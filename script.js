let currentQuestion = 0;
let currentQuizResult = null;
let selectedDifficulty = 'aleatorio';
let selectedMode = 'classic';
let QUESTIONS = [];
let currentStreak = 0;
let usedHelps = new Set();
let lives = 3;
let startedAt = 0;
let questionStartedAt = 0;
let timerInterval = null;
let timeRemaining = 60;
let lastScreenBeforeRanking = 'welcomeScreen';
let questionLocked = false;
let selectedQuestions = [];

const MODE_LABELS = {
    classic: 'Clássico',
    time: 'Contra o Tempo',
    survival: 'Sobrevivência',
    truefalse: 'Verdadeiro ou Falso',
    daily: 'Desafio Diário',
    championship: 'Campeonato',
    player: 'Adivinhe o Jogador',
    club: 'Adivinhe o Clube',
    worldcup: 'Copa do Mundo',
    brazil: 'Futebol Brasileiro'
};

const CATEGORY_LABELS = ['Todas as categorias', ...new Set(QUESTION_BANK.map(question => question.category))];

document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    updateUsersList();
    populateCategories();
    showScreen('welcomeScreen');
    if (db.readError) {
        showNotice('Os dados salvos parecem inválidos ou indisponíveis. O jogo não irá sobrescrevê-los; revise o armazenamento local do navegador.', 'error');
    }
});

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (!screen) throw new Error(`Tela não encontrada: ${screenId}`);
    screen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToRegisterScreen() {
    updateUsersList();
    showScreen('loginScreen');
    document.getElementById('username').focus();
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!username || !email) {
        showNotice('Informe nome e e-mail para continuar.', 'error');
        return;
    }

    let result = db.loginUser(email, username);
    if (!result.success) result = db.createUser(username, email);
    if (!result.success) {
        showNotice(result.message, 'error');
        return;
    }
    updateUsersList();
    showLevelSelection();
}

function updateUsersList() {
    const list = document.getElementById('usersList');
    if (!list) return;
    list.replaceChildren();
    const users = db.getAllUsers();
    if (!users.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-message';
        empty.textContent = 'Nenhum jogador cadastrado ainda.';
        list.appendChild(empty);
        return;
    }
    users.forEach(user => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'user-tag';
        button.textContent = user.username;
        button.addEventListener('click', () => selectRegisteredUser(user.email));
        list.appendChild(button);
    });
}

function selectRegisteredUser(email) {
    const result = db.loginUser(email);
    if (!result.success) {
        showNotice(result.message, 'error');
        return;
    }
    document.getElementById('registeredUserName').textContent = result.user.username;
    document.getElementById('registeredUserActions').classList.remove('hidden');
}

function clearRegisteredUserSelection() {
    document.getElementById('registeredUserActions').classList.add('hidden');
    db.logoutUser();
}

function populateCategories() {
    const select = document.getElementById('categorySelect');
    if (!select) return;
    select.replaceChildren();
    CATEGORY_LABELS.forEach((label, index) => {
        const option = document.createElement('option');
        option.value = index === 0 ? 'all' : label;
        option.textContent = index === 0 ? label : `${label} (${QUESTION_BANK.filter(question => question.category === label).length})`;
        select.appendChild(option);
    });
    document.getElementById('bankCount').textContent = `${QUESTION_BANK.length} perguntas verificadas`;
}

function showLevelSelection() {
    const user = db.getCurrentUser();
    if (!user) {
        showNotice('Entre ou crie um perfil antes de jogar.', 'error');
        return;
    }
    document.getElementById('currentUser').textContent = `Olá, ${user.username}!`;
    document.getElementById('selectedLevelText').textContent = 'Escolha o modo, o nível e a categoria.';
    showScreen('levelScreen');
}

function selectDifficulty(level) {
    selectedDifficulty = level;
    document.querySelectorAll('[data-difficulty]').forEach(button => {
        button.classList.toggle('active', button.dataset.difficulty === level);
        button.setAttribute('aria-pressed', button.dataset.difficulty === level ? 'true' : 'false');
    });
    document.getElementById('selectedLevelText').textContent =
        `Nível: ${level === 'aleatorio' ? 'Aleatório' : DIFFICULTY_LABELS[level]}.`;
}

