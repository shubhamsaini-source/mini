const CAT_COLORS = {
  "Billing": "#e74c3c",
  "Technical Support": "#3498db",
  "Account Management": "#9b59b6",
  "Shipping & Delivery": "#e67e22",
  "General Inquiry": "#27ae60"
};
const PRIORITY_COLORS = { High: "#e74c3c", Medium: "#e67e22", Low: "#27ae60" };

let currentMode = 'ml';

// Check if Gemini is configured
fetch('/api/gemini_status').then(r => r.json()).then(d => {
  if (!d.available) {
    document.getElementById('btnAI').title = 'Add GEMINI_API_KEY in .env file to enable';
    document.getElementById('btnAI').style.opacity = '0.5';
  }
});

function setMode(mode) {
  currentMode = mode;
  document.getElementById('btnML').classList.toggle('active', mode === 'ml');
  document.getElementById('btnAI').classList.toggle('active', mode === 'ai');
  document.getElementById('modeHint').textContent = mode === 'ml'
    ? 'Fast, offline — Naive Bayes classifier'
    : 'Powered by Google Gemini 2.0 Flash AI';
  document.getElementById('heroTag').textContent = mode === 'ml'
    ? '⚡ Powered by Naive Bayes + TF-IDF'
    : '✨ Powered by Google Gemini AI';

  // Hide old result when switching mode
  const rc = document.getElementById('resultCard');
  rc.style.display = 'none';
}

function updateCounter() {
  const len = document.getElementById('ticketInput').value.length;
  const el = document.getElementById('charCount');
  el.textContent = len;
  el.style.color = len > 450 ? '#e74c3c' : len > 350 ? '#e67e22' : '#55556a';
}

function setExample(btn) {
  const raw = btn.textContent.replace(/^[\p{Emoji}\s]+/u, '').trim();
  typeInto('ticketInput', raw);
}

function typeInto(id, text) {
  const el = document.getElementById(id);
  el.value = '';
  let i = 0;
  const interval = setInterval(() => {
    el.value += text[i++];
    updateCounter();
    if (i >= text.length) clearInterval(interval);
  }, 22);
}

function clearAll() {
  document.getElementById('ticketInput').value = '';
  updateCounter();
  const rc = document.getElementById('resultCard');
  rc.style.transition = 'all 0.3s ease';
  rc.style.opacity = '0';
  rc.style.transform = 'translateY(10px)';
  setTimeout(() => { rc.style.display = 'none'; rc.style.opacity = ''; rc.style.transform = ''; }, 300);
}

async function classify() {
  const text = document.getElementById('ticketInput').value.trim();
  if (!text) { shakeTextarea(); return; }

  const btn = document.getElementById('classifyBtn');
  btn.disabled = true;
  btn.innerHTML = currentMode === 'ai'
    ? '<span class="spinner"></span> Asking Gemini AI...'
    : '<span class="spinner"></span> Analyzing...';

  try {
    const res = await fetch('/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mode: currentMode })
    });
    const data = await res.json();
    data.error ? showError(data.error) : (data.mode === 'ai' ? showAIResult(data) : showMLResult(data));
  } catch {
    showError('Server error. Make sure Flask app is running.');
  }

  btn.disabled = false;
  btn.innerHTML = '<span class="btn-icon">🤖</span> Classify';
}

function shakeTextarea() {
  const ta = document.querySelector('textarea');
  ta.style.borderColor = '#e74c3c';
  ta.style.boxShadow = '0 0 0 3px #e74c3c33';
  setTimeout(() => { ta.style.borderColor = ''; ta.style.boxShadow = ''; }, 1200);
}

function showError(msg) {
  const rc = document.getElementById('resultCard');
  rc.style.display = 'block';
  document.getElementById('resultContent').innerHTML = `<div class="error-msg">⚠️ ${msg}</div>`;
  revealCard(rc);
}

