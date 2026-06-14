<template>
  <Transition name="slide-up">
    <div v-if="isVisible" class="fixed bottom-0 left-0 w-full z-[100] p-4 sm:p-6 pointer-events-none">
      <div class="max-w-4xl mx-auto bg-dark-surface/95 backdrop-blur-xl border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-900/20 pointer-events-auto relative overflow-hidden">
        
        <!-- Decoration -->
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent"></div>

        <div class="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div class="flex-1 text-left">
            <h3 class="text-xl font-display font-bold text-white mb-2 flex items-center gap-2">
              <i class="fa-solid fa-shield-halved text-cyber-secondary"></i>
              Respect de votre vie privée
            </h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Nous utilisons des cookies (via PostHog) pour analyser le trafic, 
              améliorer votre expérience sur le site et vous proposer du contenu pertinent. 
              Vous pouvez accepter ces cookies ou les refuser. 
              Pour en savoir plus, consultez nos 
              <button @click="openLegal" class="text-cyber-accent hover:text-white transition-colors underline decoration-cyber-accent/30 hover:decoration-cyber-accent underline-offset-4">Mentions Légales & Confidentialité</button>.
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button @click="declineAll" class="px-5 py-2.5 rounded-lg border border-dark-border text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium text-sm w-full sm:w-auto">
              Tout refuser
            </button>
            <button @click="acceptAll" class="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyber-primary to-cyber-secondary text-white hover:shadow-lg hover:shadow-cyber-primary/25 transition-all font-medium text-sm w-full sm:w-auto relative group overflow-hidden">
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span class="relative z-10">Accepter et continuer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  
  <!-- Mini trigger button when banner is closed -->
  <button v-if="!isVisible" @click="isVisible = true" class="fixed bottom-4 left-4 z-[90] w-10 h-10 rounded-full bg-dark-surface/80 border border-dark-border text-gray-400 hover:text-white hover:border-cyber-primary/50 transition-all flex items-center justify-center backdrop-blur-sm" title="Gérer les cookies">
    <i class="fa-solid fa-cookie-bite text-sm"></i>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import posthog from 'posthog-js';

const isVisible = ref(false);

const emit = defineEmits(['open-legal']);

// Fonction pour gérer l'opt-in PostHog
const handleConsent = (isGranted) => {
  if (isGranted) {
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
  }
};

onMounted(() => {
  // Check if consent has already been given
  const consent = localStorage.getItem('cookie_consent');
  if (consent === 'granted') {
    handleConsent(true);
  } else if (!consent) {
    // S'il n'a pas encore fait de choix, on affiche la bannière
    // Small delay before showing the banner for better UX
    setTimeout(() => {
      isVisible.value = true;
    }, 1000);
  }
});

const openLegal = () => {
  emit('open-legal');
}

const acceptAll = () => {
  localStorage.setItem('cookie_consent', 'granted');
  handleConsent(true);
  isVisible.value = false;
  posthog.capture('cookie_consent_accepted');
};

const declineAll = () => {
  const previousConsent = localStorage.getItem('cookie_consent');
  localStorage.setItem('cookie_consent', 'denied');
  handleConsent(false);
  isVisible.value = false;
  posthog.capture('cookie_consent_declined');
  
  // Si l'utilisateur avait déjà accepté et qu'il change d'avis, on recharge la page 
  // pour s'assurer qu'aucun cookie tier existant ne continue d'être exploité dans la session.
  if (previousConsent === 'granted') {
    window.location.reload();
  }
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