function selectMode(mode) {
    selectedMode = mode;
    document.querySelectorAll('[data-mode]').forEach(button => {
        button.classList.toggle('active', button.dataset.mode === mode);
        button.setAttribute('aria-pressed', button.dataset.mode === mode ? 'true' : 'false');
    });
    updateCategoryAvailability(mode);
}

function updateCategoryAvailability(mode) {
    const categorySelect = document.getElementById('categorySelect');
    const restrictedCategories = {
        player: ['Adivinhe o jogador'],
        club: ['Adivinhe o clube'],
        worldcup: ['Copa do Mundo'],
        brazil: ['Futebol brasileiro', 'Clubes brasileiros', 'Competições sul-americanas']
    };
    const allowed = restrictedCategories[mode];
    Array.from(categorySelect.options).forEach(option => {
        option.disabled = option.value !== 'all' && allowed && !allowed.includes(option.value);
    });
    if (categorySelect.selectedOptions[0] && categorySelect.selectedOptions[0].disabled) {
        categorySelect.value = 'all';
    }
}

function loadTheme() {
    let theme = 'dark';
    try {
        theme = localStorage.getItem('quizTheme') || 'dark';
    } catch (error) {
        console.error('Não foi possível carregar a preferência de tema.', error);
        showNotice('O armazenamento local está indisponível; a preferência de tema não será salva.', 'error');
    }
    setTheme(theme, false);
}

