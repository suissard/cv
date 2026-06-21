<template>
  <div 
    class="chat-container flex flex-col h-full bg-transparent rounded-none sm:rounded-b-2xl overflow-hidden relative font-sans text-gray-200"
    @click="handleContainerClick"
  >
    


    <!-- Messages Body -->
    <div 
      ref="messagesContainer" 
      class="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 scrollbar-custom"
    >
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        :data-msg-id="msg.id"
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

            <!-- Structured Project Synthesis Button -->
            <div v-if="msg.structuredData && !msg.animate" class="flex justify-start mt-1.5">
              <button 
                type="button"
                @click="prefillForm(msg.structuredData)"
                class="px-3.5 py-1.5 rounded-lg bg-cyber-accent/10 hover:bg-cyber-accent/20 border border-cyber-accent/30 hover:border-cyber-accent text-cyber-accent text-[11px] font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm shadow-cyber-accent/5 hover:scale-[1.02] cursor-pointer"
              >
                <i class="fa-solid fa-wand-magic-sparkles animate-pulse"></i>
                <span>Charger la synthèse dans le formulaire</span>
              </button>
            </div>

            <!-- CTA form button on the right if "formulaire" is in the message (and no structured card) -->
            <div 
              v-if="msg.sender === 'bot' && !msg.animate && msg.text && msg.text.toLowerCase().includes('formulaire') && !msg.structuredData" 
              class="flex justify-end mt-1.5"
            >
              <button 
                @click="emit('switch-tab', 'form')"
                class="px-3.5 py-1.5 rounded-lg bg-cyber-accent/10 hover:bg-cyber-accent/20 border border-cyber-accent/30 hover:border-cyber-accent text-cyber-accent text-[11px] font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm shadow-cyber-accent/5 hover:scale-[1.02] cursor-pointer"
              >
                <span class="flex items-center gap-1.5"><i class="fa-solid fa-clipboard-list"></i> Accéder au formulaire</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
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
    <div class="chat-input-wrapper p-4 border-t border-white/5 bg-transparent backdrop-blur-md">
      <form 
        @submit.prevent="submitMessage" 
        :class="[
          'chat-input-form flex items-end gap-2 rounded-xl p-1 transition-all duration-400',
          inputFocused ? 'is-focused' : '',
          !inputValue.trim() && !inputFocused && !isLoading ? 'is-idle' : ''
        ]"
      >
        <div class="flex items-center gap-1.5 pl-3 pb-2 pt-2 text-cyber-primary/40 flex-shrink-0 self-end">
          <i class="fa-solid fa-comments text-sm"></i>
        </div>
        <textarea
          ref="textareaRef"
          v-model="inputValue"
          @keydown.enter.prevent="onEnterKey"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
          placeholder="Votre message..."
          rows="1"
          class="flex-grow bg-transparent text-white font-mono text-xs sm:text-sm px-2 py-2 outline-none resize-none placeholder-gray-400 max-h-32 min-h-[38px] leading-relaxed"
          :disabled="isLoading"
        ></textarea>
        
        <button
          type="submit"
          :disabled="isLoading || !inputValue.trim()"
          class="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-cyber-primary to-cyber-secondary text-white hover:scale-105 hover:shadow-lg hover:shadow-cyber-primary/20 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:shadow-none transition-all duration-200 cursor-pointer flex-shrink-0 mb-0.5 mr-0.5"
        >
          <i class="fa-solid fa-paper-plane text-xs"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onBeforeUnmount, watch } from 'vue';
import { marked } from 'marked';
import TypewriterText from './TypewriterText.vue';
import suggestionsConfig from '../data/suggestions.json';
import posthog from 'posthog-js';

const emit = defineEmits(['switch-tab', 'prefill-form', 'talking-status']);

const prefillForm = (data) => {
  emit('prefill-form', data);
  emit('switch-tab', 'form');
  posthog.capture('chat_form_prefilled')
};

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
const inputFocused = ref(false);

// n8n Webhook configuration
const webhookUrl = 'https://n8n.clavier.dev/webhook/018653bb-fe00-4f2b-915b-b23a201afcb8/chat';
const headers = {
  'Content-Type': 'application/json',
  'X-Instance-Id': '2b8a9ae1093cca13e275d12302448f51a2f59dc10bdfe2f99afb7073096f27e1'
};

