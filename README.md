⚽ QUIZ FUTEBOL - Sistema Completo de Quiz com Login e Perfil

## 📋 Descrição
Um sistema interativo de quiz sobre futebol com:
- ✅ Sistema de autenticação (login/cadastro)
- ✅ 10 perguntas sobre futebol
- ✅ Perfil do usuário com histórico de quizzes
- ✅ Armazenamento de dados em LocalStorage
- ✅ Interface moderna e responsiva
- ✅ Estatísticas e resultados detalhados

## 📁 Estrutura do Projeto

```
quiz-futebol/
├── index.html       # Página principal (HTML)
├── styles.css       # Estilos da aplicação (CSS)
├── script.js        # Lógica da aplicação (JavaScript)
├── data.js          # Schema de dados e banco de dados
└── README.md        # Este arquivo
```

## 🚀 Como Usar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Nenhuma instalação necessária!

### Instruções de Execução
1. Abra o arquivo `index.html` em seu navegador
2. Você verá a tela de login

### 🔑 Sistema de Login
- **Novo Usuário**: Digite seu nome de usuário e email, clique em "Entrar"
- **Usuário Existente**: Clique na tag do usuário na lista "Usuários cadastrados" ou digite o email novamente

### 📝 Quiz
- Cada pergunta apresenta 4 opções de resposta
- Você pode navegar entre as perguntas (anterior/próxima)
- Responda todas as 10 perguntas antes de finalizar
- O quiz será salvo automaticamente no seu perfil

### 👤 Perfil
- Visualize suas estatísticas
- Veja o histórico de todos os seus quizzes
- Acompanhe sua melhor pontuação e média

## 💾 Schema de Dados

### Estrutura de Usuário
```javascript
{
  id: timestamp,
  username: "string",
  email: "string",
  createdAt: "ISO string",
  quizzes: [array de resultados]
}
```

### Estrutura de Resultado do Quiz
```javascript
{
  id: timestamp,
  userId: timestamp,
  completedAt: "ISO string",
  answers: [array com respostas],
  score: número (0-10),
  correctAnswers: número
}
```

### Estrutura de Pergunta
```javascript
{
  id: número,
  question: "string",
  options: [array com 4 opções],
  correct: índice da resposta correta,
  explanation: "string"
}
```

## 📊 Funcionalidades Principais

### 1. Autenticação
- Criar novo usuário com nome de usuário e email
- Login rápido clicando no usuário existente
- Lista de usuários cadastrados sempre visível

### 2. Quiz Interativo
- 10 perguntas sobre futebol
- Formato multiple-choice com 4 opções
- Navegação entre perguntas
- Validação: todas as perguntas devem ser respondidas

### 3. Resultados
- Pontuação total (0-10)
- Percentual de acerto
- Mensagem personalizada baseada na pontuação
- Detalhes de cada resposta (correta/incorreta)

### 4. Perfil do Usuário
- Estatísticas gerais
- Total de quizzes realizados
- Melhor pontuação
- Pontuação média
- Histórico completo de quizzes com datas

## 🎨 Recursos Visuais

- Interface moderna com gradientes
- Design responsivo (funciona em desktop e mobile)
- Animações suaves
- Indicador visual de progresso
- Cores indicativas (verde para correto, vermelho para incorreto)

## 💾 Armazenamento de Dados

Todos os dados são salvos localmente no navegador usando **LocalStorage**:
- Os dados persistem mesmo após fechar o navegador
- Não requer servidor ou banco de dados
- Completamente privado no dispositivo do usuário

## 🔧 Funcionalidades Técnicas

### data.js
- Classe `User`: Gerencia dados do usuário
- Classe `QuizResult`: Armazena resultado de um quiz
- Classe `Database`: Gerencia todas as operações de armazenamento
- Array `QUESTIONS`: Contém todas as perguntas do quiz

### script.js
- Funções de login e autenticação
- Navegação entre telas
- Lógica do quiz
- Cálculo de pontuação
- Exibição de resultados

### styles.css
- Responsivo com media queries
- Design moderno com gradientes
- Animações e transições
- Temas para diferentes estados

## 📱 Compatibilidade

✅ Chrome/Chromium
✅ Firefox
✅ Safari
✅ Edge
✅ Dispositivos móveis
✅ Tablets

## 🌟 Recursos Avançados

1. **Validação de Dados**: Verifica duplicação de emails
2. **Histórico Completo**: Cada quiz é registrado com data/hora
3. **Estatísticas em Tempo Real**: Calcula média, melhor pontuação, etc.
4. **Primeira Resposta Padrão**: Navegação fácil entre questões
5. **Logs de Usuários**: Mantém lista de todos os usuários crescimento

## 🐛 Possíveis Extensões Futuras

- [ ] Exportar resultados em PDF
- [ ] Comparação de pontuações entre usuários
- [ ] Diferentes categorias de perguntas
- [ ] Modo multijogador
- [ ] Temas personalizáveis (claro/escuro)
- [ ] Banco de dados na nuvem
- [ ] Sistema de níveis/badges
- [ ] API para integrar com outras aplicações

## 📝 Perguntas Incluídas

1. Copa do Mundo 2022
2. Primeira Copa do Mundo
3. GOAT do futebol
4. Gols de Pelé
5. País com mais Copas
6. Ronaldinho Gaúcho no Barcelona
7. Times com mais Champions League
8. Participantes de Copa do Mundo
9. Barcelona Neymar
10. Primeira Euro

## 💡 Dicas de Uso

- Use QuickLogin clicando nos usuários existentes para testar rapidamente
- Cada quiz é independente, você pode fazer múltiplos testes
- Os dados são salvos automaticamente
- Você pode redefinir tudo limpando o armazenamento local do navegador

---

Desenvolvido com ❤️ usando HTML, CSS, JavaScript e LocalStorage
