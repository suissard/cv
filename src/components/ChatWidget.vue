<template>
  <div class="chat-container flex flex-col h-[550px] bg-dark-base rounded-b-2xl overflow-hidden relative font-sans text-gray-200">
    
    <!-- Action Toolbar (Floating Top Right) -->
    <div class="absolute top-3 right-3 z-20">
      <button 
        @click="resetChat" 
        title="Recommencer la conversation"
        class="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition-all duration-200 flex items-center justify-center backdrop-blur-md"
      >
        <i class="fa-solid fa-arrows-rotate text-xs"></i>
      </button>
    </div>

    <!-- Messages Body -->
    <div 
      ref="messagesContainer" 
      class="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 scrollbar-custom"
    >
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        :class="['flex w-full', msg.sender === 'user' ? 'justify-end' : 'justify-start']"
      >
        <!-- User Message Bubble -->
        <div 
          v-if="msg.sender === 'user'" 
          class="flex items-start gap-2.5 max-w-[85%] self-end justify-end"
        >
          <div class="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-cyber-primary to-cyber-secondary text-sm text-white leading-relaxed shadow-lg shadow-cyber-primary/10">
            <p class="whitespace-pre-line text-xs sm:text-sm">{{ msg.text }}</p>
          </div>
        </div>

        <!-- Bot Message Bubble -->
        <div 
          v-else 
          class="flex items-start gap-2.5 max-w-[85%] self-start group"
        >
          <!-- Bot Avatar -->
          <div class="w-8 h-8 rounded-lg bg-cyber-primary/10 border border-cyber-primary/20 flex items-center justify-center flex-shrink-0 text-cyber-primary shadow-inner">
            <i class="fa-solid fa-robot text-xs"></i>
          </div>
          
          <div class="relative flex flex-col gap-1 w-full">
            <!-- Bubble content -->
            <div class="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#0a0b12]/50 border border-white/5 shadow-lg shadow-black/20 text-xs sm:text-sm font-mono text-gray-200 leading-relaxed markdown-body">
              <TypewriterText 
                v-if="msg.animate" 
                :htmlContent="msg.html" 
                @finished="msg.animate = false; stopAutoScroll()" 
              />
              <div v-else v-html="msg.html"></div>
            </div>

            <!-- CTA form button on the right if "formulaire" is in the message -->
            <div 
              v-if="msg.sender === 'bot' && !msg.animate && msg.text && msg.text.toLowerCase().includes('formulaire')" 
              class="flex justify-end mt-1.5"
            >
              <button 
                @click="emit('switch-tab', 'form')"
                class="px-3.5 py-1.5 rounded-lg bg-cyber-accent/10 hover:bg-cyber-accent/20 border border-cyber-accent/30 hover:border-cyber-accent text-cyber-accent text-[11px] font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm shadow-cyber-accent/5 hover:scale-[1.02] cursor-pointer"
              >
                <span>📋 Accéder au formulaire</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
            
            <!-- Floating action bar -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 mt-1 ml-1">
              <button 
                @click="copyToClipboard(msg.text, msg.id)" 
                class="text-[10px] text-gray-500 hover:text-cyber-accent flex items-center gap-1 bg-white/[0.02] hover:bg-white/[0.06] px-2 py-0.5 rounded border border-white/5 transition-all duration-200"
              >
                <i :class="copiedId === msg.id ? 'fa-solid fa-check text-emerald-400' : 'fa-regular fa-copy'"></i>
                <span>{{ copiedId === msg.id ? 'Copié !' : 'Copier' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Thinking Indicator -->
      <div v-if="isLoading" class="flex items-start gap-2.5 max-w-[85%] self-start">
        <div class="w-8 h-8 rounded-lg bg-cyber-primary/10 border border-cyber-primary/20 flex items-center justify-center flex-shrink-0 text-cyber-primary shadow-inner">
          <i class="fa-solid fa-robot text-xs"></i>
        </div>
        <div class="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-[#0a0b12]/50 border border-white/5 shadow-lg shadow-black/20 flex items-center space-x-1.5 h-10">
          <span class="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-bounce" style="animation-delay: 0s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-bounce" style="animation-delay: 0.15s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-bounce" style="animation-delay: 0.3s"></span>
        </div>
      </div>
    </div>

    <!-- Suggestion Pills (Shows only at the beginning) -->
    <div 
      v-if="showSuggestions && !isLoading" 
      class="px-4 sm:px-6 py-3 flex flex-wrap gap-2 border-t border-white/[0.03] bg-white/[0.01]"
    >
      <button 
        v-for="pill in suggestionPills" 
        :key="pill" 
        @click="sendSuggestion(pill)"
        class="text-[10px] sm:text-xs px-3 py-1.5 rounded-full border border-white/10 hover:border-cyber-primary/30 bg-white/5 hover:bg-cyber-primary/10 text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
      >
        {{ pill }}
      </button>
    </div>

    <!-- Input Box -->
    <div class="p-4 border-t border-white/5 bg-[#030305]/80 backdrop-blur-md">
      <form 
        @submit.prevent="submitMessage" 
        class="flex items-end gap-2 bg-[#0a0b10] border border-white/5 rounded-xl p-1 focus-within:border-cyber-primary/40 focus-within:ring-1 focus-within:ring-cyber-primary/20 transition-all duration-300"
      >
        <textarea
          ref="textareaRef"
          v-model="inputValue"
          @keydown.enter.prevent="onEnterKey"
          placeholder="Posez votre question ici..."
          rows="1"
          class="flex-grow bg-transparent text-white font-mono text-xs sm:text-sm px-3 py-2 outline-none resize-none placeholder-gray-600 max-h-32 min-h-[38px] leading-relaxed"
          :disabled="isLoading"
        ></textarea>
        
        <button
          type="submit"
          :disabled="isLoading || !inputValue.trim()"
          class="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-cyber-primary to-cyber-secondary text-white hover:scale-105 hover:shadow-lg hover:shadow-cyber-primary/20 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:shadow-none transition-all duration-200 cursor-pointer flex-shrink-0 mb-0.5 mr-0.5"
        >
          <i class="fa-solid fa-paper-plane text-xs"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onBeforeUnmount } from 'vue';
import { marked } from 'marked';
import TypewriterText from './TypewriterText.vue';

const emit = defineEmits(['switch-tab']);

// Configure marked to open links in a new tab
const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
  return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};
