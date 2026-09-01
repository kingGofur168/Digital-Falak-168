// js/falakAI.js

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
    
    this.currentChatId = null;
    this.isProcessing = false;
    this.isSidebarOpen = false;
    
    this.init();
  }
  
  init() {
    // Load riwayat chat
    this.loadChatHistory();
    
    // Jika tidak ada chat aktif, buat chat baru
    if (!this.currentChatId) {
      this.createNewChat(false); // false = jangan render ulang
    } else {
      this.loadChat(this.currentChatId, false); // false = jangan render ulang
    }
    
    // Event listeners
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    this.newChatBtn.addEventListener('click', () => this.createNewChat());
    this.clearChatBtn.addEventListener('click', () => this.clearCurrentChat());
    this.menuToggle.addEventListener('click', () => this.toggleSidebar());
    
    // Tutup sidebar saat klik di luar
    document.addEventListener('click', (e) => {
      if (this.isSidebarOpen && 
          !this.sidebar.contains(e.target) && 
          !this.menuToggle.contains(e.target)) {
        this.closeSidebar();
      }
    });
    
    // Simpan chat sebelum halaman ditutup
    window.addEventListener('beforeunload', () => {
      this.saveCurrentChatState();
    });
    
    // Simpan chat secara berkala (setiap 30 detik)
    setInterval(() => {
      this.saveCurrentChatState();
    }, 30000);
  }
  
  // ====== SIDEBAR FUNCTIONS ======
  toggleSidebar() {
    if (this.isSidebarOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }
  
  openSidebar() {
    this.sidebar.classList.add('open');
    this.isSidebarOpen = true;
  }
  
  closeSidebar() {
    this.sidebar.classList.remove('open');
    this.isSidebarOpen = false;
  }
  
  // ====== CHAT HISTORY FUNCTIONS ======
  getAllChats() {
    try {
      const chats = localStorage.getItem('falakai_chats');
      return chats ? JSON.parse(chats) : {};
    } catch (error) {
      console.error('Error loading chats:', error);
      return {};
    }
  }
  
  saveAllChats(chats) {
    try {
      localStorage.setItem('falakai_chats', JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats:', error);
    }
  }
  
  getCurrentChatId() {
    return localStorage.getItem('falakai_current_chat');
  }
  
  setCurrentChatId(chatId) {
    localStorage.setItem('falakai_current_chat', chatId);
  }
  
  loadChatHistory() {
    const chats = this.getAllChats();
    const currentChatId = this.getCurrentChatId();
    
    console.log('Current chat ID from storage:', currentChatId);
    console.log('Available chats:', Object.keys(chats));
    
    if (currentChatId && chats[currentChatId]) {
      this.currentChatId = currentChatId;
    }
    
    this.renderChatHistory();
  }
  
  renderChatHistory() {
    const chats = this.getAllChats();
    this.chatHistory.innerHTML = '';
    
    // Urutkan chats berdasarkan waktu (terbaru di atas)
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
          <div class="history-title">${this.escapeHtml(chat.title)}</div>
          <div class="history-preview">${this.escapeHtml(chat.preview)}</div>
        </div>
        <div class="history-time">${time}</div>
        <button class="delete-chat-btn" title="Hapus obrolan">
          <i class="bi bi-trash"></i>
        </button>
      `;
      
      // Klik untuk load chat
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
    console.log('Creating new chat...');
    
    const chats = this.getAllChats();
    
    // Generate ID baru
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
    
    // Clear chat area
    this.chatArea.innerHTML = '';
    this.showWelcomeMessage();
    
    if (renderHistory) {
      this.renderChatHistory();
    }
    
    this.closeSidebar();
    
    console.log('New chat created with ID:', chatId);
  }
  
  loadChat(chatId, renderHistory = true) {
    console.log('Loading chat:', chatId);
    
    const chats = this.getAllChats();
    const chat = chats[chatId];
    
    if (!chat) {
      console.error('Chat not found:', chatId);
      // Jika chat tidak ditemukan, buat chat baru
      this.createNewChat();
      return;
    }
    
    this.currentChatId = chatId;
    this.setCurrentChatId(chatId);
    
    // Clear chat area
    this.chatArea.innerHTML = '';
    
    // Render pesan
    if (chat.messages && chat.messages.length > 0) {
      console.log('Loading', chat.messages.length, 'messages');
      
      chat.messages.forEach(msg => {
        this.renderMessage(msg.type, msg.content, false);
      });
    } else {
      console.log('No messages, showing welcome');
      this.showWelcomeMessage();
    }
    
    if (renderHistory) {
      this.renderChatHistory();
    }
    
    this.scrollToBottom();
  }
  
  deleteChat(chatId) {
    if (confirm('Hapus obrolan ini?')) {
      console.log('Deleting chat:', chatId);
      
      const chats = this.getAllChats();
      delete chats[chatId];
      this.saveAllChats(chats);
      
      if (this.currentChatId === chatId) {
        this.currentChatId = null;
        this.setCurrentChatId('');
        
        // Buat chat baru jika tidak ada chat tersisa
        const remainingChats = Object.keys(chats);
        if (remainingChats.length > 0) {
          // Load chat terbaru
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
        this.chatArea.innerHTML = '';
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
      // Update judul berdasarkan pesan pertama user
      const firstUserMessage = chat.messages.find(msg => msg.type === 'user');
      if (firstUserMessage) {
        const text = firstUserMessage.content.replace(/<[^>]*>/g, '');
        chat.title = text.substring(0, 30) + (text.length > 30 ? '...' : '');
      }
      
      // Update preview berdasarkan pesan terakhir
      const lastMessage = chat.messages[chat.messages.length - 1];
      if (lastMessage) {
        const text = lastMessage.content.replace(/<[^>]*>/g, '');
        chat.preview = text.substring(0, 50) + (text.length > 50 ? '...' : '');
      }
      
      chat.updatedAt = new Date().toISOString();
      
      this.saveAllChats(chats);
      console.log('Chat state saved:', this.currentChatId, 'messages:', chat.messages.length);
    }
  }
  
  updateChatInfo() {
    this.saveCurrentChatState();
    this.renderChatHistory();
  }
  
  // ====== CHAT FUNCTIONS ======
  clearChatArea() {
    this.chatArea.innerHTML = '';
  }
  
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
    const message = this.userInput.value.trim();
    
    if (!message || this.isProcessing) return;
    
    console.log('Sending message:', message);
    
    // Tambahkan pesan user
    this.renderMessage('user', message);
    this.userInput.value = '';
    this.userInput.style.height = 'auto';
    
    // Simpan ke riwayat
    this.saveMessage('user', message);
    
    // Tampilkan typing indicator
    this.showTypingIndicator();
    this.isProcessing = true;
    this.sendBtn.disabled = true;
    
    // Simulasi response AI
    setTimeout(() => {
      this.removeTypingIndicator();
      
      // Generate response
      const response = this.generateResponse(message);
      
      this.renderMessage('ai', response);
      this.saveMessage('ai', response);
      
      this.isProcessing = false;
      this.sendBtn.disabled = false;
      this.updateChatInfo();
      
      console.log('Message sent and saved');
    }, 1000);
  }
  
  generateResponse(userMessage) {
    // Ini contoh sederhana
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
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = content;
    
    messageDiv.appendChild(bubble);
    
    // Tambahkan tombol copy untuk pesan AI
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
    console.log('Saving message:', type, 'to chat:', this.currentChatId);
    
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
      console.log('Message saved. Total messages:', chat.messages.length);
    } else {
      console.error('Chat not found for saving message:', this.currentChatId);
    }
  }
  
  scrollToBottom() {
    setTimeout(() => {
      this.chatArea.scrollTop = this.chatArea.scrollHeight;
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

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  window.falakAI = new FalakAI();
  
  // Debug: Log semua chat yang tersimpan
  console.log('=== FalakAI Initialized ===');
  console.log('All chats:', window.falakAI.getAllChats());
  console.log('Current chat ID:', window.falakAI.getCurrentChatId());
});