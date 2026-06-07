<template>
  <section class="py-16 relative z-10 px-6 max-w-5xl mx-auto border-t border-white/5">
    <div class="text-center space-y-3 mb-12">
      <span class="text-cyber-accent font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-cyber-accent/20 bg-cyber-accent/5 inline-block">Retours d'expérience</span>
      <h2 class="text-2xl sm:text-3xl font-bold font-display text-white">Ce qu'ils en disent</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="testimonial in testimonialsData" :key="testimonial.id" class="glass-card p-6 rounded-2xl border-white/5 flex flex-col justify-between space-y-4">
        <p class="text-xs text-gray-300 italic leading-relaxed">
          {{ testimonial.text }}
        </p>
        <div class="flex items-center space-x-3 pt-2">
          <div :class="`w-10 h-10 rounded-full bg-gradient-to-tr ${testimonial.colors} flex items-center justify-center font-bold text-white text-xs`">
            {{ testimonial.initials }}
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">{{ testimonial.author }}</h4>
            <span class="text-[10px] text-gray-400">{{ testimonial.role }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import contentData from '../data/content.json';

const testimonialsData = contentData.testimonials;
</script>
