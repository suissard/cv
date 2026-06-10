<template>
  <section class="py-16 relative z-10 px-6 max-w-5xl mx-auto">
    <!-- Gradient divider -->
    <div class="section-divider mb-12"></div>

    <div class="text-center space-y-4 mb-10">
      <span class="reveal badge-pill text-cyber-accent font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-cyber-accent/20 bg-cyber-accent/5 inline-block">Retours d'expérience</span>
      <h2 class="reveal stagger-1 text-2xl sm:text-3xl font-bold font-display text-white">Ce qu'ils en disent</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="(testimonial, index) in testimonialsData"
        :key="testimonial.id"
        :class="['reveal glow-hover glass-card p-7 rounded-2xl border-white/5 flex flex-col justify-between space-y-5', `stagger-${index + 2}`]"
      >
        <div class="quote-decoration">
          <p class="text-sm text-gray-300 italic leading-relaxed pl-2">
            {{ testimonial.text }}
          </p>
        </div>
        <div class="flex items-center space-x-3 pt-2">
          <div :class="`w-11 h-11 rounded-full bg-gradient-to-tr ${testimonial.colors} flex items-center justify-center font-bold text-white text-xs shadow-lg`">
            {{ testimonial.initials }}
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">{{ testimonial.author }}</h4>
            <span class="text-[11px] text-gray-400">{{ testimonial.role }}</span>
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
