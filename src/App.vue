<template>
  <div class="selection:bg-indigo-500/30 selection:text-indigo-200">
    <!-- Ondes lumineuses en arrière-plan -->
    <div class="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/10 blur-[130px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-teal-900/5 blur-[150px]"></div>
    </div>

    <AppHeader />
    <HeroSection />
    <UseCasesSection />
    <TestimonialsSection />
    <ContactSection />
    <AppFooter @open-legal="isLegalModalOpen = true" />
    <LegalModal :isOpen="isLegalModalOpen" @close="isLegalModalOpen = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import HeroSection from './components/HeroSection.vue';
import UseCasesSection from './components/UseCasesSection.vue';
import TestimonialsSection from './components/TestimonialsSection.vue';
import ContactSection from './components/ContactSection.vue';
import AppFooter from './components/AppFooter.vue';
import LegalModal from './components/LegalModal.vue';

const isLegalModalOpen = ref(false);
</script>
