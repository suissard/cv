<template>
  <header
    :class="[
      'fixed top-0 left-0 w-full z-50 border-b bg-dark-base/60 backdrop-blur-md transition-all duration-500',
      isScrolled ? 'header-scrolled border-indigo-500/15 py-0' : 'border-white/5'
    ]"
  >
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="#" class="flex items-center space-x-2.5 group">
        <img
          src="/logo.png"
          alt="clavier.dev Logo"
          class="w-8 h-8 filter drop-shadow-[0_0_6px_rgba(99,102,241,0.4)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
        />
        <div>
          <span class="font-display font-bold tracking-wide text-base text-white">clavier.dev</span>
          <span class="block text-[9px] text-cyber-accent uppercase tracking-widest font-semibold">Automatisation & Applications</span>
        </div>
      </a>

      <div class="flex items-center space-x-3 sm:space-x-4">
        <a
          href="#contact"
          class="cta-shimmer px-5 py-2 rounded-full bg-gradient-to-r from-cyber-primary to-cyber-secondary hover:shadow-lg hover:shadow-cyber-primary/25 text-xs font-bold text-white transition-all duration-300 transform hover:scale-105"
        >
          ⚡ Proposer un projet
        </a>
        
        <!-- The placeholder and logic for the floating chat button -->
        <FloatingChat :isScrolled="isScrolled" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import FloatingChat from './FloatingChat.vue';

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
