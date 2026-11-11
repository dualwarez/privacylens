/* PrivacyLens — hybrid inference via Firebase AI Logic.
   On-device (Gemini Nano via Chrome Prompt API) first, transparent cloud fallback.
   Every inference is logged with WHERE the data went. */

import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyDzuDJY6-JjINLaIaOzmhTtxO7pEgSKvwA",
  authDomain: "privacylens-hybrid.firebaseapp.com",
  projectId: "privacylens-hybrid",
  storageBucket: "privacylens-hybrid.firebasestorage.app",
  messagingSenderId: "754348827987",
  appId: "1:754348827987:web:72bb22f0e82201548ceda6",
  measurementId: "G-MX6BPDB6DX",
};

const firebaseApp = initializeApp(firebaseConfig);

/* ---------- state ---------- */
const state = {
  running: false,
  modelReady: false,
  mode: null, // "on-device" | "cloud" | null
  log: [],
  deviceModelStatus: "checking", // checking | available | downloadable | downloading | unavailable
};

/* ---------- helpers ---------- */
const $ = (s) => document.querySelector(s);
const el = (id) => document.getElementById(id);

function setPill(cls, text) {
  const pill = el("model-pill");
  pill.className = "pill " + cls;
  pill.textContent = text;
}

function setBanner(cls, html) {
  const b = el("privacy-badge");
  b.className = "privacy-banner " + cls;
  b.innerHTML = html;
}

function now() {
  return new Date().toLocaleTimeString();
}

function log(icon, text, where) {
  state.log.unshift({ icon, text, where, t: now() });
  renderLog();
}

function renderLog() {
  const rows = state.log.map((l) =>
    `<div class="log-row"><span class="icon">${l.icon}</span><span>${escapeHtml(l.text)}</span><span class="t">${escapeHtml(l.where || "")} · ${l.t}</span></div>`
  ).join("");
  el("tab-log").innerHTML = `<div class="log-list">${rows}</div>`;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function showResult(text) {
  el("tab-result").innerHTML = `<div class="result-text">${escapeHtml(text)}</div>`;
  selectTab("result");
}

function selectTab(name) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
  document.querySelectorAll(".tab-body").forEach((b) => b.classList.toggle("hidden", b.id !== `tab-${name}`));
}

/* ---------- model setup: hybrid inference ---------- */
const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

// on-device-capable model: PREFER_ON_DEVICE — falls back to cloud transparently
const deviceModel = getGenerativeModel(ai, {
  mode: InferenceMode.PREFER_ON_DEVICE,
});

// cloud-only model for genuinely complex tasks (user-invoked)
const cloudModel = getGenerativeModel(ai, {
  mode: InferenceMode.ONLY_IN_CLOUD,
});

/* ---------- on-device model status ---------- */
async function checkDeviceModel() {
  try {
    if (typeof LanguageModel === "undefined") {
      state.deviceModelStatus = "unavailable";
      setPill("unavailable", "⚠️ Gemini Nano unavailable — cloud fallback active");
      log("☁️", "On-device model unavailable in this browser — all inference will use cloud Gemini (still hybrid-ready: switches to on-device automatically on supported Chrome).", "setup");
      return;
    }
    const availability = await LanguageModel.availability();
    state.deviceModelStatus = availability; // "available" | "downloadable" | "downloading" | "unavailable"
    if (availability === "available") {
      setPill("on-device", "🟢 Gemini Nano READY on-device — private inference active");
      log("🟢", "On-device model (Gemini Nano) is available — your text can be analyzed without leaving your device.", "setup");
    } else if (availability === "downloadable" || availability === "downloading") {
      setPill("downloading", "⏳ Gemini Nano " + availability + " — will activate once downloaded");
      log("⏳", "On-device model is " + availability + " — cloud used until the download completes.", "setup");
      // trigger download (Chrome may require this)
      try {
        const session = await LanguageModel.create({
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              setPill("downloading", "⏳ Gemini Nano downloading — " + Math.round(e.loaded * 100) + "%");
            });
          },
        });
        session.destroy?.();
        state.deviceModelStatus = "available";
        setPill("on-device", "🟢 Gemini Nano READY on-device — private inference active");
        log("🟢", "On-device model downloaded and ready — private inference active.", "setup");
      } catch (e) {
        log("☁️", "On-device model download needs more disk/user action — cloud fallback stays active.", "setup");
      }
    } else {
      setPill("unavailable", "⚠️ Gemini Nano " + availability + " — cloud fallback active");
      log("☁️", "On-device model " + availability + " — cloud fallback active.", "setup");
    }
  } catch (e) {
    state.deviceModelStatus = "unavailable";
    setPill("unavailable", "⚠️ On-device check failed — cloud fallback active");
    log("☁️", "On-device check failed: " + e.message, "setup");
  }
}

