# 🔒 PrivacyLens — Private AI that stays on your device

**Paste your sensitive text — medical notes, legal clauses, salary negotiations. PrivacyLens analyzes it ON-DEVICE (Gemini Nano) whenever possible, and transparently falls back to cloud Gemini only when the task genuinely needs it. A live privacy log shows you exactly where your data went.**

🔗 **Live demo: [dualwarez.github.io/privacylens](https://dualwarez.github.io/privacylens/)**

Built for the [#BuildHybridAI 2026](https://firebasehybridaihackathon.devpost.com/) hackathon — hybrid inference via [Firebase AI Logic](https://firebase.google.com/docs/ai-logic).

## The problem

People paste sensitive text into cloud AI chatbots without a second thought — patient notes, contract terms, salary negotiations, disputed invoices. Once it's in a cloud log, it's out of your control.

## What PrivacyLens does

1. **Paste any sensitive document.** PrivacyLens analyzes it with **Gemini Nano running on your device** (via Chrome's Prompt API through Firebase AI Logic hybrid inference). Your text never leaves the machine.
2. **The badge always tells the truth.** Every analysis shows a banner: 🟢 processed on-device, or ☁️ processed in cloud (with the reason).
3. **Complex tasks are opt-in.** A cloud-only mode exists for tasks that genuinely exceed on-device limits (e.g., drafting a formal legal response). You explicitly invoke it — the UI tells you your text is going to the cloud *before* it goes.
4. **A live privacy log** records every inference: what ran, where it ran, and how long it took. Exportable, user-visible, honest.

## Why hybrid inference matters here

| Scenario | Without hybrid | With PrivacyLens |
|---|---|---|
| Analyzing patient notes | Text goes to a cloud server | Runs on-device — data stays local |
| Drafting a complex legal response | Same cloud call | Explicit user-invoked cloud task, clearly labeled |
| No internet | App fails | On-device inference works offline |
| Compliance (HIPAA/GDPR sensitive) | Cloud processing concerns | On-device = data never transmitted |

## Technical details

- **On-device:** Gemini Nano via Chrome's Prompt API (Chrome desktop 139+, model downloads on first use) — invoked through Firebase AI Logic's `PREFER_ON_DEVICE` mode
- **Cloud fallback:** Gemini via the Gemini Developer API backend — automatic when on-device is unavailable, or explicit for complex user-invoked tasks
- **App Check:** Firebase App Check protects the AI backend from abuse (debug token mode for this demo, per hackathon rules)
- **Zero backend:** the entire app is static — no server, no database, no logging infrastructure. Your text goes from your clipboard to your GPU (or explicitly to Gemini cloud) and nowhere else.

## The five analysis modes

All run through the hybrid pipeline (`PREFER_ON_DEVICE`): Summarize · Redact PII · Sentiment · Key points · Risk flags

## Run it

```bash
git clone https://github.com/dualwarez/privacylens && cd privacylens
npm install
npm run build        # esbuild bundles src/app.js → public/bundle.js
npx serve public     # http://localhost:3000
```

Chrome desktop 139+ recommended for on-device inference. Check `chrome://components` → "Optimization Guide On Device" for the Gemini Nano model status.

## Repo note

`docs/` mirrors `public/` for GitHub Pages deployment. The Firebase web config (apiKey, projectId) is a public client identifier by design — it is protected by Firebase App Check and is not a secret. No other API keys or secrets exist in this project.

## Team

Built by **dualwarez** (Dhananjay Singh) for the #BuildHybridAI 2026 hackathon. All code written during the submission window — git history is the proof.
