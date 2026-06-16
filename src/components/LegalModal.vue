<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="closeModal">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-dark-base/80 backdrop-blur-md"></div>

      <!-- Modal content -->
      <div class="glass-card max-w-lg w-full rounded-2xl border-white/10 p-6 space-y-4 max-h-[85vh] overflow-y-auto relative z-10 glow-hover" @click.stop>
        <div class="flex justify-between items-center border-b border-white/5 pb-3">
          <h3 class="text-base font-bold font-display text-white flex items-center gap-2">
            <span><i class="fa-solid fa-scale-balanced mr-1.5"></i>Mentions Légales</span>
          </h3>
          <button @click="closeModal" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all text-lg font-bold">&times;</button>
        </div>
        <div class="space-y-3 text-xs text-gray-400 leading-relaxed">
          <p><strong>Éditeur du site :</strong> clavier.dev, représenté par Jérémy Clavier.</p>
          <p><strong>Contact :</strong> jeremy@clavier.dev</p>
          <p><strong>Hébergement :</strong> Ce site et ses passerelles applicatives sont hébergés de manière sécurisée en Union Européenne.</p>
          <p><strong>Propriété intellectuelle :</strong> L'ensemble des designs, codes d'intégration, configurations 3D, animations interactives et contenus sont protégés par le droit d'auteur au titre de la propriété intellectuelle.</p>
          <p><strong>Données personnelles & RGPD :</strong> Vos données ne sont ni partagées ni commercialisées. Les données soumises via l'assistant de cadrage ou le formulaire de projet sont conservées de manière confidentielle et sécurisée uniquement pour la prise de contact liée à votre demande.</p>
        </div>
        <div class="pt-3 border-t border-white/5 text-right">
          <button @click="closeModal" class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all duration-200">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch, onUnmounted } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});

onUnmounted(() => {
  document.body.style.overflow = 'auto';
});
</script>

<style scoped>
.modal-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-leave-active {
  transition: all 0.25s ease-in;
}
.modal-enter-from {
  opacity: 0;
}
.modal-enter-from .glass-card {
  transform: scale(0.92) translateY(20px);
}
.modal-leave-to {
  opacity: 0;
}
</style>
