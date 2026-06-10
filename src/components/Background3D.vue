<template>
  <div class="fixed inset-0 z-[-1] pointer-events-none opacity-20">
    <canvas ref="canvas3dRef" class="w-full h-full"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';

const canvas3dRef = ref(null);
let scene, camera, renderer, particles;
let animationFrameId;
const count = 500; // Un peu plus de particules pour remplir l'écran
let mouseX = 0, mouseY = 0;
let scrollY = 0;

const onWindowResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};

const onDocumentMouseMove = (event) => {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
};

const onDocumentScroll = () => {
  scrollY = window.scrollY;
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);

  const time = Date.now() * 0.00015; // Animation légèrement plus lente pour être plus discrète
  const positions = particles.geometry.attributes.position.array;

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    positions[ix + 1] += Math.sin(time + positions[ix] * 0.01) * 0.04;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  // Réaction subtile à la souris
  camera.position.x += (mouseX - camera.position.x) * 0.02;
  
  // Réaction au scroll pour donner un effet de profondeur
  const targetY = -mouseY - (scrollY * 0.05); 
  camera.position.y += (targetY - camera.position.y) * 0.05;
  
  camera.lookAt(scene.position);

  particles.rotation.y = time * 0.015;
  particles.rotation.x = scrollY * 0.0005; // Le scroll fait tourner légèrement la galaxie de particules

  renderer.render(scene, camera);
};

onMounted(() => {
  if (!canvas3dRef.value) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 300;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const color1 = new THREE.Color("#6366f1"); // Indigo
  const color2 = new THREE.Color("#14b8a6"); // Turquoise d'action
  const color3 = new THREE.Color("#8b5cf6"); // Violet

  for (let i = 0; i < count; i++) {
    // Dispersion sur un volume plus large pour couvrir l'écran
    positions[i * 3] = (Math.random() - 0.5) * 800;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 800;

    const colorMix = Math.random();
    let mixedColor;
    if (colorMix < 0.5) {
      mixedColor = color1.clone().lerp(color2, colorMix * 2);
    } else {
      mixedColor = color2.clone().lerp(color3, (colorMix - 0.5) * 2);
    }
    
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 2.0,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  renderer = new THREE.WebGLRenderer({ canvas: canvas3dRef.value, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onDocumentMouseMove);
  window.addEventListener('scroll', onDocumentScroll);

  animate();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
  document.removeEventListener('mousemove', onDocumentMouseMove);
  window.removeEventListener('scroll', onDocumentScroll);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  if (renderer) {
    renderer.dispose();
  }
  if (particles) {
    particles.geometry.dispose();
    particles.material.dispose();
  }
});
</script>
