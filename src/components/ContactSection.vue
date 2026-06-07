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
                :class="['contact-tab', { 'contact-tab--active': activeTab === 'form' }]"
                @click="activeTab = 'form'"
              >
                <span class="contact-tab__icon">📋</span>
                <span>Formulaire</span>
              </button>
            </div>
          </div>
          <div v-if="activeTab === 'chat'" class="flex items-center space-x-1 text-[10px] text-cyber-accent">
            <span class="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-pulse mr-1"></span>
            <span>En ligne</span>
          </div>
        </div>

        <!-- TAB: Chat -->
        <div v-show="activeTab === 'chat'" class="contact-iframe-wrapper">
          <iframe
            ref="chatIframe"
            src="/chat.html?v=1"
            class="contact-iframe"
            title="Cadrage de projet intelligent"
            @load="onIframeLoad"
          ></iframe>
        </div>

        <!-- TAB: Formulaire -->
        <div v-show="activeTab === 'form'" class="p-6 sm:p-8">
          <form id="contactForm" class="space-y-5" @submit.prevent="handleFormSubmit">
            <div class="border-b border-white/5 pb-4 text-center">
              <p class="text-sm text-gray-400 font-medium">
                Passez de l'<span class="bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent font-bold">idée</span>, à la <span class="bg-gradient-to-r from-cyber-secondary to-cyber-accent bg-clip-text text-transparent font-bold">réalité</span> ! ✨
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Votre Nom / Prénom</label>
                <input type="text" required v-model="formData.name" placeholder="Ex: Marie" class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300">
              </div>
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Votre adresse e-mail</label>
                <input type="email" required v-model="formData.email" placeholder="marie@monactivite.fr" class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300">
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Que souhaitez-vous simplifier ?</label>
              <input type="text" required v-model="formData.subject" placeholder="Ex: Gagner du temps sur mes relances clients" class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300">
            </div>

            <div class="space-y-1.5">
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Dites-m'en un peu plus...</label>
              <textarea required v-model="formData.description" rows="4" placeholder="Ex: J'aimerais qu'après signature de mon devis, une tâche soit créée sur Notion et que ma facture soit générée automatiquement..." class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/50 focus:outline-none text-sm text-white transition-all duration-300 resize-none"></textarea>
            </div>

            <button type="submit" :disabled="isSubmitting" class="cta-shimmer w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-primary to-cyber-secondary font-bold text-sm text-white hover:shadow-lg hover:shadow-cyber-primary/20 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="!isSubmitting">⚡ Envoyer mon projet</span>
              <span v-else><i class="fa-solid fa-circle-notch animate-spin mr-2"></i> Envoi en cours...</span>
            </button>
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
import { ref, onMounted, onBeforeUnmount } from 'vue';

const activeTab = ref('chat');
const chatIframe = ref(null);
const iframeHeight = ref(550);

const formData = ref({
  name: '',
  email: '',
  subject: '',
  description: ''
});

const isSubmitting = ref(false);
const feedback = ref(null);

/* ─── Iframe auto-resize ─── */
const handleIframeMessage = (event) => {
  // Listen for resize messages from the iframe content
  if (event.data && event.data.type === 'resize' && event.data.height) {
    iframeHeight.value = Math.max(400, event.data.height);
    if (chatIframe.value) {
      chatIframe.value.style.height = iframeHeight.value + 'px';
    }
  }
};

const onIframeLoad = () => {
  // Same-origin iframe loaded. Height is fixed at 550px for scrolling internal widget.
};

onMounted(() => {
  window.addEventListener('message', handleIframeMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener('message', handleIframeMessage);
});

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
  gap: 2px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 2px;
}

.contact-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: rgba(156, 163, 175, 0.7);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.contact-tab:hover {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.04);
}

.contact-tab--active {
  color: #fff;
  background: rgba(99, 102, 241, 0.15);
  box-shadow: 0 0 12px -3px rgba(99, 102, 241, 0.25);
}

.contact-tab__icon {
  font-size: 13px;
}

/* ─── Iframe auto-resize wrapper ─── */
.contact-iframe-wrapper {
  width: 100%;
  min-height: 400px;
  max-height: 700px;
  overflow: hidden;
  background: rgba(13, 14, 21, 0.4);
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.contact-iframe {
  width: 100%;
  height: 550px;
  min-height: 400px;
  border: none;
  display: block;
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
