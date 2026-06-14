<template>
  <section id="cas-pratiques" class="py-16 relative z-10 px-6 max-w-5xl mx-auto">
    <!-- Gradient divider -->
    <div class="section-divider mb-12"></div>

    <div class="text-center space-y-4 mb-10">
      <span class="reveal badge-pill text-cyber-secondary font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-cyber-secondary/20 bg-cyber-secondary/5 inline-block">Cas réels</span>
      <h2 class="reveal stagger-1 text-2xl sm:text-4xl font-bold font-display text-white">
        Vous reconnaissez-vous dans ces situations ?
      </h2>
      <p class="reveal stagger-2 text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
        Sélectionnez une carte pour découvrir comment l'automatisation change radicalement votre quotidien.
      </p>
    </div>

    <div ref="cardsContainerRef" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UseCaseCard
        v-for="(useCase, index) in useCasesData"
        :key="useCase.id"
        ref="cardRefs"
        :problem="useCase.problem"
        :solution="useCase.solution"
        :class="['reveal-scale', `stagger-${index + 2}`]"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import UseCaseCard from './UseCaseCard.vue';
import contentData from '../data/content.json';

const useCasesData = contentData.useCases;
const cardsContainerRef = ref(null);
const cardRefs = ref([]);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      triggerAutoUnflip();
      if (observer) {
        observer.disconnect();
      }
    }
  }, { threshold: 0.3 });

  if (cardsContainerRef.value) {
    observer.observe(cardsContainerRef.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

const triggerAutoUnflip = () => {
  if (!cardRefs.value || cardRefs.value.length === 0) return;
  
  // Les cartes sont initialement retournées (solution), on les remet à l'endroit (problème) une par une
  cardRefs.value.forEach((card, index) => {
    setTimeout(() => {
      if (card && card.autoUnflip) card.autoUnflip();
    }, index * 400 + 400); // Délai de 400ms pour commencer, puis 400ms entre chaque
  });
};
</script>
