📚 DOCUMENTAÇÃO TÉCNICA - Quiz Futebol

## Dados da Equipe

- Nome dos alunos: Igor Andrade Gomes e Gustavo Gomes de Andrade
- Série: 3º ano do Ensino Médio
- Professora: Nadya
- Projeto: Quiz Futebol com login, perfil e histórico

## Dificuldades Apresentadas

Durante o desenvolvimento enfrentamos desafios relacionados a:
- persistência de dados no `localStorage` e restauração correta de objetos;
- fluxo de login e validação de usuário existente;
- navegação entre perguntas e finalização do quiz sem perder respostas;
- exibição de resultados com histórico de perfil e edição de dados do usuário.

## 1. Sobre o Sistema

Este projeto é um quiz de futebol construído como uma aplicação web estática que roda totalmente no navegador.
A aplicação não depende de servidor backend: todos os dados são gravados no `localStorage` do navegador.

### Tipo de sistema
- Aplicação web cliente
- Front-end estático
- Persistência local no navegador
- Estrutura baseada em páginas únicas (SPA leve)

## 2. Principais Tecnologias

- **HTML5**: marcação das telas e estrutura de conteúdo
- **CSS3**: design, responsividade, animações e temas visuais
- **JavaScript ES6+**: lógica de negócio, navegação, controle de estado e manipulação do DOM
- **localStorage**: armazenamento persistente dos usuários, quizzes e histórico

## 3. Estrutura do Banco de Dados

O sistema usa `localStorage` como banco de dados local. A chave principal é:
- `quiz_users`

Este valor é um array de objetos `User`, onde cada usuário armazena seu histórico de quizzes.

### Modelo de dados

#### Usuário (`User`)
- `id`: identificador único (timestamp)
- `username`: nome do usuário
- `email`: email do usuário (normalizado em minúsculas)
- `createdAt`: data de criação do usuário
- `quizzes`: lista de quizzes realizados

#### Quiz (`QuizResult`)
- `id`: identificador único do quiz
- `userId`: id do usuário proprietário
- `completedAt`: data/hora de conclusão do quiz
- `answers`: lista de respostas do quiz
- `score`: pontuação final do quiz
- `correctAnswers`: número de acertos

#### Resposta (`Answer`)
- `questionId`: id da pergunta respondida
- `selectedOption`: índice da opção escolhida
- `selectedText`: texto da opção selecionada
- `correctOption`: índice da opção correta
- `correctText`: texto da opção correta
- `isCorrect`: booleano indicando acerto
- `question`: texto da pergunta

#### Perguntas (`QUESTIONS`)
- lista estática de objetos com campos:
  - `id`
  - `question`
  - `options`
  - `correct`
  - `explanation`

## 4. Estrutura de Dados e Relacionamentos

### Tabelas conceituais

#### Tabela `Users`
- `id`
- `username`
- `email`
- `createdAt`
- `quizzes` (relação 1:N com `QuizResults`)

#### Tabela `QuizResults`
- `id`
- `userId`
- `completedAt`
- `score`
- `correctAnswers`
- `answers` (relação 1:N com `Answers`)

#### Tabela `Answers`
- `questionId`
- `selectedOption`
- `selectedText`
- `correctOption`
- `correctText`
- `isCorrect`
- `question`

### Relacionamentos básicos

- `Users` 1 → N `QuizResults`
- `QuizResults` 1 → N `Answers`
- `QUESTIONS` é referência mestre, mas não é armazenado no usuário

## 5. Principais Componentes do Código

### `data.js`
Responsável pelo schema de dados e pela persistência:
- `User` (modelo de usuário)
- `QuizResult` (resultado de um quiz)
- `Database` (gerencia localStorage, login e CRUD de usuário/quiz)
- `QUESTIONS` (lista de perguntas do quiz)

### `script.js`
Responsável pela lógica de execução:
- processo de login e criação de usuário
- navegação entre telas
- navegação de perguntas
- seleção de respostas
- validação do quiz completo
- exibição de resultados e perfil
- edição e exclusão de usuário

### `styles.css`
Responsável pela apresentação visual:
- layout responsivo
- tema em gradiente
- botões e cards
- feedback visual para respostas corretas/incorretas

### `index.html`
Define a estrutura das telas:
- login
- quiz
- resultados
- perfil

## 6. Campos Mais Importantes

### `User`
- `id`
- `username`
- `email`
- `createdAt`
- `quizzes`

