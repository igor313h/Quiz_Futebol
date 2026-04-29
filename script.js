// ===== VARIÁVEIS GLOBAIS =====
let currentQuestion = 0;
let currentQuizResult = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function () {
    updateUsersList();
});

// ===== LOGIN FUNCTIONS =====
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!username || !email) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    // Tenta fazer login ou criar novo usuário
    let result = db.loginUser(email, username);
    
    if (!result.success) {
        // Usuario não existe, cria novo
        result = db.createUser(username, email);
        if (!result.success) {
            alert(result.message);
            return;
        }
    }

    // Login bem-sucedido
    startQuiz();
}

function updateUsersList() {
    const usersList = document.getElementById('usersList');
    const users = db.getAllUsers();

    if (users.length === 0) {
        usersList.innerHTML = '<p style="color: #999; font-size: 0.9em;">Nenhum usuário cadastrado ainda</p>';
        return;
    }

    usersList.innerHTML = users.map(user => 
        `<span class="user-tag" onclick="quickLogin('${user.email}')">${user.username}</span>`
    ).join('');
}

function quickLogin(email) {
    const result = db.loginUser(email);
    if (result.success) {
        startQuiz();
    }
}

// ===== QUIZ FUNCTIONS =====
function startQuiz() {
    const user = db.getCurrentUser();
    document.getElementById('currentUser').textContent = `Olá, ${user.username}!`;
    
    // Reseta o quiz
    currentQuestion = 0;
    currentQuizResult = new QuizResult(user.id);
    
    // Muda para tela do quiz
    switchScreen('quizScreen');
    loadQuestion(currentQuestion);
}

function loadQuestion(questionIndex) {
    const question = QUESTIONS[questionIndex];
    
    // Atualiza progress bar
    const progress = ((questionIndex + 1) / QUESTIONS.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Atualiza número da pergunta
    document.getElementById('questionNumber').textContent = questionIndex + 1;
    document.getElementById('totalQuestions').textContent = QUESTIONS.length;
    
    // Atualiza o texto da pergunta
    document.getElementById('questionText').textContent = question.question;
    
    // Carrega as opções
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => selectOption(index, questionIndex);
        
        // Se já tem resposta, marca como selecionada
        const existingAnswer = currentQuizResult.answers.find(a => a.questionId === question.id);
        if (existingAnswer && existingAnswer.selectedOption === index) {
            button.classList.add('selected');
        }
        
        optionsContainer.appendChild(button);
    });
    
    // Atualiza botões de navegação
    updateNavigationButtons();
}

function selectOption(optionIndex, questionIndex) {
    const question = QUESTIONS[questionIndex];
    
    // Substitui respostas anteriores para esta pergunta e ajusta o contador de acertos
    const existingAnswerIndex = currentQuizResult.answers.findIndex(a => a.questionId === question.id);
    if (existingAnswerIndex > -1) {
        const existingAnswer = currentQuizResult.answers[existingAnswerIndex];
        if (existingAnswer.isCorrect) {
            currentQuizResult.correctAnswers = Math.max(0, currentQuizResult.correctAnswers - 1);
        }
        currentQuizResult.answers.splice(existingAnswerIndex, 1);
    }
    
    // Adiciona a nova resposta
    currentQuizResult.addAnswer(question.id, optionIndex);
    
    // Recarrega as opções para mostrar a seleção
    const optionsContainer = document.getElementById('optionsContainer');
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((btn, index) => {
        btn.classList.remove('selected');
        if (index === optionIndex) {
            btn.classList.add('selected');
        }
    });
}

