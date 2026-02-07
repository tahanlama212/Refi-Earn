const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Ambil data user
const user = tg.initDataUnsafe.user || {};
document.getElementById('userName').textContent = user.first_name + ' ' + (user.last_name || '');
document.getElementById('userId').textContent = 'ID: ' + (user.id || 'unknown');

// Variabel
let totalEarned = 0;
let todayCount = 0;

// Simple localStorage untuk simpan data (biar gak reset pas tutup)
function loadData() {
  const saved = localStorage.getItem('refiEarnData');
  if (saved) {
    const data = JSON.parse(saved);
    totalEarned = data.total || 0;
    todayCount = data.today || 0;
  }
  updateUI();
}

function saveData() {
  localStorage.setItem('refiEarnData', JSON.stringify({
    total: totalEarned,
    today: todayCount
  }));
}

function updateUI() {
  document.getElementById('totalEarned').textContent = totalEarned;
  document.getElementById('todayCount').textContent = todayCount;
}

// Watch Ad Button
const watchBtn = document.getElementById('watchAdBtn');

if (watchBtn) {
  watchBtn.addEventListener('click', () => {
    if (todayCount >= 5) {
      alert('Sudah mencapai limit hari ini (5x). Kembali besok ya!');
      return;
    }

    watchBtn.disabled = true;
    watchBtn.innerHTML = 'Loading Ad...<br><small>Please wait...</small>';

    // Timeout kalau ads gak muncul
    const timeout = setTimeout(() => {
      watchBtn.disabled = false;
      watchBtn.innerHTML = 'Watch Ad Now<br><small>+500 per ad (max 5x/hari)</small>';
      alert('Ads timeout atau gagal. Coba lagi.');
    }, 40000);

    // Panggil Monetag ads
    // GANTI show_10575971() sesuai Zone ID lo
    show_10575971()
      .then(() => {
        clearTimeout(timeout);
        todayCount++;
        totalEarned += 500;
        saveData();
        updateUI();
        alert('Iklan selesai! +500 berhasil ditambahkan 🔥');
      })
      .catch(err => {
        clearTimeout(timeout);
        alert('Iklan dibatalkan atau error. Coba lagi nanti.');
        console.error('Monetag error:', err);
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

// Ikut tema Telegram
if (tg.themeParams.bg_color) {
  document.body.style.background = tg.themeParams.bg_color;
}