### `QuizResult`
- `id`
- `userId`
- `completedAt`
- `score`
- `correctAnswers`
- `answers`

### `Answer`
- `questionId`
- `selectedOption`
- `correctOption`
- `isCorrect`

## 7. Como Executar o Projeto

### Requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Não é necessário servidor web, mas recomenda-se um servidor local para evitar restrições de CORS em alguns navegadores.

### Passo a passo básico

1. Abra a pasta do projeto no seu editor ou explorador de arquivos.
2. Verifique os arquivos principais:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `data.js`
3. Abra `index.html` no navegador:
   - clique duas vezes no arquivo, ou
   - use uma extensão Live Server no VS Code, ou
   - rode um servidor simples (por exemplo `python -m http.server` no terminal).
4. Na tela de login, crie um usuário com nome e email.
5. Responda as 10 perguntas do quiz.
6. Clique em `Finalizar Quiz` para ver o resultado.
7. Vá para `Ver Perfil` para acompanhar estatísticas e histórico.

### Se quiser usar Live Server no VS Code
1. Instale a extensão Live Server.
2. Abra a pasta do projeto no VS Code.
3. Clique com o botão direito em `index.html` e escolha `Open with Live Server`.

## 8. Passo a Passo Básico para Rodar o Sistema

1. Abra o arquivo `index.html`.
2. Digite um nome de usuário e email na tela de login.
3. Clique em `Entrar`.
4. Responda cada pergunta do quiz.
5. Ao chegar na última pergunta, clique em `Finalizar Quiz`.
6. Visualize sua pontuação e detalhes de respostas.
7. Clique em `Ver Perfil` para acessar o histórico, editar ou excluir sua conta.

## 9. Observações sobre o Banco de Dados Local

- O `localStorage` guarda os dados no navegador do usuário.
- Os dados persistem mesmo após fechar o navegador.
- Cada navegador/dispositivo mantém seu próprio armazenamento.
- Limpar cache ou histórico do navegador apaga os dados do sistema.

## 10. Validações Implementadas

1. **Email Único**: não permite criar usuário com email duplicado
2. **Campos Obrigatórios**: `username` e `email` são obrigatórios no login
3. **Respostas Completas**: não permite finalizar o quiz se houver perguntas sem resposta
4. **Login Obrigatório**: só é possível iniciar quiz com usuário logado
5. **Email Normalizado**: emails são comparados em minúsculas para evitar duplicatas

## 11. Depuração e Erros Comuns

### Erros de console
- Verifique se `data.js` está carregado antes de `script.js`
- Verifique se `localStorage` está disponível
- Verifique erros de DOM se elementos não forem encontrados

### Problemas comuns
1. `currentUser é null` → usuário não logado corretamente
2. `Quiz não salva` → `localStorage` desabilitado ou valor inválido
3. `Perguntas não carregam` → erro no array `QUESTIONS`
4. `Botões não funcionam` → erro em `script.js`

---

## 12. Estrutura sugerida de “tabelas” conceituais

| Entidade | Campos principais | Relacionamento |
|---------|-------------------|---------------|
| `User` | `id`, `username`, `email`, `createdAt`, `quizzes` | 1 usuário → N quizzes |
| `QuizResult` | `id`, `userId`, `completedAt`, `score`, `correctAnswers`, `answers` | 1 quiz → N answers |
| `Answer` | `questionId`, `selectedOption`, `selectedText`, `correctOption`, `correctText`, `isCorrect`, `question` | pertence a 1 quiz |
| `Question` | `id`, `question`, `options`, `correct`, `explanation` | lista mestre de perguntas |

---

## 13. Exemplo de dado no localStorage

Chave: `quiz_users`
```javascript
[
  {
    id: 1712345678901,
    username: "João Silva",
    email: "joao@email.com",
    createdAt: "2024-04-08T10:30:00.000Z",
    quizzes: [
      {
        id: 1712346000000,
        userId: 1712345678901,
        completedAt: "2024-04-08T10:35:00.000Z",
        answers: [
          {
            questionId: 1,
            selectedOption: 1,
            selectedText: "Argentina",
            correctOption: 1,
            correctText: "Argentina",
            isCorrect: true,
            question: "Qual seleção venceu a Copa do Mundo de 2022?"
          }
        ],
        score: 8,
        correctAnswers: 8
      }
    ]
  }
]
```

---

Versão: 1.0
Data: 08/04/2024
Desenvolvido com HTML5, CSS3, JavaScript ES6+
