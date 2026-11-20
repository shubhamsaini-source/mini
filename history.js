const CAT_COLORS = {
  "Billing": "#e74c3c",
  "Technical Support": "#3498db",
  "Account Management": "#9b59b6",
  "Shipping & Delivery": "#e67e22",
  "General Inquiry": "#27ae60"
};
const PRIORITY_COLORS = { High: "#e74c3c", Medium: "#e67e22", Low: "#27ae60" };

let allHistory = [];
let activeFilter = 'all';

async function loadHistory() {
  const res = await fetch('/api/history');
  allHistory = await res.json();
  renderHistory(allHistory);
  document.getElementById('historyCount').textContent =
    allHistory.length ? `${allHistory.length} ticket${allHistory.length > 1 ? 's' : ''} classified` : 'No tickets yet';
}

function filterHistory(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = cat === 'all' ? allHistory : allHistory.filter(h => h.category === cat);
  renderHistory(filtered);
}

function renderHistory(items) {
  const list = document.getElementById('historyList');
  if (!items.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No tickets found. <a href="/" style="color:#a78bfa">Classify one now →</a></p>
      </div>`;
    return;
  }

  list.innerHTML = items.map((h, i) => {
    const color = CAT_COLORS[h.category] || '#7c3aed';
    const pColor = PRIORITY_COLORS[h.priority] || '#888';
    return `
      <div class="history-item" style="animation-delay:${i * 0.04}s">
        <div class="hist-icon">${h.icon}</div>
        <div class="hist-body">
          <div class="hist-text">${escHtml(h.ticket_text)}</div>
          <div class="hist-meta">
            <span class="hist-tag" style="background:${color}18;color:${color};border-color:${color}33">${h.category}</span>
            <span class="hist-tag" style="background:${pColor}18;color:${pColor};border-color:${pColor}33">${h.priority}</span>
            <span class="hist-conf">🎯 ${h.confidence}%</span>
            <span class="hist-time">${h.timestamp}</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

async function clearHistory() {
  if (!confirm('Clear all history?')) return;
  await fetch('/api/clear_history', { method: 'POST' });
  allHistory = [];
  renderHistory([]);
  document.getElementById('historyCount').textContent = 'No tickets yet';
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Animate cards
document.querySelectorAll('.animate-slideup').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  setTimeout(() => {
    el.style.transition = 'all 0.6s cubic-bezier(0.16,1,0.3,1)';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 100 + i * 120);
});

loadHistory();
