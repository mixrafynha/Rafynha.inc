import { useEffect, useRef } from 'react';

const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const TEXTURES = {
  day: 'https://clouds.matteason.co.uk/images/4096x2048/earth.jpg',
  night: 'https://clouds.matteason.co.uk/images/4096x2048/earth-night.jpg',
  clouds: 'https://clouds.matteason.co.uk/images/2048x1024/clouds.jpg',
};

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (t) => t * t * (3 - 2 * t);

export default function CinematicGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    let renderer, scene, camera, globeGroup, earth, clouds, atmosphere, stars, moon, dataRig, meteorRig;
    let frame = 0;
    let targetP = 0;
    let currentP = 0;
    let pointerX = 0;
    let pointerY = 0;
    let isVisible = true;
    let globeReady = false;
    let observer;

    const mount = mountRef.current;
    const hero = mount?.closest('.space-hero');
    if (!mount || !hero) return;

    const readScroll = () => {
      const r = hero.getBoundingClientRect();
      const max = Math.max(1, hero.offsetHeight - window.innerHeight);
      targetP = clamp(-r.top / max);
      const stage = Math.min(2, Math.floor(targetP * 2) + 1);
      hero.dataset.stage = String(stage);
      hero.style.setProperty('--story-progress', targetP.toFixed(4));
    };

    const onPointer = (e) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    readScroll();

    (async () => {
      const THREE = await import(/* @vite-ignore */ THREE_URL);
      if (disposed) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(27, 1, 0.1, 150);
      camera.position.set(0, 0.02, 7.45);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        precision: 'highp',
        logarithmicDepthBuffer: false,
      });

      const mobile = window.innerWidth < 780;
      const dpr = window.devicePixelRatio || 1;
      renderer.setPixelRatio(Math.min(dpr, mobile ? 1.35 : 1.75));
      renderer.setSize(mount.clientWidth, mount.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.92;
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      const [dayTex, nightTex, cloudTex] = await Promise.all([
        loader.loadAsync(TEXTURES.day),
        loader.loadAsync(TEXTURES.night),
        loader.loadAsync(TEXTURES.clouds),
      ]);
      if (disposed) return;

      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      const setupTexture = (t, srgb = true) => {
        if (srgb) t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = maxAniso;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.generateMipmaps = true;
        t.wrapS = THREE.RepeatWrapping;
        t.needsUpdate = true;
      };
      setupTexture(dayTex, true);
      setupTexture(nightTex, true);
      setupTexture(cloudTex, false);

      globeGroup = new THREE.Group();
      globeGroup.rotation.z = THREE.MathUtils.degToRad(-10.5);
      scene.add(globeGroup);

      // A dense sphere keeps the silhouette perfectly smooth even very close to camera.
      const segmentsX = mobile ? 88 : 192;
      const segmentsY = mobile ? 60 : 132;
      const geo = new THREE.SphereGeometry(2.44, segmentsX, segmentsY);

      const sunDirection = new THREE.Vector3(1.2, 0.18, 0.92).normalize();
      const earthUniforms = {
        dayMap: { value: dayTex },
        nightMap: { value: nightTex },
        cloudMap: { value: cloudTex },
        sunDirection: { value: sunDirection },
        storyProgress: { value: 0 },
      };

      const earthMat = new THREE.ShaderMaterial({
        uniforms: earthUniforms,
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          varying vec3 vWorldPosition;
          void main() {
            vUv = uv;
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPosition = wp.xyz;
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform sampler2D dayMap;
          uniform sampler2D nightMap;
          uniform sampler2D cloudMap;
          uniform vec3 sunDirection;
          uniform float storyProgress;
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          varying vec3 vWorldPosition;

          float saturate(float x){ return clamp(x, 0.0, 1.0); }

          void main() {
            vec3 N = normalize(vWorldNormal);
            vec3 L = normalize(sunDirection);
            vec3 V = normalize(cameraPosition - vWorldPosition);
            float ndl = dot(N, L);

            vec3 day = texture2D(dayMap, vUv).rgb;
            vec3 night = texture2D(nightMap, vUv).rgb;
            float cloud = texture2D(cloudMap, vUv).r;

            // Realistic broad day/night terminator, not a hard cartoon cut.
            float dayAmt = smoothstep(-0.14, 0.16, ndl);
            float diffuse = 0.13 + 0.87 * max(ndl, 0.0);

            // Detect ocean from the satellite albedo and give it a tight solar glint.
            float oceanBlue = day.b - max(day.r, day.g) * 0.72;
            float oceanMask = smoothstep(0.035, 0.19, oceanBlue) * (1.0 - smoothstep(0.44, 0.72, day.g));
            vec3 H = normalize(L + V);
            float spec = pow(max(dot(N, H), 0.0), 150.0) * oceanMask * max(ndl, 0.0);
            float grazing = pow(1.0 - max(dot(N, V), 0.0), 5.0);

            // Cloud shadows help the land stop looking like a flat printed texture.
            float cloudShadow = 1.0 - cloud * 0.085 * smoothstep(0.0, 0.8, ndl);
            vec3 dayLit = day * diffuse * cloudShadow;
            dayLit += vec3(1.0, 0.82, 0.60) * spec * 1.55;
            dayLit += vec3(0.035, 0.08, 0.13) * grazing * oceanMask * 0.45;

            // City lights stay restrained and only appear on the true night side.
            vec3 cityColor = night * vec3(1.05, 0.72, 0.38) * 1.55;
            float nightMask = 1.0 - smoothstep(-0.19, 0.08, ndl);
            vec3 nightLit = cityColor * nightMask + day * 0.018;

            vec3 col = mix(nightLit, dayLit, dayAmt);

            // The scroll gradually wakes a digital colour layer inside the Earth.
            // It stays restrained at the start, then moves through the same
            // blue/violet/magenta/amber language used by the code overlays.
            vec3 scrollBlue = vec3(0.08, 0.42, 1.0);
            vec3 scrollViolet = vec3(0.47, 0.18, 1.0);
            vec3 scrollPink = vec3(1.0, 0.10, 0.55);
            vec3 scrollAmber = vec3(1.0, 0.48, 0.08);
            vec3 scrollColor = mix(scrollBlue, scrollViolet, smoothstep(0.12, 0.38, storyProgress));
            scrollColor = mix(scrollColor, scrollPink, smoothstep(0.38, 0.66, storyProgress));
            scrollColor = mix(scrollColor, scrollAmber, smoothstep(0.66, 0.94, storyProgress));
            float digitalPulse = smoothstep(0.16, 0.72, storyProgress) * (0.22 + 0.78 * grazing);
            col += scrollColor * digitalPulse * 0.075;

            // Slight atmospheric aerial perspective at the horizon.
            float limb = pow(1.0 - max(dot(N, V), 0.0), 3.2);
            float sunSide = smoothstep(-0.35, 0.55, ndl);
            col += vec3(0.028, 0.12, 0.28) * limb * (0.20 + 0.80 * sunSide);

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });

      earth = new THREE.Mesh(geo, earthMat);
      globeGroup.add(earth);

      // Separate physically lit cloud layer. No Screen blending: it keeps texture and depth.
      const cloudGeo = new THREE.SphereGeometry(2.462, mobile ? 78 : 168, mobile ? 52 : 116);
      const cloudMat = new THREE.ShaderMaterial({
        uniforms: {
          cloudMap: { value: cloudTex },
          sunDirection: { value: sunDirection },
        },
        transparent: true,
        depthWrite: false,
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          void main(){
            vUv = uv;
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D cloudMap;
          uniform vec3 sunDirection;
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          void main(){
            float c = texture2D(cloudMap, vUv).r;
            c = smoothstep(0.18, 0.82, c);
            float light = 0.23 + 0.77 * max(dot(normalize(vWorldNormal), normalize(sunDirection)), 0.0);
            vec3 cloudColor = mix(vec3(0.48,0.56,0.66), vec3(1.0,0.985,0.95), light);
            gl_FragColor = vec4(cloudColor, c * 0.68);
          }
        `,
      });
      clouds = new THREE.Mesh(cloudGeo, cloudMat);
      globeGroup.add(clouds);

      // Subtle Rayleigh-style rim. Deliberately thin to avoid a neon/cartoon halo.
      const atmosphereGeo = new THREE.SphereGeometry(2.535, mobile ? 68 : 144, mobile ? 46 : 100);
      const atmosphereMat = new THREE.ShaderMaterial({
        uniforms: { sunDirection: { value: sunDirection } },
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `
          varying vec3 vN;
          varying vec3 vW;
          void main(){
            vN = normalize(mat3(modelMatrix) * normal);
            vec4 wp = modelMatrix * vec4(position,1.0);
            vW = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform vec3 sunDirection;
          varying vec3 vN;
          varying vec3 vW;
          void main(){
            vec3 V = normalize(cameraPosition - vW);
            float rim = pow(1.0 - max(dot(normalize(vN), V), 0.0), 4.8);
            float lit = smoothstep(-0.42, 0.38, dot(normalize(vN), normalize(sunDirection)));
            vec3 c = mix(vec3(0.02,0.12,0.34), vec3(0.20,0.62,1.0), lit);
            gl_FragColor = vec4(c, rim * (0.20 + lit * 0.72));
          }
        `,
      });
      atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
      globeGroup.add(atmosphere);

      // Subtle data/orbit rig. It is intentionally thin so Earth remains photorealistic.
      dataRig = new THREE.Group();
      dataRig.visible = false;
      scene.add(dataRig);

      // Coloured meteor packets cross the scene as the scroll timeline advances.
      // Each packet is a small glowing head with a soft directional trail.
      meteorRig = new THREE.Group();
      scene.add(meteorRig);
      const meteorColors = [0x78bfff, 0xb78cff, 0xff65c7, 0xffb25c, 0x80f5cf];
      for (let i = 0; i < 10; i++) {
        const color = meteorColors[i % meteorColors.length];
        const head = new THREE.Mesh(
          new THREE.SphereGeometry(i % 3 === 0 ? 0.034 : 0.022, 10, 8),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending })
        );
        const trailGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(-0.34 - (i % 3) * 0.16, 0.11 + (i % 2) * 0.08, 0),
        ]);
        const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }));
        const packet = new THREE.Group();
        packet.add(trail, head);
        packet.userData = {
          head,
          trail,
          phase: (i / 10) * 1.7,
          speed: 0.18 + (i % 4) * 0.035,
          lane: i % 2 === 0 ? 1 : -1,
          radius: 3.4 + (i % 4) * 0.42,
        };
        meteorRig.add(packet);
      }
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0x79bfff, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending });
      const orbitA = new THREE.Mesh(new THREE.TorusGeometry(2.94, 0.004, 6, 260), orbitMat.clone());
      orbitA.rotation.set(THREE.MathUtils.degToRad(67), THREE.MathUtils.degToRad(12), THREE.MathUtils.degToRad(8));
      dataRig.add(orbitA);
      const orbitB = new THREE.Mesh(new THREE.TorusGeometry(3.16, 0.003, 6, 280), orbitMat.clone());
      orbitB.material.opacity = 0.07; orbitB.rotation.set(THREE.MathUtils.degToRad(38), THREE.MathUtils.degToRad(-22), THREE.MathUtils.degToRad(71));
      dataRig.add(orbitB);
      const orbitC = new THREE.Mesh(new THREE.TorusGeometry(2.72, 0.0025, 6, 240), orbitMat.clone());
      orbitC.material.color.set(0xff6bc7);
      orbitC.material.opacity = 0.055;
      orbitC.rotation.set(THREE.MathUtils.degToRad(82), THREE.MathUtils.degToRad(-34), THREE.MathUtils.degToRad(25));
      dataRig.add(orbitC);

      // Small colour-coded packets travel around the rings as the story moves.
      const packetColors = [0x79bfff, 0xb48cff, 0xff6bc7, 0xffb45c, 0x86f7cf];
      [orbitA, orbitB, orbitC].forEach((orbit, ringIndex) => {
        for (let i = 0; i < 4; i++) {
          const packet = new THREE.Mesh(
            new THREE.SphereGeometry(ringIndex === 2 ? 0.014 : 0.019, 10, 8),
            new THREE.MeshBasicMaterial({ color: packetColors[(i + ringIndex) % packetColors.length], transparent: true, opacity: 0.82, blending: THREE.AdditiveBlending })
          );
          const a = (i / 4) * Math.PI * 2 + ringIndex * 0.7;
          packet.position.set(Math.cos(a) * orbit.geometry.parameters.radius, Math.sin(a) * orbit.geometry.parameters.radius, 0);
          packet.userData.phase = a;
          packet.userData.speed = 0.45 + ringIndex * 0.16;
          orbit.add(packet);
        }
      });
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xbfe8ff, transparent: true, opacity: 0.92 });
      for (let i = 0; i < 5; i++) {
        const n = new THREE.Mesh(new THREE.SphereGeometry(i===0?0.028:0.018, 16, 12), nodeMat.clone());
        const a = i * 1.26; n.position.set(Math.cos(a)*2.94, Math.sin(a)*2.94, 0);
        orbitA.add(n);
      }

      // Deep starfield: small points, low opacity, no oversized decorative stars.
      const starCount = mobile ? 480 : 1800;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const r = 18 + Math.random() * 48;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPos[i * 3 + 2] = r * Math.cos(phi);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      stars = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          size: mobile ? 0.026 : 0.020,
          color: 0xddeaff,
          transparent: true,
          opacity: 0.72,
          sizeAttenuation: true,
        })
      );
      scene.add(stars);

      // Distant moon: subdued so the Earth stays the hero.
      moon = new THREE.Mesh(
        new THREE.SphereGeometry(0.30, 42, 30),
        new THREE.MeshStandardMaterial({ color: 0x6b6e72, roughness: 1.0, metalness: 0.0 })
      );
      moon.position.set(-3.28, 1.62, -2.25);
      scene.add(moon);

      const key = new THREE.DirectionalLight(0xffe5c2, 2.5);
      key.position.set(6.5, 1.2, 4.6);
      scene.add(key);
      scene.add(new THREE.AmbientLight(0x0b1424, 0.11));

      const resize = () => {
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        const nowMobile = window.innerWidth < 780;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, nowMobile ? 1.05 : 1.75));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', resize);
      resize();

      // Start on Europe / Africa. Scroll is the timeline and directly rotates the world.
      const baseRot = THREE.MathUtils.degToRad(-20);
      const animate = () => {
        if (disposed) return;
        if (!isVisible || document.hidden) { frame = 0; return; }
        currentP += (targetP - currentP) * 0.075;
        const p = currentP;
        const now = performance.now();
        if (earthMat?.uniforms.storyProgress) earthMat.uniforms.storyProgress.value = p;

        globeGroup.rotation.y = baseRot + p * Math.PI * 1.38;
        clouds.rotation.y = p * Math.PI * 1.38 + p * 0.055;

        let x, y, z, scale;
        if (p < 0.27) {
          const q = smooth(p / 0.27);
          x = 1.02 - q * 0.20;
          y = -0.06 - q * 0.13;
          z = 7.46 - q * 0.42;
          scale = 1.0 + q * 0.055;
        } else if (p < 0.55) {
          const q = smooth((p - 0.27) / 0.28);
          x = 0.82 - q * 1.40;
          y = -0.19 + q * 0.13;
          z = 7.04 - q * 0.36;
          scale = 1.055 + q * 0.085;
        } else if (p < 0.80) {
          const q = smooth((p - 0.55) / 0.25);
          x = -0.58 + q * 1.34;
          y = -0.06 - q * 0.18;
          z = 6.68 + q * 0.34;
          scale = 1.14 - q * 0.045;
        } else {
          const q = smooth((p - 0.80) / 0.20);
          x = 0.76 - q * 0.66;
          y = -0.24 - q * 0.92;
          z = 7.02 - q * 0.36;
          scale = 1.095 + q * 0.30;
        }

        const nowMobile = window.innerWidth < 780;
        const mobileShift = nowMobile ? 0.38 : 0;
        globeGroup.position.x += ((x + mobileShift + pointerX * 0.025) - globeGroup.position.x) * 0.055;
        globeGroup.position.y += ((y - pointerY * 0.018) - globeGroup.position.y) * 0.055;
        globeGroup.scale.setScalar(globeGroup.scale.x + (scale - globeGroup.scale.x) * 0.055);
        camera.position.z += (z - camera.position.z) * 0.055;
        camera.lookAt(nowMobile ? 0.32 : 0, -0.10, 0);

        stars.rotation.y = p * 0.055;
        if (dataRig) {
          const rigAmt = smooth(clamp((p - 0.19) / 0.18)) * (1.0 - smooth(clamp((p - 0.79) / 0.14)));
          dataRig.visible = rigAmt > 0.01;
          dataRig.position.copy(globeGroup.position);
          dataRig.scale.copy(globeGroup.scale);
          dataRig.rotation.y = -p * 0.92;
          dataRig.rotation.z = p * 0.18;
          dataRig.children.forEach((o, idx) => {
            if (o.material) o.material.opacity = (idx === 0 ? 0.14 : idx === 1 ? 0.09 : 0.075) * rigAmt;
            o.children?.forEach((packet) => {
              const radius = o.geometry?.parameters?.radius || 2.9;
              const a = packet.userData.phase + now * 0.00035 * packet.userData.speed + p * 1.7;
              packet.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
              packet.material.opacity = (0.42 + 0.42 * rigAmt) * Math.min(1, p * 5);
            });
          });
        }
        if (meteorRig) {
          const meteorAmt = smooth(clamp((p - 0.08) / 0.18)) * (1.0 - smooth(clamp((p - 0.92) / 0.08)));
          meteorRig.visible = meteorAmt > 0.01;
          meteorRig.position.copy(globeGroup.position);
          meteorRig.scale.copy(globeGroup.scale);
          meteorRig.rotation.z = -p * 0.3;
          meteorRig.children.forEach((packet, i) => {
            const d = packet.userData;
            const t = (now * 0.0001 * d.speed + d.phase + p * 1.9) % 1;
            const angle = -1.55 + t * 2.7;
            const x = Math.cos(angle) * d.radius;
            const y = Math.sin(angle) * d.radius * 0.48 + d.lane * 0.18;
            const z = -1.9 + (i % 3) * 0.55;
            packet.position.set(x, y, z);
            packet.rotation.z = angle + (d.lane > 0 ? 0.15 : Math.PI + 0.15);
            const alpha = (0.18 + Math.sin(t * Math.PI) * 0.72) * meteorAmt;
            d.head.material.opacity = alpha;
            d.trail.material.opacity = alpha * 0.52;
          });
        }
        moon.position.x = -3.28 + p * 0.42;
        moon.position.y = 1.62 - p * 0.14;
        moon.rotation.y = p * 1.15;

        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };

      globeReady = true;
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && globeReady && !frame && !document.hidden) frame = requestAnimationFrame(animate);
      }, { rootMargin: '20% 0px 20% 0px' });
      observer.observe(hero);
      frame = requestAnimationFrame(animate);
      mount._cleanupGlobe = () => window.removeEventListener('resize', resize);
    })().catch((err) => {
      console.error(err);
      mount.classList.add('globe-failed');
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('pointermove', onPointer);
      observer?.disconnect();
      mount?._cleanupGlobe?.();
      renderer?.dispose();
      renderer?.domElement?.remove();
    };
  }, []);

  return <div ref={mountRef} className="cinematic-globe" aria-hidden="true" />;
}
