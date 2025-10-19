// Exportador Simplificado - Apenas Markdown
// Cole este código no console do navegador (F12) no claude.ai

(function() {
  // Extrai todas as mensagens em ordem
  function extractConversation() {
    const conversation = [];
    const allContainers = document.querySelectorAll('[data-test-render-count]');
    
    allContainers.forEach(container => {
      // Verifica se é mensagem do usuário
      const userMsg = container.querySelector('[data-testid="user-message"]');
      if (userMsg) {
        // Extrai parágrafos separadamente para preservar formatação
        const paragraphs = Array.from(userMsg.querySelectorAll('p'))
          .map(p => p.textContent.trim())
          .filter(text => text.length > 0);
        
        conversation.push({
          role: 'user',
          content: paragraphs.join('\n\n')
        });
        return;
      }
      
      // Verifica se é mensagem do Claude
      const claudeMsg = container.querySelector('.standard-markdown, .progressive-markdown');
      if (claudeMsg) {
        // Preserva a estrutura do markdown
        let content = '';
        
        claudeMsg.childNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            
            // Parágrafos
            if (tag === 'p') {
              content += node.textContent.trim() + '\n\n';
            }
            // Listas
            else if (tag === 'ul') {
              const items = Array.from(node.querySelectorAll('li'))
                .map(li => '- ' + li.textContent.trim());
              content += items.join('\n') + '\n\n';
            }
            else if (tag === 'ol') {
              const items = Array.from(node.querySelectorAll('li'))
                .map((li, i) => `${i + 1}. ${li.textContent.trim()}`);
              content += items.join('\n') + '\n\n';
            }
            // Cabeçalhos
            else if (tag.match(/^h[1-6]$/)) {
              const level = parseInt(tag[1]);
              content += '#'.repeat(level) + ' ' + node.textContent.trim() + '\n\n';
            }
            // Blocos de código
            else if (tag === 'pre') {
              const code = node.querySelector('code');
              if (code) {
                const language = Array.from(code.classList)
                  .find(c => c.startsWith('language-'))
                  ?.replace('language-', '') || '';
                content += '```' + language + '\n' + code.textContent + '\n```\n\n';
              }
            }
            // Citações
            else if (tag === 'blockquote') {
              const lines = node.textContent.trim().split('\n');
              content += lines.map(line => '> ' + line).join('\n') + '\n\n';
            }
            // Strong/Bold
            else if (tag === 'strong') {
              content += '**' + node.textContent.trim() + '**';
            }
          }
        });
        
        conversation.push({
          role: 'assistant',
          content: content.trim()
        });
      }
    });
    
    return conversation;
  }

  // Gera o Markdown
  function generateMarkdown(conversation) {
    const title = document.title || 'Conversa com Claude';
    const date = new Date().toLocaleString('pt-BR');
    
    let markdown = `# ${title}\n\n`;
    markdown += `*Exportado em: ${date}*\n\n`;
    markdown += `Total de mensagens: ${conversation.length}\n\n`;
    markdown += `---\n\n`;
    
    conversation.forEach((msg, index) => {
      const author = msg.role === 'user' ? '**👤 Você**' : '**🤖 Claude**';
      markdown += `## ${author}\n\n`;
      markdown += msg.content + '\n\n';
      
      if (index < conversation.length - 1) {
        markdown += `---\n\n`;
      }
    });
    
    return markdown;
  }

  // Faz o download
  function downloadMarkdown(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
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
  const markdown = generateMarkdown(conversation);
  const filename = `claude_chat_${Date.now()}.md`;
  
  downloadMarkdown(markdown, filename);

  console.log(`✓ Exportadas ${conversation.length} mensagens para ${filename}`);
  console.log('Preview:', markdown.substring(0, 500) + '...');
})();
