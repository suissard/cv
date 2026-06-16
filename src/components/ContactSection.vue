<template>
  <section id="contact" class="py-16 relative z-10 px-6 max-w-7xl mx-auto">
    <!-- Gradient divider -->
    <div class="section-divider mb-12"></div>

    <div class="text-center space-y-4 mb-10">
      <span class="reveal badge-pill text-cyber-accent font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-cyber-accent/20 bg-cyber-accent/5 inline-block font-display">Lancez-vous</span>
      <h2 class="reveal stagger-1 text-2xl sm:text-4xl font-bold font-display text-white">Passez de l'idée à la réalité !</h2>
      <p class="reveal stagger-2 text-gray-400 text-xs sm:text-sm max-w-xl mx-auto">
        Décrivez vos besoins, on les traduira en automatisations.
      </p>
    </div>

    <!-- Layout: Formulaire Centré -->
    <div class="reveal stagger-3 max-w-2xl mx-auto">

      <!-- Form Panel -->
      <div ref="formPanelRef" class="contact-panel contact-panel--form glass-card rounded-2xl border-white/10 overflow-hidden shadow-2xl relative glow-hover">
        <!-- Form Header Bar -->
        <div class="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
            <span class="ml-3 text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
              <span>📋</span> Formulaire
              <span v-if="isStructuredForm" class="flex h-2 w-2 relative ml-1">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-accent opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-cyber-accent"></span>
              </span>
            </span>
          </div>
        </div>

        <div class="p-5 sm:p-6 form-scroll">
          <!-- Panneau de confirmation d'envoi -->
          <div v-if="isSubmitted" class="py-10 flex flex-col items-center text-center space-y-6">
            <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl shadow-lg shadow-emerald-500/5 animate-bounce">
              <i class="fa-solid fa-check"></i>
            </div>
            <div class="space-y-2 max-w-md">
              <h3 class="text-lg font-bold font-display text-white">Projet transmis avec succès !</h3>
              <p class="text-xs text-gray-400 leading-relaxed">
                Merci <strong class="text-white">{{ savedSubmittedName }}</strong>. Votre cahier des charges a été envoyé avec succès. Jérémy l'étudie et reviendra vers vous sous 24 heures ouvrées.
              </p>
            </div>
            <button 
              type="button" 
              @click="resetFormState"
              class="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 cursor-pointer"
            >
              🔄 Nouveau projet
            </button>
          </div>

          <form v-else id="contactForm" class="space-y-5" @submit.prevent="handleFormSubmit">
            
            <!-- Coordonnées: toujours en haut -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Votre Nom / Prénom</label>
                <input 
                  type="text" 
                  name="name"
                  autocomplete="name"
                  required 
                  v-model="formData.name" 
                  placeholder="Ex: Marie" 
                  :class="['w-full px-4 py-2.5 bg-white/5 rounded-xl border focus:outline-none text-sm text-white transition-all duration-300',
                    attentionFields && !formData.name.trim() ? 'field-attention border-cyber-accent/50' : 'border-white/10 focus:border-cyber-primary/50']"
                >
              </div>
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Votre adresse e-mail</label>
                <input 
                  type="email" 
                  name="email"
                  autocomplete="email"
                  required 
                  v-model="formData.email" 
                  @blur="emailTouched = true"
                  @input="emailTouched = true"
                  placeholder="marie@monactivite.fr" 
                  :class="['w-full px-4 py-2.5 bg-white/5 rounded-xl border focus:outline-none text-sm text-white transition-all duration-300', 
                    isEmailInvalid ? 'border-red-500/50 focus:border-red-500' : 
                    attentionFields && !formData.email.trim() ? 'field-attention border-cyber-accent/50' : 'border-white/10 focus:border-cyber-primary/50']"
                >
                <span v-if="isEmailInvalid" class="text-[9px] text-red-400 block mt-1">
                  ⚠️ Format d'e-mail incorrect. Exemple : nom@domaine.fr
                </span>
              </div>
            </div>

            <!-- Séparateur -->
            <div class="border-t border-white/5 pt-4">
              <!-- Mode Toggle Header -->
              <div class="flex items-center justify-between pb-3">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {{ isStructuredForm ? '📁 Cahier des charges IA' : '📝 Description simple' }}
                  </span>
                </div>
                <button 
                  type="button" 
                  @click="toggleFormMode"
                  class="text-[10px] text-cyber-accent hover:underline flex items-center gap-1.5 bg-cyber-accent/5 px-2.5 py-1 rounded-lg border border-cyber-accent/10 hover:border-cyber-accent/30 hover:bg-cyber-accent/10 transition-all duration-300 cursor-pointer font-sans"
                >
                  <i :class="isStructuredForm ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off'"></i>
                  <span>{{ isStructuredForm ? 'Mode Simple' : 'Mode Détaillé' }}</span>
                </button>
              </div>

              <!-- Input: Subject (Show ONLY when structured mode is active) -->
              <div v-if="isStructuredForm" class="space-y-1.5 mb-4">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Que souhaitez-vous simplifier ?</label>
                <input 
                  type="text" 
                  v-model="formData.subject" 
                  placeholder="Ex: Gagner du temps sur mes relances clients" 
                  class="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300"
                >
              </div>

              <!-- Mode 1: Simple Description -->
              <div v-if="!isStructuredForm" class="space-y-1.5">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Dites-m'en un peu plus...</label>
                <textarea 
                  required 
                  v-model="formData.description" 
                  ref="descriptionTextarea"
                  @input="autoResize($event.target)"
                  rows="3" 
                  placeholder="Ex: J'aimerais qu'après signature de mon devis, une tâche soit créée sur Notion et que ma facture soit générée automatiquement..." 
                  class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300 resize-none font-sans auto-textarea"
                ></textarea>
              </div>

              <!-- Mode 2: Structured Fields -->
              <div v-else class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <span>⚠️ Situation actuelle (Pain points)</span>
                    </label>
                    <textarea 
                      v-model="formData.situation_actuelle" 
                      @input="autoResize($event.target)"
                      rows="2" 
                      placeholder="Ex: Les clients oublient les RDV, je dois les relancer un par un par SMS manuellement." 
                      class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300 resize-none font-sans auto-textarea"
                    ></textarea>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-cyber-accent flex items-center gap-1">
                      <span>⚙️ Solution souhaitée</span>
                    </label>
                    <textarea 
                      v-model="formData.solution_automatisee" 
                      @input="autoResize($event.target)"
                      rows="2" 
                      placeholder="Ex: Envoi automatique de rappels par SMS et invitation calendrier (ICS) 24h avant." 
                      class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300 resize-none font-sans auto-textarea"
                    ></textarea>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                      <span>🔧 Outils déjà utilisés</span>
                    </label>
                    <input 
                      type="text"
                      v-model="formData.outils_existants" 
                      placeholder="Ex: Excel, Gmail, Calendly, papier..." 
                      class="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300 font-sans"
                    >
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
                      <span>📊 Volume / Fréquence</span>
                    </label>
                    <input 
                      type="text"
                      v-model="formData.volume_estime" 
                      placeholder="Ex: ~15 factures/mois, 3h/semaine" 
                      class="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300 font-sans"
                    >
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-fuchsia-400 flex items-center gap-1">
                    <span>🧘 Bénéfice & Sérénité attendus</span>
                  </label>
                  <textarea 
                    v-model="formData.impact_serenite" 
                    @input="autoResize($event.target)"
                    rows="2" 
                    placeholder="Ex: Diviser par 4 le taux de rendez-vous manqués et récupérer 2h de libre par semaine." 
                    class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300 resize-none font-sans auto-textarea"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isSubmitting || !isFormValid"
              class="cta-shimmer w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-primary to-cyber-secondary font-bold text-sm text-white hover:shadow-lg hover:shadow-cyber-primary/20 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span v-if="!isSubmitting">⚡ Envoyer mon projet</span>
              <span v-else><i class="fa-solid fa-circle-notch animate-spin mr-2"></i> Envoi en cours...</span>
            </button>
          </form>

          <!-- Notification Box Moderne d'Erreur -->
          <Transition name="feedback">
            <div v-if="feedback && !isSubmitted" :class="`mt-4 p-5 rounded-xl text-xs font-medium text-center transition-all ${feedback.className}`" v-html="feedback.html"></div>
          </Transition>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import posthog from 'posthog-js';

