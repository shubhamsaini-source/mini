const CAT_COLORS = {
  "Billing": "#e74c3c",
  "Technical Support": "#3498db",
  "Account Management": "#9b59b6",
  "Shipping & Delivery": "#e67e22",
  "General Inquiry": "#27ae60"
};
const PRI_COLORS = { High: "#e74c3c", Medium: "#e67e22", Low: "#27ae60" };

function animateCount(el, target, suffix = '') {
  let start = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start + suffix;
    if (start >= target) clearInterval(interval);
  }, 30);
}

async function loadAnalytics() {
  const res = await fetch('/api/analytics');
  const d = await res.json();

  // Animate stat counters
  animateCount(document.getElementById('statTotal'), d.total);
  animateCount(document.getElementById('statConf'), d.avg_confidence, '%');
  animateCount(document.getElementById('statHigh'), d.priorities['High'] || 0);
  animateCount(document.getElementById('statLow'), d.priorities['Low'] || 0);

  // Category chart
  const catDiv = document.getElementById('categoryChart');
  const maxCat = Math.max(...Object.values(d.categories), 1);
  if (!Object.keys(d.categories).length) {
    catDiv.innerHTML = emptyMsg();
  } else {
    catDiv.innerHTML = Object.entries(d.categories)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count], i) => {
        const pct = Math.round((count / maxCat) * 100);
        const color = CAT_COLORS[cat] || '#7c3aed';
        return `
          <div class="chart-bar-row" style="animation:chip-in 0.4s ease ${i * 0.08}s both">
            <span class="chart-lbl">${cat}</span>
            <div class="chart-bar-bg">
              <div class="chart-bar" data-w="${pct}" style="background:${color}"></div>
            </div>
            <span class="chart-val">${count}</span>
          </div>`;
      }).join('');
  }

  // Priority chart
  const priDiv = document.getElementById('priorityChart');
  const maxPri = Math.max(...Object.values(d.priorities), 1);
  if (!Object.keys(d.priorities).length) {
    priDiv.innerHTML = emptyMsg();
  } else {
    const order = ['High', 'Medium', 'Low'];
    priDiv.innerHTML = order
      .filter(p => d.priorities[p])
      .map((pri, i) => {
        const count = d.priorities[pri] || 0;
        const pct = Math.round((count / maxPri) * 100);
        const color = PRI_COLORS[pri];
        return `
          <div class="chart-bar-row" style="animation:chip-in 0.4s ease ${i * 0.1}s both">
            <span class="chart-lbl">${pri} Priority</span>
            <div class="chart-bar-bg">
              <div class="chart-bar" data-w="${pct}" style="background:${color}"></div>
            </div>
            <span class="chart-val">${count}</span>
          </div>`;
      }).join('');
  }

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.chart-bar[data-w]').forEach(b => {
      b.style.width = b.dataset.w + '%';
    });
  }, 200);

  // Animate stat cards
  document.querySelectorAll('.stat-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'all 0.5s cubic-bezier(0.16,1,0.3,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 80);
  });
}

function emptyMsg() {
  return `<div class="empty-state" style="padding:30px">
    <div class="empty-icon">📊</div>
    <p>No data yet. <a href="/" style="color:#a78bfa">Classify some tickets →</a></p>
  </div>`;
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

loadAnalytics();