marked.setOptions({ renderer });

const messagesContainer = ref(null);
const textareaRef = ref(null);
const inputValue = ref('');
const isLoading = ref(false);
const copiedId = ref(null);

// n8n Webhook configuration
const webhookUrl = 'https://n8n.clavier.dev/webhook/018653bb-fe00-4f2b-915b-b23a201afcb8/chat';
const headers = {
  'Content-Type': 'application/json',
  'X-Instance-Id': '2b8a9ae1093cca13e275d12302448f51a2f59dc10bdfe2f99afb7073096f27e1'
};

const suggestionPills = [
  "💡 Que peux-tu faire pour moi ?",
  "⚡ Exemples d'automatisations",
  "💰 Quels sont tes tarifs ?",
  "📅 Prendre un rendez-vous"
];

// Session ID logic
const getSessionId = () => {
  let id = sessionStorage.getItem('chat_session_id');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    sessionStorage.setItem('chat_session_id', id);
  }
  return id;
};

// Initial messages setup
const messages = ref([
  {
    id: 'welcome',
    sender: 'bot',
    text: "Comment souhaitez vous améliorer votre quotidien ?",
    html: '<p>Comment souhaitez vous améliorer votre quotidien ?</p>',
    animate: true
  }
]);

// Compute if suggestion pills should be displayed
const showSuggestions = computed(() => {
  return messages.value.filter(m => m.sender === 'user').length === 0;
});

// Auto scroll mechanics
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

let scrollInterval = null;

const startAutoScroll = () => {
  if (scrollInterval) clearInterval(scrollInterval);
  scrollInterval = setInterval(() => {
    scrollToBottom();
  }, 80);
};

const stopAutoScroll = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
  nextTick(() => {
    scrollToBottom();
  });
};

onMounted(() => {
  scrollToBottom();
  startAutoScroll();
  // We stop the welcome message auto-scroll when typewriter finishes (which is handled inside the template)
});

onBeforeUnmount(() => {
  if (scrollInterval) clearInterval(scrollInterval);
});

// Resets conversation
const resetChat = () => {
  sessionStorage.removeItem('chat_session_id');
  messages.value = [
    {
      id: 'welcome-' + Date.now(),
      sender: 'bot',
      text: "Comment souhaitez vous améliorer votre quotidien ?",
      html: '<p>Comment souhaitez vous améliorer votre quotidien ?</p>',
      animate: true
    }
  ];
  startAutoScroll();
};

