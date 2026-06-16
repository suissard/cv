<template>
  <footer class="relative z-10 px-6">
    <!-- Gradient divider -->
    <div class="section-divider"></div>

    <div class="max-w-5xl mx-auto py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
      <div class="flex items-center space-x-3">
        <img src="/logo.png" alt="clavier.dev" class="w-5 h-5 opacity-40" />
        <span class="font-display font-medium text-gray-400">clavier.dev &copy; 2026</span>
      </div>
      <div class="flex items-center space-x-4">
        <span class="text-gray-500 text-[11px]">Conçu avec <i class="fa-solid fa-heart text-rose-400 mx-0.5"></i> et beaucoup d'automatisation</span>
        <span class="text-gray-600">·</span>
        <button @click="$emit('open-legal')" class="hover:text-white transition-colors duration-200 cursor-pointer text-[11px] underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
          Mentions légales
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
