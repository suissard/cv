<template>
  <section class="relative min-h-[85vh] flex items-center justify-center pt-28 pb-12 z-10 px-6 overflow-hidden">
    <div class="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

      <!-- Côté Gauche : Promesse de sérénité -->
      <div class="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">

        <!-- Badge top -->
        <div class="reveal stagger-1 inline-flex items-center space-x-2 self-start px-3 py-1.5 rounded-full glass-card border-white/10 text-xs text-gray-300">
          <span class="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-pulse"></span>
          <span>Libérez-vous enfin du temps de gestion</span>
        </div>

        <!-- Titre principal -->
        <div class="space-y-4">
          <h1 class="reveal stagger-2 text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-tight text-white">
            Faites votre métier.<br>
            <span class="bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent bg-clip-text text-transparent gradient-text-animated">
              L'IA s'occupe du reste.
            </span>
          </h1>
          <p class="reveal stagger-3 text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Indépendants, artisans, PME : je connecte intelligemment vos outils du quotidien pour automatiser vos tâches administratives et répétitives. Zéro oubli, moins de paperasse, l'esprit léger. ☕
          </p>
        </div>

        <!-- Call to actions directs -->
        <div class="reveal stagger-4 flex flex-col sm:flex-row gap-4 pt-2">
          <a href="#contact" @click="trackCta('Simplifier mon quotidien maintenant')" class="cta-shimmer px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyber-primary to-cyber-secondary font-bold text-sm text-center text-white hover:shadow-xl hover:shadow-cyber-primary/20 hover:scale-[1.02] transition-all duration-300">
            🚀 Simplifier mon quotidien maintenant
          </a>
          <a href="#cas-pratiques" @click="trackCta('Voir des exemples concrets')" class="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 font-bold text-sm text-center text-white transition-all duration-300">
            💡 Voir des exemples concrets
          </a>
        </div>
      </div>

      <!-- Côté Droit : Visualisation de l'intégration -->
      <div class="lg:col-span-5 w-full reveal-right stagger-3">
        <div class="glass-card p-6 rounded-2xl border-white/10 space-y-5 glow-hover">
          <h3 class="text-xs font-bold uppercase tracking-wider text-cyber-accent flex items-center justify-between">
            <span>Votre journée automatisée</span>
            <span class="px-2 py-0.5 rounded bg-cyber-accent/10 text-cyber-accent text-[9px] font-mono flex items-center space-x-1">
              <span class="w-1 h-1 rounded-full bg-cyber-accent animate-pulse"></span>
              <span>Actif</span>
            </span>
          </h3>
          <div class="space-y-3">
            <div class="feature-item flex items-start space-x-3 text-xs bg-white/5 p-3.5 rounded-xl border border-white/5 cursor-default">
              <span class="text-lg animate-float" style="animation-delay: 0s;">🔗</span>
              <div>
                <h4 class="font-bold text-white text-sm">Des outils simples, qui communiquent entre eux</h4>
                <p class="text-gray-400 text-xs mt-0.5">Prise de rdv, factures et fichiers synchronisés instantanément.</p>
              </div>
            </div>
            <div class="feature-item flex items-start space-x-3 text-xs bg-white/5 p-3.5 rounded-xl border border-white/5 cursor-default">
              <span class="text-lg animate-float" style="animation-delay: 1s;">🤖</span>
              <div>
                <h4 class="font-bold text-white text-sm">Zéro prospect oublié</h4>
                <p class="text-gray-400 text-xs mt-0.5">Une IA qualifie les demandes de devis même durant vos rendez-vous.</p>
              </div>
            </div>
            <div class="feature-item flex items-start space-x-3 text-xs bg-white/5 p-3.5 rounded-xl border border-white/5 cursor-default">
              <span class="text-lg animate-float" style="animation-delay: 2s;">🧘</span>
              <div>
                <h4 class="font-bold text-white text-sm">Concentration maximale</h4>
                <p class="text-gray-400 text-xs mt-0.5">Plus besoin de courir après les relances le soir ou le week-end.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import posthog from 'posthog-js'

const trackCta = (label) => {
  posthog.capture('hero_cta_clicked', { cta_label: label })
}
</script>