// Copy bubble to clipboard
const copyToClipboard = async (text, msgId) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedId.value = msgId;
    setTimeout(() => {
      if (copiedId.value === msgId) copiedId.value = null;
    }, 2000);
  } catch (err) {
    console.error('Erreur de copie:', err);
  }
};

// Send message
const sendMessage = async (text) => {
  const cleanText = text.trim();
  if (!cleanText) return;

  // Add User Message
  messages.value.push({
    id: 'user-' + Date.now(),
    sender: 'user',
    text: cleanText,
    html: cleanText,
    animate: false
  });

  inputValue.value = '';
  isLoading.value = true;
  startAutoScroll();

  // Reset textarea height
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }

  const payload = {
    action: 'sendMessage',
    sessionId: getSessionId(),
    chatInput: cleanText
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse response content (n8n usually returns `{ output: "..." }` or `[{ output: "..." }]`)
    let responseText = '';
    if (Array.isArray(data)) {
      responseText = data[0]?.output || data[0]?.text || '';
    } else if (data && typeof data === 'object') {
      responseText = data.output || data.text || '';
    }

    if (!responseText) {
      responseText = "Désolé, je n'ai pas reçu de réponse valide du serveur.";
    }

    messages.value.push({
      id: 'bot-' + Date.now(),
      sender: 'bot',
      text: responseText,
      html: marked.parse(responseText),
      animate: true
    });

  } catch (error) {
    console.error('Chat webhook error:', error);
    messages.value.push({
      id: 'error-' + Date.now(),
      sender: 'bot',
      text: "Une erreur de connexion est survenue. Veuillez vérifier votre réseau ou me contacter directement par e-mail à jeremy@clavier.dev.",
      html: '<p class="text-rose-400 font-bold mb-1">⚠️ Erreur de connexion</p><p class="text-gray-300">Une erreur est survenue lors de la communication avec l\'assistant. Vous pouvez réessayer ou m\'écrire directement par email à <a href="mailto:jeremy@clavier.dev" class="text-cyber-accent underline">jeremy@clavier.dev</a>.</p>',
      animate: true
    });
  } finally {
    isLoading.value = false;
  }
};

// Form submit
const submitMessage = () => {
  if (inputValue.value.trim() && !isLoading.value) {
    sendMessage(inputValue.value);
  }
};

// Send suggestion pill
const sendSuggestion = (pillText) => {
  // Strip the emoji from suggestion if we want, or send directly
  const cleanText = pillText.replace(/^[\p{Emoji}\s]+/u, '');
  sendMessage(cleanText);
};

// Input box Enter key handler
const onEnterKey = (e) => {
  // Mobile devices: enter key just line-breaks, desktop: sends message unless Shift is pressed
  const isMobile = window.innerWidth <= 640;
  if (!isMobile) {
    submitMessage();
  } else {
    inputValue.value += '\n';
  }
};
</script>

<style scoped>
/* Scrolled Area styles */
.scrollbar-custom::-webkit-scrollbar {
  width: 5px;
}
.scrollbar-custom::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-custom::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.2);
  border-radius: 99px;
}
.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.4);
}

/* Custom Markdown styling overrides for JetBrains Mono and premium look */
.markdown-body :deep(p) {
  margin-bottom: 0.6rem;
}
.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}
.markdown-body :deep(ul), .markdown-body :deep(ol) {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  padding-left: 1.25rem;
}
.markdown-body :deep(ul) {
  list-style-type: disc;
}
.markdown-body :deep(ol) {
  list-style-type: decimal;
}
.markdown-body :deep(li) {
  margin-bottom: 0.2rem;
}
.markdown-body :deep(strong) {
  color: #fff;
  font-weight: 600;
}
.markdown-body :deep(a) {
  color: #14b8a6;
  text-decoration: underline;
  font-weight: 500;
}
.markdown-body :deep(a:hover) {
  color: #fff;
}
.markdown-body :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.125rem 0.25rem;
  border-radius: 4px;
  font-size: 0.85em;
  color: #e879f9;
}
.markdown-body :deep(pre) {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.75rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.75rem 0;
}
.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #f3f4f6;
  font-size: 0.9em;
}
</style>
