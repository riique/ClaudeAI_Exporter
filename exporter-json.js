// Exportador Simplificado - Apenas JSON
// Cole este código no console do navegador (F12) no claude.ai

(function() {
  // Extrai mensagens do usuário
  function extractUserMessages() {
    const messages = [];
    const userElements = document.querySelectorAll('[data-testid="user-message"]');
    
    userElements.forEach(element => {
      const text = element.textContent.trim();
      if (text) {
        messages.push({
          role: 'user',
          content: text
        });
      }
    });
    
    return messages;
  }

  // Extrai mensagens do Claude
  function extractClaudeMessages() {
    const messages = [];
    const claudeElements = document.querySelectorAll('[data-is-streaming="false"]');
    
    claudeElements.forEach(element => {
      const markdown = element.querySelector('.standard-markdown, .progressive-markdown');
      if (markdown) {
        const text = markdown.textContent.trim();
        if (text) {
          messages.push({
            role: 'assistant',
            content: text
          });
        }
      }
    });
    
    return messages;
  }

  // Intercala mensagens na ordem correta
  function extractConversation() {
    const conversation = [];
    const allContainers = document.querySelectorAll('[data-test-render-count]');
    
    allContainers.forEach(container => {
      // Verifica se é mensagem do usuário
      const userMsg = container.querySelector('[data-testid="user-message"]');
      if (userMsg) {
        conversation.push({
          role: 'user',
          content: userMsg.textContent.trim()
        });
        return;
      }
      
      // Verifica se é mensagem do Claude
      const claudeMsg = container.querySelector('.standard-markdown, .progressive-markdown');
      if (claudeMsg) {
        conversation.push({
          role: 'assistant',
          content: claudeMsg.textContent.trim()
        });
      }
    });
    
    return conversation;
  }

  // Faz o download
  function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Execução principal
  const conversation = extractConversation();
  
  const exportData = {
    title: document.title || 'Conversa Claude',
    exportDate: new Date().toISOString(),
    messageCount: conversation.length,
    messages: conversation
  };

  const filename = `claude_chat_${Date.now()}.json`;
  downloadJSON(exportData, filename);

  console.log(`✓ Exportadas ${conversation.length} mensagens para ${filename}`);
  console.log('Dados:', exportData);
})();
