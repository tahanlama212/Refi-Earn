// Init Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Variabel game
let coins = 0;
let energy = 1000;
let maxEnergy = 1000;
let totalEarned = 0;
let level = 1;

// Ambil data user
const user = tg.initDataUnsafe?.user || {};
document.getElementById('userName').textContent = `Nama: ${user.first_name || 'User'} ${user.last_name || ''}`;
document.getElementById('userId').textContent = `ID: ${user.id || 'Unknown'}`;

// Update tampilan
function updateDisplay() {
  document.getElementById('coinBalance').textContent = Math.floor(coins);
  document.getElementById('energyValue').textContent = Math.floor(energy);
  document.getElementById('totalEarned').textContent = Math.floor(totalEarned);
  document.getElementById('level').textContent = level;
}

// Tap logic
const tapArea = document.getElementById('tapArea');
const character = document.getElementById('character');
const tapEffect = document.getElementById('tapEffect');

if (tapArea) {
  tapArea.addEventListener('click', (e) => {
    if (energy <= 0) return;

    energy -= 1;
    const earn = 1;
    coins += earn;
    totalEarned += earn;

    tapEffect.textContent = `+${earn}`;
    tapEffect.style.opacity = 1;
    tapEffect.style.transform = `translate(${e.offsetX - 20}px, ${e.offsetY - 40}px)`;
    setTimeout(() => { tapEffect.style.opacity = 0; }, 500);

    character.style.transform = 'scale(0.92)';
    setTimeout(() => { character.style.transform = 'scale(1)'; }, 100);

    updateDisplay();
  });
}

// Navigasi tab
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const page = btn.dataset.page;
    if (page !== 'home') {
      const pageElement = document.getElementById(page + 'Page');
      if (pageElement) pageElement.classList.remove('hidden');
    }
  });
});

// Claim task sederhana
function claimTask(taskId) {
  let reward = 0;
  if (taskId === 'joinChannel') reward = 500;
  if (taskId === 'invite') reward = 1000;

  if (reward > 0) {
    coins += reward;
    totalEarned += reward;
    alert(`Claimed ${reward} coins!`);
    updateDisplay();
  }
}

function claimDaily() {
  coins += 200;
  totalEarned += 200;
  alert('Daily reward claimed!');
  const btn = document.getElementById('dailyLoginBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sudah Claim Hari Ini';
  }
  updateDisplay();
}

// Energy regen
setInterval(() => {
  if (energy < maxEnergy) {
    energy += 1;
    updateDisplay();
  }
}, 2000);

// ========================
// Monetag Rewarded Interstitial
// ========================
const watchAdBtn = document.getElementById('watchAdBtn');

if (watchAdBtn) {
  watchAdBtn.addEventListener('click', () => {
    watchAdBtn.disabled = true;
    watchAdBtn.textContent = 'Loading Ad...';

    // GANTI NOMOR INI SESUAI ZONE ID LO DI DASHBOARD MONETAG
    // Contoh: kalau data-sdk="show_12345678", ganti jadi show_12345678()
    show_10575971()
      .then(() => {
        coins += 500;
        totalEarned += 500;
        alert('Iklan selesai! +500 coins 🔥');
        updateDisplay();
      })
      .catch((err) => {
        alert('Iklan dibatalkan atau gagal. Coba lagi!');
        console.error('Ads error:', err);
      })
      .finally(() => {
        watchAdBtn.disabled = false;
        watchAdBtn.textContent = 'Watch & Claim 500 🪙';
      });
  });
}

// Init pertama
updateDisplay();

// Tema Telegram
if (tg.themeParams.bg_color) {
  document.body.style.background = tg.themeParams.bg_color;
}
