import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;
const smooth = (value: number) => value * value * (3 - 2 * value);

const hash2D = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return value - Math.floor(value);
};

const noise2D = (x: number, y: number) => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = smooth(x - x0);
  const ty = smooth(y - y0);
  const a = hash2D(x0, y0);
  const b = hash2D(x0 + 1, y0);
  const c = hash2D(x0, y0 + 1);
  const d = hash2D(x0 + 1, y0 + 1);
  return mix(mix(a, b, tx), mix(c, d, tx), ty);
};

const fbm = (x: number, y: number, octaves = 5) => {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let total = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += noise2D(x * frequency, y * frequency) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2.04;
  }

  return value / total;
};

const drawOrganicBlob = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  seed: number
) => {
  context.beginPath();
  for (let i = 0; i <= 42; i += 1) {
    const angle = (i / 42) * Math.PI * 2;
    const wobble = 1 + Math.sin(angle * 3 + seed) * 0.16 + Math.cos(angle * 5 - seed) * 0.11;
    const px = x + Math.cos(angle) * radiusX * wobble;
    const py = y + Math.sin(angle) * radiusY * wobble;
    if (i === 0) {
      context.moveTo(px, py);
    } else {
      context.lineTo(px, py);
    }
  }
  context.closePath();
  context.fill();
};

const makeEarthTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const width = canvas.width;
  const height = canvas.height;
  const imageData = context.createImageData(width, height);
  const { data } = imageData;
  const landAnchors = [
    { lon: -104, lat: 44, rx: 42, ry: 29, boost: 1.0 },
    { lon: -74, lat: 5, rx: 23, ry: 53, boost: 0.95 },
    { lon: -42, lat: 72, rx: 37, ry: 13, boost: 0.62 },
    { lon: 21, lat: 6, rx: 30, ry: 46, boost: 0.98 },
    { lon: 61, lat: 48, rx: 66, ry: 31, boost: 1.0 },
    { lon: 105, lat: 18, rx: 38, ry: 27, boost: 0.88 },
    { lon: 135, lat: -25, rx: 23, ry: 16, boost: 0.78 },
    { lon: 145, lat: 63, rx: 34, ry: 18, boost: 0.66 }
  ];
  const lonDistance = (a: number, b: number) => {
    const diff = Math.abs(a - b);
    return Math.min(diff, 360 - diff);
  };

  for (let py = 0; py < height; py += 1) {
    const lat = 90 - (py / height) * 180;
    for (let px = 0; px < width; px += 1) {
      const lon = (px / width) * 360 - 180;
      const macro = fbm((lon + 220) * 0.018, (lat + 120) * 0.03, 5);
      const detail = fbm((lon + 58) * 0.11, (lat - 16) * 0.12, 4);
      const grain = fbm((lon + 10) * 0.45, (lat + 22) * 0.42, 3);
      let land = 0;

      landAnchors.forEach((anchor) => {
        const dx = lonDistance(lon, anchor.lon) / anchor.rx;
        const dy = (lat - anchor.lat) / anchor.ry;
        const influence = Math.max(0, 1 - (dx * dx + dy * dy)) * anchor.boost;
        land = Math.max(land, influence);
      });

      const islandNoise = fbm((lon + 13) * 0.06, (lat + 41) * 0.08, 4);
      const landScore = land + (macro - 0.48) * 0.52 + (detail - 0.5) * 0.16;
      const isIsland = Math.abs(lat) < 54 && islandNoise > 0.76 && macro > 0.54;
      const isLand = landScore > 0.24 || isIsland;
      const byteIndex = (py * width + px) * 4;
      let r = 0;
      let g = 0;
      let b = 0;

      if (isLand) {
        const elevation = clamp((landScore - 0.18) * 1.9 + detail * 0.36, 0, 1);
        const desertBand = clamp(1 - Math.abs(Math.abs(lat) - 23) / 25, 0, 1);
        const desert = desertBand * (0.34 + macro * 0.58);
        const forest = clamp(1 - desert * 0.7 - Math.abs(lat) / 120 + detail * 0.38, 0, 1);
        const snow = clamp((Math.abs(lat) - 58) / 24, 0, 1) + clamp(elevation - 0.74, 0, 1) * 0.65;

        r = mix(62, 118, desert) + mix(0, 22, elevation) + grain * 18;
        g = mix(88, 103, desert) + forest * 42 + grain * 13;
        b = mix(58, 58, desert) + forest * 10 + grain * 9;

        if (snow > 0.36) {
          const snowMix = clamp((snow - 0.28) * 1.5, 0, 0.85);
          r = mix(r, 214, snowMix);
          g = mix(g, 218, snowMix);
          b = mix(b, 208, snowMix);
        }
      } else {
        const shore = clamp((landScore + 0.04) / 0.26, 0, 1);
        const depth = fbm((lon - 12) * 0.055, (lat + 28) * 0.07, 5);
        r = mix(3, 13, shore) + depth * 5;
        g = mix(12, 48, shore) + depth * 11;
        b = mix(28, 72, shore) + depth * 16;
      }

      data[byteIndex] = clamp(Math.round(r), 0, 255);
      data[byteIndex + 1] = clamp(Math.round(g), 0, 255);
      data[byteIndex + 2] = clamp(Math.round(b), 0, 255);
      data[byteIndex + 3] = 255;
    }
  }
  context.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

const makeCloudTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.globalCompositeOperation = 'lighter';

  for (let i = 0; i < 92; i += 1) {
    const seed = hash2D(i * 3.7, i * 11.2);
    const y = 42 + hash2D(i, 6) * 420;
    const x = hash2D(i, 9) * canvas.width;
    const length = 90 + hash2D(i, 14) * 260;
    const lift = (hash2D(i, 18) - 0.5) * 54;
    context.globalAlpha = 0.055 + seed * 0.08;
    context.strokeStyle = '#ffffff';
    context.lineWidth = 3 + hash2D(i, 21) * 10;
    context.beginPath();
    context.moveTo(x, y);
    context.bezierCurveTo(
      x + length * 0.28,
      y - lift,
      x + length * 0.64,
      y + lift * 0.55,
      x + length,
      y + (hash2D(i, 31) - 0.5) * 36
    );
    context.stroke();
  }

  for (let i = 0; i < 44; i += 1) {
    const x = hash2D(i, 41) * canvas.width;
    const y = 42 + hash2D(i, 46) * 420;
    const radius = 20 + hash2D(i, 52) * 70;
    const cloud = context.createRadialGradient(x, y, 0, x, y, radius);
    cloud.addColorStop(0, `rgba(255, 255, 255, ${0.11 + hash2D(i, 58) * 0.12})`);
    cloud.addColorStop(0.54, `rgba(255, 255, 255, ${0.04 + hash2D(i, 62) * 0.05})`);
    cloud.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = cloud;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  context.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

const makeMoonTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const imageData = context.createImageData(canvas.width, canvas.height);
  const { data } = imageData;
  for (let py = 0; py < canvas.height; py += 1) {
    for (let px = 0; px < canvas.width; px += 1) {
      const nx = px / canvas.width;
      const ny = py / canvas.height;
      const broad = fbm(nx * 8, ny * 4, 5);
      const grain = fbm(nx * 56 + 12, ny * 28 - 5, 4);
      const shade = 66 + broad * 58 + grain * 34;
      const byteIndex = (py * canvas.width + px) * 4;
      data[byteIndex] = clamp(Math.round(shade * 0.98), 0, 255);
      data[byteIndex + 1] = clamp(Math.round(shade * 0.98), 0, 255);
      data[byteIndex + 2] = clamp(Math.round(shade * 0.92), 0, 255);
      data[byteIndex + 3] = 255;
    }
  }
  context.putImageData(imageData, 0, 0);

  context.globalCompositeOperation = 'multiply';
  context.globalAlpha = 0.26;
  context.fillStyle = '#2c3134';
  [
    [122, 95, 58, 28, 0.4],
    [214, 142, 88, 42, 1.8],
    [340, 102, 72, 34, 2.7],
    [438, 164, 44, 22, 4.2]
  ].forEach(([x, y, rx, ry, seed]) => drawOrganicBlob(context, x, y, rx, ry, seed));
  context.globalCompositeOperation = 'source-over';

  for (let i = 0; i < 88; i += 1) {
    const x = (i * 83) % canvas.width;
    const y = 20 + ((i * 47) % (canvas.height - 40));
    const radius = 4 + (i % 9) * 2.4;
    context.globalAlpha = 0.1 + (i % 5) * 0.025;
    context.fillStyle = '#202427';
    context.beginPath();
    context.ellipse(x, y, radius * 1.5, radius, 0, 0, Math.PI * 2);
    context.fill();

    context.globalAlpha = 0.08;
    context.strokeStyle = '#f0efdf';
    context.lineWidth = 1;
    context.beginPath();
    context.ellipse(x - radius * 0.18, y - radius * 0.16, radius * 1.44, radius * 0.94, 0, Math.PI * 1.05, Math.PI * 1.78);
    context.stroke();
  }

  context.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

const makeMilkyWayTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1700;
  canvas.height = 760;
  const context = canvas.getContext('2d');
  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width * 0.5;
  const centerY = canvas.height * 0.52;
  const drawStar = (x: number, y: number, radius: number, color: string, alpha: number) => {
    context.fillStyle = `rgba(${color}, ${alpha})`;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  };

  context.globalCompositeOperation = 'lighter';

  const core = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, 190);
  core.addColorStop(0, 'rgba(247, 244, 234, 0.56)');
  core.addColorStop(0.24, 'rgba(216, 255, 79, 0.32)');
  core.addColorStop(0.56, 'rgba(87, 227, 255, 0.16)');
  core.addColorStop(1, 'rgba(87, 227, 255, 0)');
  context.fillStyle = core;
  context.beginPath();
  context.ellipse(centerX, centerY, 250, 94, -0.08, 0, Math.PI * 2);
  context.fill();

  for (let arm = 0; arm < 4; arm += 1) {
    const armOffset = (arm / 4) * Math.PI * 2;
    context.strokeStyle = arm % 2 === 0 ? 'rgba(87, 227, 255, 0.3)' : 'rgba(247, 244, 234, 0.24)';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 3.4;
    context.beginPath();
    for (let i = 0; i <= 160; i += 1) {
      const t = i / 160;
      const radius = 92 + t * 720;
      const angle = armOffset + t * Math.PI * 2.18;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius * 0.38;
      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.stroke();
  }

  for (let arm = 0; arm < 4; arm += 1) {
    const armOffset = (arm / 4) * Math.PI * 2;
    for (let i = 0; i < 900; i += 1) {
      const seed = arm * 1000 + i;
      const t = Math.pow(i / 900, 0.82);
      const radius = 76 + t * 760 + (hash2D(seed, 5) - 0.5) * 64;
      const spread = 16 + t * 74;
      const angle = armOffset + t * Math.PI * 2.18 + (hash2D(seed, 9) - 0.5) * 0.24;
      const localY = (hash2D(seed, 13) - 0.5) * spread;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius * 0.38 + localY;
      const distanceFade = 1 - t * 0.54;
      const innerFade = 0.5 + Math.min(1, t / 0.26) * 0.5;
      const alpha = (0.2 + hash2D(seed, 17) * 0.48) * distanceFade * innerFade;
      const starRadius = 0.54 + hash2D(seed, 21) * (i % 13 === 0 ? 2.35 : 1.28);
      const color = i % 17 === 0
        ? '216, 255, 79'
        : i % 9 === 0
          ? '168, 141, 255'
          : i % 5 === 0
            ? '87, 227, 255'
            : '247, 244, 234';
      drawStar(x, y, starRadius, color, alpha);
    }
  }

  context.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 11; i += 1) {
    const dustAngle = i * 0.62 + 0.28;
    const dustRadius = 118 + i * 58;
    const x = centerX + Math.cos(dustAngle) * dustRadius;
    const y = centerY + Math.sin(dustAngle) * dustRadius * 0.38;
    context.fillStyle = `rgba(0, 0, 0, ${0.2 + hash2D(i, 27) * 0.16})`;
    context.beginPath();
    context.ellipse(x, y, 150 + hash2D(i, 31) * 122, 11 + hash2D(i, 35) * 20, dustAngle * 0.32 - 0.08, 0, Math.PI * 2);
    context.fill();
  }

  context.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 430; i += 1) {
    const x = hash2D(i, 39) * canvas.width;
    const y = hash2D(i, 43) * canvas.height;
    const alpha = 0.035 + hash2D(i, 47) * 0.11;
    drawStar(x, y, 0.35 + hash2D(i, 51) * 0.82, '247, 244, 234', alpha);
  }

  context.globalCompositeOperation = 'source-over';
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

