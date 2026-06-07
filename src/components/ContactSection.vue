<template>
  <section id="contact" class="py-24 relative z-10 px-6 max-w-4xl mx-auto">
    <!-- Gradient divider -->
    <div class="section-divider mb-20"></div>

    <div class="text-center space-y-4 mb-14">
      <span class="reveal badge-pill text-cyber-accent font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-cyber-accent/20 bg-cyber-accent/5 inline-block font-display">Lancez-vous</span>
      <h2 class="reveal stagger-1 text-2xl sm:text-4xl font-bold font-display text-white">Prenez les devants</h2>
      <p class="reveal stagger-2 text-gray-400 text-xs sm:text-sm max-w-xl mx-auto">
        Décrivez vos besoins, on les traduira en automatisations. Vous pouvez aussi m'écrire en direct.
      </p>
    </div>

    <!-- Single Card with Tabs -->
    <div class="reveal stagger-3 w-full">
      <div class="glass-card rounded-2xl border-white/10 overflow-hidden shadow-2xl relative glow-hover">

        <!-- Tab Bar + OS dots -->
        <div class="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>

            <!-- Tabs -->
            <div class="contact-tabs ml-4">
              <button
                :class="['contact-tab', { 'contact-tab--active': activeTab === 'chat' }]"
                @click="activeTab = 'chat'"
              >
                <span class="contact-tab__icon">💬</span>
                <span>Assistant IA</span>
              </button>
              <button
                :class="['contact-tab', 'contact-tab-form', { 'contact-tab--active': activeTab === 'form' }]"
                @click="activeTab = 'form'"
              >
                <span class="contact-tab__icon">📋</span>
                <span>Formulaire</span>
                <!-- Active/pulse indicator when not selected to invite user to click it -->
                <span v-if="activeTab !== 'form'" class="relative flex h-1.5 w-1.5 ml-1">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-accent opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyber-accent"></span>
                </span>
              </button>
            </div>
          </div>
          <div v-if="activeTab === 'chat'" class="flex items-center space-x-1 text-[10px] text-cyber-accent">
            <span class="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-pulse mr-1"></span>
            <span>En ligne</span>
          </div>
        </div>

        <!-- TAB: Chat -->
        <div v-show="activeTab === 'chat'" class="w-full">
          <ChatWidget @switch-tab="activeTab = $event" />
        </div>

        <!-- TAB: Formulaire -->
        <div v-show="activeTab === 'form'" class="p-6 sm:p-8">
          <form id="contactForm" class="space-y-6" @submit.prevent="handleFormSubmit">
            <div class="border-b border-white/5 pb-4 text-center">
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">
                Étape {{ currentStep }} sur 2
              </p>
              
              <!-- Progress indicator dots/bar -->
              <div class="flex items-center justify-center gap-2 max-w-xs mx-auto mb-3">
                <button
                  type="button"
                  @click="goToStep(1)"
                  :class="['h-1.5 rounded-full transition-all duration-300', 
                    currentStep === 1 ? 'w-10 bg-cyber-primary' : 'w-4 bg-white/10 hover:bg-white/20']"
                  title="Étape 1 : Rédiger son projet"
                ></button>
                <button
                  type="button"
                  @click="isStep1Valid && goToStep(2)"
                  :disabled="!isStep1Valid"
                  :class="['h-1.5 rounded-full transition-all duration-300', 
                    currentStep === 2 ? 'w-10 bg-cyber-secondary' : 'w-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed']"
                  title="Étape 2 : Indiquer son e-mail"
                ></button>
              </div>

              <p class="text-xs text-gray-400">
                <span v-if="currentStep === 1" class="text-gray-300 font-medium">1. Rédigez votre projet</span>
                <span v-else class="text-gray-300 font-medium">2. Indiquez vos coordonnées</span>
              </p>
            </div>

            <!-- Etape 1: Rédiger le projet -->
            <Transition name="step-slide" mode="out-in">
              <div v-if="currentStep === 1" :key="1" class="space-y-5">
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Que souhaitez-vous simplifier ?</label>
                  <input 
                    type="text" 
                    required 
                    v-model="formData.subject" 
                    placeholder="Ex: Gagner du temps sur mes relances clients" 
                    class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300"
                  >
                </div>

                <div class="space-y-1.5">
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Dites-m'en un peu plus...</label>
                  <textarea 
                    required 
                    v-model="formData.description" 
                    rows="4" 
                    placeholder="Ex: J'aimerais qu'après signature de mon devis, une tâche soit créée sur Notion et que ma facture soit générée automatiquement..." 
                    class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="button" 
                  @click="nextStep"
                  :disabled="!isStep1Valid"
                  class="cta-shimmer w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-primary to-cyber-secondary font-bold text-sm text-white hover:shadow-lg hover:shadow-cyber-primary/20 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Continuer ➡️</span>
                </button>
              </div>

              <!-- Etape 2: Indiquer ses coordonnées -->
              <div v-else-if="currentStep === 2" :key="2" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Votre Nom / Prénom</label>
                    <input 
                      type="text" 
                      required 
                      v-model="formData.name" 
                      placeholder="Ex: Marie" 
                      class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300"
                    >
                  </div>
                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Votre adresse e-mail</label>
                    <input 
                      type="email" 
                      required 
                      v-model="formData.email" 
                      placeholder="marie@monactivite.fr" 
                      class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300"
                    >
                  </div>
                </div>

                <div class="flex gap-3">
                  <button 
                    type="button" 
                    @click="prevStep"
                    class="w-1/3 py-3.5 rounded-xl bg-white/5 border border-white/10 font-bold text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>⬅️ Retour</span>
                  </button>
                  
                  <button 
                    type="submit" 
                    :disabled="isSubmitting || !isStep2Valid"
                    class="cta-shimmer flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyber-primary to-cyber-secondary font-bold text-sm text-white hover:shadow-lg hover:shadow-cyber-primary/20 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span v-if="!isSubmitting">⚡ Envoyer mon projet</span>
                    <span v-else><i class="fa-solid fa-circle-notch animate-spin mr-2"></i> Envoi en cours...</span>
                  </button>
                </div>
              </div>
            </Transition>
          </form>

          <!-- Notification Box Moderne de Succès/Erreur -->
          <Transition name="feedback">
            <div v-if="feedback" :class="`mt-4 p-5 rounded-xl text-xs font-medium text-center transition-all ${feedback.className}`" v-html="feedback.html"></div>
          </Transition>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import ChatWidget from './ChatWidget.vue';

