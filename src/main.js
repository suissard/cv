import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import posthog from 'posthog-js'

const consent = localStorage.getItem('cookie_consent');

posthog.init(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN || '', {
  api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com',
  defaults: '2026-01-30',
  opt_out_capturing_by_default: consent !== 'granted',
})

const app = createApp(App)

app.config.errorHandler = (err) => {
  posthog.captureException(err)
}

app.mount('#app')