const HeroWebGL = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.1, 7.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    const textureLoader = new THREE.TextureLoader();
    const runtimeTextures: THREE.Texture[] = [];
    let isDisposed = false;
    const spaceAsset = (fileName: string) => `${process.env.PUBLIC_URL || ''}/assets/space/${fileName}`;
    const loadSpaceTexture = (fileName: string, isColorTexture: boolean, onLoad: (texture: THREE.Texture) => void) => {
      textureLoader.load(
        spaceAsset(fileName),
        (texture) => {
          if (isDisposed) {
            texture.dispose();
            return;
          }
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.colorSpace = isColorTexture ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          texture.needsUpdate = true;
          runtimeTextures.push(texture);
          onLoad(texture);
        },
        undefined,
        () => {}
      );
    };

    const fxCanvas = document.createElement('canvas');
    fxCanvas.className = 'cursor-fx-canvas';
    const fxContext = fxCanvas.getContext('2d');
    mount.appendChild(fxCanvas);

    const blue = new THREE.Color('#57e3ff');
    const yellow = new THREE.Color('#d8ff4f');
    const pearl = new THREE.Color('#f4f1e8');
    const violet = new THREE.Color('#a88dff');

    const root = new THREE.Group();
    const spineGroup = new THREE.Group();
    const atmosphereGroup = new THREE.Group();
    scene.add(atmosphereGroup, spineGroup, root);

    const ambientLight = new THREE.AmbientLight(0x7f9fb2, 0.28);
    const keyLight = new THREE.DirectionalLight(0xf4f1e8, 0.92);
    keyLight.position.set(-2.8, 1.8, 4.6);
    const rimLight = new THREE.DirectionalLight(0x57e3ff, 0.52);
    rimLight.position.set(2.2, -0.8, 2.8);
    scene.add(ambientLight, keyLight, rimLight);

    const additiveLine = (color: THREE.Color, opacity: number) => new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true
    });

    const additiveMesh = (color: THREE.Color, opacity: number, wireframe = false) => new THREE.MeshBasicMaterial({
      color,
      wireframe,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true
    });

    const planetGroup = new THREE.Group();
    const globeGroup = new THREE.Group();
    const earthTexture = makeEarthTexture();
    const cloudTexture = makeCloudTexture();
    const moonTexture = makeMoonTexture();
    const milkyWayTexture = makeMilkyWayTexture();
    const milkyWayMaterial = new THREE.MeshBasicMaterial({
      map: milkyWayTexture,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true
    });
    const milkyWay = new THREE.Mesh(new THREE.PlaneGeometry(6.35, 2.66), milkyWayMaterial);
    milkyWay.position.set(1.5, 0.56, -2.8);
    milkyWay.rotation.z = -0.38;
    milkyWay.renderOrder = -8;
    atmosphereGroup.add(milkyWay);
    const coreMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      color: 0xffffff,
      emissive: new THREE.Color('#061525'),
      emissiveIntensity: 0.055,
      opacity: 1,
      shininess: 18,
      specular: new THREE.Color('#17435f'),
      transparent: true
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.78, 96, 48), coreMaterial);
    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(0.795, 96, 48), cloudMaterial);
    const planetAtmosphereMaterial = additiveMesh(blue, 0.14);
    const planetAtmosphere = new THREE.Mesh(new THREE.SphereGeometry(0.82, 96, 48), planetAtmosphereMaterial);
    planetAtmosphere.scale.set(1.01, 1.01, 1.01);
    const moonOrbit = new THREE.Group();
    const moonMaterial = new THREE.MeshPhongMaterial({
      map: moonTexture,
      color: 0xdadbd4,
      emissive: new THREE.Color('#17191c'),
      emissiveIntensity: 0.08,
      shininess: 2,
      transparent: true,
      opacity: 1,
      depthWrite: true,
      depthTest: true
    });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(0.145, 48, 24), moonMaterial);
    moon.renderOrder = 20;
    moon.position.set(1.92, 0, -0.08);
    moonOrbit.rotation.z = 0;
    moonOrbit.add(moon);
    const discMaterial = additiveMesh(pearl, 0.08);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1.04, 96), discMaterial);
    disc.position.z = -0.08;
    globeGroup.add(core, clouds, planetAtmosphere, moonOrbit);
    planetGroup.add(disc, globeGroup);
    root.add(planetGroup);

    loadSpaceTexture('earth_atmos_2048.jpg', true, (texture) => {
      coreMaterial.map = texture;
      coreMaterial.needsUpdate = true;
    });
    loadSpaceTexture('earth_normal_2048.jpg', false, (texture) => {
      coreMaterial.normalMap = texture;
      coreMaterial.normalScale.set(0.1, 0.1);
      coreMaterial.needsUpdate = true;
    });
    loadSpaceTexture('earth_specular_2048.jpg', false, (texture) => {
      coreMaterial.specularMap = texture;
      coreMaterial.needsUpdate = true;
    });
    loadSpaceTexture('earth_clouds_1024.png', true, (texture) => {
      cloudMaterial.map = texture;
      cloudMaterial.opacity = 0.26;
      cloudMaterial.needsUpdate = true;
    });
    loadSpaceTexture('moon_1024.jpg', true, (texture) => {
      moonMaterial.map = texture;
      moonMaterial.bumpMap = texture;
      moonMaterial.bumpScale = 0.018;
      moonMaterial.needsUpdate = true;
    });

    const innerRingMaterial = additiveMesh(pearl, 0.44);
    const outerRingMaterial = additiveMesh(blue, 0.32, true);
    const tallRingMaterial = additiveMesh(blue, 0.24, true);
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.93, 0.012, 12, 180), innerRingMaterial);
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.006, 8, 220), outerRingMaterial);
    const tallRing = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.005, 8, 240), tallRingMaterial);
    tallRing.scale.set(0.58, 1.08, 1);
    root.add(innerRing, outerRing, tallRing);

    const makeLoop = (scaleX: number, scaleY: number, rotation: number, color: THREE.Color, opacity: number) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 280; i += 1) {
        const t = (i / 280) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.sin(t) * scaleX,
          Math.cos(t) * scaleY - 0.45,
          Math.sin(t * 2) * 0.18
        ));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = additiveLine(color, opacity);
      const line = new THREE.Line(geometry, material);
      line.rotation.z = rotation;
      return line;
    };

    const loopA = makeLoop(0.96, 2.76, 0.18, blue, 0.34);
    const loopB = makeLoop(0.96, 2.76, -0.18, violet, 0.24);
    const loopC = makeLoop(1.55, 1.1, Math.PI / 2, blue, 0.2);
    root.add(loopA, loopB, loopC);

    const rayGroup = new THREE.Group();
    const rayGeometries: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 22; i += 1) {
      const angle = (i / 22) * Math.PI * 2;
      const length = 0.9 + (i % 4) * 0.42;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, -0.1),
        new THREE.Vector3(Math.cos(angle) * (1.35 + length), Math.sin(angle) * (1.35 + length), -0.1)
      ]);
      rayGeometries.push(geometry);
      const ray = new THREE.Line(geometry, additiveLine(i % 2 ? blue : yellow, 0.14));
      rayGroup.add(ray);
    }
    root.add(rayGroup);

    const particleCount = 1700;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 0.7 + Math.random() * 4.0;
      const angle = Math.random() * Math.PI * 2;
      const vertical = (Math.random() - 0.5) * 5.6;
      const x = Math.cos(angle) * radius * (0.42 + Math.random() * 0.46);
      const y = vertical;
      const z = Math.sin(angle) * radius * 0.46 + (Math.random() - 0.5) * 1.4;
      const offset = i * 3;
      positions[offset] = x;
      positions[offset + 1] = y;
      positions[offset + 2] = z;
      basePositions[offset] = x;
      basePositions[offset + 1] = y;
      basePositions[offset + 2] = z;

      const color = Math.random() > 0.32 ? yellow : pearl;
      colors[offset] = color.r;
      colors[offset + 1] = color.g;
      colors[offset + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.018,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
    atmosphereGroup.add(particleMesh);

    const galaxyCount = 1500;
    const galaxyPositions = new Float32Array(galaxyCount * 3);
    const galaxyColors = new Float32Array(galaxyCount * 3);
    const galaxyBase = new Float32Array(galaxyCount * 3);
    const galaxyGroup = new THREE.Group();
    for (let i = 0; i < galaxyCount; i += 1) {
      const arm = i % 5;
      const radius = 0.85 + Math.pow(Math.random(), 0.72) * 5.8;
      const angle = (arm / 5) * Math.PI * 2 + radius * 0.62 + (Math.random() - 0.5) * 0.72;
      const height = (Math.random() - 0.5) * (1.2 + radius * 0.16);
      const offset = i * 3;
      const x = Math.cos(angle) * radius;
      const y = height;
      const z = Math.sin(angle) * radius * 0.34 - 1.55;
      galaxyPositions[offset] = x;
      galaxyPositions[offset + 1] = y;
      galaxyPositions[offset + 2] = z;
      galaxyBase[offset] = x;
      galaxyBase[offset + 1] = y;
      galaxyBase[offset + 2] = z;

      const color = i % 9 === 0 ? violet : i % 4 === 0 ? blue : i % 3 === 0 ? yellow : pearl;
      const strength = 0.38 + Math.random() * 0.42;
      galaxyColors[offset] = color.r * strength;
      galaxyColors[offset + 1] = color.g * strength;
      galaxyColors[offset + 2] = color.b * strength;
    }
    const galaxyGeometry = new THREE.BufferGeometry();
    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.014,
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true
    });
    const galaxyMesh = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxyGroup.add(galaxyMesh);
    atmosphereGroup.add(galaxyGroup);

    const makeSpineLine = (color: THREE.Color, opacity: number, phase: number) => {
      const count = 360;
      const positionArray = new Float32Array(count * 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      const material = additiveLine(color, opacity);
      const line = new THREE.Line(geometry, material);
      return { count, geometry, line, material, phase, positionArray };
    };

    const spineA = makeSpineLine(blue, 0.0, 0);
    const spineB = makeSpineLine(violet, 0.0, Math.PI * 0.75);
    const spineC = makeSpineLine(yellow, 0.0, Math.PI * 1.32);
    spineGroup.add(spineA.line, spineB.line, spineC.line);

    const spineDotCount = 320;
    const spineDotPositions = new Float32Array(spineDotCount * 3);
    const spineDotColors = new Float32Array(spineDotCount * 3);
    for (let i = 0; i < spineDotCount; i += 1) {
      const offset = i * 3;
      spineDotPositions[offset] = 99;
      spineDotPositions[offset + 1] = 99;
      spineDotPositions[offset + 2] = 99;
      const color = i % 5 === 0 ? pearl : yellow;
      spineDotColors[offset] = color.r;
      spineDotColors[offset + 1] = color.g;
      spineDotColors[offset + 2] = color.b;
    }
    const spineDotGeometry = new THREE.BufferGeometry();
    spineDotGeometry.setAttribute('position', new THREE.BufferAttribute(spineDotPositions, 3));
    spineDotGeometry.setAttribute('color', new THREE.BufferAttribute(spineDotColors, 3));
    const spineDotMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const spineDots = new THREE.Points(spineDotGeometry, spineDotMaterial);
    spineGroup.add(spineDots);

    const makeSpineRib = (index: number) => {
      const count = 72;
      const positionArray = new Float32Array(count * 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      const material = additiveLine(index % 3 === 0 ? yellow : index % 2 === 0 ? blue : pearl, 0);
      const line = new THREE.Line(geometry, material);
      spineGroup.add(line);
      return { count, geometry, index, line, material, positionArray };
    };

    const spineRibs = Array.from({ length: 28 }, (_, index) => makeSpineRib(index));

    const trailCount = 220;
    const trailPositions = new Float32Array(trailCount * 3);
    const trailColors = new Float32Array(trailCount * 3);
    const trailVelocity = new Float32Array(trailCount * 3);
    const trailLife = new Float32Array(trailCount);
    for (let i = 0; i < trailCount; i += 1) {
      const offset = i * 3;
      trailPositions[offset] = 99;
      trailPositions[offset + 1] = 99;
      trailPositions[offset + 2] = 99;
    }
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    const trailMaterial = new THREE.PointsMaterial({
      size: 0.036,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const trailMesh = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trailMesh);

    const burstCount = 360;
    const burstPositions = new Float32Array(burstCount * 3);
    const burstColors = new Float32Array(burstCount * 3);
    const burstVelocity = new Float32Array(burstCount * 3);
    const burstLife = new Float32Array(burstCount);
    for (let i = 0; i < burstCount; i += 1) {
      const offset = i * 3;
      burstPositions[offset] = 99;
      burstPositions[offset + 1] = 99;
      burstPositions[offset + 2] = 99;
    }
    const burstGeometry = new THREE.BufferGeometry();
    burstGeometry.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
    burstGeometry.setAttribute('color', new THREE.BufferAttribute(burstColors, 3));
    const burstMaterial = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const burstMesh = new THREE.Points(burstGeometry, burstMaterial);
    scene.add(burstMesh);

    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);
    const pointerWorld = new THREE.Vector3(0, 0, 0);
    const scrollTarget = { value: 0 };
    const scrollState = { value: 0 };
    const clock = new THREE.Clock();
    let frameId = 0;
    let trailIndex = 0;
    let mobileScale = 1;
    let nextShootingStar = 0;
    let lastPointerEventTime = 0;
    let lastPointerDownTime = 0;
    const lastPointer = {
      initialized: false,
      x: 0,
      y: 0
    };
    const lastMotion = {
      x: 1,
      y: 0
    };
    const earthDrag = {
      active: false,
      lastX: 0,
      lastY: 0
    };
    const globeQuaternion = new THREE.Quaternion();
    const globeTargetQuaternion = new THREE.Quaternion();
    const dragYawQuaternion = new THREE.Quaternion();
    const dragPitchQuaternion = new THREE.Quaternion();
    const dragStepQuaternion = new THREE.Quaternion();
    const dragYawAxis = new THREE.Vector3(0, 1, 0);
    const dragPitchAxis = new THREE.Vector3(1, 0, 0);
    const fxParticles: Array<{
      color: string;
      glass: number;
      life: number;
      size: number;
      tail: number;
      vx: number;
      vy: number;
      x: number;
      y: number;
    }> = [];
    const shootingStars: Array<{
      color: string;
      life: number;
      tail: number;
      vx: number;
      vy: number;
      width: number;
      x: number;
      y: number;
    }> = [];

    const spawnFx = (x: number, y: number, velocityX: number, velocityY: number, burst = false) => {
      const count = burst ? 7 : 2;
      const magnitude = Math.max(Math.hypot(velocityX, velocityY), 0.1);
      if (!burst && magnitude < 1.2) {
        return;
      }
      const directionX = velocityX / magnitude;
      const directionY = velocityY / magnitude;
      const normalX = -directionY;
      const normalY = directionX;
      for (let i = 0; i < count; i += 1) {
        const sideOffset = ((i % 3) - 1) * (burst ? 13 : 7) + (Math.random() - 0.5) * (burst ? 8 : 5);
        const backOffset = Math.random() * (burst ? 46 : 22);
        const speed = (burst ? 1.35 : 0.86) + Math.min(magnitude * 0.026, burst ? 2.2 : 1.25) + Math.random() * 0.52;
        fxParticles.push({
          glass: burst ? 0.2 + Math.random() * 0.16 : 0.16 + Math.random() * 0.12,
          x: x + normalX * sideOffset - directionX * backOffset,
          y: y + normalY * sideOffset - directionY * backOffset,
          vx: directionX * speed + normalX * (Math.random() - 0.5) * 0.18,
          vy: directionY * speed + normalY * (Math.random() - 0.5) * 0.18,
          life: burst ? 0.96 : 0.7,
          size: burst ? 0.15 + Math.random() * 0.1 : 0.1 + Math.random() * 0.07,
          tail: burst ? 76 + Math.random() * 90 : 44 + Math.random() * 54,
          color: i % 4 === 0 ? '255,255,255' : i % 2 === 0 ? '197,239,255' : '216,255,79'
        });
      }
      if (fxParticles.length > 120) {
        fxParticles.splice(0, fxParticles.length - 120);
      }
    };

    const spawnShootingStar = (width: number, height: number) => {
      const edge = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;

      if (edge === 0) {
        x = Math.random() * width;
        y = -80;
      } else if (edge === 1) {
        x = width + 80;
        y = Math.random() * height;
      } else if (edge === 2) {
        x = Math.random() * width;
        y = height + 80;
      } else {
        x = -80;
        y = Math.random() * height;
      }

      const targetX = width * (0.18 + Math.random() * 0.64);
      const targetY = height * (0.14 + Math.random() * 0.72);
      const dx = targetX - x;
      const dy = targetY - y;
      const length = Math.max(Math.hypot(dx, dy), 1);
      const speed = 6.5 + Math.random() * 10;

      shootingStars.push({
        x,
        y,
        vx: (dx / length) * speed,
        vy: (dy / length) * speed,
        life: 1,
        tail: 120 + Math.random() * 190,
        width: 0.32 + Math.random() * 0.46,
        color: Math.random() > 0.5 ? '197,239,255' : '216,255,79'
      });
      if (shootingStars.length > 34) {
        shootingStars.shift();
      }
    };

    const pointerToWorld = (event: PointerEvent | MouseEvent) => {
      const bounds = mount.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      const y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
      const vector = new THREE.Vector3(x, y, 0.5).unproject(camera);
      const direction = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / direction.z;
      return camera.position.clone().add(direction.multiplyScalar(distance));
    };

    const tint = (color: THREE.Color, strength: number, target: Float32Array, offset: number) => {
      target[offset] = color.r * strength;
      target[offset + 1] = color.g * strength;
      target[offset + 2] = color.b * strength;
    };

    const spawnTrail = (position: THREE.Vector3) => {
      for (let i = 0; i < 5; i += 1) {
        const offset = trailIndex * 3;
        trailPositions[offset] = position.x + (Math.random() - 0.5) * 0.12;
        trailPositions[offset + 1] = position.y + (Math.random() - 0.5) * 0.12;
        trailPositions[offset + 2] = (Math.random() - 0.5) * 0.22;
        trailVelocity[offset] = (Math.random() - 0.5) * 0.018;
        trailVelocity[offset + 1] = (Math.random() - 0.5) * 0.018;
        trailVelocity[offset + 2] = (Math.random() - 0.5) * 0.008;
        trailLife[trailIndex] = 1;
        tint(i % 3 === 0 ? pearl : yellow, 1, trailColors, offset);
        trailIndex = (trailIndex + 1) % trailCount;
      }
    };

    const updateScrollProgress = () => {
      const home = document.getElementById('home');
      if (!home) {
        scrollTarget.value = 0;
        return;
      }
      const rect = home.getBoundingClientRect();
      const scrollable = Math.max(home.offsetHeight - window.innerHeight, 1);
      scrollTarget.value = clamp(-rect.top / scrollable, 0, 1);
      const visibility = clamp(rect.bottom / window.innerHeight, 0, 1);
      home.style.setProperty('--hero-visibility', visibility.toFixed(3));
      mount.style.opacity = (visibility > 0.01 ? 1 : 0.22).toFixed(3);
      mount.style.pointerEvents = visibility > 0.16 ? 'auto' : 'none';
      const stage = document.querySelector('.home-stage') as HTMLElement | null;
      if (stage) {
        const overlayVisibility = visibility * clamp(1 - scrollTarget.value * 1.28, 0, 1);
        stage.style.opacity = overlayVisibility.toFixed(3);
        stage.style.visibility = overlayVisibility > 0.02 ? 'visible' : 'hidden';
      }
    };

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight, false);
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      fxCanvas.width = Math.round(clientWidth * pixelRatio);
      fxCanvas.height = Math.round(clientHeight * pixelRatio);
      fxCanvas.style.width = `${clientWidth}px`;
      fxCanvas.style.height = `${clientHeight}px`;
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
      mobileScale = clientWidth < 700 ? 0.64 : 1;
      updateScrollProgress();
    };

    const handlePointerMove = (event: PointerEvent | MouseEvent) => {
      const now = performance.now();
      if (event.type === 'pointermove') {
        lastPointerEventTime = now;
      } else if (now - lastPointerEventTime < 32) {
        return;
      }
      const bounds = mount.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const velocityX = lastPointer.initialized ? x - lastPointer.x : 1;
      const velocityY = lastPointer.initialized ? y - lastPointer.y : 0;
      const velocityMagnitude = Math.hypot(velocityX, velocityY);
      if (velocityMagnitude > 0.8) {
        lastMotion.x = velocityX / velocityMagnitude;
        lastMotion.y = velocityY / velocityMagnitude;
      }
      lastPointer.x = x;
      lastPointer.y = y;
      lastPointer.initialized = true;
      targetMouse.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      targetMouse.y = -((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      pointerWorld.copy(pointerToWorld(event));
      spawnTrail(pointerWorld);
      spawnFx(x, y, velocityX, velocityY);
    };

    const handlePointerDown = (event: PointerEvent | MouseEvent) => {
      const now = performance.now();
      if (event.type === 'pointerdown') {
        lastPointerDownTime = now;
      } else if (now - lastPointerDownTime < 32) {
        return;
      }
      const bounds = mount.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const velocityX = lastPointer.initialized ? x - lastPointer.x : 1;
      const velocityY = lastPointer.initialized ? y - lastPointer.y : 0;
      const velocityMagnitude = Math.hypot(velocityX, velocityY);
      spawnFx(
        x,
        y,
        velocityMagnitude > 0.8 ? velocityX : lastMotion.x * 12,
        velocityMagnitude > 0.8 ? velocityY : lastMotion.y * 12,
        true
      );
    };

    const beginEarthDrag = (event: PointerEvent) => {
      if ((event.pointerType === 'mouse' && event.button !== 0) || scrollTarget.value > 0.48) {
        return;
      }

      const bounds = mount.getBoundingClientRect();
      const centerX = bounds.left + bounds.width * 0.5;
      const centerY = bounds.top + bounds.height * 0.5;
      const hitRadius = Math.min(bounds.width, bounds.height) * (bounds.width < 700 ? 0.38 : 0.31);
      if (Math.hypot(event.clientX - centerX, event.clientY - centerY) > hitRadius) {
        return;
      }

      earthDrag.active = true;
      earthDrag.lastX = event.clientX;
      earthDrag.lastY = event.clientY;
      mount.classList.add('is-dragging');
      renderer.domElement.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    };

    const updateEarthDrag = (event: PointerEvent) => {
      if (!earthDrag.active) {
        return;
      }

      const deltaX = event.clientX - earthDrag.lastX;
      const deltaY = event.clientY - earthDrag.lastY;
      earthDrag.lastX = event.clientX;
      earthDrag.lastY = event.clientY;
      dragYawQuaternion.setFromAxisAngle(dragYawAxis, deltaX * 0.009);
      dragPitchQuaternion.setFromAxisAngle(dragPitchAxis, deltaY * 0.009);
      dragStepQuaternion.copy(dragYawQuaternion).multiply(dragPitchQuaternion);
      globeTargetQuaternion.premultiply(dragStepQuaternion).normalize();
      event.preventDefault();
    };

    const endEarthDrag = () => {
      if (!earthDrag.active) {
        return;
      }

      earthDrag.active = false;
      mount.classList.remove('is-dragging');
    };

    const updateSpineLine = (
      spine: ReturnType<typeof makeSpineLine>,
      elapsed: number,
      progress: number
    ) => {
      const visible = smooth(clamp((progress - 0.14) / 0.62, 0, 1));
      const lowerSceneDim = 1 - smooth(clamp((progress - 0.78) / 0.22, 0, 1)) * 0.72;
      for (let i = 0; i < spine.count; i += 1) {
        const t = i / (spine.count - 1);
        const wave = elapsed * 0.9 + t * Math.PI * 8 + spine.phase;
        const radius = (0.38 + Math.sin(t * Math.PI) * 0.78) * (0.4 + progress * 0.75);
        const offset = i * 3;
        spine.positionArray[offset] = Math.sin(wave) * radius;
        spine.positionArray[offset + 1] = 2.9 - t * (5.7 + progress * 2.8);
        spine.positionArray[offset + 2] = Math.cos(wave) * radius * 0.36;
      }
      const positionAttribute = spine.geometry.getAttribute('position') as THREE.BufferAttribute;
      positionAttribute.needsUpdate = true;
      spine.material.opacity = visible * 0.82 * lowerSceneDim;
    };

    const animate = () => {
      frameId = 0;
      if (isDisposed || document.hidden) {
        return;
      }

      const elapsed = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.034);
      mouse.lerp(targetMouse, 0.055);
      scrollState.value += (scrollTarget.value - scrollState.value) * 0.075;
      const p = smooth(scrollState.value);
      const lowerSceneDim = 1 - smooth(clamp((p - 0.78) / 0.22, 0, 1)) * 0.72;
      globeQuaternion.slerp(globeTargetQuaternion, earthDrag.active ? 0.24 : 0.12);

      const sceneScale = mobileScale * (1 - p * 0.12);
      root.scale.setScalar(sceneScale);
      spineGroup.scale.setScalar(mobileScale);
      atmosphereGroup.scale.setScalar(mobileScale);

      root.position.y = -p * 2.25;
      spineGroup.position.y = -p * 0.9;
      atmosphereGroup.position.y = -p * 0.75;
      camera.position.z = 7.4 - p * 1.15;
      camera.position.y = 0.1 - p * 0.38;

      root.rotation.y = mouse.x * 0.22 + p * 0.7;
      root.rotation.x = mouse.y * 0.1 - p * 0.22;
      root.rotation.z = Math.sin(elapsed * 0.2) * 0.02 - p * 0.42;
      planetGroup.position.y = -p * 0.38 + Math.sin(elapsed * 0.5) * 0.018;
      planetGroup.rotation.y = elapsed * 0.045 + p * 1.35 + mouse.x * 0.08;
      planetGroup.rotation.x = mouse.y * 0.035 - p * 0.12;
      globeGroup.quaternion.copy(globeQuaternion);
      core.rotation.y = elapsed * 0.055 + p * 1.2;
      clouds.rotation.y = -elapsed * 0.035 + p * 0.46;
      clouds.rotation.z = Math.sin(elapsed * 0.11) * 0.018;
      planetAtmosphere.rotation.y = -elapsed * 0.04;
      moonOrbit.rotation.y = elapsed * 0.34 + p * Math.PI * 1.2;
      moonOrbit.rotation.x = Math.sin(elapsed * 0.22) * 0.14 + p * 0.34;
      moon.rotation.y = elapsed * 0.16;
      innerRing.rotation.z = elapsed * 0.38 + p * Math.PI * 1.2;
      outerRing.rotation.z = -elapsed * 0.16 - p * Math.PI * 0.7;
      tallRing.rotation.z = elapsed * 0.1 + p * Math.PI;
      tallRing.rotation.x = p * 0.65;
      rayGroup.rotation.z = elapsed * 0.05 + p * 1.8;
      loopA.rotation.y = Math.sin(elapsed * 0.35) * 0.12 + p * 0.7;
      loopB.rotation.y = -Math.sin(elapsed * 0.3) * 0.12 - p * 0.7;
      loopC.rotation.x = p * 0.86;
      milkyWay.rotation.z = -0.38 + Math.sin(elapsed * 0.045) * 0.01 + p * 0.08;
      milkyWay.position.y = 0.56 - p * 0.38;
      milkyWayMaterial.opacity = 0.7 + p * 0.06;

      coreMaterial.opacity = 0.96 - p * 0.08;
      planetAtmosphereMaterial.opacity = 0.12 + p * 0.06;
      discMaterial.opacity = 0.05 + p * 0.08;
      innerRingMaterial.opacity = 0.44 - p * 0.16;
      outerRingMaterial.opacity = 0.32 - p * 0.12;
      tallRingMaterial.opacity = 0.24 + p * 0.12;

      updateSpineLine(spineA, elapsed, p);
      updateSpineLine(spineB, elapsed * 0.92, p);
      updateSpineLine(spineC, elapsed * 1.08, p);

      const ribVisible = 0.18 + smooth(clamp((p - 0.08) / 0.62, 0, 1)) * 0.72;
      spineRibs.forEach((rib) => {
        const t = rib.index / Math.max(spineRibs.length - 1, 1);
        const yBase = 2.95 - t * (6.25 + p * 3.35);
        const wave = elapsed * 0.92 + rib.index * 0.42;
        const radius = (0.16 + Math.sin(t * Math.PI) * 0.76) * (0.55 + p * 0.72);
        const twist = elapsed * 0.52 + t * Math.PI * 6.2 + p * Math.PI * 1.5;

        for (let i = 0; i < rib.count; i += 1) {
          const u = i / (rib.count - 1);
          const arc = (u - 0.5) * Math.PI;
          const sidePulse = Math.sin(u * Math.PI) * (0.7 + Math.sin(wave) * 0.08);
          const offset = i * 3;
          rib.positionArray[offset] = Math.sin(arc) * radius * (0.9 + sidePulse * 0.35) + Math.sin(twist + u * 2.2) * 0.045;
          rib.positionArray[offset + 1] = yBase + Math.cos(arc * 2) * 0.025 + Math.sin(wave + u * 1.8) * 0.035;
          rib.positionArray[offset + 2] = Math.cos(arc) * radius * 0.34 + Math.cos(twist + u * 2.2) * 0.08;
        }

        const positionAttribute = rib.geometry.getAttribute('position') as THREE.BufferAttribute;
        positionAttribute.needsUpdate = true;
        rib.material.opacity = ribVisible * (0.04 + Math.sin(t * Math.PI) * 0.2) * lowerSceneDim;
      });
      spineGroup.rotation.y = mouse.x * 0.08 + Math.sin(elapsed * 0.18) * 0.1 + p * 0.16;

      const spineDotPositionAttribute = spineDotGeometry.getAttribute('position') as THREE.BufferAttribute;
      const spineDotPositionArray = spineDotPositionAttribute.array as Float32Array;
      const dotVisible = smooth(clamp((p - 0.18) / 0.58, 0, 1));
      for (let i = 0; i < spineDotCount; i += 1) {
        const t = i / (spineDotCount - 1);
        const wave = elapsed * 1.05 + t * Math.PI * 9.5;
        const radius = (0.34 + Math.sin(t * Math.PI) * 0.7) * (0.5 + p * 0.7);
        const offset = i * 3;
        spineDotPositionArray[offset] = Math.sin(wave) * radius + Math.sin(elapsed + i) * 0.015;
        spineDotPositionArray[offset + 1] = 2.75 - t * (5.8 + p * 3.1);
        spineDotPositionArray[offset + 2] = Math.cos(wave) * radius * 0.35;
      }
      spineDotPositionAttribute.needsUpdate = true;
      spineDotMaterial.opacity = dotVisible * 1.12 * lowerSceneDim;
      spineDotMaterial.size = 0.018 + dotVisible * 0.012;

      const particlePositionAttribute = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
      const particlePositionArray = particlePositionAttribute.array as Float32Array;
      for (let i = 0; i < particleCount; i += 1) {
        const offset = i * 3;
        const drift = p * Math.sin(elapsed * 0.55 + i * 0.09) * 0.36;
        particlePositionArray[offset] = basePositions[offset] + Math.sin(elapsed * 0.4 + i * 0.17) * 0.022 + drift * 0.2;
        particlePositionArray[offset + 1] = basePositions[offset + 1] + Math.cos(elapsed * 0.34 + i * 0.13) * 0.022 - p * 1.1;
      }
      particlePositionAttribute.needsUpdate = true;
      particleMesh.rotation.y = elapsed * 0.045 + p * 0.52;
      particleMaterial.opacity = 0.68 + p * 0.15;

      const galaxyPositionAttribute = galaxyGeometry.getAttribute('position') as THREE.BufferAttribute;
      const galaxyPositionArray = galaxyPositionAttribute.array as Float32Array;
      for (let i = 0; i < galaxyCount; i += 1) {
        const offset = i * 3;
        const radiusPulse = Math.sin(elapsed * 0.18 + i * 0.013) * (0.025 + p * 0.035);
        galaxyPositionArray[offset] = galaxyBase[offset] + Math.sin(elapsed * 0.12 + i * 0.019) * 0.08 + galaxyBase[offset] * radiusPulse;
        galaxyPositionArray[offset + 1] = galaxyBase[offset + 1] + Math.cos(elapsed * 0.16 + i * 0.027) * 0.045 - p * 0.46;
        galaxyPositionArray[offset + 2] = galaxyBase[offset + 2] + Math.cos(elapsed * 0.1 + i * 0.017) * 0.08;
      }
      galaxyPositionAttribute.needsUpdate = true;
      galaxyGroup.rotation.y = elapsed * 0.018 + p * 0.38;
      galaxyGroup.rotation.z = -0.18 + Math.sin(elapsed * 0.08) * 0.035 + p * 0.1;
      galaxyGroup.scale.setScalar(1.05 + p * 0.16);
      galaxyMaterial.opacity = 0.2 + p * 0.13;

      const trailPositionAttribute = trailGeometry.getAttribute('position') as THREE.BufferAttribute;
      const trailColorAttribute = trailGeometry.getAttribute('color') as THREE.BufferAttribute;
      const trailPositionArray = trailPositionAttribute.array as Float32Array;
      const trailColorArray = trailColorAttribute.array as Float32Array;
      for (let i = 0; i < trailCount; i += 1) {
        if (trailLife[i] <= 0) {
          continue;
        }
        const offset = i * 3;
        trailLife[i] = Math.max(0, trailLife[i] - delta * 0.78);
        trailPositionArray[offset] += trailVelocity[offset];
        trailPositionArray[offset + 1] += trailVelocity[offset + 1] + delta * 0.04;
        trailPositionArray[offset + 2] += trailVelocity[offset + 2];
        trailColorArray[offset] *= 0.986;
        trailColorArray[offset + 1] *= 0.986;
        trailColorArray[offset + 2] *= 0.986;
        if (trailLife[i] === 0) {
          trailPositionArray[offset] = 99;
          trailPositionArray[offset + 1] = 99;
          trailPositionArray[offset + 2] = 99;
        }
      }
      trailPositionAttribute.needsUpdate = true;
      trailColorAttribute.needsUpdate = true;

      const burstPositionAttribute = burstGeometry.getAttribute('position') as THREE.BufferAttribute;
      const burstColorAttribute = burstGeometry.getAttribute('color') as THREE.BufferAttribute;
      const burstPositionArray = burstPositionAttribute.array as Float32Array;
      const burstColorArray = burstColorAttribute.array as Float32Array;
      for (let i = 0; i < burstCount; i += 1) {
        if (burstLife[i] <= 0) {
          continue;
        }
        const offset = i * 3;
        burstLife[i] = Math.max(0, burstLife[i] - delta * 0.62);
        burstPositionArray[offset] += burstVelocity[offset];
        burstPositionArray[offset + 1] += burstVelocity[offset + 1];
        burstPositionArray[offset + 2] += burstVelocity[offset + 2];
        burstVelocity[offset] *= 0.985;
        burstVelocity[offset + 1] *= 0.985;
        burstVelocity[offset + 2] *= 0.985;
        burstColorArray[offset] *= 0.991;
        burstColorArray[offset + 1] *= 0.991;
        burstColorArray[offset + 2] *= 0.991;
        if (burstLife[i] === 0) {
          burstPositionArray[offset] = 99;
          burstPositionArray[offset + 1] = 99;
          burstPositionArray[offset + 2] = 99;
        }
      }
      burstPositionAttribute.needsUpdate = true;
      burstColorAttribute.needsUpdate = true;

      if (fxContext) {
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        if (elapsed > nextShootingStar) {
          spawnShootingStar(fxCanvas.width / pixelRatio, fxCanvas.height / pixelRatio);
          nextShootingStar = elapsed + 0.22 + Math.random() * 0.78;
        }
        fxContext.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
        fxContext.save();
        fxContext.scale(pixelRatio, pixelRatio);
        fxContext.globalCompositeOperation = 'lighter';

        for (let i = shootingStars.length - 1; i >= 0; i -= 1) {
          const star = shootingStars[i];
          star.life -= delta * 0.42;
          star.x += star.vx;
          star.y += star.vy;
          if (star.life <= 0) {
            shootingStars.splice(i, 1);
            continue;
          }
          const alpha = clamp(star.life, 0, 1) * 0.38;
          const magnitude = Math.max(Math.hypot(star.vx, star.vy), 0.1);
          const dx = (star.vx / magnitude) * star.tail;
          const dy = (star.vy / magnitude) * star.tail;
          const gradient = fxContext.createLinearGradient(star.x, star.y, star.x - dx, star.y - dy);
          gradient.addColorStop(0, `rgba(${star.color}, ${alpha})`);
          gradient.addColorStop(1, `rgba(${star.color}, 0)`);
          fxContext.strokeStyle = gradient;
          fxContext.lineWidth = star.width;
          fxContext.beginPath();
          fxContext.moveTo(star.x, star.y);
          fxContext.lineTo(star.x - dx, star.y - dy);
          fxContext.stroke();
        }

        for (let i = fxParticles.length - 1; i >= 0; i -= 1) {
          const particle = fxParticles[i];
          particle.life -= delta * 0.82;
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vx *= 0.992;
          particle.vy *= 0.992;
          if (particle.life <= 0) {
            fxParticles.splice(i, 1);
            continue;
          }
          const alpha = clamp(particle.life, 0, 1) * particle.glass;
          const magnitude = Math.max(Math.hypot(particle.vx, particle.vy), 0.1);
          const dx = (particle.vx / magnitude) * particle.tail;
          const dy = (particle.vy / magnitude) * particle.tail;
          const gradient = fxContext.createLinearGradient(particle.x, particle.y, particle.x - dx, particle.y - dy);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.82})`);
          gradient.addColorStop(0.22, `rgba(${particle.color}, ${alpha * 0.42})`);
          gradient.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.08})`);
          gradient.addColorStop(1, `rgba(${particle.color}, 0)`);
          fxContext.strokeStyle = gradient;
          fxContext.lineWidth = particle.size * 2.6;
          fxContext.beginPath();
          fxContext.moveTo(particle.x, particle.y);
          fxContext.lineTo(particle.x - dx, particle.y - dy);
          fxContext.stroke();
          fxContext.strokeStyle = `rgba(${particle.color}, ${alpha * 0.48})`;
          fxContext.lineWidth = particle.size;
          fxContext.beginPath();
          fxContext.moveTo(particle.x, particle.y);
          fxContext.lineTo(particle.x - dx, particle.y - dy);
          fxContext.stroke();
          fxContext.fillStyle = `rgba(255, 255, 255, ${alpha * 0.32})`;
          fxContext.beginPath();
          fxContext.arc(particle.x, particle.y, Math.max(0.65, particle.size * 1.2), 0, Math.PI * 2);
          fxContext.fill();
        }
        fxContext.restore();
      }

      mount.style.setProperty('--scroll-progress', scrollState.value.toFixed(3));
      const home = document.getElementById('home');
      if (home) {
        const progress = scrollState.value;
        home.style.setProperty('--scroll-progress', progress.toFixed(3));
        home.style.setProperty('--copy-opacity', `${Math.max(0, 1 - progress * 0.45).toFixed(3)}`);
        home.style.setProperty('--scroll-label-opacity', `${Math.max(0, 1 - progress).toFixed(3)}`);
        home.style.setProperty('--mark-opacity', `${Math.max(0, 1 - progress * 0.28).toFixed(3)}`);
        home.style.setProperty('--caption-opacity', `${Math.max(0, 1 - progress * 0.62).toFixed(3)}`);
        home.style.setProperty('--stats-opacity', `${Math.max(0, 1 - progress * 0.55).toFixed(3)}`);
        home.style.setProperty('--mark-shift', `${(progress * 15).toFixed(3)}vh`);
        home.style.setProperty('--mark-shift-mobile', `${(progress * 12).toFixed(3)}vh`);
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (frameId === 0 && !document.hidden && !isDisposed) {
        clock.getDelta();
        frameId = requestAnimationFrame(animate);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (frameId !== 0) {
          cancelAnimationFrame(frameId);
          frameId = 0;
        }
        return;
      }

      updateScrollProgress();
      startAnimation();
    };

    resize();
    updateScrollProgress();
    startAnimation();

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('mousedown', handlePointerDown);
    renderer.domElement.addEventListener('pointerdown', beginEarthDrag);
    window.addEventListener('pointermove', updateEarthDrag);
    window.addEventListener('pointerup', endEarthDrag);
    window.addEventListener('pointercancel', endEarthDrag);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('mousedown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerdown', beginEarthDrag);
      window.removeEventListener('pointermove', updateEarthDrag);
      window.removeEventListener('pointerup', endEarthDrag);
      window.removeEventListener('pointercancel', endEarthDrag);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mount.removeChild(renderer.domElement);
      mount.removeChild(fxCanvas);
      renderer.dispose();
      [
        core.geometry,
        clouds.geometry,
        disc.geometry,
        planetAtmosphere.geometry,
        moon.geometry,
        milkyWay.geometry,
        innerRing.geometry,
        outerRing.geometry,
        tallRing.geometry,
        loopA.geometry,
        loopB.geometry,
        loopC.geometry,
        particleGeometry,
        galaxyGeometry,
        spineA.geometry,
        spineB.geometry,
        spineC.geometry,
        ...spineRibs.map((rib) => rib.geometry),
        spineDotGeometry,
        trailGeometry,
        burstGeometry,
        ...rayGeometries
      ].forEach((geometry) => geometry.dispose());
      [
        coreMaterial,
        cloudMaterial,
        planetAtmosphereMaterial,
        moonMaterial,
        discMaterial,
        innerRingMaterial,
        outerRingMaterial,
        tallRingMaterial,
        milkyWayMaterial,
        particleMaterial,
        galaxyMaterial,
        spineDotMaterial,
        trailMaterial,
        burstMaterial
      ].forEach((material) => material.dispose());
      earthTexture.dispose();
      cloudTexture.dispose();
      moonTexture.dispose();
      milkyWayTexture.dispose();
      runtimeTextures.forEach((texture) => texture.dispose());
    };
  }, []);

  return <div className="webgl-scene" ref={mountRef} aria-hidden="true" />;
};

export default HeroWebGL;