const suggestionPills = Object.keys(suggestionsConfig.defaultResponses || {});

// Session ID logic
const getSessionId = () => {
  let id = sessionStorage.getItem('chat_session_id');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    sessionStorage.setItem('chat_session_id', id);
  }
  return id;
};

// Track the ID of the currently animating bot message
const animatingMsgId = ref(null);

// Initial messages setup
const messages = ref([
  {
    id: 'welcome',
    sender: 'bot',
    text: suggestionsConfig.welcomeMessage,
    html: `<p>${suggestionsConfig.welcomeMessage}</p>`,
    animate: true
  }
]);

// Compute if suggestion pills should be displayed
const showSuggestions = computed(() => {
  return messages.value.filter(m => m.sender === 'user').length === 0;
});

// ── Smart Auto-Scroll ──
// During typewriter animation, scroll so the bottom of the content is visible
// BUT never scroll past the point where the first line of the message disappears.
const smartScroll = () => {
  const container = messagesContainer.value;
  if (!container) return;

  // If there's an animating message, clamp scroll so its top stays visible
  if (animatingMsgId.value) {
    const msgEl = container.querySelector(`[data-msg-id="${animatingMsgId.value}"]`);
    if (msgEl) {
      const containerRect = container.getBoundingClientRect();
      const msgRect = msgEl.getBoundingClientRect();
      
      // Where the top of the message is in absolute scroll terms
      const msgTopInScroll = msgRect.top - containerRect.top + container.scrollTop;
      
      // Maximum scroll position: the message's top sits at the top of the container, with a small padding
      const maxAllowedScroll = msgTopInScroll - 8;
      
      // The "natural" scroll-to-bottom position
      const bottomScroll = container.scrollHeight - container.clientHeight;
      
      // If the content is now taller than the visible area, the scroll would be clamped.
      // At that point, stop the typewriter and reveal all the text instantly.
      if (bottomScroll >= maxAllowedScroll) {
        const msg = messages.value.find(m => m.id === animatingMsgId.value);
        if (msg && msg.animate) {
          msg.animate = false;
        }
        animatingMsgId.value = null;
        container.scrollTop = maxAllowedScroll;
        // Stop the interval — animation is done
        if (scrollInterval) {
          clearInterval(scrollInterval);
          scrollInterval = null;
        }
        return;
      }

      // Otherwise, scroll normally to show new content as it appears
      container.scrollTop = bottomScroll;
      return;
    }
  }

  // Default: scroll all the way to the bottom (for loading indicators, user messages, etc.)
  container.scrollTop = container.scrollHeight - container.clientHeight;
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

let scrollInterval = null;

const startAutoScroll = () => {
  if (scrollInterval) clearInterval(scrollInterval);
  scrollInterval = setInterval(() => {
    smartScroll();
  }, 80);
};

const stopAutoScroll = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
  animatingMsgId.value = null;
  nextTick(() => {
    scrollToBottom();
  });
};

onMounted(() => {
  scrollToBottom();
  startAutoScroll();
  animatingMsgId.value = 'welcome';
});

onBeforeUnmount(() => {
  if (scrollInterval) clearInterval(scrollInterval);
});


const cleanStringForMatching = (str) => {
  return str
    .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
    .toLowerCase()
    .trim();
};

// Find static default response from config JSON (exact match only)
const findDefaultResponse = (text) => {
  if (!suggestionsConfig.defaultResponses) return null;
  const cleanedQuery = cleanStringForMatching(text);
  
  // Find key that matches exactly after stripping emojis
  const matchKey = Object.keys(suggestionsConfig.defaultResponses).find(
    key => cleanStringForMatching(key) === cleanedQuery
  );
  
  return matchKey ? suggestionsConfig.defaultResponses[matchKey] : null;
};

