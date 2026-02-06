// Init Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

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

tapArea.addEventListener('click', (e) => {
  if (energy <= 0) return;

  // Kurangi energi
  energy -= 1;
  
  // Tambah coin
  const earn = 1; // bisa dinaikin nanti berdasarkan upgrade
  coins += earn;
  totalEarned += earn;

  // Efek tap
  tapEffect.textContent = `+${earn}`;
  tapEffect.style.opacity = 1;
  tapEffect.style.transform = `translate(${e.offsetX - 20}px, ${e.offsetY - 40}px)`;
  setTimeout(() => {
    tapEffect.style.opacity = 0;
  }, 500);

  // Animasi karakter
  character.style.transform = 'scale(0.92)';
  setTimeout(() => { character.style.transform = 'scale(1)'; }, 100);

  updateDisplay();
});

// Navigasi tab
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const page = btn.dataset.page;
    if (page !== 'home') {
      document.getElementById(page + 'Page').classList.remove('hidden');
    }
    // home gak perlu, karena tap area selalu visible
  });
});

// Contoh claim task sederhana
function claimTask(taskId) {
  let reward = 0;
  if (taskId === 'joinChannel') reward = 500;
  if (taskId === 'invite') reward = 1000;

  coins += reward;
  totalEarned += reward;
  alert(`Claimed ${reward} coins!`);
  updateDisplay();
}

function claimDaily() {
  // nanti bisa dicek tanggal terakhir claim
  coins += 200;
  totalEarned += 200;
  alert('Daily reward claimed!');
  document.getElementById('dailyLoginBtn').disabled = true;
  document.getElementById('dailyLoginBtn').textContent = 'Sudah Claim Hari Ini';
  updateDisplay();
}

// Energy regen (setiap 2 detik +1 energi)
setInterval(() => {
  if (energy < maxEnergy) {
    energy += 1;
    updateDisplay();
  }
}, 2000);

// Init pertama
updateDisplay();

// Tema ikut Telegram
if (tg.themeParams.bg_color) {
  document.body.style.background = tg.themeParams.bg_color;
}