function setTheme(theme, persist = true) {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('dark-theme', theme !== 'light');
    if (persist) {
        try {
            localStorage.setItem('quizTheme', theme === 'light' ? 'light' : 'dark');
        } catch (error) {
            console.error('Não foi possível salvar a preferência de tema.', error);
            showNotice('O tema foi alterado, mas não será mantido após fechar a página.', 'error');
        }
    }
    document.querySelectorAll('[data-theme]').forEach(button => {
        const active = button.dataset.theme === theme;
        button.classList.toggle('active-theme', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
}

function openRankingFromCurrentScreen() {
    const screen = document.querySelector('.screen.active');
    showRanking(screen ? screen.id : 'welcomeScreen');
}

function showRanking(fromScreen = 'welcomeScreen') {
    lastScreenBeforeRanking = fromScreen;
    const list = document.getElementById('rankingList');
    list.replaceChildren();
    const leaderboard = db.getLeaderboard();
    if (!leaderboard.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-message';
        empty.textContent = 'Ainda não existem partidas concluídas neste navegador.';
        list.appendChild(empty);
    } else {
        leaderboard.forEach((player, index) => {
            const row = document.createElement('div');
            row.className = 'ranking-row';
            const values = [`${index + 1}`, player.username, `${player.bestScore} pts`, `${player.averageScore} pts`, `${player.totalQuizzes}`];
            values.forEach(value => {
                const cell = document.createElement('span');
                cell.textContent = value;
                row.appendChild(cell);
            });
            list.appendChild(row);
        });
    }
    showScreen('rankingsScreen');
}

function backFromRanking() {
    showScreen(lastScreenBeforeRanking);
}

function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function seededShuffle(items, seed) {
    const output = items.slice();
    let state = seed >>> 0;
    const random = () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 4294967296;
    };
    for (let index = output.length - 1; index > 0; index -= 1) {
        const target = Math.floor(random() * (index + 1));
        [output[index], output[target]] = [output[target], output[index]];
    }
    return output;
}

function getModeQuestions(mode, category) {
    const categoryForMode = {
        player: ['Adivinhe o jogador'],
        club: ['Adivinhe o clube'],
        worldcup: ['Copa do Mundo'],
        brazil: ['Futebol brasileiro', 'Clubes brasileiros', 'Competições sul-americanas']
    };
    let pool = QUESTION_BANK.slice();
    if (categoryForMode[mode]) pool = pool.filter(question => categoryForMode[mode].includes(question.category));
    if (category !== 'all') pool = pool.filter(question => question.category === category);
    if (selectedDifficulty !== 'aleatorio') pool = pool.filter(question => question.difficulty === selectedDifficulty);
    if (mode === 'daily') {
        const dateKey = new Date().toLocaleDateString('sv-SE');
        pool = seededShuffle(pool, hashString(dateKey));
    } else {
        pool = shuffle(pool);
    }
    if (mode === 'daily') return pool.slice(0, Math.min(10, pool.length));
    const count = mode === 'championship' ? 12 : mode === 'time' ? Math.min(pool.length, 100) : mode === 'survival' ? Math.min(pool.length, 50) : 10;
    return pool.slice(0, count);
}

function shuffle(items) {
    const output = items.slice();
    for (let index = output.length - 1; index > 0; index -= 1) {
        const target = Math.floor(Math.random() * (index + 1));
        [output[index], output[target]] = [output[target], output[index]];
    }
    return output;
}

function prepareQuestion(question) {
    if (selectedMode !== 'truefalse') {
        const shuffledOptions = shuffle(question.options.map((text, index) => ({ text, isCorrect: index === question.correct })));
        return { ...question, options: shuffledOptions.map(option => option.text), correct: shuffledOptions.findIndex(option => option.isCorrect) };
    }
    const isTrue = Math.random() >= 0.5;
    const statementAnswer = isTrue
        ? question.options[question.correct]
        : question.options[(question.correct + 1 + Math.floor(Math.random() * 3)) % question.options.length];
    return {
        ...question,
        question: `Verdadeiro ou falso: ${question.question} Resposta proposta: ${statementAnswer}.`,
        options: ['Verdadeiro', 'Falso'],
        correct: isTrue ? 0 : 1,
        explanation: `${isTrue ? 'A afirmação é verdadeira.' : 'A afirmação é falsa.'} Resposta correta: ${question.options[question.correct]}. ${question.explanation}`
    };
}

function confirmStartQuiz() {
    selectedMode = document.getElementById('modeSelect').value;
    startQuiz();
}

function startQuiz() {
    const user = db.getCurrentUser();
    if (!user) {
        showNotice('Entre ou crie um perfil para começar.', 'error');
        showScreen('loginScreen');
        return;
    }

    selectedMode = document.getElementById('modeSelect').value;
    const category = document.getElementById('categorySelect').value;
    selectedQuestions = getModeQuestions(selectedMode, category);
    if (!selectedQuestions.length) {
        showNotice('Não há perguntas para esta combinação de modo, categoria e dificuldade. Escolha outra opção.', 'error');
        return;
    }

    const configuredLives = Number(document.getElementById('livesSelect').value);
    lives = Number.isInteger(configuredLives) && configuredLives > 0 ? configuredLives : 3;
    QUESTIONS = selectedQuestions.map(prepareQuestion);
    currentQuestion = 0;
    currentStreak = 0;
    usedHelps = new Set();
    questionLocked = false;
    startedAt = Date.now();
    questionStartedAt = startedAt;
    timeRemaining = 60;
    currentQuizResult = new QuizResult(user.id);
    currentQuizResult.mode = selectedMode;
    currentQuizResult.difficulty = selectedDifficulty;
    currentQuizResult.category = category === 'all' ? 'Todas' : category;
    currentQuizResult.lives = lives;
    document.getElementById('modeName').textContent = MODE_LABELS[selectedMode];
    document.getElementById('quizUserName').textContent = user.username;
    document.getElementById('championshipRound').classList.toggle('hidden', selectedMode !== 'championship');
    document.getElementById('scoreLive').textContent = '0';
    document.getElementById('streakLive').textContent = '0';
    document.getElementById('lifeCount').textContent = lives;
    document.getElementById('timerCard').classList.toggle('hidden', selectedMode !== 'time');
    document.getElementById('lifeCard').classList.toggle('hidden', selectedMode !== 'survival');
    document.getElementById('helpStatus').textContent = 'Cada ajuda pode ser usada uma vez por partida.';
    showScreen('quizScreen');
    loadQuestion(currentQuestion);

    if (selectedMode === 'time') {
        document.getElementById('timerValue').textContent = timeRemaining;
        timerInterval = window.setInterval(() => {
            timeRemaining -= 1;
            document.getElementById('timerValue').textContent = timeRemaining;
            if (timeRemaining <= 0) finishQuiz('O tempo acabou!');
        }, 1000);
    }
}

function loadQuestion(index) {
    questionLocked = false;
    const question = QUESTIONS[index];
    questionStartedAt = Date.now();
    const progress = Math.round(index / QUESTIONS.length * 100);
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('questionNumber').textContent = `${index + 1}`;
    document.getElementById('totalQuestions').textContent = `${QUESTIONS.length}`;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('categoryBadge').textContent = question.category;
    document.getElementById('difficultyBadge').textContent = DIFFICULTY_LABELS[question.difficulty];
    document.getElementById('feedbackPanel').classList.add('hidden');
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('nextBtn').textContent = index === QUESTIONS.length - 1 ? 'Ver resultado' : 'Próxima pergunta';
    document.getElementById('nextBtn').setAttribute('aria-label', index === QUESTIONS.length - 1 ? 'Ver resultado da partida' : 'Avançar para a próxima pergunta');
    const options = document.getElementById('optionsContainer');
    options.replaceChildren();
    question.options.forEach((option, optionIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-btn';
        button.textContent = option;
        button.dataset.optionIndex = String(optionIndex);
        button.addEventListener('click', () => selectOption(optionIndex));
        options.appendChild(button);
    });
    document.getElementById('streakLive').textContent = `${currentStreak}`;
    document.getElementById('liveQuestionCount').textContent = `${index + 1} / ${QUESTIONS.length}`;
    updateQuestionCounts();
    document.querySelector('.progress-bar').setAttribute('aria-valuenow', String(progress));
    if (selectedMode === 'championship') {
        const rounds = ['Oitavas de final', 'Quartas de final', 'Semifinal', 'Final'];
        const roundIndex = Math.min(Math.floor(index / 3), rounds.length - 1);
        document.getElementById('championshipRound').textContent = `Rodada ${roundIndex + 1} de 4 · ${rounds[roundIndex]}`;
        document.getElementById('championshipRound').classList.remove('hidden');
    }
    document.getElementById('questionText').focus({ preventScroll: true });
    updateHelpButtons();
}

function selectOption(optionIndex) {
    if (questionLocked) return;
    questionLocked = true;
    const question = QUESTIONS[currentQuestion];
    const isCorrect = optionIndex === question.correct;
    const elapsedSeconds = Math.max(0, (Date.now() - questionStartedAt) / 1000);
    let earnedPoints = 0;

    if (isCorrect) {
        currentStreak += 1;
        const streakBonus = Math.min(Math.floor(currentStreak / 3) * 25, 100);
        const speedBonus = Math.max(0, Math.round(50 - elapsedSeconds * 5));
        earnedPoints = 100 + streakBonus + speedBonus;
        document.getElementById('scoreLive').textContent = `${currentQuizResult.score + earnedPoints}`;
        document.getElementById('streakLive').textContent = `${currentStreak}`;
    } else {
        currentStreak = 0;
        document.getElementById('streakLive').textContent = '0';
        if (selectedMode === 'survival') {
            lives -= 1;
            document.getElementById('lifeCount').textContent = `${lives}`;
        }
    }
    currentQuizResult.bestStreak = Math.max(currentQuizResult.bestStreak, currentStreak);
    currentQuizResult.addAnswer(question, optionIndex, earnedPoints);

    document.querySelectorAll('.option-btn').forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) button.classList.add('correct');
        else if (index === optionIndex) button.classList.add('incorrect');
    });
    showFeedback(isCorrect, question, earnedPoints);
    document.getElementById('nextBtn').disabled = false;

    if (selectedMode === 'survival' && lives <= 0) {
        document.getElementById('nextBtn').textContent = 'Ver resultado';
        document.getElementById('nextBtn').dataset.finish = 'true';
    } else {
        delete document.getElementById('nextBtn').dataset.finish;
    }
    updateQuestionCounts();
}

