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
          <span class="hidden sm:block text-[9px] text-cyber-accent uppercase tracking-widest font-semibold">Automatisation & Applications</span>
        </div>
      </a>

      <div class="flex items-center space-x-3 sm:space-x-4">
        <button
          @click="openChat"
          class="hidden sm:flex px-3 sm:px-4 py-1.5 rounded-full border border-cyber-accent/30 text-cyber-accent hover:bg-cyber-accent/10 hover:border-cyber-accent transition-all duration-300 items-center text-left"
        >
          <i class="fa-solid fa-robot mr-2 text-base"></i>
          <span class="flex flex-col leading-[1.1] font-bold text-[9px] sm:text-[10px] uppercase tracking-wider">
            <span class="text-white/80">Demander à</span>
            <span>l'agent IA</span>
          </span>
        </button>
        <a
          href="#contact"
          class="cta-shimmer px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-cyber-primary to-cyber-secondary hover:shadow-lg hover:shadow-cyber-primary/25 text-[11px] sm:text-xs font-bold text-white transition-all duration-300 transform hover:scale-105 whitespace-nowrap flex items-center"
        >
          <i class="fa-solid fa-bolt mr-1.5"></i> Proposer un projet
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const openChat = () => {
  window.dispatchEvent(new CustomEvent('open-chat'));
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