const isStructuredForm = ref(false);

const formData = ref({
  name: '',
  email: '',
  subject: '',
  description: '',
  situation_actuelle: '',
  solution_automatisee: '',
  impact_serenite: '',
  outils_existants: '',
  volume_estime: ''
});

const isSubmitting = ref(false);
const feedback = ref(null);
const emailTouched = ref(false);
const isSubmitted = ref(false);
const savedSubmittedName = ref('');
const formPanelRef = ref(null);
const attentionFields = ref(false);

const resetFormState = () => {
  isSubmitted.value = false;
};

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const isEmailInvalid = computed(() => {
  if (!emailTouched.value || !formData.value.email) return false;
  return !isValidEmail(formData.value.email);
});

const handleGlobalPrefill = (e) => {
  handlePrefill(e.detail);
};

onMounted(() => {
  const savedName = localStorage.getItem('contact_name');
  const savedEmail = localStorage.getItem('contact_email');
  if (savedName) formData.value.name = savedName;
  if (savedEmail) formData.value.email = savedEmail;
  
  window.addEventListener('chat-prefill', handleGlobalPrefill);
});

onBeforeUnmount(() => {
  window.removeEventListener('chat-prefill', handleGlobalPrefill);
});

/* ─── Auto-resize textarea ─── */
const autoResize = (el) => {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
};

