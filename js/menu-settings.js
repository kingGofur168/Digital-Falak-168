// Menu & Pages
// Menu Settings
const menuPengaturan = document.getElementById('menuPengaturan');
const settingsPage = document.getElementById('settingsPage');
const closeSettings = document.getElementById('closeSettings');
  
menuPengaturan.onclick = () => {
  settingsPage.style.display = 'block';
  setTimeout(() => settingsPage.classList.add('show'), 10);
};

closeSettings.onclick = () => {
  settingsPage.classList.remove('show');
  setTimeout(() => {
    settingsPage.style.display = 'none';
  }, 300);
};

