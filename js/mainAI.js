// js/falakAI.js

// ===============================
// KELAS FALAK AI
// ===============================

class FalakAI {
  constructor() {
    this.chatArea = document.getElementById('chatArea');
    this.userInput = document.getElementById('userInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.sidebar = document.getElementById('sidebar');
    this.chatHistory = document.getElementById('chatHistory');
    this.menuToggle = document.getElementById('menuToggle');
    this.newChatBtn = document.getElementById('newChatBtn');
    this.clearChatBtn = document.getElementById('clearChatBtn');
    this.sidebarOverlay = document.getElementById('sidebarOverlay');
    
    this.currentChatId = null;
    this.isProcessing = false;
    this.isSidebarOpen = false;
    
    this.init();
  }
  
  init() {
    console.log('🚀 FalakAI dimulai');
    
    // Load riwayat chat
    this.loadChatHistory();
    
    // Jika tidak ada chat aktif, buat chat baru
    if (!this.currentChatId) {
      this.createNewChat(false);
    } else {
      this.loadChat(this.currentChatId, false);
    }
    
    // Event listeners
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.sendMessage());
    }
    
    if (this.userInput) {
      this.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
    
    if (this.newChatBtn) {
      this.newChatBtn.addEventListener('click', () => this.createNewChat());
    }
    
    if (this.clearChatBtn) {
      this.clearChatBtn.addEventListener('click', () => this.clearCurrentChat());
    }
    
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleSidebar();
      });
    }
    
    if (this.sidebarOverlay) {
      this.sidebarOverlay.addEventListener('click', () => {
        this.closeSidebar();
      });
    }
    
    // Tutup sidebar saat klik di luar
    document.addEventListener('click', (e) => {
      if (this.isSidebarOpen && 
          this.sidebar && 
          !this.sidebar.contains(e.target) && 
          this.menuToggle && 
          !this.menuToggle.contains(e.target)) {
        this.closeSidebar();
      }
    });
    
    // Simpan chat sebelum halaman ditutup
    window.addEventListener('beforeunload', () => {
      this.saveCurrentChatState();
    });
  }
  
  // ====== SIDEBAR ======
  toggleSidebar() {
    if (this.isSidebarOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }
  
  openSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.add('open');
      this.isSidebarOpen = true;
      
      if (this.sidebarOverlay) {
        this.sidebarOverlay.classList.add('active');
      }
    }
  }
  
  closeSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.remove('open');
      this.isSidebarOpen = false;
      
      if (this.sidebarOverlay) {
        this.sidebarOverlay.classList.remove('active');
      }
    }
  }
  
  // ====== STORAGE ======
  getAllChats() {
    try {
      const chats = localStorage.getItem('falakai_chats');
      return chats ? JSON.parse(chats) : {};
    } catch (e) {
      console.error('❌ Gagal load chats:', e);
      return {};
    }
  }
  
  saveAllChats(chats) {
    try {
      localStorage.setItem('falakai_chats', JSON.stringify(chats));
    } catch (e) {
      console.error('❌ Gagal simpan chats:', e);
    }
  }
  
  getCurrentChatId() {
    return localStorage.getItem('falakai_current_chat') || null;
  }
  
  setCurrentChatId(chatId) {
    if (chatId) {
      localStorage.setItem('falakai_current_chat', chatId);
    } else {
      localStorage.removeItem('falakai_current_chat');
    }
  }
  
  // ====== RIWAYAT CHAT ======
  loadChatHistory() {
    const chats = this.getAllChats();
    const currentChatId = this.getCurrentChatId();
    
    if (currentChatId && chats[currentChatId]) {
      this.currentChatId = currentChatId;
    }
    
    this.renderChatHistory();
  }
  
  renderChatHistory() {
    if (!this.chatHistory) return;
    
    const chats = this.getAllChats();
    this.chatHistory.innerHTML = '';
    
    const sortedChats = Object.values(chats).sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    
    if (sortedChats.length === 0) {
      this.chatHistory.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #8696a0;">
          <i class="bi bi-chat-dots" style="font-size: 32px; display: block; margin-bottom: 8px;"></i>
          <p style="font-size: 13px;">Belum ada riwayat obrolan</p>
        </div>
      `;
      return;
    }
    
    sortedChats.forEach(chat => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      if (chat.id === this.currentChatId) {
        historyItem.classList.add('active');
      }
      
      const time = this.formatTime(chat.updatedAt);
      
      historyItem.innerHTML = `
        <div class="history-icon">
          <i class="bi bi-chat-left-text"></i>
        </div>
        <div class="history-content">
          <div class="history-title">${this.escapeHtml(chat.title || 'Obrolan Baru')}</div>
          <div class="history-preview">${this.escapeHtml(chat.preview || 'Ketik pertanyaan Anda...')}</div>
        </div>
        <div class="history-time">${time}</div>
        <button class="delete-chat-btn" title="Hapus obrolan">
          <i class="bi bi-trash"></i>
        </button>
      `;
      
      historyItem.addEventListener('click', (e) => {
        if (e.target.closest('.delete-chat-btn')) {
          e.stopPropagation();
          this.deleteChat(chat.id);
        } else {
          this.loadChat(chat.id);
          this.closeSidebar();
        }
      });
      
      this.chatHistory.appendChild(historyItem);
    });
  }
  
  createNewChat(renderHistory = true) {
    const chats = this.getAllChats();
    const chatId = 'chat_' + Date.now();
    
    chats[chatId] = {
      id: chatId,
      title: 'Obrolan Baru',
      preview: 'Ketik pertanyaan Anda...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    
    this.saveAllChats(chats);
    this.currentChatId = chatId;
    this.setCurrentChatId(chatId);
    
    if (this.chatArea) {
      this.chatArea.innerHTML = '';
    }
    this.showWelcomeMessage();
    
    if (renderHistory) {
      this.renderChatHistory();
    }
    
    this.closeSidebar();
  }
  
  loadChat(chatId, renderHistory = true) {
    const chats = this.getAllChats();
    const chat = chats[chatId];
    
    if (!chat) {
      this.createNewChat();
      return;
    }
    
    this.currentChatId = chatId;
    this.setCurrentChatId(chatId);
    
    if (this.chatArea) {
      this.chatArea.innerHTML = '';
    }
    
    if (chat.messages && chat.messages.length > 0) {
      chat.messages.forEach(msg => {
        this.renderMessage(msg.type, msg.content, false);
      });
    } else {
      this.showWelcomeMessage();
    }
    
    if (renderHistory) {
      this.renderChatHistory();
    }
    
    this.scrollToBottom();
  }
  
  deleteChat(chatId) {
    if (confirm('Hapus obrolan ini?')) {
      const chats = this.getAllChats();
      delete chats[chatId];
      this.saveAllChats(chats);
      
      if (this.currentChatId === chatId) {
        this.currentChatId = null;
        this.setCurrentChatId(null);
        
        const remainingChats = Object.keys(chats);
        if (remainingChats.length > 0) {
          const sortedChats = Object.values(chats).sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          });
          this.loadChat(sortedChats[0].id);
        } else {
          this.createNewChat();
        }
      }
      
      this.renderChatHistory();
    }
  }
  
  clearCurrentChat() {
    if (confirm('Hapus semua pesan dalam obrolan ini?')) {
      const chats = this.getAllChats();
      const chat = chats[this.currentChatId];
      
      if (chat) {
        chat.messages = [];
        chat.preview = 'Ketik pertanyaan Anda...';
        chat.title = 'Obrolan Baru';
        chat.updatedAt = new Date().toISOString();
        
        this.saveAllChats(chats);
        if (this.chatArea) {
          this.chatArea.innerHTML = '';
        }
        this.showWelcomeMessage();
        this.renderChatHistory();
      }
    }
  }
  
  saveCurrentChatState() {
    if (!this.currentChatId) return;
    
    const chats = this.getAllChats();
    const chat = chats[this.currentChatId];
    
    if (chat) {
      const firstUserMessage = chat.messages.find(msg => msg.type === 'user');
      if (firstUserMessage) {
        const text = firstUserMessage.content.replace(/<[^>]*>/g, '');
        chat.title = text.substring(0, 30) + (text.length > 30 ? '...' : '');
      }
      
      const lastMessage = chat.messages[chat.messages.length - 1];
      if (lastMessage) {
        const text = lastMessage.content.replace(/<[^>]*>/g, '');
        chat.preview = text.substring(0, 50) + (text.length > 50 ? '...' : '');
      }
      
      chat.updatedAt = new Date().toISOString();
      
      this.saveAllChats(chats);
    }
  }
  
  updateChatInfo() {
    this.saveCurrentChatState();
    this.renderChatHistory();
  }
  
  // ====== CHAT ======
  showWelcomeMessage() {
    const welcomeMessage = `
      Assalamualaikum warahmatullahi wabarakatuh. 👋
      <br><br>
      Bismillahirrahmanirrahim.
      <br><br>
      Saya adalah <strong>FalakAI</strong>, asisten yang dirancang khusus untuk membantu perhitungan dan menjawab pertanyaan seputar <strong>Awal Bulan Hijriyah</strong>.
      <br><br>
      Perhitungan astronomi pada FalakAI menggunakan <strong>metode Jean Meeus</strong>. Saya dapat membantu Anda mengetahui waktu ijtimak, data posisi Matahari dan Bulan, tinggi hilal, elongasi, waktu terbenam Matahari, serta data-data hisab lainnya yang berkaitan dengan penentuan awal bulan Hijriyah.
      <br><br>
      Untuk data pengamatan seperti <strong>lintang, bujur, ketinggian tempat, dan kriteria imkan rukyat</strong>, FalakAI akan menggunakan <strong>data default</strong> yang telah ditentukan. Namun, Anda juga dapat meminta penggunaan data atau kriteria tertentu secara khusus.
      <br><br>
      Silakan tanyakan apa saja seputar <strong>Awal Bulan Hijriyah</strong>.
      
      <div class="example">
        <i class="bi bi-lightbulb"></i> Contoh:<br>
        "Kapan lebaran 1448 H?"
      </div>
    `;
    
    this.renderMessage('ai', welcomeMessage, false);
  }
  
  sendMessage() {
    const message = this.userInput ? this.userInput.value.trim() : '';
    
    if (!message || this.isProcessing) return;
    
    this.renderMessage('user', message);
    
    if (this.userInput) {
      this.userInput.value = '';
      this.userInput.style.height = 'auto';
    }
    
    this.saveMessage('user', message);
    
    this.showTypingIndicator();
    this.isProcessing = true;
    if (this.sendBtn) {
      this.sendBtn.disabled = true;
    }
    
    setTimeout(() => {
      this.removeTypingIndicator();
      
      const response = this.generateResponse(message);
      
      this.renderMessage('ai', response);
      this.saveMessage('ai', response);
      
      this.isProcessing = false;
      if (this.sendBtn) {
        this.sendBtn.disabled = false;
      }
      this.updateChatInfo();
    }, 1000);
  }
  
  generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('lebaran') || lowerMessage.includes('idul fitri') || lowerMessage.includes('syawal')) {
      return `
        Berdasarkan perhitungan metode Jean Meeus dengan kriteria default:
        <br><br>
        <strong>Ijtima' akhir Ramadhan 1448 H:</strong><br>
        Tanggal: 25 Maret 2027<br>
        Waktu: 15:42 WIB
        <br><br>
        <strong>Posisi Matahari:</strong><br>
        Azimuth: 271° 15' 30"<br>
        Altitude: -0° 45' 20"
        <br><br>
        <strong>Posisi Bulan:</strong><br>
        Azimuth: 273° 28' 45"<br>
        Altitude: 1° 15' 10"
        <br><br>
        <strong>Tinggi Hilal:</strong> 2° 30' 45"<br>
        <strong>Elongasi:</strong> 3° 15' 30"
        <br><br>
        Dengan kriteria tersebut, <strong>1 Syawal 1448 H diperkirakan jatuh pada tanggal 26 Maret 2027</strong>.
      `;
    } else if (lowerMessage.includes('assalamualaikum') || lowerMessage.includes('halo') || lowerMessage.includes('hai')) {
      return `
        Waalaikumsalam warahmatullahi wabarakatuh. 👋
        <br><br>
        Ada yang bisa saya bantu terkait perhitungan awal bulan Hijriyah?
      `;
    } else {
      return `
        Mohon maaf, saya belum memahami pertanyaan tersebut. 🙏
        <br><br>
        Saya adalah <strong>FalakAI</strong> yang khusus membantu perhitungan <strong>Awal Bulan Hijriyah</strong>.
        <br><br>
        Anda bisa bertanya tentang:<br>
        • Waktu ijtima'<br>
        • Posisi Matahari dan Bulan<br>
        • Tinggi hilal<br>
        • Elongasi<br>
        • Waktu terbenam Matahari<br>
        • Penentuan awal bulan Hijriyah
        <br><br>
        Contoh: "Kapan lebaran 1448 H?"
      `;
    }
  }
  
  renderMessage(type, content, animate = true) {
    if (!this.chatArea) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = content;
    
    messageDiv.appendChild(bubble);
    
    if (type === 'ai') {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.title = 'Salin Pesan';
      copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
      
      copyBtn.addEventListener('click', () => {
        const textContent = bubble.textContent;
        navigator.clipboard.writeText(textContent).then(() => {
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
          
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
          }, 2000);
        });
      });
      
      messageDiv.appendChild(copyBtn);
    }
    
    if (animate) {
      messageDiv.style.animation = 'fadeIn 0.3s ease-out';
    }
    
    this.chatArea.appendChild(messageDiv);
    this.scrollToBottom();
  }
  
  showTypingIndicator() {
    if (!this.chatArea) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    this.chatArea.appendChild(typingDiv);
    this.scrollToBottom();
  }
  
  removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  saveMessage(type, content) {
    const chats = this.getAllChats();
    const chat = chats[this.currentChatId];
    
    if (chat) {
      chat.messages.push({
        type: type,
        content: content,
        timestamp: new Date().toISOString()
      });
      
      chat.updatedAt = new Date().toISOString();
      
      this.saveAllChats(chats);
    }
  }
  
  scrollToBottom() {
    setTimeout(() => {
      if (this.chatArea) {
        this.chatArea.scrollTop = this.chatArea.scrollHeight;
      }
    }, 100);
  }
  
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      return 'Kemarin';
    } else if (diffDays < 7) {
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ===============================
// DROPDOWN MENU HEADER
// ===============================

function initDropdownMenu() {
  const btnMenu = document.getElementById("btnMenuHeader");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const btnMenuProfil = document.getElementById("btnMenuProfil");
  const btnMenuHapus = document.getElementById("btnMenuHapus");

  if (!btnMenu || !dropdownMenu) {
    console.log('ℹ️ Dropdown menu tidak ditemukan, melewati...');
    return;
  }

  // Toggle dropdown
  btnMenu.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("🖱️ Tombol menu diklik");
    
    if (dropdownMenu.style.display === "block") {
      dropdownMenu.style.display = "none";
      console.log("📂 Dropdown ditutup");
    } else {
      dropdownMenu.style.display = "block";
      console.log("📂 Dropdown dibuka");
    }
  });

  // Tutup dropdown saat klik di luar
  document.addEventListener("click", function(e) {
    if (!dropdownMenu.contains(e.target) && e.target !== btnMenu && !btnMenu.contains(e.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  // Menu Profil
  if (btnMenuProfil) {
    btnMenuProfil.addEventListener("click", function(e) {
      e.preventDefault();
      dropdownMenu.style.display = "none";
      if (typeof bukaModalProfil === 'function') {
        bukaModalProfil();
      }
    });
  }

  // Menu Hapus Obrolan
  if (btnMenuHapus) {
    btnMenuHapus.addEventListener("click", function(e) {
      e.preventDefault();
      dropdownMenu.style.display = "none";
      if (window.falakAI) {
        window.falakAI.clearCurrentChat();
      }
    });
  }
}

// ===============================
// PROFIL USER
// ===============================

const DEFAULT_PROFIL = {
  foto: null,
  nama: "",
  hobi: "",
  alamat: "Tangerang, Banten",
  latitude: -6.122,
  longitude: 106.606,
  altitude: 20,
  zona: 7,
  kriteria: "4"
};

let profilUser = { ...DEFAULT_PROFIL };

function loadProfil() {
  const saved = localStorage.getItem("profilFalakAI");
  if (saved) {
    try {
      profilUser = JSON.parse(saved);
    } catch (e) {
      profilUser = { ...DEFAULT_PROFIL };
    }
  }
  return profilUser;
}

function simpanProfil(profil) {
  profilUser = profil;
  localStorage.setItem("profilFalakAI", JSON.stringify(profil));
}

function tampilkanProfil() {
  const fotoImg = document.getElementById("fotoProfilImg");
  const fotoDefault = document.getElementById("fotoProfilDefault");
  const namaEl = document.getElementById("profilNama");
  const alamatEl = document.getElementById("profilAlamat");

  if (fotoImg && fotoDefault) {
    if (profilUser.foto) {
      fotoImg.src = profilUser.foto;
      fotoImg.style.display = "block";
      fotoDefault.style.display = "none";
    } else {
      fotoImg.style.display = "none";
      fotoDefault.style.display = "block";
    }
  }

  if (namaEl) namaEl.textContent = profilUser.nama || "Pengguna";
  if (alamatEl) alamatEl.textContent = profilUser.alamat || "Tangerang, Banten";
}

function bukaModalProfil() {
  const modal = document.getElementById("modalProfil");
  if (!modal) {
    return;
  }
  
  modal.style.display = "flex";

  document.getElementById("inputNama").value = profilUser.nama || "";
  document.getElementById("inputHobi").value = profilUser.hobi || "";
  document.getElementById("inputAlamat").value = profilUser.alamat || "Tangerang, Banten";
  document.getElementById("inputLatitude").value = profilUser.latitude || -6.122;
  document.getElementById("inputLongitude").value = profilUser.longitude || 106.606;
  document.getElementById("inputAltitude").value = profilUser.altitude || 20;
  document.getElementById("inputZona").value = profilUser.zona || 7;
  document.getElementById("inputKriteria").value = profilUser.kriteria || "4"; 

  if (inputNama) inputNama.value = profilUser.nama || "";
  if (inputHobi) inputHobi.value = profilUser.hobi || "";
  if (inputAlamat) inputAlamat.value = profilUser.alamat || "Tangerang, Banten";
  if (inputLatitude) inputLatitude.value = profilUser.latitude || -6.122;
  if (inputLongitude) inputLongitude.value = profilUser.longitude || 106.606;
  if (inputAltitude) inputAltitude.value = profilUser.altitude || 20;
  if (inputZona) inputZona.value = profilUser.zona || 7;

  const previewFoto = document.getElementById("previewFoto");
  const fotoPlaceholder = document.getElementById("fotoPlaceholder");
  
  if (previewFoto && fotoPlaceholder) {
    if (profilUser.foto) {
      previewFoto.src = profilUser.foto;
      previewFoto.style.display = "block";
      fotoPlaceholder.style.display = "none";
    } else {
      previewFoto.style.display = "none";
      fotoPlaceholder.style.display = "flex";
    }
  }
}

function tutupModalProfil() {
  const modal = document.getElementById("modalProfil");
  if (modal) {
    modal.style.display = "none";
  }
}

function ambilLokasiGPS() {
  if (!navigator.geolocation) {
    alert("Geolocation tidak didukung di browser ini");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const inputLatitude = document.getElementById("inputLatitude");
      const inputLongitude = document.getElementById("inputLongitude");
      const inputZona = document.getElementById("inputZona");
      
      if (inputLatitude) inputLatitude.value = position.coords.latitude.toFixed(6);
      if (inputLongitude) inputLongitude.value = position.coords.longitude.toFixed(6);
      
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let zona = 7;
      if (timezone.includes("Makassar") || timezone.includes("Ujung Pandang")) {
        zona = 8;
      } else if (timezone.includes("Jayapura")) {
        zona = 9;
      }
      if (inputZona) inputZona.value = zona;
      
      alert("Lokasi berhasil diambil dari GPS!");
    },
    (error) => {
      alert("Gagal mengambil lokasi: " + error.message);
    }
  );
}

function handleUploadFoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const fotoData = e.target.result;
    
    const previewFoto = document.getElementById("previewFoto");
    const fotoPlaceholder = document.getElementById("fotoPlaceholder");
    
    if (previewFoto && fotoPlaceholder) {
      previewFoto.src = fotoData;
      previewFoto.style.display = "block";
      fotoPlaceholder.style.display = "none";
    }
    
    profilUser.foto = fotoData;
  };
  reader.readAsDataURL(file);
}

function simpanProfilDariForm() {
  const nama = document.getElementById("inputNama")?.value.trim() || "";
  const hobi = document.getElementById("inputHobi")?.value.trim() || "";
  const alamat = document.getElementById("inputAlamat")?.value.trim() || "";
  const latitude = parseFloat(document.getElementById("inputLatitude")?.value);
  const longitude = parseFloat(document.getElementById("inputLongitude")?.value);
  const altitude = parseFloat(document.getElementById("inputAltitude")?.value);
  const zona = parseInt(document.getElementById("inputZona")?.value);
  const kriteria = parseInt(document.getElementById("inputKriteria")?.value);

  if (!alamat) {
    alert("Alamat wajib diisi!");
    return;
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    alert("Latitude dan Longitude wajib diisi dengan angka!");
    return;
  }

  profilUser = {
    foto: profilUser.foto || null,
    nama: nama,
    hobi: hobi,
    alamat: alamat,
    latitude: latitude,
    longitude: longitude,
    altitude: isNaN(altitude) ? 0 : altitude,
    zona: zona,
    kriteria: kriteria
  };

  simpanProfil(profilUser);
  tampilkanProfil();
  tutupModalProfil();
  
  alert("Profil berhasil disimpan!");
}

function initProfil() {
  console.log('👤 Inisialisasi profil...');
  
  loadProfil();
  tampilkanProfil();

  const btnEditProfil = document.getElementById("btnEditProfil");
  if (btnEditProfil) {
    btnEditProfil.addEventListener("click", bukaModalProfil);
  }

  const btnTutupModal = document.getElementById("btnTutupModal");
  if (btnTutupModal) {
    btnTutupModal.addEventListener("click", tutupModalProfil);
  }

  const btnBatalProfil = document.getElementById("btnBatalProfil");
  if (btnBatalProfil) {
    btnBatalProfil.addEventListener("click", tutupModalProfil);
  }

  const btnSimpanProfil = document.getElementById("btnSimpanProfil");
  if (btnSimpanProfil) {
    btnSimpanProfil.addEventListener("click", simpanProfilDariForm);
  }

  const btnAmbilGPS = document.getElementById("btnAmbilGPS");
  if (btnAmbilGPS) {
    btnAmbilGPS.addEventListener("click", ambilLokasiGPS);
  }

  const fotoPlaceholder = document.getElementById("fotoPlaceholder");
  if (fotoPlaceholder) {
    fotoPlaceholder.addEventListener("click", function() {
      const inputFoto = document.getElementById("inputFoto");
      if (inputFoto) inputFoto.click();
    });
  }

  const previewFoto = document.getElementById("previewFoto");
  if (previewFoto) {
    previewFoto.addEventListener("click", function() {
      const inputFoto = document.getElementById("inputFoto");
      if (inputFoto) inputFoto.click();
    });
  }

  const inputFoto = document.getElementById("inputFoto");
  if (inputFoto) {
    inputFoto.addEventListener("change", handleUploadFoto);
  }

  const modalProfil = document.getElementById("modalProfil");
  if (modalProfil) {
    modalProfil.addEventListener("click", function(e) {
      if (e.target === this) {
        tutupModalProfil();
      }
    });
  }
}

// ===============================
// INISIALISASI UTAMA (SATU SAJA)
// ===============================

document.addEventListener("DOMContentLoaded", function() {
  console.log("🚀 DOM loaded, inisialisasi semua...");
  
  // 1. Inisialisasi FalakAI
  window.falakAI = new FalakAI();
  
  // 2. Inisialisasi Profil
  initProfil();
  
  // 3. Inisialisasi Dropdown Menu
  initDropdownMenu();
  
  console.log("✅ Semua komponen berhasil diinisialisasi");
});