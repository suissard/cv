<template>
  <!-- Placeholder dynamically expands to make room for the text when docked -->
  <div ref="placeholderRef" :class="['h-10 hidden sm:block relative transition-all duration-500', isScrolled ? 'w-10' : 'w-[170px]']"></div>

  <!-- Teleport the fixed elements to body so they are not constrained by any overflow hidden -->
  <Teleport to="body">
    <Transition name="chat-window">
      <div v-if="isOpen" class="fixed top-[92px] right-6 sm:right-10 w-[380px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-8rem)] z-[100] rounded-2xl shadow-2xl border border-white/10 overflow-hidden bg-dark-base flex flex-col">
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
          <!-- Placeholder to maintain layout since we use floating button to close -->
          <div class="w-8 h-8"></div>
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
      class="fixed z-[110] flex items-center justify-center transition-all duration-[700ms] chat-btn-anim cursor-pointer group shadow-[0_0_15px_rgba(16,185,129,0.2)] isolate"
      :class="[
        isOpen ? 'chat-open-btn bg-emerald-500 hover:bg-emerald-400 border-2 border-transparent' :
        (isScrolled 
          ? 'floating-chat-btn bg-emerald-500 hover:bg-emerald-400 pb-[14px]' 
          : 'docked-chat-btn border-2 border-emerald-500 bg-[#0a0b10] hover:bg-emerald-500/10 hover:scale-105')
      ]"
      :style="(isScrolled || isOpen) ? {} : dockedStyle"
      :title="isOpen ? 'Fermer le chat' : 'Ouvrir le chat IA'"
    >
      <div v-if="isScrolled" class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit]"></div>
      
      <!-- Intro Bubble -->
      <Transition name="fade-slide">
        <div 
          v-if="showIntroBubble && !isOpen" 
          @click.stop="isOpen = true; showIntroBubble = false"
          class="absolute right-full top-1/2 -translate-y-1/2 mr-4 w-56 sm:w-64 bg-[#0a0b10] border border-emerald-500/30 rounded-2xl p-3 shadow-xl shadow-emerald-500/5 cursor-pointer hover:border-emerald-500/60 transition-colors pointer-events-auto"
        >
          <div class="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#0a0b10] border-t border-r border-emerald-500/30 rotate-45"></div>
          <p class="text-xs sm:text-sm text-gray-200 font-mono leading-relaxed relative z-10 text-left">
            <span class="text-emerald-400 font-bold mb-1 block"><i class="fa-solid fa-robot mr-1"></i>Assistant IA</span>
            {{ introPhrase }}
          </p>
        </div>
      </Transition>

      <!-- Text inside button when docked -->
      <span 
        class="hidden sm:inline-block font-bold transition-all duration-500 overflow-hidden whitespace-nowrap"
        :class="(isScrolled || isOpen) ? 'max-w-0 opacity-0 ml-0 mr-0 text-[0px]' : 'max-w-[150px] opacity-100 ml-3 mr-2 text-[10px] sm:text-[11px] text-emerald-400'"
      >
        Sollicitez l'assistant IA
      </span>

      <!-- Icon -->
      <i 
        :class="[
          isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-robot',
          'relative z-10 transition-all duration-300',
          isOpen ? 'text-xl text-black' : (isScrolled ? 'text-2xl text-black' : 'text-lg text-emerald-400 sm:mr-3')
        ]"
        :style="(isScrolled || isOpen) ? { mixBlendMode: 'destination-out' } : {}"
      ></i>
    </button>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import ChatWidget from './ChatWidget.vue';
import suggestionsConfig from '../data/suggestions.json';

const props = defineProps({
  isScrolled: Boolean
});

const placeholderRef = ref(null);
const dockedStyle = ref({ top: '16px', right: '24px' });
const isOpen = ref(false);
const showIntroBubble = ref(false);
const introPhrase = suggestionsConfig.welcomeMessage;
let introTimeout = null;

const updateDockedPosition = () => {
  if (placeholderRef.value) {
    const rect = placeholderRef.value.getBoundingClientRect();
    if (rect.width > 0) {
      // Calculate right position relative to viewport
      const rightPos = window.innerWidth - rect.right;
      dockedStyle.value = {
        top: `${rect.top}px`,
        right: `${rightPos}px`
      };
    } else {
      // Fallback for mobile where placeholder might be hidden
      dockedStyle.value = {
        top: '16px',
        right: '24px'
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

  // Show intro bubble after 4 seconds
  introTimeout = setTimeout(() => {
    if (!isOpen.value) {
      showIntroBubble.value = true;
      // Auto-hide after 12 seconds
      setTimeout(() => {
        showIntroBubble.value = false;
      }, 12000);
    }
  }, 4000);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDockedPosition);
  if (introTimeout) clearTimeout(introTimeout);
});

watch(isOpen, (val) => {
  if (val) showIntroBubble.value = false;
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

.docked-chat-btn {
  width: 170px;
  height: 40px;
  border-radius: 0.75rem;
}

.chat-open-btn {
  top: 99px;
  right: 33px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

@media (max-width: 639px) {
  .docked-chat-btn {
    width: 40px;
  }
}

.floating-chat-btn {
  /* Stay high up, just below the navbar */
  top: 88px; /* 5.5rem */
  right: 24px;
  width: 56px;
  height: 70px; /* 56px body + 14px tail */
  /* Custom SVG path to create a perfect 56x56 square body with a downward tail shifted slightly left */
  clip-path: path('M 16 0 H 40 Q 56 0 56 16 V 48 Q 56 56 48 56 L 45 70 L 32 56 H 16 Q 0 56 0 40 V 16 Q 0 0 16 0 Z');
}

@media (min-width: 640px) {
  .floating-chat-btn {
    right: 40px; /* sm:right-10 */
  }
  .chat-open-btn {
    right: 49px;
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

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translate(10px, -50%);
}
</style>