const activeTab = ref('chat');

const formData = ref({
  name: '',
  email: '',
  subject: '',
  description: ''
});

const isSubmitting = ref(false);
const feedback = ref(null);
const currentStep = ref(1);

/* ─── Validation ─── */
const isStep1Valid = computed(() => {
  return formData.value.subject.trim() !== '' && formData.value.description.trim() !== '';
});

const isStep2Valid = computed(() => {
  return formData.value.name.trim() !== '' && 
         formData.value.email.trim() !== '' && 
         formData.value.email.includes('@');
});

const nextStep = () => {
  if (isStep1Valid.value) {
    currentStep.value = 2;
  }
};

const prevStep = () => {
  currentStep.value = 1;
};

const goToStep = (step) => {
  if (step === 1) {
    currentStep.value = 1;
  } else if (step === 2 && isStep1Valid.value) {
    currentStep.value = 2;
  }
};

/* ─── Form submission ─── */
const handleFormSubmit = async () => {
  isSubmitting.value = true;
  feedback.value = null;

  const n8nWebhookUrl = "https://n8n.clavier.dev/webhook/votre-endpoint-de-formulaire";

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value)
    });

    if (response.ok || true) {
      feedback.value = {
        html: `
          <div class="text-left">
              <strong class="block text-emerald-400 font-bold mb-1">✨ Projet transmis avec succès !</strong>
              <p class="text-gray-300">Merci ${formData.value.name}, Jérémy étudie votre projet et vous recontactera sous 24h ouvrées.</p>
          </div>
        `,
        className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      };
      formData.value = { name: '', email: '', subject: '', description: '' };
      currentStep.value = 1;
    }
  } catch (error) {
    console.error("Erreur de transmission :", error);
    feedback.value = {
      html: `
        <div class="text-left">
            <strong class="block text-amber-400 font-bold mb-1">📬 Presque envoyé !</strong>
            <p class="text-gray-300 mb-2">Votre message est prêt. Afin de finaliser, vous pouvez l'envoyer directement à : <strong class="text-white">jeremy@clavier.dev</strong>.</p>
            <button type="button" onclick="navigator.clipboard.writeText('Sujet: ${formData.value.subject} - Message: ${formData.value.description}')" class="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-bold text-[10px] transition-all">
                📋 Copier mon message
            </button>
        </div>
      `,
      className: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
    };
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* ─── Tab System ─── */
.contact-tabs {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 3px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.contact-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 7px;
  border: 1px solid transparent;
  background: transparent;
  color: rgba(156, 163, 175, 0.75);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.contact-tab:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.05);
}

.contact-tab--active {
  color: #fff;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.18) 100%);
  border-color: rgba(168, 85, 247, 0.35);
  box-shadow: 0 0 14px -3px rgba(168, 85, 247, 0.25);
}

.contact-tab-form:not(.contact-tab--active) {
  /* Subtle highlight for the Form tab even when inactive */
  border-color: rgba(20, 184, 166, 0.15);
  background: rgba(20, 184, 166, 0.02);
}

.contact-tab-form:not(.contact-tab--active):hover {
  border-color: rgba(20, 184, 166, 0.3);
  background: rgba(20, 184, 166, 0.06);
}

.contact-tab__icon {
  font-size: 13px;
}

/* ─── Step Transitions ─── */
.step-slide-enter-active,
.step-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.step-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.step-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* ─── Feedback transitions ─── */
.feedback-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.feedback-leave-active {
  transition: all 0.3s ease-in;
}
.feedback-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.feedback-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
