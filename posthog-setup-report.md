<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into **clavier.dev**, a Vue 3 + Vite automation consultancy site. PostHog is initialized in `src/main.js` with the EU host, a global Vue error handler forwarding uncaught exceptions to PostHog, and environment-variable-based configuration. Eleven custom events are captured across five components covering the full visitor-to-lead conversion funnel: from hero CTA clicks and use-case card exploration, through AI chat interactions, all the way to contact form submission and user identification.

| Event | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicked a CTA button in the hero section | `src/components/HeroSection.vue` |
| `use_case_card_flipped` | User flipped a use case card to reveal the automation solution | `src/components/UseCaseCard.vue` |
| `chat_message_sent` | User sent a message in the AI chat assistant | `src/components/ChatWidget.vue` |
| `chat_suggestion_clicked` | User clicked a suggestion pill in the chat widget | `src/components/ChatWidget.vue` |
| `chat_form_prefilled` | User loaded AI-generated project synthesis into the contact form | `src/components/ChatWidget.vue` |
| `chat_reset` | User restarted the chat conversation | `src/components/ChatWidget.vue` |
| `contact_form_mode_toggled` | User toggled between simple and structured form mode | `src/components/ContactSection.vue` |
| `contact_form_submitted` | User successfully submitted the contact/project form | `src/components/ContactSection.vue` |
| `contact_form_submission_failed` | Form submission to the webhook failed | `src/components/ContactSection.vue` |
| `cookie_consent_accepted` | User accepted analytics cookies | `src/components/CookieBanner.vue` |
| `cookie_consent_declined` | User declined analytics cookies | `src/components/CookieBanner.vue` |

## Next steps

### 1. Install the posthog-js package

The sandbox blocked network access during setup. Run this manually:

```bash
npm add posthog-js
```

### 2. Create the "Analytics basics (wizard)" dashboard in PostHog

Log into [PostHog](https://eu.i.posthog.com) and create a dashboard named **"Analytics basics (wizard)"** with these five insights:

1. **Contact Form Conversion Funnel** — Funnel with steps: `hero_cta_clicked` → `chat_message_sent` → `contact_form_submitted`
2. **Form Submissions Over Time** — Trend chart for `contact_form_submitted`, broken down by `form_mode` (simple vs structured)
3. **Chat Engagement** — Trend chart showing `chat_message_sent` and `chat_suggestion_clicked` over time
4. **Chat-to-Form Conversion** — Funnel: `chat_message_sent` → `chat_form_prefilled` → `contact_form_submitted`
5. **Cookie Consent Rate** — Pie chart comparing `cookie_consent_accepted` vs `cookie_consent_declined`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
