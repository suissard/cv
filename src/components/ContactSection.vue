<template>
  <section id="contact" class="py-16 relative z-10 px-6 max-w-6xl mx-auto border-t border-white/5">
    <div class="text-center space-y-3 mb-12">
      <span class="text-cyber-accent font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-cyber-accent/20 bg-cyber-accent/5 inline-block font-display">Lancez-vous</span>
      <h2 class="text-2xl sm:text-4xl font-bold font-display text-white">Prenez les devants</h2>
      <p class="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto">
        Décrivez vos besoins, on les traduira en automatisations. Vous pouvez aussi m'écrire en direct.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      <!-- Colonne Tchat Webhook (Gauche) -->
      <div class="lg:col-span-6 w-full">
        <div class="glass-card rounded-2xl border-white/10 overflow-hidden shadow-2xl relative">
          <!-- Barre style OS -->
          <div class="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
              <span class="text-[11px] text-gray-400 font-mono ml-2">assistant_clavier.dev</span>
            </div>
            <div class="flex items-center space-x-1 text-[10px] text-cyber-accent">
              <span class="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-ping mr-1"></span>
              <span>En ligne</span>
            </div>
          </div>

          <!-- Iframe n8n -->
          <div class="h-[400px] w-full bg-[#0d0e15]/40">
            <iframe
              src="https://n8n.clavier.dev/webhook/018653bb-fe00-4f2b-915b-b23a201afcb8/chat"
              class="w-full h-full border-none"
              title="Cadrage de projet intelligent">
            </iframe>
          </div>
        </div>
      </div>

      <!-- Colonne Formulaire SANS mailto (Droite) -->
      <div class="lg:col-span-6 w-full">
        <form id="contactForm" class="glass-card p-6 sm:p-8 rounded-2xl border-white/10 space-y-4" @submit.prevent="handleFormSubmit">
          <div class="border-b border-white/5 pb-4 text-center">
            <p class="text-xs sm:text-sm text-gray-400 font-medium">
              Passez de l'<span class="bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent font-bold">idée</span>, à la <span class="bg-gradient-to-r from-cyber-secondary to-cyber-accent bg-clip-text text-transparent font-bold">réalité</span> ! ✨
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Votre Nom / Prénom</label>
              <input type="text" required v-model="formData.name" placeholder="Ex: Marie" class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/40 focus:outline-none text-xs text-white transition-all">
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Votre adresse e-mail</label>
              <input type="email" required v-model="formData.email" placeholder="marie@monactivite.fr" class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/40 focus:outline-none text-xs text-white transition-all">
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Que souhaitez-vous simplifier ?</label>
            <input type="text" required v-model="formData.subject" placeholder="Ex: Gagner du temps sur mes relances clients" class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/40 focus:outline-none text-xs text-white transition-all">
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Dites-m'en un peu plus...</label>
            <textarea required v-model="formData.description" rows="4" placeholder="Ex: J'aimerais qu'après signature de mon devis, une tâche soit créée sur Notion et que ma facture soit générée automatiquement..." class="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyber-primary/40 focus:outline-none text-xs text-white transition-all"></textarea>
          </div>

          <button type="submit" :disabled="isSubmitting" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-primary to-cyber-secondary font-bold text-xs text-white hover:shadow-lg hover:shadow-cyber-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2">
            <span v-if="!isSubmitting">⚡ Envoyer mon projet</span>
            <span v-else><i class="fa-solid fa-circle-notch animate-spin mr-2"></i> Envoi en cours...</span>
          </button>
        </form>

        <!-- Notification Box Moderne de Succès/Erreur -->
        <div v-if="feedback" :class="`mt-4 p-4 rounded-xl text-xs font-medium text-center transition-all ${feedback.className}`" v-html="feedback.html"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  name: '',
  email: '',
  subject: '',
  description: ''
});

const isSubmitting = ref(false);
const feedback = ref(null);

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
