// Добавьте клиентский JS

document.addEventListener('DOMContentLoaded', function() {
  // Для всех модалок Bootstrap
  var modals = document.querySelectorAll('.modal');
  modals.forEach(function(modal) {
    modal.addEventListener('show.bs.modal', function (event) {
      console.log('Открывается модалка:', modal.id);
    });
    modal.addEventListener('hide.bs.modal', function (event) {
      console.log('Закрывается модалка:', modal.id);
    });
  });

  // Обработчик для мини-чата поддержки
  var supportButton = document.getElementById('supportButton');
  var chatWindow = document.getElementById('chatWindow');
  var closeChatBtn = document.getElementById('closeChatBtn');

  // Функция для загрузки сообщений поддержки в мини-чат
  function loadChatMessages() {
    var chatMessages = document.getElementById('chatMessages');
    var loadingChatMessages = document.getElementById('loadingChatMessages');
    var noChatMessages = document.getElementById('noChatMessages');
    var messageContainer = document.getElementById('messageContainer');

    if (!chatMessages) return;

    loadingChatMessages.classList.remove('d-none');
    noChatMessages.classList.add('d-none');
    messageContainer.innerHTML = '';

    fetch('/api/support/messages/my')
      .then(res => res.json())
      .then(messages => {
        loadingChatMessages.classList.add('d-none');
        if (!messages.length) {
          noChatMessages.classList.remove('d-none');
          return;
        }
        messageContainer.innerHTML = messages.map(msg => `
          <div class="mb-2">
            <div><b>Вы:</b> ${msg.message}</div>
            ${msg.reply ? `<div class="bg-light p-2 rounded mt-1"><b>Оператор:</b> ${msg.reply}</div>` : ''}
          </div>
        `).join('');
      })
      .catch(err => {
        loadingChatMessages.classList.add('d-none');
        messageContainer.innerHTML = '<div class="alert alert-danger">Ошибка при загрузке сообщений</div>';
      });
  }

  // Загружать сообщения при открытии чата
  if (supportButton && chatWindow) {
    supportButton.addEventListener('click', function() {
      chatWindow.style.display = 'block';
      loadChatMessages();
    });
  }
  if (closeChatBtn && chatWindow) {
    closeChatBtn.addEventListener('click', function() {
      chatWindow.style.display = 'none';
    });
  }

  // Обработка отправки сообщения из мини-чата поддержки
  var chatForm = document.getElementById('chatForm');
  var chatMessageText = document.getElementById('chatMessageText');

  if (chatForm && chatMessageText) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var text = chatMessageText.value.trim();
      if (!text) return;
      chatForm.querySelector('button[type="submit"]').disabled = true;
      fetch('/api/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      .then(res => res.json())
      .then(data => {
        chatMessageText.value = '';
        loadChatMessages();
      })
      .catch(() => alert('Ошибка при отправке сообщения'))
      .finally(() => {
        chatForm.querySelector('button[type="submit"]').disabled = false;
      });
    });
  }
});
