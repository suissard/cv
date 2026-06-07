<template>
  <div class="perspective-1000 w-full min-h-[260px] cursor-pointer" @click="toggleCard">
    <div class="card-inner w-full h-full relative duration-500" :class="{ 'flipped': isFlipped }">

      <!-- RECTO : Le Problème -->
      <div class="card-front absolute inset-0 glass-card p-5 rounded-2xl border-rose-500/20 hover:border-rose-500/40 flex flex-col justify-between transition-all">
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-xl">{{ problem.icon }}</span>
            <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">La situation</span>
          </div>
          <h3 class="text-sm font-bold text-white font-display">{{ problem.title }}</h3>
          <p class="text-[11px] text-gray-400 leading-relaxed">
            {{ problem.description }}
          </p>
        </div>
        <div class="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-rose-400 font-semibold">
          <span>Découvrir la solution</span>
          <span class="animate-bounce"><i class="fa-solid fa-arrow-rotate-right"></i></span>
        </div>
      </div>

      <!-- VERSO : La Solution -->
      <div class="card-back absolute inset-0 glass-card p-5 rounded-2xl border-emerald-500/20 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-xl">{{ solution.icon }}</span>
            <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">La solution</span>
          </div>
          <h3 class="text-sm font-bold text-white font-display">{{ solution.title }}</h3>
          <p class="text-[11px] text-gray-300 leading-relaxed">
            {{ solution.description }}
          </p>
        </div>
        <div class="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-emerald-400 font-semibold">
          <span>Revenir au problème</span>
          <span><i class="fa-solid fa-arrow-rotate-left"></i></span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  problem: {
    type: Object,
    required: true
  },
  solution: {
    type: Object,
    required: true
  }
});

const isFlipped = ref(false);

const toggleCard = () => {
  isFlipped.value = !isFlipped.value;
};
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.card-inner {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.card-inner.flipped {
  transform: rotateY(180deg);
}
.card-front, .card-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.card-back {
  transform: rotateY(180deg);
}
</style>
