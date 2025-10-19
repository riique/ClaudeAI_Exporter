// Exportador de Conversas do Claude.ai
// Execute este script no console do navegador (F12) enquanto estiver em uma conversa no claude.ai

class ClaudeExporter {
  constructor() {
    this.messages = [];
    this.chatTitle = '';
  }

  // Extrai o título da conversa
  extractChatTitle() {
    // Tenta encontrar o título na interface
    const titleElement = document.querySelector('[data-testid="chat-title"]') ||
                        document.querySelector('h1') ||
                        document.querySelector('[class*="title"]');
    
    if (titleElement) {
      this.chatTitle = titleElement.textContent.trim();
    } else {
      this.chatTitle = 'Conversa Claude - ' + new Date().toISOString().split('T')[0];
    }
    
    return this.chatTitle;
  }

  // Extrai o texto de uma mensagem do usuário
  extractUserMessage(element) {
    const messageElement = element.querySelector('[data-testid="user-message"]');
    if (!messageElement) return null;

    const textElements = messageElement.querySelectorAll('p.whitespace-pre-wrap');
    const text = Array.from(textElements)
      .map(p => p.textContent.trim())
      .join('\n\n');

    return text;
  }

  // Extrai o texto de uma mensagem do Claude
  extractClaudeMessage(element) {
    // Procura pelo container de markdown
    const markdownElement = element.querySelector('.standard-markdown, .progressive-markdown');
    if (!markdownElement) return null;

    // Função auxiliar para processar elementos recursivamente
    const extractContent = (node) => {
      let content = [];

      for (const child of node.children) {
        const tag = child.tagName.toLowerCase();

        switch(tag) {
          case 'p':
            content.push(child.textContent.trim());
            break;
          
          case 'ul':
          case 'ol':
            const items = Array.from(child.querySelectorAll('li'))
              .map(li => {
                const text = li.textContent.trim();
                return tag === 'ul' ? `• ${text}` : `${Array.from(child.children).indexOf(li) + 1}. ${text}`;
              });
            content.push(...items);
            break;
          
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            const level = parseInt(tag[1]);
            content.push('#'.repeat(level) + ' ' + child.textContent.trim());
            break;
          
          case 'pre':
            // Código
            const code = child.querySelector('code');
            if (code) {
              const language = code.className.match(/language-(\w+)/)?.[1] || '';
              content.push('```' + language + '\n' + code.textContent + '\n```');
            } else {
              content.push('```\n' + child.textContent + '\n```');
            }
            break;
          
          case 'blockquote':
            const quoted = child.textContent.trim().split('\n').map(line => '> ' + line).join('\n');
            content.push(quoted);
            break;
          
          default:
            // Para outros elementos, tenta extrair texto
            if (child.textContent.trim()) {
              content.push(child.textContent.trim());
            }
        }
      }

      return content.join('\n\n');
    };

    return extractContent(markdownElement);
  }

  // Extrai todas as mensagens da página
  extractAllMessages() {
    this.messages = [];
    this.extractChatTitle();

    // Encontra todos os containers de mensagem
    const allMessageContainers = document.querySelectorAll('[data-test-render-count]');
    
    console.log(`Encontrados ${allMessageContainers.length} containers de mensagens`);

    for (const container of allMessageContainers) {
      // Tenta extrair como mensagem do usuário
      const userText = this.extractUserMessage(container);
      if (userText) {
        this.messages.push({
          role: 'user',
          content: userText,
          timestamp: new Date().toISOString()
        });
        continue;
      }

      // Tenta extrair como mensagem do Claude
      const claudeText = this.extractClaudeMessage(container);
      if (claudeText) {
        this.messages.push({
          role: 'assistant',
          content: claudeText,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`✓ Extraídas ${this.messages.length} mensagens`);
    return this.messages;
  }

  // Exporta para JSON
  toJSON() {
    return {
      title: this.chatTitle,
      exportDate: new Date().toISOString(),
      messageCount: this.messages.length,
      messages: this.messages
    };
  }

  // Exporta para Markdown
  toMarkdown() {
    let md = `# ${this.chatTitle}\n\n`;
    md += `*Exportado em: ${new Date().toLocaleString('pt-BR')}*\n\n`;
    md += `---\n\n`;

    for (const msg of this.messages) {
      const author = msg.role === 'user' ? '**Você**' : '**Claude**';
      md += `### ${author}\n\n`;
      md += msg.content + '\n\n';
      md += `---\n\n`;
    }

    return md;
  }

  // Download do arquivo
  download(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Exporta e faz download em JSON
  exportJSON() {
    this.extractAllMessages();
    const json = JSON.stringify(this.toJSON(), null, 2);
    const filename = `${this.chatTitle.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.json`;
    this.download(json, filename, 'application/json');
    console.log(`✓ Exportado para ${filename}`);
  }

  // Exporta e faz download em Markdown
  exportMarkdown() {
    this.extractAllMessages();
    const markdown = this.toMarkdown();
    const filename = `${this.chatTitle.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.md`;
    this.download(markdown, filename, 'text/markdown');
    console.log(`✓ Exportado para ${filename}`);
  }

  // Mostra prévia no console
  preview() {
    this.extractAllMessages();
    console.log('=== PRÉVIA DA CONVERSA ===\n');
    console.log(`Título: ${this.chatTitle}`);
    console.log(`Total de mensagens: ${this.messages.length}\n`);
    
    for (let i = 0; i < Math.min(3, this.messages.length); i++) {
      const msg = this.messages[i];
      console.log(`${msg.role.toUpperCase()}: ${msg.content.substring(0, 100)}...`);
    }
    
    console.log('\n=== FIM DA PRÉVIA ===');
    return this.messages;
  }
}

// Função de uso rápido
function exportarClaude(formato = 'json') {
  const exporter = new ClaudeExporter();
  
  if (formato.toLowerCase() === 'json') {
    exporter.exportJSON();
  } else if (formato.toLowerCase() === 'markdown' || formato.toLowerCase() === 'md') {
    exporter.exportMarkdown();
  } else {
    console.error('Formato não suportado. Use "json" ou "markdown"');
  }
}

// Instruções no console
console.log('%c📋 Exportador de Conversas Claude.ai carregado!', 'font-size: 16px; font-weight: bold; color: #4A90E2;');
console.log('\n%cUso rápido:', 'font-weight: bold;');
console.log('  exportarClaude("json")     - Exporta para JSON');
console.log('  exportarClaude("markdown") - Exporta para Markdown');
console.log('\n%cUso avançado:', 'font-weight: bold;');
console.log('  const exp = new ClaudeExporter();');
console.log('  exp.preview();        - Ver prévia');
console.log('  exp.exportJSON();     - Exportar JSON');
console.log('  exp.exportMarkdown(); - Exportar Markdown');
console.log('');
