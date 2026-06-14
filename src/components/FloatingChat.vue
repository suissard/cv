<template>
  <!-- Placeholder dynamically expands to make room for the text when docked -->
  <div ref="placeholderRef" :class="['h-10 hidden sm:block relative transition-all duration-500', isScrolled ? 'w-10' : 'w-[140px]']"></div>

  <!-- Teleport the fixed elements to body so they are not constrained by any overflow hidden -->
  <Teleport to="body">
    <Transition name="chat-window">
      <div v-if="isOpen" class="fixed top-24 mt-4 right-6 sm:right-10 w-[380px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-8rem)] z-[100] rounded-2xl shadow-2xl border border-white/10 overflow-hidden bg-dark-base flex flex-col">
        <!-- Add a header to the chat window -->
        <div class="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-2">
             <span class="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
             <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
             <span class="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
             <span class="ml-3 text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
               <span>💬</span> Assistant IA
             </span>
          </div>
          <button @click="isOpen = false" class="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <ChatWidget 
          @switch-tab="closeChatAndScrollToForm" 
          @prefill-form="handlePrefillEvent" 
          class="flex-1 rounded-none border-none" 
        />
      </div>
    </Transition>

    <button 
      @click="isOpen = !isOpen"
      class="fixed z-[110] flex items-center justify-center text-white transition-all duration-[700ms] chat-btn-anim border border-white/10 cursor-pointer group bg-gradient-to-r from-cyber-primary to-cyber-secondary shadow-[0_0_20px_rgba(99,102,241,0.4)]"
      :class="isScrolled ? 'floating-chat-btn' : 'hover:scale-105 docked-chat-btn'"
      :style="isScrolled ? {} : dockedStyle"
      :title="isOpen ? 'Fermer le chat' : 'Ouvrir le chat IA'"
    >
      <div v-if="isScrolled" class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit]"></div>
      
      <!-- Tooltip / Label text to the left -->
      <div 
        class="absolute right-full h-full flex flex-col items-end justify-center pr-3 pl-16 text-right transition-all duration-500 whitespace-nowrap pointer-events-none"
        :class="[
          isScrolled 
            ? 'opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0' 
            : 'opacity-100 translate-x-0'
        ]"
      >
        <!-- The background shadow gradient pointing to the button -->
        <div class="absolute inset-y-1 right-0 left-0 bg-gradient-to-r from-transparent via-indigo-600/30 to-cyber-secondary/70 blur-[2px] rounded-l-full -z-10"></div>
        <div class="absolute inset-y-1 right-0 w-12 bg-gradient-to-r from-transparent to-cyber-secondary/50 -z-10"></div>
        
        <span class="text-[10px] sm:text-[11px] font-bold leading-tight drop-shadow-md text-white">Sollicitez</span>
        <span class="text-[9px] sm:text-[10px] font-semibold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-cyber-accent">l'assistant IA</span>
      </div>

      <i :class="isOpen ? 'fa-solid fa-xmark text-xl relative z-10' : 'fa-solid fa-robot text-lg relative z-10'"></i>
    </button>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import ChatWidget from './ChatWidget.vue';

const props = defineProps({
  isScrolled: Boolean
});

const placeholderRef = ref(null);
const dockedStyle = ref({ top: '16px', right: '24px', width: '40px', height: '40px', borderRadius: '0.75rem' });
const isOpen = ref(false);

const updateDockedPosition = () => {
  if (placeholderRef.value) {
    const rect = placeholderRef.value.getBoundingClientRect();
    if (rect.width > 0) {
      // Calculate right position relative to viewport
      const rightPos = window.innerWidth - rect.right;
      dockedStyle.value = {
        top: `${rect.top}px`,
        right: `${rightPos}px`,
        width: `40px`, // Always 40px, ignores rect.width so placeholder can be wider
        height: `40px`,
        borderRadius: '0.75rem'
      };
    } else {
      // Fallback for mobile where placeholder might be hidden
      dockedStyle.value = {
        top: '16px',
        right: '24px',
        width: '40px',
        height: '40px',
        borderRadius: '0.75rem'
      };
    }
  }
};

watch(() => props.isScrolled, () => {
  // Update docked position right before transitioning in case of resize
  if (!props.isScrolled) {
    nextTick(() => {
      updateDockedPosition();
    });
  }
});

onMounted(() => {
  window.addEventListener('resize', updateDockedPosition);
  // Initial calculation after DOM is fully rendered
  setTimeout(updateDockedPosition, 100);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDockedPosition);
});

const closeChatAndScrollToForm = () => {
  isOpen.value = false;
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
};

const handlePrefillEvent = (data) => {
  isOpen.value = false;
  window.dispatchEvent(new CustomEvent('chat-prefill', { detail: data }));
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
.chat-btn-anim {
  /* Bouncy effect for extraction and insertion */
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.floating-chat-btn {
  /* Stay high up, just below the navbar */
  top: 88px; /* 5.5rem */
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
}

@media (min-width: 640px) {
  .floating-chat-btn {
    right: 40px; /* sm:right-10 */
  }
}

.chat-window-enter-active,
.chat-window-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.chat-window-enter-from,
.chat-window-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
  transform-origin: top right;
}
</style>
