// ===== SCHEMA DE DADOS =====
// Estrutura de armazenamento de usuários e quizzes

const QUESTIONS = [
    {
        id: 1,
        question: "Qual seleção venceu a Copa do Mundo de 2022?",
        options: [
            "Brasil",
            "Argentina",
            "França",
            "Alemanha"
        ],
        correct: 1,
        explanation: "A Argentina conquistou a Copa do Mundo de 2022 no Qatar, com uma vitória emocionante sobre a França."
    },
    {
        id: 2,
        question: "Em que ano a primeira Copa do Mundo foi realizada?",
        options: [
            "1920",
            "1930",
            "1940",
            "1950"
        ],
        correct: 1,
        explanation: "A primeira Copa do Mundo foi realizada em 1930 no Uruguai."
    },
    {
        id: 3,
        question: "Qual jogador é considerado a GOAT do futebol (segundo a maioria)?",
        options: [
            "Pelé",
            "Maradona",
            "Cristiano Ronaldo",
            "Lionel Messi"
        ],
        correct: 3,
        explanation: "Lionel Messi é amplamente considerado um dos maiores jogadores de todos os tempos, tendo conquistado 8 prêmios Ballon d'Or."
    },
    {
        id: 4,
        question: "Quantos gols Pelé marcou em sua carreira segundo registros oficiais?",
        options: [
            "757 gols",
            "812 gols",
            "650 gols",
            "900+ gols"
        ],
        correct: 0,
        explanation: "Pelé marcou aproximadamente 757 gols em sua carreira oficial, sendo um dos maiores artilheiros da história."
    },
    {
        id: 5,
        question: "Qual país ganhou mais Copas do Mundo?",
        options: [
            "Alemanha",
            "Brasil",
            "Itália",
            "França"
        ],
        correct: 1,
        explanation: "Brasil é o país com mais títulos de Copa do Mundo, tendo vencido 5 vezes (1958, 1962, 1970, 1994, 2002)."
    },
    {
        id: 6,
        question: "Em que ano Ronaldinho Gaúcho jogava pelo Barcelona?",
        options: [
            "2000-2003",
            "2003-2008",
            "2005-2010",
            "2001-2006"
        ],
        correct: 1,
        explanation: "Ronaldinho Gaúcho jogou pelo Barcelona de 2003 a 2008, sendo um dos períodos mais brilhantes de sua carreira."
    },
    {
        id: 7,
        question: "Qual é o time com mais títulos de Champions League?",
        options: [
            "Barcelona",
            "Bayern de Munique",
            "Real Madrid",
            "AC Milan"
        ],
        correct: 2,
        explanation: "Real Madrid é o clube com mais títulos de Champions League, tendo conquistado 15 títulos até agora."
    },
    {
        id: 8,
        question: "Quantos países participam normalmente de uma Copa do Mundo?",
        options: [
            "24 países",
            "30 países",
            "32 países",
            "48 países"
        ],
        correct: 2,
        explanation: "Tradicionalmente 32 países participam da Copa do Mundo, divididos em 8 grupos de 4 times cada. A partir de 2026, será 48 times."
    },
    {
        id: 9,
        question: "Qual foi o melhor amigo e parceiro de ataque de Neymar na época em que jogava pelo Barcelona?",
        options: [
            "Suárez",
            "Griezmann",
            "Messi",
            "Coutinho"
        ],
        correct: 2,
        explanation: "Neymar jogou com Messi no Barcelona, e ambos fizeram parte de um grande time durante esse período (Neymar estava lá de 2013-2017)."
    },
    {
        id: 10,
        question: "Qual seleção venceu a primeira Euro (Campeonato Europeu)?",
        options: [
            "Alemanha",
            "França",
            "União Soviética",
            "Itália"
        ],
        correct: 2,
        explanation: "A União Soviética venceu a primeira Euro em 1960, na qual Nikita Simonian marcou um dos gols mais importantes."
    }
];

// ===== SCHEMA DO USUÁRIO =====
class User {
    constructor(username, email) {
        this.id = Date.now();
        this.username = username.trim();
        this.email = User.normalizeEmail(email);
        this.createdAt = new Date().toISOString();
        this.quizzes = [];
    }

    static normalizeEmail(email) {
        return String(email || '').trim().toLowerCase();
    }

    addQuiz(quizResult) {
        this.quizzes.push(quizResult);
    }

    getTotalScore() {
        if (this.quizzes.length === 0) return 0;
        const sum = this.quizzes.reduce((acc, quiz) => acc + quiz.score, 0);
        return Math.round(sum / this.quizzes.length);
    }

    getBestScore() {
        if (this.quizzes.length === 0) return 0;
        return Math.max(...this.quizzes.map(quiz => quiz.score));
    }

    getStatistics() {
        return {
            totalQuizzes: this.quizzes.length,
            bestScore: this.getBestScore(),
            averageScore: this.getTotalScore(),
            totalCorrect: this.quizzes.reduce((sum, quiz) => sum + quiz.correctAnswers, 0),
            totalQuestions: this.quizzes.length * 10
        };
    }
}

// ===== SCHEMA DO RESULTADO DO QUIZ =====
class QuizResult {
    constructor(userId) {
        this.id = Date.now();
        this.userId = userId;
        this.completedAt = new Date().toISOString();
        this.answers = []; // Array com as respostas do usuário
        this.score = 0;
        this.correctAnswers = 0;
    }

