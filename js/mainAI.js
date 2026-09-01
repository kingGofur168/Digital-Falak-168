// Fungsi untuk mengelola riwayat obrolan
function saveChatHistory() {
  // Simpan pesan ke localStorage
  const messages = chatArea.innerHTML;
  const chatId = Date.now();
  const chats = JSON.parse(localStorage.getItem('falakai_chats') || '{}');
  chats[chatId] = {
    id: chatId,
    title: getChatTitle(),
    preview: getLastMessage(),
    timestamp: new Date().toISOString(),
    messages: messages
  };
  localStorage.setItem('falakai_chats', JSON.stringify(chats));
  renderChatHistory();
}

function renderChatHistory() {
  // Tampilkan riwayat di sidebar
  const chats = JSON.parse(localStorage.getItem('falakai_chats') || '{}');
  const historyContainer = document.getElementById('chatHistory');
  // ... render items
}

function loadChat(chatId) {
  // Muat obrolan dari riwayat
  const chats = JSON.parse(localStorage.getItem('falakai_chats') || '{}');
  const chat = chats[chatId];
  if (chat) {
    document.getElementById('chatArea').innerHTML = chat.messages;
  }
}