/* ─── Validation: single step ─── */
const isContentValid = computed(() => {
  if (isStructuredForm.value) {
    return formData.value.subject.trim() !== '' || 
           formData.value.situation_actuelle.trim() !== '' || 
           formData.value.solution_automatisee.trim() !== '' ||
           formData.value.impact_serenite.trim() !== '';
  } else {
    return formData.value.description.trim() !== '';
  }
});

const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' && 
         isValidEmail(formData.value.email) &&
         isContentValid.value;
});

/* ─── Mode and Syncing Helpers ─── */
const syncStructuredToSimple = () => {
  let parts = [];
  if (formData.value.situation_actuelle.trim()) {
    parts.push(`Situation actuelle : ${formData.value.situation_actuelle.trim()}`);
  }
  if (formData.value.solution_automatisee.trim()) {
    parts.push(`Solution souhaitée : ${formData.value.solution_automatisee.trim()}`);
  }
  if (formData.value.outils_existants.trim()) {
    parts.push(`Outils existants : ${formData.value.outils_existants.trim()}`);
  }
  if (formData.value.volume_estime.trim()) {
    parts.push(`Volume / Fréquence : ${formData.value.volume_estime.trim()}`);
  }
  if (formData.value.impact_serenite.trim()) {
    parts.push(`Bénéfice & Sérénité : ${formData.value.impact_serenite.trim()}`);
  }
  formData.value.description = parts.join('\n\n');
};

const syncSimpleToStructured = () => {
  if (formData.value.description.trim() && !formData.value.situation_actuelle.trim()) {
    formData.value.situation_actuelle = formData.value.description.trim();
  }
};

const toggleFormMode = () => {
  if (isStructuredForm.value) {
    syncStructuredToSimple();
    isStructuredForm.value = false;
  } else {
    syncSimpleToStructured();
    isStructuredForm.value = true;
  }
  posthog.capture('contact_form_mode_toggled', { new_mode: isStructuredForm.value ? 'structured' : 'simple' })
};

