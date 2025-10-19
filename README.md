# 📋 Exportador de Conversas Claude.ai

Ferramentas simples para exportar suas conversas do Claude.ai em diferentes formatos, já que o site não oferece essa funcionalidade nativamente.

## 🎯 Características

- ✅ **Sem instalação**: Execute diretamente no console do navegador
- 📄 **Exportação JSON**: Formato estruturado para processamento
- 📝 **Exportação Markdown**: Formato legível para documentação
- 🎨 **Preserva formatação**: Mantém listas, código, negrito, etc.
- 🚀 **Rápido e simples**: Apenas copie, cole e execute
- 🔒 **100% local**: Nenhum dado é enviado para servidores externos

## 📦 Arquivos Disponíveis

### 1. `console-exporter.js` (Completo)
Script principal com classe completa e múltiplas funcionalidades.

**Recursos:**
- Exportação em JSON e Markdown
- Preview das mensagens no console
- Interface orientada a objetos
- Comandos de atalho

### 2. `exporter-json.js` (Simples)
Versão minimalista que exporta direto para JSON.

**Uso:** Cole no console → Enter → Download automático

### 3. `exporter-markdown.js` (Simples)
Versão minimalista que exporta direto para Markdown.

**Uso:** Cole no console → Enter → Download automático

## 🚀 Como Usar

### Método Rápido (Recomendado)

1. **Abra uma conversa** no [claude.ai](https://claude.ai)
2. **Abra o console do navegador:**
   - **Windows/Linux**: `F12` ou `Ctrl + Shift + J`
   - **Mac**: `Cmd + Option + J`
3. **Copie e cole** o conteúdo de um dos arquivos
4. **Pressione Enter**
5. **Aguarde o download** automático!

### Método Avançado (console-exporter.js)

Se você usar o `console-exporter.js`, terá acesso a comandos adicionais:

```javascript
// Exportação rápida
exportarClaude("json")      // Exporta para JSON
exportarClaude("markdown")  // Exporta para Markdown

// Uso avançado
const exp = new ClaudeExporter();
exp.preview();           // Visualiza mensagens no console
exp.extractAllMessages(); // Extrai mensagens
exp.exportJSON();        // Exporta JSON
exp.exportMarkdown();    // Exporta Markdown
```

## 📖 Exemplos de Uso

### Exemplo 1: Exportar rapidamente para JSON
```javascript
// Cole o conteúdo de exporter-json.js no console
// O download começa automaticamente!
```

### Exemplo 2: Visualizar antes de exportar
```javascript
// Cole o conteúdo de console-exporter.js no console
const exp = new ClaudeExporter();
exp.preview();  // Veja as primeiras mensagens
exp.exportMarkdown();  // Exporte quando estiver pronto
```

### Exemplo 3: Exportar ambos os formatos
```javascript
// Cole o conteúdo de console-exporter.js no console
exportarClaude("json");      // Baixa JSON
exportarClaude("markdown");  // Baixa Markdown
```

## 📄 Formatos de Saída

### JSON
```json
{
  "title": "Conversa Claude - 2024-10-19",
  "exportDate": "2024-10-19T22:05:00.000Z",
  "messageCount": 4,
  "messages": [
    {
      "role": "user",
      "content": "Olá, Claude!"
    },
    {
      "role": "assistant",
      "content": "Olá! Como posso ajudar você hoje?"
    }
  ]
}
```

### Markdown
```markdown
# Conversa com Claude

*Exportado em: 19/10/2024, 19:05:00*

Total de mensagens: 4

---

## **👤 Você**

Olá, Claude!

---

## **🤖 Claude**

Olá! Como posso ajudar você hoje?

---
```

## 🔧 Detalhes Técnicos

### Como Funciona

Os scripts utilizam seletores CSS para encontrar elementos específicos na página do Claude.ai:

- **Mensagens do usuário**: `[data-testid="user-message"]`
- **Mensagens do Claude**: `.standard-markdown`, `.progressive-markdown`
- **Containers**: `[data-test-render-count]`

O código extrai o conteúdo, processa a formatação e gera o arquivo para download.

### Compatibilidade

- ✅ Chrome / Edge / Brave (testado)
- ✅ Firefox (testado)
- ✅ Safari (deve funcionar)
- ✅ Opera (deve funcionar)

### Limitações

- ⚠️ **Conversas longas**: Role a página até o fim para carregar todas as mensagens antes de exportar
- ⚠️ **Anexos**: Imagens e arquivos anexados não são exportados (apenas o texto)
- ⚠️ **Streaming**: Aguarde a resposta do Claude terminar antes de exportar

## 🛠️ Personalização

### Modificar o formato JSON

Edite a função `toJSON()` no `console-exporter.js`:

```javascript
toJSON() {
  return {
    title: this.chatTitle,
    exportDate: new Date().toISOString(),
    messageCount: this.messages.length,
    messages: this.messages,
    // Adicione seus campos personalizados aqui
    customField: "valor"
  };
}
```

### Modificar o formato Markdown

Edite a função `toMarkdown()` no `console-exporter.js`:

```javascript
toMarkdown() {
  let md = `# ${this.chatTitle}\n\n`;
  // Personalize a formatação aqui
  return md;
}
```

## ❓ FAQ

### Por que não há uma extensão do navegador?

Manter o código simples e auditável. Você pode ler todo o código e entender exatamente o que ele faz.

### Os dados são enviados para algum servidor?

Não! Todo o processamento acontece no seu navegador. Os scripts apenas extraem o HTML da página e geram os arquivos localmente.

### Posso usar isso comercialmente?

Sim! Este código é livre para uso pessoal e comercial. Veja a seção de licença abaixo.

### E se a estrutura do site mudar?

Os seletores CSS podem precisar ser atualizados. Abra uma issue no GitHub se parar de funcionar!

### Funciona em conversas privadas?

Sim! O script funciona em qualquer conversa que você possa visualizar no seu navegador.

## 🐛 Problemas Conhecidos

- **Mensagens não aparecem**: Role a página até o topo e até o fim para garantir que todas as mensagens foram carregadas
- **Formatação incorreta**: Alguns elementos especiais podem não ser capturados perfeitamente
- **Console bloqueado**: Alguns navegadores podem exigir que você digite `allow pasting` antes de colar código

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- 🐛 Reportar bugs
- 💡 Sugerir novas funcionalidades
- 🔧 Enviar pull requests
- 📖 Melhorar a documentação

## 📝 Changelog

### Versão 1.0.0 (2024-10-19)
- ✨ Lançamento inicial
- 📄 Exportação para JSON
- 📝 Exportação para Markdown
- 🎨 Preservação de formatação

## 📜 Licença

MIT License - Sinta-se livre para usar, modificar e distribuir.

## 🙏 Agradecimentos

- Ao Claude (Anthropic) pela excelente ferramenta
- À comunidade que solicitou esta funcionalidade

## 📞 Suporte

Se tiver problemas:
1. Verifique se está usando a versão mais recente do código
2. Tente em outro navegador
3. Abra uma issue no GitHub com detalhes do erro

---

**Feito com ❤️ para a comunidade Claude**

*Nota: Este é um projeto independente e não é afiliado à Anthropic.*