function nextQuestion() {
    if (currentQuestion < QUESTIONS.length - 1) {
        currentQuestion++;
        loadQuestion(currentQuestion);
    } else {
        finishQuiz();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion(currentQuestion);
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Mostra/oculta botão anterior
    prevBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
    
    // Atualiza texto do botão próximo
    if (currentQuestion === QUESTIONS.length - 1) {
        nextBtn.textContent = 'Finalizar Quiz ✓';
    } else {
        nextBtn.textContent = 'Próxima →';
    }
}

function finishQuiz() {
    const answeredIds = Array.from(new Set(currentQuizResult.answers.map(answer => answer.questionId)));

    if (answeredIds.length < QUESTIONS.length) {
        const pendentes = QUESTIONS.length - answeredIds.length;
        alert(`Você ainda tem ${pendentes} pergunta(s) sem responder. Vou levar você para a próxima pergunta pendente.`);
        goToFirstUnansweredQuestion();
        return;
    }

    // Atualiza o horário de término antes de salvar
    currentQuizResult.completedAt = new Date().toISOString();

    // Normaliza respostas e calcula o score
    currentQuizResult.calculateScore();
    
    // Salva o resultado e verifica retorno
    const saveResult = db.saveQuizResult(currentQuizResult);
    if (!saveResult.success) {
        alert(saveResult.message);
        return;
    }
    
    // Mostra resultados
    showResults();
}

function goToFirstUnansweredQuestion() {
    const answeredIds = currentQuizResult.answers.map(answer => answer.questionId);
    const firstUnanswered = QUESTIONS.findIndex(question => !answeredIds.includes(question.id));
    if (firstUnanswered >= 0) {
        currentQuestion = firstUnanswered;
        loadQuestion(currentQuestion);
    }
}

// ===== RESULTS FUNCTIONS =====
function showResults() {
    const user = db.getCurrentUser();
    const percentage = currentQuizResult.getPercentage();
    
    // Preenche dados dos resultados
    document.getElementById('userResultName').textContent = `Resultado de ${user.username}`;
    document.getElementById('scoreValue').textContent = currentQuizResult.score;
    document.getElementById('scorePercentage').textContent = `${percentage}%`;
    
    // Mensagem personalizada
    let message = '';
    if (percentage === 100) {
        message = '🎉 Perfeito! Você é um verdadeiro expert em futebol!';
    } else if (percentage >= 80) {
        message = '✅ Excelente! Você tem um grande conhecimento sobre futebol!';
    } else if (percentage >= 60) {
        message = '👍 Bom! Você conhece bem sobre futebol!';
    } else if (percentage >= 40) {
        message = '📚 Pode melhorar. Continue estudando sobre futebol!';
    } else {
        message = '💪 Continue praticando e aprendendo mais sobre futebol!';
    }
    
    document.getElementById('resultMessage').textContent = message;
    
    // Detalhes das respostas
    const detailsList = document.getElementById('detailsList');
    detailsList.innerHTML = '';
    
    currentQuizResult.answers.forEach((answer, index) => {
        const detailItem = document.createElement('div');
        detailItem.className = `detail-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'detail-question';
        questionDiv.textContent = `${index + 1}. ${answer.question}`;
        
        const answerDiv = document.createElement('div');
        answerDiv.className = 'detail-answer';
        answerDiv.innerHTML = `
            <strong>Sua resposta:</strong> ${answer.selectedText} ${answer.isCorrect ? '✓' : '✗'}<br>
            ${!answer.isCorrect ? `<strong>Resposta correta:</strong> ${answer.correctText}` : ''}
        `;
        
        detailItem.appendChild(questionDiv);
        detailItem.appendChild(answerDiv);
        detailsList.appendChild(detailItem);
    });
    
    // Muda para tela de resultados
    switchScreen('resultsScreen');
}

function retakeQuiz() {
    startQuiz();
}

// ===== PROFILE FUNCTIONS =====
function viewProfile() {
    const user = db.getCurrentUser();
    const stats = db.getCurrentUserStats();
    
    // Preenche dados do perfil
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileTotalQuizzes').textContent = stats.totalQuizzes;
    document.getElementById('profileBestScore').textContent = stats.bestScore + '/10';
    document.getElementById('profileAverageScore').textContent = stats.averageScore + '/10';
    
    // Preenche campos de edição
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('profileEditSection').classList.add('hidden');
    
    // Histórico de quizzes
    const historyList = document.getElementById('quizHistoryList');
    historyList.innerHTML = '';
    
    if (user.quizzes.length === 0) {
        historyList.innerHTML = '<div class="empty-message">Você ainda não completou nenhum quiz</div>';
    } else {
        user.quizzes.forEach((quiz, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span>
                    <strong>Quiz ${index + 1}</strong><br>
                    <span class="history-date">${db.getFormattedDate(quiz.completedAt)}</span>
                </span>
                <span class="history-score">${quiz.score}/10 (${quiz.getPercentage()}%)</span>
            `;
            historyList.appendChild(historyItem);
        });
    }
    
    switchScreen('profileScreen');
}

function showProfileEditor() {
    const user = db.getCurrentUser();
    if (!user) return;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('profileEditSection').classList.remove('hidden');
}

function cancelProfileEdit() {
    document.getElementById('profileEditSection').classList.add('hidden');
}

function saveProfileEdits() {
    const username = document.getElementById('editUsername').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const user = db.getCurrentUser();

    if (!username || !email) {
        alert('Por favor, preencha todos os campos para atualizar o perfil.');
        return;
    }

    const result = db.updateUser(user.id, username, email);
    if (!result.success) {
        alert(result.message);
        return;
    }

    document.getElementById('profileUsername').textContent = username;
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('currentUser').textContent = `Olá, ${username}!`;
    document.getElementById('profileEditSection').classList.add('hidden');
    updateUsersList();
    alert('Dados atualizados com sucesso!');
}

function confirmDeleteUser() {
    const user = db.getCurrentUser();
    if (!user) {
        alert('Nenhum usuário logado para excluir.');
        return;
    }

    const confirmDelete = confirm(`Tem certeza que deseja excluir sua conta, ${user.username}? Esta ação não pode ser desfeita.`);
    if (!confirmDelete) {
        return;
    }

    const result = db.deleteCurrentUser();
    if (!result.success) {
        alert(result.message);
        return;
    }

    alert('Conta excluída com sucesso. Você será redirecionado à tela de login.');
    logout();
}

function backToResults() {
    switchScreen('resultsScreen');
}

// ===== NAV FUNCTIONS =====
function logout() {
    db.logoutUser();
    currentQuestion = 0;
    currentQuizResult = null;
    
    // Limpa o formulário de login
    document.getElementById('loginForm').reset();
    document.getElementById('username').focus();
    
    // Volta para tela de login
    switchScreen('loginScreen');
    updateUsersList();
}

function switchScreen(screenId) {
    // Esconde todas as telas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Mostra a tela selecionada
    document.getElementById(screenId).classList.add('active');
}

// ===== UTILITIES =====
// Adiciona método getPercentage ao QuizResult se não existir
if (!QuizResult.prototype.getPercentage) {
    QuizResult.prototype.getPercentage = function() {
        return Math.round((this.correctAnswers / 10) * 100);
    };
}
