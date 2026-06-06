<template>
  <footer class="border-t border-white/5 bg-[#010103] py-8 relative z-10 px-6">
    <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
      <span class="font-display font-medium text-gray-400">clavier.dev &copy; 2026</span>
      <button @click="$emit('open-legal')" class="hover:text-white transition-colors duration-200 cursor-pointer text-[11px] underline underline-offset-4">
        Mentions légales
      </button>
    </div>
  </footer>
</template>

<script setup>
</script>