function updateQuestionCounts() {
    const answered = currentQuizResult ? currentQuizResult.answers.length : 0;
    document.getElementById('liveQuestionCount').textContent =
        `Respondidas ${answered} · Restam ${Math.max(QUESTIONS.length - answered, 0)}`;
}

function showFeedback(isCorrect, question, points, skipped = false) {
    const panel = document.getElementById('feedbackPanel');
    panel.className = `feedback-panel ${skipped ? 'feedback-neutral' : isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
    document.getElementById('feedbackTitle').textContent = skipped
        ? 'Pergunta pulada'
        : isCorrect ? `Resposta certa! +${points} pontos` : 'Não foi dessa vez';
    document.getElementById('feedbackAnswer').textContent = `Resposta correta: ${question.options[question.correct]}.`;
    document.getElementById('feedbackExplanation').textContent = question.explanation;
    document.getElementById('feedbackSource').textContent = question.source ? `Referência: ${question.source}` : '';
    panel.classList.remove('hidden');
}

function nextQuestion() {
    if (document.getElementById('nextBtn').dataset.finish === 'true') {
        finishQuiz('As vidas acabaram!');
        return;
    }
    if (currentQuestion < QUESTIONS.length - 1) {
        currentQuestion += 1;
        loadQuestion(currentQuestion);
        return;
    }
    finishQuiz();
}

function previousQuestion() {
    if (currentQuestion > 0 && !questionLocked) {
        currentQuestion -= 1;
        loadQuestion(currentQuestion);
    }
}

function useHelp(kind) {
    if (usedHelps.has(kind) || questionLocked) return;
    const question = QUESTIONS[currentQuestion];
    if (kind === 'fifty') {
        const incorrectButtons = Array.from(document.querySelectorAll('.option-btn'))
            .filter(button => Number(button.dataset.optionIndex) !== question.correct);
        shuffle(incorrectButtons).slice(0, 2).forEach(button => {
            button.disabled = true;
            button.classList.add('option-eliminated');
        });
    } else if (kind === 'hint') {
        document.getElementById('helpStatus').textContent = `Pista: ${question.hint}`;
        document.getElementById('helpStatus').classList.add('help-hint');
    } else if (kind === 'skip') {
        usedHelps.add(kind);
        currentQuizResult.addAnswer(question, -1, 0, true);
        updateQuestionCounts();
        showFeedback(false, question, 0, true);
        document.querySelectorAll('.option-btn').forEach(button => { button.disabled = true; });
        questionLocked = true;
        document.getElementById('nextBtn').disabled = false;
        updateHelpButtons();
        return;
    }
    usedHelps.add(kind);
    updateHelpButtons();
}

function updateHelpButtons() {
    const mapping = { fifty: 'helpFifty', skip: 'helpSkip', hint: 'helpHint' };
    Object.entries(mapping).forEach(([key, id]) => {
        const button = document.getElementById(id);
        button.disabled = usedHelps.has(key) || questionLocked;
        button.setAttribute('aria-disabled', button.disabled ? 'true' : 'false');
    });
}

function finishQuiz(reason = '') {
    if (timerInterval) {
        window.clearInterval(timerInterval);
        timerInterval = null;
    }
    if (!currentQuizResult || currentQuizResult.answers.length === 0) {
        showScreen('levelScreen');
        showNotice('A partida terminou sem respostas e não foi salva.', 'info');
        return;
    }
    currentQuizResult.completedAt = new Date().toISOString();
    currentQuizResult.timeUsed = Math.round((Date.now() - startedAt) / 1000);
    currentQuizResult.totalQuestions = Math.max(currentQuizResult.answers.length, 1);
    currentQuizResult.calculateScore();
    currentQuizResult.endedEarly = currentQuestion < QUESTIONS.length - 1;
    const previousModeResults = db.getCurrentUser().quizzes
        .filter(quiz => quiz.mode === currentQuizResult.mode);
    const previousBest = previousModeResults
        .reduce((best, quiz) => Math.max(best, Number(quiz.score || 0)), 0);
    currentQuizResult.isRecord = previousModeResults.length === 0 || currentQuizResult.score > previousBest;
    const user = db.getCurrentUser();
    if (!Array.isArray(user.achievements)) user.achievements = [];
    const awarded = [
        { id: 'first-goal', title: '⚽ Primeiro gol', earned: currentQuizResult.correctAnswers > 0 },
        { id: 'perfect-match', title: '🏆 Partida perfeita', earned: currentQuizResult.getPercentage() === 100 },
        { id: 'five-streak', title: '🔥 Sequência de 5', earned: currentQuizResult.bestStreak >= 5 },
        { id: 'daily-challenge', title: '📅 Desafio diário', earned: currentQuizResult.mode === 'daily' },
        {
            id: 'survivor',
            title: '🛡️ Muralha',
            earned: currentQuizResult.mode === 'survival'
                && currentQuizResult.answers.every(answer => answer.isCorrect && !answer.skipped)
        }
    ];
    currentQuizResult.newAchievements = awarded
        .filter(achievement => achievement.earned && !user.achievements.some(existing => existing.id === achievement.id))
        .map(({ id, title }) => ({ id, title }));
    user.achievements.push(...currentQuizResult.newAchievements);
    const saved = db.saveQuizResult(currentQuizResult);
    if (!saved.success) {
        user.achievements = user.achievements.filter(achievement =>
            !currentQuizResult.newAchievements.some(newAchievement => newAchievement.id === achievement.id));
        showNotice(saved.message, 'error');
        return;
    }
    showResults(reason);
}

function showResults(reason = '') {
    const result = currentQuizResult;
    const answered = result.answers.length;
    const correct = result.correctAnswers;
    const incorrect = result.answers.filter(answer => !answer.isCorrect && !answer.skipped).length;
    const percentage = answered ? Math.round(correct / answered * 100) : 0;
    const categoryScores = {};
    result.answers.filter(answer => answer.isCorrect).forEach(answer => {
        categoryScores[answer.category] = (categoryScores[answer.category] || 0) + 1;
    });
    const bestCategory = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0];
    const review = document.getElementById('detailsList');
    review.replaceChildren();
    result.answers.forEach((answer, index) => {
        const item = document.createElement('article');
        item.className = `detail-item ${answer.isCorrect ? 'correct' : answer.skipped ? 'skipped' : 'incorrect'}`;
        const question = document.createElement('h3');
        question.textContent = `${index + 1}. ${answer.question}`;
        const response = document.createElement('p');
        response.textContent = `${answer.skipped ? 'Pulou' : `Sua resposta: ${answer.selectedText}`} · ${answer.isCorrect ? 'Acertou' : `Correta: ${answer.correctText}`}`;
        const explanation = document.createElement('p');
        explanation.textContent = answer.explanation || '';
        item.append(question, response, explanation);
            if (answer.source) {
                const source = document.createElement('small');
                source.className = 'source-citation';
                source.textContent = `Referência: ${answer.source}`;
                item.appendChild(source);
            }
            review.appendChild(item);
    });

    document.getElementById('userResultName').textContent = `Partida de ${db.getCurrentUser().username} · ${MODE_LABELS[result.mode]}`;
    document.getElementById('scoreValue').textContent = `${result.score}`;
    document.getElementById('scorePercentage').textContent = `${percentage}% de acertos`;
    document.getElementById('resultRecord').textContent = result.isRecord ? '✨ Novo recorde pessoal neste modo!' : 'Seu melhor resultado neste modo continua salvo.';
    document.getElementById('resultCorrect').textContent = `${correct}`;
    document.getElementById('resultIncorrect').textContent = `${incorrect}`;
    document.getElementById('resultTime').textContent = formatDuration(result.timeUsed);
    document.getElementById('resultStreak').textContent = `${result.bestStreak}`;
    document.getElementById('resultCategory').textContent = bestCategory ? bestCategory[0] : 'Ainda sem acertos';
    document.getElementById('resultMessage').textContent = reason || resultMessage(percentage);
    const earned = result.newAchievements || [];
    document.getElementById('achievements').textContent = earned.length
        ? `Conquista desbloqueada: ${earned.map(achievement => achievement.title).join(' · ')}`
        : `${(db.getCurrentUser().achievements || []).length} conquista(s) desbloqueada(s). Continue jogando para ganhar mais.`;
    showScreen('resultsScreen');
}

function resultMessage(percentage) {
    if (percentage === 100) return 'Perfeito! Uma atuação de campeão.';
    if (percentage >= 80) return 'Excelente! Você conhece muito de futebol.';
    if (percentage >= 60) return 'Bom jogo! Mais algumas rodadas e você chega ao topo.';
    if (percentage >= 40) return 'Boa tentativa. As explicações ajudam a aprender a cada rodada.';
    return 'O próximo jogo é uma nova chance. Continue treinando!';
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${String(remaining).padStart(2, '0')}`;
}