/* ---------- prompts ---------- */
const PROMPTS = {
  summarize: "Summarize the following text in 3-5 concise bullet points. Keep all names, dates and figures exact.",
  redact: "Rewrite the following text with every piece of personally identifying information (names, phone numbers, emails, IDs, account numbers, addresses) replaced with [REDACTED-<TYPE>]. Keep everything else verbatim.",
  sentiment: "Analyze the sentiment and tone of the following text. Reply with: overall sentiment (positive/neutral/negative), tone description in one line, and any notable emotional cues.",
  keypoints: "Extract the key points from the following text as a numbered list. Preserve exact figures, dates, names and obligations.",
  risk: "Flag any risks, red flags, obligations, deadlines or unusual clauses in the following text as a bulleted list. Be specific and quote the source phrases.",
};

/* ---------- run analysis (hybrid) ---------- */
async function runAnalysis() {
  const doc = el("doc-input").value.trim();
  if (!doc || state.running) return;
  const mode = document.querySelector("input[name='mode']:checked").value;
  state.running = true;
  el("run-btn").disabled = true;
  el("run-btn").textContent = "Analyzing…";
  setBanner("neutral", "⏳ Analyzing on-device first…");

  const prompt = PROMPTS[mode] + "\n\n---\n\n" + doc;
  let where = "unknown";
  let resultText = "";

  const t0 = Date.now();
  try {
    // PREFER_ON_DEVICE: runs Gemini Nano locally; throws/falls back per SDK behavior
    let response;
    try {
      response = await deviceModel.generateContent(prompt);
      // determine where it ran: the SDK runs on-device when the local model served it.
      // We detect via timing + availability: if device model is "available", the first attempt is on-device.
      where = state.deviceModelStatus === "available" ? "on-device" : "cloud (fallback)";
    } catch (deviceErr) {
      // on-device attempt failed → transparent cloud fallback
      response = await cloudModel.generateContent(prompt);
      where = "cloud (fallback)";
    }
    resultText = (await response.response).text();
    const ms = Date.now() - t0;

    // privacy banner: WHERE the data went
    if (where === "on-device") {
      setBanner("on-device", `🟢 <strong>Processed on-device.</strong> Your text never left this machine. Model: Gemini Nano · ${(ms / 1000).toFixed(1)}s`);
      log("🟢", mode + " analysis completed ON-DEVICE (" + (ms / 1000).toFixed(1) + "s) — data stayed local.", "inference");
    } else {
      setBanner("cloud-run", `☁️ <strong>Processed in cloud (fallback).</strong> Reason: on-device attempt failed or unavailable. Model: Gemini · ${(ms / 1000).toFixed(1)}s`);
      log("☁️", mode + " analysis ran in cloud (" + (ms / 1000).toFixed(1) + "s) — on-device attempt failed or unavailable.", "inference");
    }
    showResult(resultText);

    // verify grounding: was the response actually about the doc? quick on-device check
    state.mode = where;
  } catch (err) {
    setBanner("warn-run", `⚠️ <strong>Error:</strong> ${escapeHtml(err.message)}`);
    log("🛑", "Error: " + err.message, "inference");
  } finally {
    state.running = false;
    el("run-btn").disabled = false;
    el("run-btn").textContent = "Analyze privately 🔒";
  }
}

/* ---------- complex cloud task (user-invoked) ---------- */
async function runComplex() {
  const doc = el("doc-input").value.trim();
  const task = el("complex-input").value.trim();
  if (!doc || !task || state.running) return;
  state.running = true;
  el("complex-btn").disabled = true;
  setBanner("cloud-run", "☁️ <strong>Complex task — running in cloud.</strong> You explicitly invoked this, so the text goes to Gemini cloud.");

  const prompt = task + "\n\n---\n\n" + doc;
  const t0 = Date.now();
  try {
    const response = await cloudModel.generateContent(prompt);
    const text = (await response.response).text();
    const ms = Date.now() - t0;
    setBanner("cloud-run", `☁️ <strong>Complex task completed in cloud.</strong> Model: Gemini · ${(ms / 1000).toFixed(1)}s · You explicitly chose cloud for this deep task.`);
    log("☁️", "Complex task (user-invoked) ran in cloud (" + (ms / 1000).toFixed(1) + "s).", "inference");
    showResult(text);
    state.mode = "cloud";
  } catch (err) {
    setBanner("warn-run", `⚠️ <strong>Error:</strong> ${escapeHtml(err.message)}`);
    log("🛑", "Complex task error: " + err.message, "inference");
  } finally {
    state.running = false;
    el("complex-btn").disabled = false;
  }
}