const handlePrefill = (data) => {
  formData.value.subject = data.titre_projet || data.subject || '';
  formData.value.situation_actuelle = data.situation_actuelle || '';
  formData.value.solution_automatisee = data.solution_automatisee || '';
  formData.value.impact_serenite = data.impact_serenite || '';
  formData.value.outils_existants = data.outils_existants || '';
  formData.value.volume_estime = data.volume_estime || '';
  
  syncStructuredToSimple();
  
  isStructuredForm.value = true;

  // Auto-resize all textareas after prefill
  nextTick(() => {
    document.querySelectorAll('.auto-textarea').forEach(el => autoResize(el));

    // Scroll to form panel
    if (formPanelRef.value) {
      formPanelRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Highlight empty required fields (nom/email)
    if (!formData.value.name.trim() || !formData.value.email.trim()) {
      attentionFields.value = true;
      // Remove the attention effect after 4 seconds
      setTimeout(() => {
        attentionFields.value = false;
      }, 4000);
    }
  });
};

/* ─── Form submission ─── */
const handleFormSubmit = async () => {
  isSubmitting.value = true;
  feedback.value = null;

  if (isStructuredForm.value) {
    syncStructuredToSimple();
  } else {
    syncSimpleToStructured();
    if (!formData.value.subject.trim()) {
      const desc = formData.value.description.trim();
      const firstLine = desc.split('\n')[0] || '';
      formData.value.subject = firstLine.substring(0, 50) || 'Nouveau projet';
    }
  }

  const n8nWebhookUrl = "https://n8n.clavier.dev/webhook/clavierDevForm";

  const payload = {
    name: formData.value.name,
    email: formData.value.email,
    subject: formData.value.subject,
    description: formData.value.description
  };

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      posthog.identify(formData.value.email, { name: formData.value.name })
      posthog.capture('contact_form_submitted', {
        form_mode: isStructuredForm.value ? 'structured' : 'simple',
        has_tools: !!formData.value.outils_existants.trim(),
        has_volume: !!formData.value.volume_estime.trim(),
      })
      localStorage.setItem('contact_name', formData.value.name);
      localStorage.setItem('contact_email', formData.value.email);
      emailTouched.value = false;
      savedSubmittedName.value = formData.value.name;
      isSubmitted.value = true;
      
      formData.value = { 
        name: localStorage.getItem('contact_name') || '', 
        email: localStorage.getItem('contact_email') || '', 
        subject: '', 
        description: '',
        situation_actuelle: '',
        solution_automatisee: '',
        impact_serenite: '',
        outils_existants: '',
        volume_estime: ''
      };
      isStructuredForm.value = false;
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur de transmission :", error);
    posthog.captureException(error)
    posthog.capture('contact_form_submission_failed')

    // Construct prefilled mailto URL
    const subjectEncoded = encodeURIComponent(`Nouveau projet : ${formData.value.subject || 'Cahier des charges'}`);
    const bodyText = `Bonjour Jérémy,

Voici le cahier des charges de mon projet :

- Situation actuelle :
${formData.value.situation_actuelle || formData.value.description || ''}

- Solution souhaitée :
${formData.value.solution_automatisee || ''}

- Outils déjà utilisés :
${formData.value.outils_existants || 'Non précisé'}

- Volume / Fréquence :
${formData.value.volume_estime || 'Non précisé'}

- Bénéfices attendus :
${formData.value.impact_serenite || ''}

Cordialement,
${formData.value.name || ''}
${formData.value.email || ''}`;

    const mailtoUrl = `mailto:jeremy@clavier.dev?subject=${subjectEncoded}&body=${encodeURIComponent(bodyText)}`;

    feedback.value = {
      html: `
        <div class="text-left space-y-3">
            <strong class="block text-amber-400 font-bold mb-1">📬 Erreur de transmission automatique !</strong>
            <p class="text-gray-300 text-xs">Le service rencontre une perturbation temporaire. Pour ne pas perdre votre saisie, vous pouvez l'envoyer directement par e-mail en un clic.</p>
            <div class="flex flex-wrap gap-2 pt-1">
                <a href="${mailtoUrl}" class="px-3.5 py-2 bg-gradient-to-r from-cyber-primary to-cyber-secondary hover:brightness-110 text-white rounded-lg font-bold text-[10px] transition-all hover:scale-[1.02] flex items-center gap-1.5 shadow-md shadow-cyber-primary/20">
                    📧 Envoyer par e-mail direct (Pré-rempli)
                </a>
            </div>
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
/* ─── Layout ─── */
.contact-panel {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.contact-panel--chat {
  /* Chat takes remaining height */
}

/* ─── Auto-resize textareas ─── */
.auto-textarea {
  min-height: 60px;
  max-height: 240px;
  overflow-y: auto;
  transition: height 0.15s ease;
}

/* ─── Field attention glow animation ─── */
.field-attention {
  animation: fieldGlow 1.2s ease-in-out infinite;
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.15);
}

@keyframes fieldGlow {
  0%, 100% {
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.1), 0 0 8px rgba(20, 184, 166, 0.05);
    border-color: rgba(20, 184, 166, 0.3);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.25), 0 0 16px rgba(20, 184, 166, 0.15);
    border-color: rgba(20, 184, 166, 0.6);
  }
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
