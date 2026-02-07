const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// User info
const user = tg.initDataUnsafe.user || {};
document.getElementById('userName').textContent = user.first_name + ' ' + (user.last_name || '');
document.getElementById('userId').textContent = 'ID: ' + (user.id || 'unknown');

// Variabel
let totalEarned = 0;
let todayCount = 0;

// Load/save data
function loadData() {
  const saved = localStorage.getItem('refiEarn');
  if (saved) {
    const data = JSON.parse(saved);
    totalEarned = data.total || 0;
    todayCount = data.today || 0;
  }
  updateUI();
  document.getElementById('debug').textContent = 'Debug: Data loaded. Monetag ready? ' + (typeof show_10575971 === 'function' ? 'YES' : 'NO');
}

function saveData() {
  localStorage.setItem('refiEarn', JSON.stringify({
    total: totalEarned,
    today: todayCount
  }));
}

function updateUI() {
  document.getElementById('totalEarned').textContent = totalEarned;
  document.getElementById('todayCount').textContent = todayCount;
}

// Function reward umum
function handleReward() {
  todayCount++;
  totalEarned += 500;
  saveData();
  updateUI();
  alert('Iklan selesai! +500 coins 🔥');
}

// Rewarded Interstitial button
const interstitialBtn = document.getElementById('interstitialBtn');
if (interstitialBtn) {
  interstitialBtn.addEventListener('click', () => {
    if (todayCount >= 5) {
      alert('Limit tercapai. Besok lagi!');
      return;
    }
    interstitialBtn.disabled = true;
    interstitialBtn.textContent = 'Loading Interstitial...';
    document.getElementById('debug').textContent = 'Debug: Calling Rewarded Interstitial';

    const timeout = setTimeout(() => {
      interstitialBtn.disabled = false;
      interstitialBtn.textContent = 'Rewarded Interstitial';
      alert('Timeout. Coba lagi.');
    }, 40000);

    show_10575971()
      .then(() => {
        clearTimeout(timeout);
        handleReward();
        document.getElementById('debug').textContent = 'Debug: Interstitial success';
      })
      .catch(err => {
        clearTimeout(timeout);
        alert('Gagal: ' + (err.message || 'Unknown'));
        document.getElementById('debug').textContent = 'Debug: Interstitial error - ' + (err.message || 'Unknown');
      })
      .finally(() => {
        clearTimeout(timeout);
        interstitialBtn.disabled = false;
        interstitialBtn.textContent = 'Rewarded Interstitial';
      });
  });
}

// Rewarded Popup button
const popupBtn = document.getElementById('popupBtn');
if (popupBtn) {
  popupBtn.addEventListener('click', () => {
    if (todayCount >= 5) {
      alert('Limit tercapai. Besok lagi!');
      return;
    }
    popupBtn.disabled = true;
    popupBtn.textContent = 'Loading Popup...';
    document.getElementById('debug').textContent = 'Debug: Calling Rewarded Popup';

    const timeout = setTimeout(() => {
      popupBtn.disabled = false;
      popupBtn.textContent = 'Rewarded Popup';
      alert('Timeout. Coba lagi.');
    }, 40000);

    show_10575971('pop')
      .then(() => {
        clearTimeout(timeout);
        handleReward();
        document.getElementById('debug').textContent = 'Debug: Popup success';
      })
      .catch(err => {
        clearTimeout(timeout);
        alert('Gagal: ' + (err.message || 'Unknown'));
        document.getElementById('debug').textContent = 'Debug: Popup error - ' + (err.message || 'Unknown');
      })
      .finally(() => {
        clearTimeout(timeout);
        popupBtn.disabled = false;
        popupBtn.textContent = 'Rewarded Popup';
      });
  });
}

// In-App Interstitial (otomatis, no reward)
show_10575971({
  type: 'inApp',
  inAppSettings: {
    frequency: 2,
    capping: 0.1,
    interval: 30,
    timeout: 5,
    everyPage: false
  }
});
document.getElementById('debug').textContent += ' | In-App called';

// Init
loadData();
updateUI();

// Tema Telegram
if (tg.themeParams.bg_color) {
  document.body.style.background = tg.themeParams.bg_color;
}