function retakeQuiz() {
    showLevelSelection();
}

function returnToMenu() {
    if (timerInterval) {
        window.clearInterval(timerInterval);
        timerInterval = null;
    }
    showScreen('levelScreen');
}

function viewProfile() {
    const user = db.getCurrentUser();
    if (!user) {
        showScreen('loginScreen');
        return;
    }
    const stats = user.getStatistics();
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileTotalQuizzes').textContent = `${stats.totalQuizzes}`;
    document.getElementById('profileBestScore').textContent = `${stats.bestScore} pts`;
    document.getElementById('profileAverageScore').textContent = `${stats.percentage}%`;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('profileEditSection').classList.add('hidden');
    const history = document.getElementById('quizHistoryList');
    history.replaceChildren();
    if (!user.quizzes.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-message';
        empty.textContent = 'Você ainda não concluiu uma partida.';
        history.appendChild(empty);
    } else {
        user.quizzes.slice().reverse().forEach((quiz, index) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            const details = document.createElement('span');
            details.textContent = `${MODE_LABELS[quiz.mode] || 'Quiz'} · ${db.getFormattedDate(quiz.completedAt)}`;
            const score = document.createElement('strong');
            score.textContent = `${quiz.score} pts · ${quiz.getPercentage()}%`;
            item.append(details, score);
            history.appendChild(item);
        });
    }
    const achievements = document.getElementById('profileAchievements');
    achievements.replaceChildren();
    if (!user.achievements || user.achievements.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-message';
        empty.textContent = 'Ainda não há conquistas. Acerte, mantenha sequências e complete desafios!';
        achievements.appendChild(empty);
    } else {
        user.achievements.forEach(achievement => {
            const badge = document.createElement('span');
            badge.className = 'achievement-badge';
            badge.textContent = achievement.title;
            achievements.appendChild(badge);
        });
    }
    const currentScreen = document.querySelector('.screen.active');
    lastScreenBeforeRanking = currentScreen ? currentScreen.id : 'welcomeScreen';
    showScreen('profileScreen');
}

