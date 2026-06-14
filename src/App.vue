<template>
  <div class="selection:bg-indigo-500/30 selection:text-indigo-200">
    <!-- Ondes lumineuses en arrière-plan -->
    <div class="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/10 blur-[130px] animate-gentle-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-teal-900/5 blur-[150px] animate-gentle-pulse" style="animation-delay: 1.5s;"></div>
      <!-- Subtle mid-page accent -->
      <div class="absolute top-[40%] left-[60%] w-[35vw] h-[35vw] rounded-full bg-violet-900/5 blur-[120px] animate-gentle-pulse" style="animation-delay: 3s;"></div>
    </div>

    <Background3D />

    <AppHeader />
    <HeroSection />
    <UseCasesSection />
    <TestimonialsSection />
    <ContactSection />
    <AppFooter @open-legal="isLegalModalOpen = true" />
    <LegalModal :isOpen="isLegalModalOpen" @close="isLegalModalOpen = false" />
    <CookieBanner @open-legal="isLegalModalOpen = true" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import HeroSection from './components/HeroSection.vue';
import UseCasesSection from './components/UseCasesSection.vue';
import TestimonialsSection from './components/TestimonialsSection.vue';
import ContactSection from './components/ContactSection.vue';
import AppFooter from './components/AppFooter.vue';
import LegalModal from './components/LegalModal.vue';
import Background3D from './components/Background3D.vue';
import CookieBanner from './components/CookieBanner.vue';

const isLegalModalOpen = ref(false);

// Global IntersectionObserver for scroll-reveal animations
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Don't unobserve — keeps it simple, only fires once per element
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  // Observe all elements with reveal classes
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
    observer.observe(el);
  });
});
</script>
