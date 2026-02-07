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

// Simpan data biar gak hilang
function loadData() {
  const saved = localStorage.getItem('refiEarn');
  if (saved) {
    const data = JSON.parse(saved);
    totalEarned = data.total || 0;
    todayCount = data.today || 0;
  }
  updateUI();
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

// Debug helper
function logDebug(msg) {
  document.getElementById('debug').textContent = msg;
}

// Watch Ad Button
const watchBtn = document.getElementById('watchAdBtn');

if (watchBtn) {
  watchBtn.addEventListener('click', () => {
    if (todayCount >= 5) {
      alert('Limit hari ini tercapai (5x). Kembali besok!');
      return;
    }

    watchBtn.disabled = true;
    watchBtn.innerHTML = 'Loading Ad...<br><small>Please wait...</small>';

    logDebug('Memulai ads...');

    const timeout = setTimeout(() => {
      watchBtn.disabled = false;
      watchBtn.innerHTML = 'Watch Ad Now<br><small>+500 per ad (max 5x/hari)</small>';
      alert('Ads timeout atau gagal. Coba lagi.');
      logDebug('Timeout: ads tidak muncul dalam 40 detik');
    }, 40000);

    // Monetag Rewarded Interstitial - FUNCTION DARI DASHBOARD LO
    show_10575971()
      .then(() => {
        clearTimeout(timeout);
        todayCount++;
        totalEarned += 500;
        saveData();
        updateUI();
        alert('Iklan selesai! +500 coins ditambahkan 🔥');
        logDebug('Sukses: iklan ditonton sampai akhir');
      })
      .catch(err => {
        clearTimeout(timeout);
        alert('Iklan dibatalkan atau error: ' + (err.message || 'Unknown'));
        console.error('Monetag error:', err);
        logDebug('Error: ' + (err.message || 'Tidak diketahui'));
      })
      .finally(() => {
        clearTimeout(timeout);
        watchBtn.disabled = false;
        watchBtn.innerHTML = 'Watch Ad Now<br><small>+500 per ad (max 5x/hari)</small>';
      });
  });
}

// Init
loadData();
updateUI();

// Tema Telegram
if (tg.themeParams.bg_color) {
  document.body.style.background = tg.themeParams.bg_color;
}