// ── ML Result ──
function showMLResult(d) {
  const color = CAT_COLORS[d.category] || '#7c3aed';
  const pColor = PRIORITY_COLORS[d.priority] || '#888';

  const scoreRows = Object.entries(d.all_scores).map(([cat, pct], i) => `
    <div class="score-row" style="animation-delay:${0.1 + i * 0.07}s">
      <span class="score-lbl"><span style="color:${CAT_COLORS[cat]}">●</span> ${cat}</span>
      <div class="score-bar-bg">
        <div class="score-bar" data-w="${pct}" style="background:${CAT_COLORS[cat] || '#7c3aed'}"></div>
      </div>
      <span class="score-pct">${pct}%</span>
    </div>`).join('');

  document.getElementById('resultContent').innerHTML = `
    <div class="result-hero" style="background:${color}0d;border-color:${color}33">
      <div class="result-big-icon">${d.icon}</div>
      <div>
        <div class="result-cat-name" style="color:${color}">${d.category}</div>
        <div class="result-cat-desc">${d.description}</div>
      </div>
    </div>
    <div class="meta-chips">
      <div class="meta-chip" style="animation-delay:0.05s">
        <div class="chip-label">Priority</div>
        <div class="chip-value" style="color:${pColor}">${d.priority}</div>
      </div>
      <div class="meta-chip" style="animation-delay:0.1s">
        <div class="chip-label">Response Time</div>
        <div class="chip-value">${d.response_time}</div>
      </div>
      <div class="meta-chip" style="animation-delay:0.15s">
        <div class="chip-label">Confidence</div>
        <div class="chip-value" style="color:#a78bfa">${d.confidence}%</div>
      </div>
      <div class="meta-chip" style="animation-delay:0.2s">
        <div class="chip-label">Time</div>
        <div class="chip-value" style="font-size:0.82rem">${d.timestamp}</div>
      </div>
    </div>
    <div class="conf-section">
      <div class="conf-label"><span>Model Confidence</span><span style="color:#a78bfa;font-weight:700">${d.confidence}%</span></div>
      <div class="bar-bg"><div class="bar-fill" id="confBar"></div></div>
    </div>
    <div class="scores-section-title">All Category Probability Scores</div>
    ${scoreRows}`;

  renderResultCard();
  setTimeout(() => {
    const cb = document.getElementById('confBar');
    if (cb) cb.style.width = d.confidence + '%';
    document.querySelectorAll('.score-bar[data-w]').forEach(b => b.style.width = b.dataset.w + '%');
  }, 80);
}

// ── Gemini AI Result ──
function showAIResult(d) {
  const color = CAT_COLORS[d.category] || '#7c3aed';
  const pColor = PRIORITY_COLORS[d.priority] || '#888';

  document.getElementById('resultContent').innerHTML = `
    <div class="ai-badge">✨ Google Gemini AI · Generative AI Response</div>

    <div class="result-hero" style="background:${color}0d;border-color:${color}33">
      <div class="result-big-icon">${d.icon}</div>
      <div>
        <div class="result-cat-name" style="color:${color}">${d.category}</div>
        <div class="result-cat-desc">${d.description}</div>
      </div>
    </div>

    <div class="meta-chips">
      <div class="meta-chip" style="animation-delay:0.05s">
        <div class="chip-label">Priority</div>
        <div class="chip-value" style="color:${pColor}">${d.priority}</div>
      </div>
      <div class="meta-chip" style="animation-delay:0.1s">
        <div class="chip-label">Response Time</div>
        <div class="chip-value">${d.response_time}</div>
      </div>
      <div class="meta-chip" style="animation-delay:0.15s">
        <div class="chip-label">AI Engine</div>
        <div class="chip-value" style="color:#a78bfa">Gemini 2.0</div>
      </div>
      <div class="meta-chip" style="animation-delay:0.2s">
        <div class="chip-label">Time</div>
        <div class="chip-value" style="font-size:0.82rem">${d.timestamp}</div>
      </div>
    </div>

    ${d.reason ? `<div class="ai-reason"><strong>🧠 AI Reasoning</strong>${escHtml(d.reason)}</div>` : ''}
    ${d.suggested_response ? `<div class="ai-reply"><strong>💬 Suggested Reply to Customer</strong>${escHtml(d.suggested_response)}</div>` : ''}
  `;

  renderResultCard();
}

function renderResultCard() {
  const rc = document.getElementById('resultCard');
  rc.style.display = 'block';
  revealCard(rc);
}

function revealCard(el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.5s cubic-bezier(0.16,1,0.3,1)';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }));
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ticketInput').addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') classify();
  });
});
