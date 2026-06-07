<template>
  <section class="relative min-h-screen flex items-center justify-center pt-28 pb-12 z-10 px-6 overflow-hidden">
    <!-- Canvas 3D -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-30">
      <canvas ref="canvas3dRef" class="w-full h-full"></canvas>
    </div>

    <div class="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

      <!-- Côté Gauche : Promesse de sérénité -->
      <div class="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">

        <!-- Badge top -->
        <div class="reveal stagger-1 inline-flex items-center space-x-2 self-start px-3 py-1.5 rounded-full glass-card border-white/10 text-xs text-gray-300">
          <span class="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-pulse"></span>
          <span>Libérez-vous enfin du temps de gestion</span>
        </div>

        <!-- Titre principal -->
        <div class="space-y-4">
          <h1 class="reveal stagger-2 text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-tight text-white">
            Faites votre métier.<br>
            <span class="bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent bg-clip-text text-transparent gradient-text-animated">
              L'IA s'occupe du reste.
            </span>
          </h1>
          <p class="reveal stagger-3 text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Indépendants, artisans, PME : je connecte intelligemment vos outils du quotidien pour automatiser vos tâches administratives et répétitives. Zéro oubli, moins de paperasse, l'esprit léger. ☕
          </p>
        </div>

        <!-- Stats rapides -->
        <div class="reveal stagger-4 flex flex-wrap gap-6 pt-1">
          <div class="flex items-center space-x-2">
            <span class="text-2xl font-bold font-display text-white stat-glow">10+</span>
            <span class="text-[11px] text-gray-400 leading-tight">heures économisées<br>par semaine</span>
          </div>
          <div class="w-px h-8 bg-white/10"></div>
          <div class="flex items-center space-x-2">
            <span class="text-2xl font-bold font-display text-white stat-glow">0 €</span>
            <span class="text-[11px] text-gray-400 leading-tight">d'abonnement<br>logiciel imposé</span>
          </div>
          <div class="w-px h-8 bg-white/10"></div>
          <div class="flex items-center space-x-2">
            <span class="text-2xl font-bold font-display text-white stat-glow">100%</span>
            <span class="text-[11px] text-gray-400 leading-tight">confidentiel<br>& hébergé en UE</span>
          </div>
        </div>

        <!-- Call to actions directs -->
        <div class="reveal stagger-5 flex flex-col sm:flex-row gap-4 pt-2">
          <a href="#contact" class="cta-shimmer px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyber-primary to-cyber-secondary font-bold text-sm text-center text-white hover:shadow-xl hover:shadow-cyber-primary/20 hover:scale-[1.02] transition-all duration-300">
            🚀 Simplifier mon quotidien maintenant
          </a>
          <a href="#cas-pratiques" class="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 font-bold text-sm text-center text-white transition-all duration-300">
            💡 Voir des exemples concrets
          </a>
        </div>
      </div>

      <!-- Côté Droit : Visualisation de l'intégration -->
      <div class="lg:col-span-5 w-full reveal-right stagger-3">
        <div class="glass-card p-6 rounded-2xl border-white/10 space-y-5 glow-hover">
          <h3 class="text-xs font-bold uppercase tracking-wider text-cyber-accent flex items-center justify-between">
            <span>Votre journée automatisée</span>
            <span class="px-2 py-0.5 rounded bg-cyber-accent/10 text-cyber-accent text-[9px] font-mono flex items-center space-x-1">
              <span class="w-1 h-1 rounded-full bg-cyber-accent animate-pulse"></span>
              <span>Actif</span>
            </span>
          </h3>
          <div class="space-y-3">
            <div class="feature-item flex items-start space-x-3 text-xs bg-white/5 p-3.5 rounded-xl border border-white/5 cursor-default">
              <span class="text-lg animate-float" style="animation-delay: 0s;">🔗</span>
              <div>
                <h4 class="font-bold text-white text-sm">Des outils simples, qui communiquent entre eux</h4>
                <p class="text-gray-400 text-xs mt-0.5">Prise de rdv, factures et fichiers synchronisés instantanément.</p>
              </div>
            </div>
            <div class="feature-item flex items-start space-x-3 text-xs bg-white/5 p-3.5 rounded-xl border border-white/5 cursor-default">
              <span class="text-lg animate-float" style="animation-delay: 1s;">🤖</span>
              <div>
                <h4 class="font-bold text-white text-sm">Zéro prospect oublié</h4>
                <p class="text-gray-400 text-xs mt-0.5">Une IA qualifie les demandes de devis même durant vos rendez-vous.</p>
              </div>
            </div>
            <div class="feature-item flex items-start space-x-3 text-xs bg-white/5 p-3.5 rounded-xl border border-white/5 cursor-default">
              <span class="text-lg animate-float" style="animation-delay: 2s;">🧘</span>
              <div>
                <h4 class="font-bold text-white text-sm">Concentration maximale</h4>
                <p class="text-gray-400 text-xs mt-0.5">Plus besoin de courir après les relances le soir ou le week-end.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';

const canvas3dRef = ref(null);
let scene, camera, renderer, particles;
let animationFrameId;
const count = 400;
let mouseX = 0, mouseY = 0;

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

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);

  const time = Date.now() * 0.0002;
  const positions = particles.geometry.attributes.position.array;

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    positions[ix + 1] += Math.sin(time + positions[ix] * 0.01) * 0.06;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  particles.rotation.y = time * 0.02;

  renderer.render(scene, camera);
};

onMounted(() => {
  if (!canvas3dRef.value) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 240;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const color1 = new THREE.Color("#6366f1"); // Indigo
  const color2 = new THREE.Color("#14b8a6"); // Turquoise d'action

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 600;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  renderer = new THREE.WebGLRenderer({ canvas: canvas3dRef.value, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onDocumentMouseMove);

  animate();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
  document.removeEventListener('mousemove', onDocumentMouseMove);
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
