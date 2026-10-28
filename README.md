# Quiz Futebol

Jogo de perguntas sobre futebol feito com HTML, CSS e JavaScript puro. Não requer instalação de pacotes nem conexão com uma API para jogar.

## Executar

1. Abra `index.html` em um navegador moderno; ou
2. Na pasta do projeto, inicie um servidor estático com `python -m http.server 8000` e acesse `http://localhost:8000`.

O servidor local é recomendado para evitar restrições de armazenamento do navegador ao abrir arquivos diretamente.

## Como jogar

1. Clique em **Jogar agora**.
2. Informe um nome e um e-mail para criar ou selecionar um perfil local.
3. Escolha um modo, uma dificuldade e, quando compatível, uma categoria.
4. Responda às perguntas; confira o resultado, as explicações e o histórico.

Perfis, partidas, tema e ranking ficam no `localStorage` do navegador. Esses perfis são apenas uma conveniência local, não uma autenticação segura. Limpar os dados do navegador remove esse histórico.

## Modos de jogo

- **Clássico:** 10 perguntas.
- **Contra o Tempo:** 60 segundos para responder o máximo possível.
- **Sobrevivência:** a partida termina quando as vidas configuradas acabam.
- **Verdadeiro ou Falso:** afirmações derivadas de perguntas validadas.
- **Desafio Diário:** conjunto determinístico de 10 perguntas por data local.
- **Campeonato:** 12 perguntas divididas em quatro etapas até a final.
- **Adivinhe o Jogador / Adivinhe o Clube:** identificação por pistas de carreira, apelido e cidade.
- **Copa do Mundo / Futebol Brasileiro:** perguntas filtradas por tema.

Há quatro dificuldades (Fácil, Médio, Difícil e Especialista), opção aleatória, categorias, tema claro/escuro e três ajudas por partida: eliminar duas opções, receber uma pista e pular uma pergunta. Acertos dão pontos base, sequência e velocidade podem render bônus. A pergunta não pode pontuar novamente na mesma partida.

## Banco de perguntas

O banco está separado da interface em `data.js`. Ele contém mais de 500 perguntas com ID único, quatro alternativas, resposta correta, categoria, dificuldade, explicação, pista e referência editorial. O carregamento valida IDs, enunciados, alternativas e respostas antes de iniciar a aplicação. As referências indicam arquivos institucionais (FIFA, IFAB, UEFA, CONMEBOL, CBF e outras); não há chamadas externas.

As perguntas privilegiam fatos históricos e regras estáveis. Elencos, transferências e estatísticas atuais não são tratados como dados ao vivo. Revise datas e recordes contra as fontes listadas antes de usar o banco em uma publicação formal.

## Arquivos principais

- `index.html`: estrutura e telas do jogo.
- `styles.css`: identidade visual, temas, acessibilidade e layout responsivo.
- `script.js`: modos, pontuação, ajudas, resultados e navegação.
- `data.js`: perguntas, validação do banco, perfis e armazenamento local.

`quiz-futebol.html`, `quiz-futebol.php`, `src/conexao-bd.php`, `test.php` e páginas de guia são materiais separados do fluxo principal. As páginas PHP requerem PHP, MySQL, um banco e credenciais configurados; não são necessárias para jogar a versão do `index.html`.

## Limites e próximos passos

- O ranking é local ao navegador; ranking compartilhado exige backend, autenticação e armazenamento de partidas no servidor.
- O cadastro local não verifica identidade nem sincroniza perfis entre aparelhos.
- Não são carregados escudos ou imagens de clubes. Isso evita incluir imagens sem licença confirmada.
- Para conteúdo realmente atualizado, conecte uma API licenciada, documente a fonte e a data de atualização e valide as respostas antes de exibi-las.
