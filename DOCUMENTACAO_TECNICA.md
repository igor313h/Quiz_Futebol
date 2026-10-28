<div style="text-align: center; font-family: Arial, sans-serif;">

**ESCOLA ESTADUAL PROFESSOR OSVALDO FRANCO**

**3º ANO DO ENSINO MÉDIO**

**DOCUMENTAÇÃO TÉCNICA - QUIZ FUTEBOL**

**Aplicação Web de Quiz Interativo sobre Futebol com Sistema de Login, Perfil e Histórico**

**Equipe:**  
Igor Andrade Gomes  
Gustavo Gomes de Andrade

**Professora Orientadora:**  
Nadya

**Local:**  
[Betim], Brasil

**Data:**  
29 de abril de 2026

</div>

---

## SUMÁRIO

1. [INTRODUÇÃO](#1-introdução)  
   1.1 [Objetivo](#11-objetivo)  
   1.2 [Escopo](#12-escopo)  
2. [REFERENCIAL TEÓRICO E JUSTIFICATIVA](#2-referencial-teórico-e-justificativa)  
3. [METODOLOGIA DE DESENVOLVIMENTO](#3-metodologia-de-desenvolvimento)  
   3.1 [Tecnologias utilizadas](#31-tecnologias-utilizadas)  
   3.2 [Ferramentas](#32-ferramentas)  
4. [ARQUITETURA DO SISTEMA](#4-arquitetura-do-sistema)  
   4.1 [Visão geral](#41-visão-geral)  
   4.2 [Modelo de dados](#42-modelo-de-dados)  
      4.2.1 [Entidade User](#421-entidade-user)  
      4.2.2 [Entidade QuizResult](#422-entidade-quizresult)  
      4.2.3 [Entidade Answer](#423-entidade-answer)  
      4.2.4 [Entidade Question](#424-entidade-question)  
   4.3 [Relacionamentos](#43-relacionamentos)  
5. [IMPLEMENTAÇÃO](#5-implementação)  
   5.1 [data.js](#51-datajs)  
   5.2 [script.js](#52-scriptjs)  
   5.3 [styles.css](#53-stylescss)  
   5.4 [index.html](#54-indexhtml)  
6. [REQUISITOS E VALIDAÇÕES](#6-requisitos-e-validações)  
   6.1 [Requisitos funcionais](#61-requisitos-funcionais)  
   6.2 [Requisitos não funcionais](#62-requisitos-não-funcionais)  
   6.3 [Validações aplicadas](#63-validações-aplicadas)  
7. [TESTES E DEPURAÇÃO](#7-testes-e-depuração)  
   7.1 [Problemas comuns identificados](#71-problemas-comuns-identificados)  
   7.2 [Verificações realizadas](#72-verificações-realizadas)  
8. [ORIENTAÇÕES DE USO](#8-orientações-de-uso)  
   8.1 [Como executar o projeto](#81-como-executar-o-projeto)  
   8.2 [Observações sobre armazenamento](#82-observações-sobre-armazenamento)  
9. [RESULTADOS E CONCLUSÃO](#9-resultados-e-conclusão)  
10. [ANEXOS](#10-anexos)  
    10.1 [Estrutura conceitual de entidades](#101-estrutura-conceitual-de-entidades)  
    10.2 [Exemplo de dado em localStorage](#102-exemplo-de-dado-em-localstorage)  

---

## 1. INTRODUÇÃO

Este documento descreve a arquitetura, as tecnologias, a implementação e as validações do projeto "Quiz Futebol". O sistema é uma aplicação web estática que funciona inteiramente no navegador e preserva dados localmente por meio de localStorage.

### 1.1 Objetivo

O objetivo do projeto é oferecer uma aplicação interativa de perguntas e respostas sobre futebol, com cadastro de usuário, controle de sessão, registro de resultados e histórico de desempenho.

### 1.2 Escopo

O sistema abrange:  
- Cadastro e autenticação por e-mail;  
- Interface de quiz com navegação entre perguntas;  
- Registro de respostas e cálculo de pontuação;  
- Visualização de perfil e histórico de quizzes;  
- Persistência de dados no navegador.

## 2. REFERENCIAL TEÓRICO E JUSTIFICATIVA

A solução foi construída como uma aplicação cliente (front-end) baseada em HTML5, CSS3 e JavaScript ES6+. A opção pelo localStorage se deu pela simplicidade de implementação para trabalhos escolares e pela possibilidade de manter dados entre sessões sem backend.

## 3. METODOLOGIA DE DESENVOLVIMENTO

### 3.1 Tecnologias utilizadas

- HTML5: marcação e estrutura das páginas.  
- CSS3: layout responsivo, temas e efeitos visuais.  
- JavaScript ES6+: lógica de negócio, manipulação de DOM e persistência.  
- localStorage: armazenamento persistente do estado de usuários e quizzes.

### 3.2 Ferramentas

- Editor de código (por exemplo, VS Code);  
- Navegador moderno (Chrome, Firefox, Edge ou Safari);  
- Live Server ou servidor local opcional para testes.

## 4. ARQUITETURA DO SISTEMA

### 4.1 Visão geral

O sistema é composto por:  
- index.html: estrutura das telas de login, quiz, resultados e perfil;  
- styles.css: definição de estilos visuais, responsividade e temas;  
- data.js: modelo de dados, persistência em localStorage e operações CRUD;  
- script.js: lógica de navegação, controle de quiz, validações e interface.

### 4.2 Modelo de dados

O armazenamento principal utiliza a chave "quiz_users" em localStorage. O valor salvo é um array de objetos User.

#### 4.2.1 Entidade User

- id: identificador único do usuário;  
- username: nome do usuário;  
- email: e-mail do usuário (normalizado em minúsculas);  
- createdAt: data de criação do usuário;  
- quizzes: lista de quizzes realizados.

#### 4.2.2 Entidade QuizResult

- id: identificador único do quiz;  
- userId: identificador do usuário proprietário;  
- completedAt: data/hora de conclusão;  
- answers: lista de respostas;  
- score: pontuação final;  
- correctAnswers: número de acertos.

#### 4.2.3 Entidade Answer

- questionId: identificador da pergunta;  
- selectedOption: índice da opção escolhida;  
- selectedText: texto da opção selecionada;  
- correctOption: índice da opção correta;  
- correctText: texto da opção correta;  
- isCorrect: booleano de acerto;  
- question: texto da pergunta.

#### 4.2.4 Entidade Question

- id;  
- question;  
- options;  
- correct;  
- explanation.

### 4.3 Relacionamentos

- User 1 → N QuizResult;  
- QuizResult 1 → N Answer;  
- Question atua como referência mestre, não é persistida no usuário.

## 5. IMPLEMENTAÇÃO

### 5.1 data.js

Define as classes e funções responsáveis por:  
- Criar e validar usuários;  
- Carregar e salvar dados em localStorage;  
- Gerenciar a lista de quizzes e histórico;  
- Manter a lista estática de perguntas.

### 5.2 script.js

Responsável pela interação com o usuário:  
- Captura de dados de login;  
- Controle de navegação entre telas e perguntas;  
- Seleção de alternativas;  
- Validação de preenchimento completo do quiz;  
- Cálculo de pontuação e apresentação de resultados;  
- Edição e exclusão de perfil.

### 5.3 styles.css

Garante frequência visual do projeto por meio de:  
- Layout responsivo;  
- Cores e tipografia;  
- Feedback visual para respostas corretas/incorretas;  
- Estilo de botões e cards.

### 5.4 index.html

Contém seções distintas para:  
- Formulário de login;  
- Interface do quiz;  
- Página de resultados;  
- Página de perfil e histórico.

## 6. REQUISITOS E VALIDAÇÕES

### 6.1 Requisitos funcionais

- Cadastro e login de usuário;  
- Iniciar quiz somente com usuário autenticado;  
- Salvar respostas e calcular pontuação;  
- Exibir histórico de resultados por usuário.

### 6.2 Requisitos não funcionais

- Operação em navegador sem backend;  
- Persistência local de dados;  
- Interface amigável e responsiva.

### 6.3 Validações aplicadas

1. E-mail único: impede duplicação de cadastros com o mesmo e-mail;  
2. Campos obrigatórios: username e e-mail devem ser preenchidos;  
3. Respostas completas: não permite finalizar quiz com perguntas sem resposta;  
4. Login obrigatório: só é possível iniciar quiz com usuário autenticado;  
5. E-mail normalizado: comparação em minúsculas para evitar duplicidade.

## 7. TESTES E DEPURAÇÃO

### 7.1 Problemas comuns identificados

- currentUser é null: indica login inválido ou usuário não encontrado;  
- Quiz não salva: localStorage desabilitado ou dado inválido;  
- Perguntas não carregam: erro no array QUESTIONS ou na lógica de renderização;  
- Botões não funcionam: erro de referência aos elementos do DOM.

### 7.2 Verificações realizadas

- Ordem de carregamento dos scripts (data.js antes de script.js);  
- Disponibilidade do localStorage no navegador;  
- Integridade dos dados salvos e lidos do localStorage;  
- Navegação correta entre telas e conclusão de quiz.

## 8. ORIENTAÇÕES DE USO

### 8.1 Como executar o projeto

1. Abra a pasta do projeto no editor ou explorador de arquivos.  
2. Verifique os arquivos principais: index.html, styles.css, script.js, data.js.  
3. Abra index.html no navegador:  
   - Clique duas vezes no arquivo, ou  
   - Use Live Server no VS Code, ou  
   - Rode um servidor local (python -m http.server).  
4. Preencha nome de usuário e e-mail na tela de login.  
5. Responda todas as perguntas do quiz.  
6. Clique em "Finalizar Quiz".  
7. Consulte os resultados e o histórico no perfil.

### 8.2 Observações sobre armazenamento

- O localStorage armazena os dados no navegador em uso;  
- Os dados persistem após fechar o navegador;  
- Cada navegador/dispositivo possui armazenamento independente;  
- Limpar cache/histórico apaga os dados do sistema.

## 9. RESULTADOS E CONCLUSÃO

O projeto alcança os objetivos propostos ao oferecer um quiz de futebol funcional com:  
- Cadastro e autenticação de usuário;  
- Persistência de histórico;  
- Apresentação de resultados e perfil;  
- Validações básicas de uso.

A aplicação demonstra o uso de tecnologias web front-end para desenvolver um sistema educativo simples e com armazenamento local.

## 10. ANEXOS

### 10.1 Estrutura conceitual de entidades

| Entidade    | Campos principais                                                   | Relacionamento             |
|-------------|---------------------------------------------------------------------|----------------------------|
| User        | id, username, email, createdAt, quizzes                            | 1 usuário → N quizzes     |
| QuizResult  | id, userId, completedAt, score, correctAnswers, answers            | 1 quiz → N answers        |
| Answer      | questionId, selectedOption, selectedText, correctOption, correctText, isCorrect, question | Pertence a 1 quiz         |
| Question    | id, question, options, correct, explanation                        | Lista mestre de perguntas |

### 10.2 Exemplo de dado em localStorage

**Chave:** quiz_users

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

**Versão:** 1.0  
**Data:** 29/04/2026  
**Desenvolvido com:** HTML5, CSS3, JavaScript ES6+

## Atualização do jogo

A versão atual do fluxo principal em `index.html` passou a utilizar um banco de perguntas separado em `data.js`, com mais de 500 perguntas sobre Copas, clubes, jogadores, futebol feminino, regras, estádios, competições e tática. O banco valida IDs e enunciados únicos, quatro alternativas distintas, índice correto, categoria, dificuldade, explicação e referência antes de ser usado.

O jogo também oferece quatro níveis de dificuldade, seleção de categoria e dez modos: Clássico, Contra o Tempo, Sobrevivência, Verdadeiro ou Falso, Desafio Diário, Campeonato, Adivinhe o Jogador, Adivinhe o Clube, Copa do Mundo e Futebol Brasileiro. A partida apresenta explicações após cada resposta, pontuação com bônus, sequência, ajudas, cronômetro/vidas conforme o modo, resultado detalhado e histórico.

O armazenamento continua local, em `localStorage`; não há backend configurado. Portanto, perfis, recordes e ranking não são sincronizados entre navegadores ou dispositivos. As referências associadas às perguntas indicam fontes institucionais para conferência, mas o aplicativo não consulta dados ao vivo. Elencos e transferências atuais dependem de uma API externa e não são apresentados como informação atualizada.

Para executar, abra `index.html` ou inicie `python -m http.server 8000` na pasta do projeto e acesse `http://localhost:8000`. Consulte também o `README.md` para instruções e limites da versão local.