    addAnswer(questionId, selectedOptionIndex) {
        const question = QUESTIONS.find(q => q.id === questionId);
        const isCorrect = selectedOptionIndex === question.correct;
        
        this.answers.push({
            questionId,
            selectedOption: selectedOptionIndex,
            selectedText: question.options[selectedOptionIndex],
            correctOption: question.correct,
            correctText: question.options[question.correct],
            isCorrect,
            question: question.question
        });
    }

    calculateScore() {
        const uniqueAnswers = [];
        const seenQuestions = new Set();

        for (let i = 0; i < this.answers.length; i++) {
            const answer = this.answers[i];
            if (!seenQuestions.has(answer.questionId)) {
                seenQuestions.add(answer.questionId);
                uniqueAnswers.push(answer);
            }
        }

        this.answers = uniqueAnswers;
        this.correctAnswers = this.answers.reduce((sum, answer) => sum + (answer.isCorrect ? 1 : 0), 0);
        this.score = this.correctAnswers;
        return this.score;
    }

    getPercentage() {
        return Math.round((this.correctAnswers / 10) * 100);
    }
}

// ===== DATABASE COM LOCAL STORAGE =====
class Database {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = null;
    }

    loadUsers() {
        const data = localStorage.getItem('quiz_users');
        if (!data) return [];
        
        const parsedData = JSON.parse(data);
        
        // Mapeia os objetos puros de volta para instâncias das classes User e QuizResult
        return parsedData.map(userData => {
            // Recria a instância do usuário para recuperar os métodos (ex: addQuiz, getStatistics)
            const user = new User(userData.username, userData.email);
            user.id = userData.id;
            user.createdAt = userData.createdAt;
            
            // Recria as instâncias dos quizzes salvos no histórico
            if (userData.quizzes) {
                user.quizzes = userData.quizzes.map(quizData => {
                    const quiz = new QuizResult(user.id);
                    Object.assign(quiz, quizData);
                    return quiz;
                });
            }
            
            return user;
        });
    }

    saveUsers() {
        localStorage.setItem('quiz_users', JSON.stringify(this.users));
    }

    createUser(username, email) {
        const existingUser = this.getUserByEmail(email);
        if (existingUser) {
            return { success: false, message: 'Usuário com este email já existe', user: null };
        }

        const newUser = new User(username, email);
        this.users.push(newUser);
        this.saveUsers();
        this.currentUser = newUser;
        return { success: true, message: 'Usuário criado com sucesso', user: newUser };
    }

    getUserByEmail(email) {
        const normalizedEmail = User.normalizeEmail(email);
        return this.users.find(u => User.normalizeEmail(u.email) === normalizedEmail);
    }

    getUserByUsername(username) {
        const normalizedName = String(username || '').trim().toLowerCase();
        return this.users.find(u => String(u.username || '').trim().toLowerCase() === normalizedName);
    }

    loginUser(email, username = '') {
        const user = this.getUserByEmail(email) || this.getUserByUsername(username);
        if (!user) {
            return { success: false, message: 'Usuário não encontrado', user: null };
        }
        this.currentUser = user;
        return { success: true, message: 'Login realizado com sucesso', user };
    }

    // Quiz operations
    saveQuizResult(quizResult) {
        if (!this.currentUser) {
            return { success: false, message: 'Nenhum usuário logado' };
        }

        this.currentUser.addQuiz(quizResult);
        this.saveUsers();
        return { success: true, message: 'Quiz salvo com sucesso' };
    }

    getCurrentUserQuizzes() {
        if (!this.currentUser) return [];
        return this.currentUser.quizzes;
    }

    getCurrentUserStats() {
        if (!this.currentUser) return null;
        return this.currentUser.getStatistics();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    logoutUser() {
        this.currentUser = null;
    }

    updateUser(userId, username, email) {
        const user = this.users.find(u => u.id === userId);
        if (!user) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        const normalizedEmail = User.normalizeEmail(email);
        const emailExists = this.users.some(u => User.normalizeEmail(u.email) === normalizedEmail && u.id !== userId);
        if (emailExists) {
            return { success: false, message: 'Este email já está em uso por outro usuário' };
        }

        user.username = username.trim();
        user.email = normalizedEmail;
        this.saveUsers();

        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = user;
        }

        return { success: true, message: 'Dados atualizados com sucesso', user };
    }

    // Utility
    deleteUserById(userId) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        const deletedUser = this.users.splice(userIndex, 1)[0];
        this.saveUsers();

        if (this.currentUser && this.currentUser.id === deletedUser.id) {
            this.currentUser = null;
        }

        return { success: true, message: 'Usuário excluído com sucesso' };
    }

    deleteUser(email) {
        const normalizedEmail = User.normalizeEmail(email);
        this.users = this.users.filter(u => User.normalizeEmail(u.email) !== normalizedEmail);
        this.saveUsers();
    }

    deleteCurrentUser() {
        if (!this.currentUser) {
            return { success: false, message: 'Nenhum usuário logado' };
        }
        return this.deleteUserById(this.currentUser.id);
    }

    getFormattedDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Instância global do banco de dados
const db = new Database();