// Send message
const sendMessage = async (text) => {
  const cleanText = text.trim();
  if (!cleanText) return;

  posthog.capture('chat_message_sent', { message_length: cleanText.length })

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
  animatingMsgId.value = null; // No bot message animating yet, scroll to bottom for loading indicator
  startAutoScroll();

  // Reset textarea height
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }

  // Check if we have a matching local default response
  const defaultReply = findDefaultResponse(cleanText);
  if (defaultReply) {
    try {
      // Simulate fake network thinking time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      
      const msgId = 'bot-' + Date.now();
      messages.value.push({
        id: msgId,
        sender: 'bot',
        text: defaultReply,
        html: marked.parse(defaultReply),
        animate: true,
        structuredData: null
      });
      // Set this as the animating message so smartScroll pins its top
      animatingMsgId.value = msgId;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
      startAutoScroll();
    }
    return;
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

    const formPattern = /===FORM_START===([\s\S]*?)===FORM_END===/;
    const match = responseText.match(formPattern);
    let structuredData = null;
    let cleanResponseText = responseText;

    if (match) {
      try {
        structuredData = JSON.parse(match[1].trim());
        // Clean up responseText for display
        cleanResponseText = responseText.replace(formPattern, '').trim();
      } catch (e) {
        console.error("Erreur de parsing du JSON du formulaire :", e);
      }
    }

    const msgId = 'bot-' + Date.now();
    messages.value.push({
      id: msgId,
      sender: 'bot',
      text: cleanResponseText,
      html: marked.parse(cleanResponseText),
      animate: true,
      structuredData: structuredData
    });
    // Set this as the animating message so smartScroll pins its top
    animatingMsgId.value = msgId;

  } catch (error) {
    console.error('Chat webhook error:', error);
    messages.value.push({
      id: 'error-' + Date.now(),
      sender: 'bot',
      text: "Une erreur de connexion est survenue. Veuillez vérifier votre réseau ou me contacter directement par e-mail à jeremy@clavier.dev.",
      html: '<p class="text-rose-400 font-bold mb-1"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>Erreur de connexion</p><p class="text-gray-300">Une erreur est survenue lors de la communication avec l\'assistant. Vous pouvez réessayer ou m\'écrire directement par email à <a href="mailto:jeremy@clavier.dev" class="text-cyber-accent underline">jeremy@clavier.dev</a>.</p>',
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
  posthog.capture('chat_suggestion_clicked', { suggestion: pillText })
  sendMessage(pillText);
};

// Input box Enter key handler
const onEnterKey = (e) => {
  if (e.shiftKey) {
    inputValue.value += '\n';
  } else {
    submitMessage();
  }
};

// Focus textarea when clicking container (outside interactive elements)
const handleContainerClick = (e) => {
  if (e.target.closest('button, a, textarea, input')) {
    return;
  }
  const selection = window.getSelection();
  if (selection && selection.toString().trim() !== '') {
    return;
  }
  textareaRef.value?.focus();
};

const isBotTalking = computed(() => {
  return isLoading.value || messages.value.some(m => m.animate);
});

const isUserTyping = ref(false);
let typingTimer = null;

watch(isBotTalking, (val) => {
  emit('talking-status', { bot: val, user: isUserTyping.value });
});

watch(inputValue, () => {
  isUserTyping.value = true;
  emit('talking-status', { bot: isBotTalking.value, user: true });
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    isUserTyping.value = false;
    emit('talking-status', { bot: isBotTalking.value, user: false });
  }, 300);
});
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

/* ── Chat Input Styling ── */
.chat-input-form {
  background: rgba(22, 24, 40, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.15);
  position: relative;
}

/* Idle state: visible pulsing glow to attract attention */
.chat-input-form.is-idle {
  animation: inputPulse 2.5s ease-in-out infinite;
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 0 16px -2px rgba(99, 102, 241, 0.2),
              inset 0 1px 0 rgba(99, 102, 241, 0.08);
}

/* Focus state: strong glow, no pulse */
.chat-input-form.is-focused {
  animation: none;
  background: rgba(26, 28, 48, 0.98);
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 24px -3px rgba(99, 102, 241, 0.35),
              0 0 8px -1px rgba(99, 102, 241, 0.2),
              inset 0 1px 0 rgba(99, 102, 241, 0.12);
}

@keyframes inputPulse {
  0%, 100% {
    border-color: rgba(99, 102, 241, 0.18);
    box-shadow: 0 0 10px -2px rgba(99, 102, 241, 0.12),
                inset 0 1px 0 rgba(99, 102, 241, 0.05);
  }
  50% {
    border-color: rgba(99, 102, 241, 0.45);
    box-shadow: 0 0 22px -2px rgba(99, 102, 241, 0.3),
                inset 0 1px 0 rgba(99, 102, 241, 0.1);
  }
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
