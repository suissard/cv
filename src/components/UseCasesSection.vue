<template>
  <section id="cas-pratiques" class="py-20 relative z-10 px-6 max-w-5xl mx-auto">
    <div class="text-center space-y-3 mb-12">
      <span class="text-cyber-secondary font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-cyber-secondary/20 bg-cyber-secondary/5 inline-block">Cas réels</span>
      <h2 class="text-2xl sm:text-4xl font-bold font-display text-white">Vous reconnaissez-vous dans ces situations ?</h2>
      <p class="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
        Sélectionnez une carte pour découvrir comment l'automatisation change radicalement votre quotidien.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UseCaseCard
        v-for="useCase in useCasesData"
        :key="useCase.id"
        :problem="useCase.problem"
        :solution="useCase.solution"
      />
    </div>
  </section>
</template>

<script setup>
import UseCaseCard from './UseCaseCard.vue';
import contentData from '../data/content.json';

const useCasesData = contentData.useCases;
</script>