function showProfileEditor() {
    document.getElementById('profileEditSection').classList.remove('hidden');
}

function cancelProfileEdit() {
    document.getElementById('profileEditSection').classList.add('hidden');
}

function saveProfileEdits() {
    const user = db.getCurrentUser();
    const result = db.updateUser(user.id, document.getElementById('editUsername').value, document.getElementById('editEmail').value);
    if (!result.success) {
        showNotice(result.message, 'error');
        return;
    }
    document.getElementById('profileUsername').textContent = result.user.username;
    document.getElementById('profileEmail').textContent = result.user.email;
    showNotice('Perfil atualizado.', 'success');
    cancelProfileEdit();
    updateUsersList();
}

function confirmDeleteUser() {
    const user = db.getCurrentUser();
    if (!user || !window.confirm(`Excluir o perfil de ${user.username} e o histórico salvo neste navegador?`)) return;
    const deleted = db.deleteCurrentUser();
    if (!deleted.success) {
        showNotice(deleted.message, 'error');
        return;
    }
    updateUsersList();
    showScreen('welcomeScreen');
}

function backToResults() {
    showScreen(lastScreenBeforeRanking === 'resultsScreen' ? 'resultsScreen' : 'levelScreen');
}

function logout() {
    if (timerInterval) {
        window.clearInterval(timerInterval);
        timerInterval = null;
    }
    db.logoutUser();
    currentQuizResult = null;
    selectedDifficulty = 'aleatorio';
    showScreen('welcomeScreen');
    updateUsersList();
}

function showNotice(message, type = 'info') {
    const notice = document.getElementById('appNotice');
    if (!notice) {
        window.alert(message);
        return;
    }
    notice.textContent = message;
    notice.className = `app-notice notice-${type}`;
    notice.classList.remove('hidden');
    window.clearTimeout(showNotice.timeout);
    showNotice.timeout = window.setTimeout(() => notice.classList.add('hidden'), 5000);
}

function openProfile() {
    viewProfile();
}

function goBackToLevel() {
    showScreen('levelScreen');
}

function nextQuestionKey(event) {
    if (event.key === 'Enter' && document.getElementById('nextBtn') === document.activeElement) nextQuestion();
}

document.addEventListener('keydown', nextQuestionKey);