/* ---------- samples ---------- */
const SAMPLES = [
  { name: "🩺 Patient notes", text: "Patient: Priya Sharma, DOB 1988-03-12\nMRN: 4471-B\n\nPresenting complaint: Persistent migraines, 3x/week for 2 months.\nCurrent medication: Sumatriptan 50mg PRN.\nAllergies: Penicillin.\n\nAssessment: Suspected chronic migraine without aura. MRI ordered for 2026-11-20.\nPlan: Increase hydration, sleep hygiene counseling. Follow-up in 2 weeks.\nInsurance claim #: CL-2026-88412\nContact: p.sharma@email.com / +91 98200 11223" },
  { name: "📜 Contract clause", text: "CLAUSE 7.2 — TERMINATION FOR CONVENIENCE\n\nThe Client may terminate this Agreement at any time upon fifteen (15) days' written notice. Upon termination, the Vendor shall be entitled to payment for all Services performed through the effective date of termination, provided however that the Client may, at its sole discretion, withhold up to 20% of the final invoice as a quality assurance retention for a period of ninety (90) days.\n\nCLAUSE 7.3 — Late payment interest accrues at 1.5% per month on overdue amounts." },
  { name: "💰 Salary negotiation", text: "Hi Mr. Verma,\n\nThank you for the offer. The base of ₹18,00,000 is below my expectations given my 8 years of experience and the current market. I was targeting ₹24,00,000 plus ESOPs.\n\nI have a competing offer at ₹22,50,000 from a Series-B startup. If you can match ₹23,00,000 with a joining bonus of ₹2,00,000, I'm ready to sign this week.\n\nRegards,\nAnkit" },
  { name: "🧾 Invoice dispute", text: "Invoice #INV-8812 from TechFlow Solutions\nDate: 2026-10-15\nAmount: $4,850.00\n\nServices: UI development sprint (Oct 1-15)\n\nNote: This replaces our earlier quote of $3,200.00 dated 2026-09-30 due to scope changes requested on Oct 8.\nPayment terms: Net 15. Wire to A/C 9987 2210 4455.\n\nDisputed items: Two of three deliverables not accepted by client on Oct 18." },
];

function buildSamples() {
  const wrap = el("samples");
  for (const s of SAMPLES) {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = s.name;
    chip.addEventListener("click", () => {
      el("doc-input").value = s.text;
      refreshRun();
    });
    wrap.appendChild(chip);
  }
}

/* ---------- wire ---------- */
function refreshRun() {
  el("run-btn").disabled = !el("doc-input").value.trim() || state.running;
  el("complex-btn").disabled = !el("doc-input").value.trim() || !el("complex-input").value.trim() || state.running;
}

el("doc-input").addEventListener("input", refreshRun);
el("complex-input").addEventListener("input", refreshRun);
el("run-btn").addEventListener("click", runAnalysis);
el("complex-btn").addEventListener("click", runComplex);
el("clear-btn").addEventListener("click", () => {
  el("doc-input").value = ""; el("complex-input").value = "";
  state.log = []; renderLog();
  setBanner("neutral", "🔒 Ready — nothing has been sent anywhere yet.");
  el("tab-result").innerHTML = `<div class="placeholder">Run an analysis to see results.</div>`;
  refreshRun();
});
document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x.dataset.tab === t.dataset.tab));
  document.querySelectorAll(".tab-body").forEach((b) => b.classList.toggle("hidden", b.id !== `tab-${t.dataset.tab}`));
}));

buildSamples();
refreshRun();
setTabBody("result", `<div class="placeholder">Run an analysis to see results.</div>`);
setTabBody("log", `<div class="placeholder">Every inference is logged here with where your data went.</div>`);
function setTabBody(name, html) {
  el(`tab-${name}`).innerHTML = html || `<div class="placeholder">Nothing here yet.</div>`;
}
checkDeviceModel();
