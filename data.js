const DIFFICULTIES = ['facil', 'medio', 'dificil', 'especialista'];
const DIFFICULTY_LABELS = {
    facil: 'Fácil',
    medio: 'Médio',
    dificil: 'Difícil',
    especialista: 'Especialista'
};

const QUESTION_BANK = [];
const questionIds = new Set();
const questionTexts = new Set();

function addQuestion(question, answer, distractors, category, difficulty, explanation, hint, source) {
    const options = [answer, ...distractors.filter(option => option !== answer)].slice(0, 4);
    if (options.length !== 4 || new Set(options).size !== 4) {
        throw new Error(`Alternativas inválidas para a pergunta: ${question}`);
    }

    const normalizedText = question.trim().toLocaleLowerCase('pt-BR');
    const id = `q-${QUESTION_BANK.length + 1}`;
    if (questionIds.has(id) || questionTexts.has(normalizedText)) {
        throw new Error(`ID ou pergunta duplicada: ${id}`);
    }
    questionIds.add(id);
    questionTexts.add(normalizedText);
    QUESTION_BANK.push({
        id,
        question,
        options,
        correct: 0,
        category,
        difficulty,
        explanation,
        hint,
        source
    });
}

function uniqueAlternatives(answer, pool, seed) {
    const alternatives = [];
    for (let offset = 0; alternatives.length < 3 && offset < pool.length * 2; offset += 1) {
        const candidate = pool[(seed + offset) % pool.length];
        if (candidate !== answer && !alternatives.includes(candidate)) alternatives.push(candidate);
    }
    return alternatives;
}

const WORLD_CUP_TEAMS = [
    'Brasil', 'Argentina', 'Uruguai', 'França', 'Alemanha', 'Itália',
    'Inglaterra', 'Espanha', 'Países Baixos', 'Croácia', 'Suécia',
    'Hungria', 'Tchecoslováquia', 'República Tcheca', 'Áustria',
    'Chile', 'México', 'Portugal', 'Bélgica', 'Colômbia'
];

const MEN_WORLD_CUPS = [
    [1930, 'Uruguai', 'Uruguai', 'Argentina'],
    [1934, 'Itália', 'Itália', 'Tchecoslováquia'],
    [1938, 'França', 'Itália', 'Hungria'],
    [1950, 'Brasil', 'Uruguai', 'Brasil'],
    [1954, 'Suíça', 'Alemanha Ocidental', 'Hungria'],
    [1958, 'Suécia', 'Brasil', 'Suécia'],
    [1962, 'Chile', 'Brasil', 'Tchecoslováquia'],
    [1966, 'Inglaterra', 'Inglaterra', 'Alemanha Ocidental'],
    [1970, 'México', 'Brasil', 'Itália'],
    [1974, 'Alemanha Ocidental', 'Alemanha Ocidental', 'Países Baixos'],
    [1978, 'Argentina', 'Argentina', 'Países Baixos'],
    [1982, 'Espanha', 'Itália', 'Alemanha Ocidental'],
    [1986, 'México', 'Argentina', 'Alemanha Ocidental'],
    [1990, 'Itália', 'Alemanha Ocidental', 'Argentina'],
    [1994, 'Estados Unidos', 'Brasil', 'Itália'],
    [1998, 'França', 'França', 'Brasil'],
    [2002, 'Coreia do Sul e Japão', 'Brasil', 'Alemanha'],
    [2006, 'Alemanha', 'Itália', 'França'],
    [2010, 'África do Sul', 'Espanha', 'Países Baixos'],
    [2014, 'Brasil', 'Alemanha', 'Argentina'],
    [2018, 'Rússia', 'França', 'Croácia'],
    [2022, 'Catar', 'Argentina', 'França']
];

MEN_WORLD_CUPS.forEach(([year, host, champion, runnerUp], index) => {
    const winnerPool = [...new Set(WORLD_CUP_TEAMS.concat(champion === 'Alemanha Ocidental' ? ['Alemanha'] : []))];
    addQuestion(
        `Qual seleção conquistou a Copa do Mundo masculina de ${year}?`,
        champion,
        uniqueAlternatives(champion, winnerPool, index),
        'Copa do Mundo',
        DIFFICULTIES[index % 4],
        `${champion} venceu a edição de ${year}, disputada em ${host}.`,
        `A resposta está entre as seleções campeãs do torneio.`,
        'FIFA — arquivo histórico das Copas do Mundo'
    );
    addQuestion(
        `Em qual país ou países foi disputada a Copa do Mundo masculina de ${year}?`,
        host,
        uniqueAlternatives(host, [
            'Brasil', 'Itália', 'França', 'México', 'Alemanha', 'Argentina',
            'Suíça', 'Suécia', 'Inglaterra', 'Espanha', 'Estados Unidos',
            'Rússia', 'Catar', 'África do Sul', 'Japão'
        ], index + 3),
        'Copa do Mundo',
        DIFFICULTIES[(index + 1) % 4],
        `A edição de ${year} aconteceu em ${host}; ${champion} foi a campeã.`,
        `A edição aconteceu em ${year}.`,
        'FIFA — arquivo histórico das Copas do Mundo'
    );
    addQuestion(
        `Qual seleção terminou como vice-campeã da Copa do Mundo masculina de ${year}?`,
        runnerUp,
        uniqueAlternatives(runnerUp, WORLD_CUP_TEAMS, index + 7),
        'Copa do Mundo',
        DIFFICULTIES[(index + 2) % 4],
        `${runnerUp} foi vice-campeã; ${champion} conquistou o título.`,
        `A final colocou a campeã ${champion} contra sua adversária.`,
        'FIFA — arquivo histórico das Copas do Mundo'
    );
});

const WOMEN_WORLD_CUPS = [
    [1991, 'China', 'Estados Unidos', 'Noruega'],
    [1995, 'Suécia', 'Noruega', 'Alemanha'],
    [1999, 'Estados Unidos', 'Estados Unidos', 'China'],
    [2003, 'Estados Unidos', 'Alemanha', 'Suécia'],
    [2007, 'China', 'Alemanha', 'Brasil'],
    [2011, 'Alemanha', 'Japão', 'Estados Unidos'],
    [2015, 'Canadá', 'Estados Unidos', 'Japão'],
    [2019, 'França', 'Estados Unidos', 'Países Baixos'],
    [2023, 'Austrália e Nova Zelândia', 'Espanha', 'Inglaterra']
];
const WOMEN_TEAMS = [
    'Estados Unidos', 'Noruega', 'Alemanha', 'China', 'Brasil', 'Japão',
    'Suécia', 'Espanha', 'Inglaterra', 'França', 'Austrália', 'Canadá',
    'Países Baixos', 'Itália', 'Nigéria', 'Coreia do Sul'
];

WOMEN_WORLD_CUPS.forEach(([year, host, champion, runnerUp], index) => {
    addQuestion(
        `Quem venceu a Copa do Mundo Feminina de ${year}?`,
        champion,
        uniqueAlternatives(champion, WOMEN_TEAMS, index),
        'Futebol feminino',
        DIFFICULTIES[(index + 1) % 4],
        `${champion} foi campeã da edição de ${year}, sediada em ${host}.`,
        `A edição foi disputada em ${year}.`,
        'FIFA — arquivo da Copa do Mundo Feminina'
    );
    addQuestion(
        `Onde foi realizada a Copa do Mundo Feminina de ${year}?`,
        host,
        uniqueAlternatives(host, ['China', 'Suécia', 'Estados Unidos', 'Alemanha', 'Canadá', 'França', 'Austrália e Nova Zelândia'], index + 2),
        'Futebol feminino',
        DIFFICULTIES[(index + 2) % 4],
        `${host} recebeu a competição em ${year}; ${champion} venceu o torneio.`,
        `A resposta pode incluir dois países-sede.`,
        'FIFA — arquivo da Copa do Mundo Feminina'
    );
    addQuestion(
        `Qual seleção foi vice-campeã da Copa do Mundo Feminina de ${year}?`,
        runnerUp,
        uniqueAlternatives(runnerUp, WOMEN_TEAMS, index + 4),
        'Futebol feminino',
        DIFFICULTIES[(index + 3) % 4],
        `${runnerUp} ficou com o vice-campeonato diante da campeã ${champion}.`,
        `A seleção campeã foi ${champion}.`,
        'FIFA — arquivo da Copa do Mundo Feminina'
    );
});

const BRAZILIAN_CLUBS = [
    ['Flamengo', 'Maracanã', 'Rio de Janeiro', 'Rubro-Negro'],
    ['Corinthians', 'Neo Química Arena', 'São Paulo', 'Timão'],
    ['Palmeiras', 'Allianz Parque', 'São Paulo', 'Verdão'],
    ['São Paulo', 'Morumbi', 'São Paulo', 'Tricolor Paulista'],
    ['Santos', 'Vila Belmiro', 'Santos', 'Peixe'],
    ['Grêmio', 'Arena do Grêmio', 'Porto Alegre', 'Tricolor Gaúcho'],
    ['Internacional', 'Beira-Rio', 'Porto Alegre', 'Colorado'],
    ['Atlético Mineiro', 'Arena MRV', 'Belo Horizonte', 'Galo'],
    ['Cruzeiro', 'Mineirão', 'Belo Horizonte', 'Raposa'],
    ['Botafogo', 'Estádio Nilton Santos', 'Rio de Janeiro', 'Glorioso'],
    ['Fluminense', 'Maracanã', 'Rio de Janeiro', 'Tricolor das Laranjeiras'],
    ['Vasco da Gama', 'São Januário', 'Rio de Janeiro', 'Gigante da Colina'],
    ['Bahia', 'Arena Fonte Nova', 'Salvador', 'Esquadrão de Aço'],
    ['Sport Recife', 'Ilha do Retiro', 'Recife', 'Leão da Ilha'],
    ['Athletico Paranaense', 'Ligga Arena', 'Curitiba', 'Furacão'],
    ['Coritiba', 'Couto Pereira', 'Curitiba', 'Coxa-Branca'],
    ['Fortaleza', 'Arena Castelão', 'Fortaleza', 'Leão do Pici'],
    ['Ceará', 'Arena Castelão', 'Fortaleza', 'Vozão'],
    ['Goiás', 'Estádio Hailé Pinheiro', 'Goiânia', 'Esmeraldino'],
    ['Vitória', 'Barradão', 'Salvador', 'Leão da Barra'],
    ['Paysandu', 'Curuzu', 'Belém', 'Papão da Curuzu'],
    ['Remo', 'Baenão', 'Belém', 'Leão Azul'],
    ['Ponte Preta', 'Moisés Lucarelli', 'Campinas', 'Macaca'],
    ['Guarani', 'Brinco de Ouro da Princesa', 'Campinas', 'Bugre'],
    ['Chapecoense', 'Arena Condá', 'Chapecó', 'Verdão do Oeste'],
    ['Red Bull Bragantino', 'Estádio Nabi Abi Chedid', 'Bragança Paulista', 'Massa Bruta'],
    ['América Mineiro', 'Independência', 'Belo Horizonte', 'Coelho'],
    ['Cuiabá', 'Arena Pantanal', 'Cuiabá', 'Dourado'],
    ['ABC', 'Frasqueirão', 'Natal', 'Mais Querido'],
    ['CRB', 'Rei Pelé', 'Maceió', 'Galo da Pajuçara']
];

const INTERNATIONAL_CLUBS = [
    ['Real Madrid', 'Santiago Bernabéu', 'Madri', 'Merengues'],
    ['Barcelona', 'Camp Nou', 'Barcelona', 'Barça'],
    ['Manchester City', 'Etihad Stadium', 'Manchester', 'Citizens'],
    ['Manchester United', 'Old Trafford', 'Manchester', 'Red Devils'],
    ['Liverpool', 'Anfield', 'Liverpool', 'Reds'],
    ['Arsenal', 'Emirates Stadium', 'Londres', 'Gunners'],
    ['Chelsea', 'Stamford Bridge', 'Londres', 'Blues'],
    ['Tottenham Hotspur', 'Tottenham Hotspur Stadium', 'Londres', 'Spurs'],
    ['Bayern de Munique', 'Allianz Arena', 'Munique', 'Bávaros'],
    ['Borussia Dortmund', 'Signal Iduna Park', 'Dortmund', 'Aurinegros'],
    ['Paris Saint-Germain', 'Parc des Princes', 'Paris', 'Parisienses'],
    ['Milan', 'San Siro', 'Milão', 'Rossoneri'],
    ['Internazionale', 'San Siro', 'Milão', 'Nerazzurri'],
    ['Juventus', 'Allianz Stadium', 'Turim', 'Bianconeri'],
    ['Ajax', 'Johan Cruyff Arena', 'Amsterdã', 'Godenzonen'],
    ['Benfica', 'Estádio da Luz', 'Lisboa', 'Águias'],
    ['Porto', 'Estádio do Dragão', 'Porto', 'Dragões'],
    ['Celtic', 'Celtic Park', 'Glasgow', 'The Bhoys'],
    ['Boca Juniors', 'La Bombonera', 'Buenos Aires', 'Xeneizes'],
    ['River Plate', 'Estádio Monumental', 'Buenos Aires', 'Millonarios']
];

function addClubQuestions(clubs, category, source, startIndex) {
    const stadiums = clubs.map(club => club[1]);
    const cities = clubs.map(club => club[2]);
    const nicknames = clubs.map(club => club[3]);
    clubs.forEach(([club, stadium, city, nickname], index) => {
        addQuestion(
            `Qual estádio é tradicionalmente associado ao ${club}?`,
            stadium,
            uniqueAlternatives(stadium, stadiums, index + startIndex),
            category,
            DIFFICULTIES[index % 4],
            `${club} tem como estádio tradicionalmente associado o ${stadium}.`,
            `O clube é da cidade de ${city}.`,
            source
        );
        addQuestion(
            `Em qual cidade está sediado o ${club}?`,
            city,
            uniqueAlternatives(city, cities, index + startIndex + 3),
            category,
            DIFFICULTIES[(index + 1) % 4],
            `${club} é sediado em ${city}.`,
            `Seu estádio tradicionalmente associado é o ${stadium}.`,
            source
        );
        addQuestion(
            `Qual apelido é associado ao clube ${club}?`,
            nickname,
            uniqueAlternatives(nickname, nicknames, index + startIndex + 6),
            category,
            DIFFICULTIES[(index + 2) % 4],
            `${club} é conhecido como ${nickname}.`,
            `O apelido do clube é uma referência popular entre a torcida.`,
            source
        );
        addQuestion(
            `Adivinhe o clube: conhecido como ${nickname} e sediado em ${city}. Qual é?`,
            club,
            uniqueAlternatives(club, clubs.map(item => item[0]), index + startIndex + 9),
            'Adivinhe o clube',
            DIFFICULTIES[(index + 3) % 4],
            `${club} é sediado em ${city} e é conhecido como ${nickname}.`,
            `Seu apelido é ${nickname}.`,
            source
        );
    });
}

addClubQuestions(BRAZILIAN_CLUBS, 'Clubes brasileiros', 'CBF e páginas oficiais dos clubes', 2);
addClubQuestions(INTERNATIONAL_CLUBS, 'Clubes internacionais', 'UEFA e páginas oficiais dos clubes', 5);

const PLAYERS = [
    ['Pelé', 'Brasil', 'três Copas do Mundo masculinas', 'Rei do Futebol'],
    ['Marta', 'Brasil', 'seis prêmios de melhor jogadora do mundo da FIFA', 'Rainha do Futebol'],
    ['Diego Maradona', 'Argentina', 'a Copa do Mundo de 1986', 'El Pibe de Oro'],
    ['Zico', 'Brasil', 'a geração brasileira da Copa de 1982', 'Galinho de Quintino'],
    ['Romário', 'Brasil', 'a Copa do Mundo de 1994', 'Baixinho'],
    ['Ronaldo Nazário', 'Brasil', 'a Copa do Mundo de 2002', 'Fenômeno'],
    ['Ronaldinho Gaúcho', 'Brasil', 'a Bola de Ouro de 2005', 'Bruxo'],
    ['Lionel Messi', 'Argentina', 'a Copa do Mundo de 2022', 'La Pulga'],
    ['Cristiano Ronaldo', 'Portugal', 'a Eurocopa de 2016', 'CR7'],
    ['Zinedine Zidane', 'França', 'a Copa do Mundo de 1998', 'Zizou'],
    ['Johan Cruyff', 'Países Baixos', 'o futebol total do Ajax e da seleção neerlandesa', 'Flying Dutchman'],
    ['Franz Beckenbauer', 'Alemanha', 'a Copa do Mundo de 1974 como jogador e a de 1990 como técnico', 'Der Kaiser'],
    ['Mia Hamm', 'Estados Unidos', 'duas Copas do Mundo Femininas', 'lenda do futebol feminino dos EUA'],
    ['Birgit Prinz', 'Alemanha', 'três Copas do Mundo Femininas', 'uma das grandes artilheiras alemãs'],
    ['Formiga', 'Brasil', 'sete edições da Copa do Mundo Feminina', 'recordista de participações em Mundiais'],
    ['Carli Lloyd', 'Estados Unidos', 'a final olímpica de 2012 e a Copa do Mundo de 2015', 'meia e atacante norte-americana'],
    ['Andrés Iniesta', 'Espanha', 'o gol da final da Copa do Mundo de 2010', 'meio-campista espanhol'],
    ['Xavi Hernández', 'Espanha', 'o meio-campo campeão mundial em 2010', 'meio-campista espanhol'],
    ['Kylian Mbappé', 'França', 'a final da Copa do Mundo de 2018 aos 19 anos', 'atacante francês'],
    ['Miroslav Klose', 'Alemanha', 'o recorde de gols masculinos em Copas do Mundo', 'artilheiro alemão'],
    ['Garrincha', 'Brasil', 'as Copas do Mundo de 1958 e 1962', 'Alegria do Povo'],
    ['Didi', 'Brasil', 'as Copas do Mundo de 1958 e 1962', 'meio-campista conhecido pelo chute folha seca'],
    ['Cafu', 'Brasil', 'três finais consecutivas de Copas do Mundo', 'lateral-direito brasileiro'],
    ['Rivaldo', 'Brasil', 'a Copa do Mundo de 2002', 'meia-atacante brasileiro'],
    ['Bebeto', 'Brasil', 'a Copa do Mundo de 1994', 'atacante brasileiro'],
    ['Just Fontaine', 'França', '13 gols na Copa do Mundo de 1958', 'artilheiro francês'],
    ['Eusébio', 'Portugal', 'o terceiro lugar de Portugal na Copa de 1966', 'Pantera Negra'],
    ['Paolo Maldini', 'Itália', 'a defesa do Milan por mais de duas décadas', 'zagueiro e lateral italiano'],
    ['Rogério Ceni', 'Brasil', 'goleiro com muitos gols em cobranças de falta e pênalti', 'M1TO'],
    ['Alex de Souza', 'Brasil', 'sua passagem marcante pelo Fenerbahçe', 'meia brasileiro'],
    ['Neymar', 'Brasil', 'o ouro olímpico masculino do Brasil em 2016', 'atacante brasileiro'],
    ['Sissi', 'Brasil', 'o destaque brasileiro na Copa do Mundo Feminina de 1999', 'meia-atacante brasileira'],
    ['Abby Wambach', 'Estados Unidos', 'o gol de cabeça na semifinal olímpica de 2012', 'atacante norte-americana'],
    ['Homare Sawa', 'Japão', 'o título mundial feminino do Japão em 2011', 'capitã japonesa'],
    ['Ada Hegerberg', 'Noruega', 'a primeira Bola de Ouro feminina, em 2018', 'atacante norueguesa'],
    ['Sam Kerr', 'Austrália', 'a seleção australiana e o futebol feminino de clubes', 'atacante australiana'],
    ['Christine Sinclair', 'Canadá', 'a medalha de ouro olímpica canadense de 2020', 'atacante canadense'],
    ['Aitana Bonmatí', 'Espanha', 'a Copa do Mundo Feminina de 2023', 'meio-campista espanhola'],
    ['Ronaldo de Assis Moreira', 'Brasil', 'a Bola de Ouro de 2005', 'nome completo de Ronaldinho Gaúcho'],
    ['Ferenc Puskás', 'Hungria', 'a seleção húngara dos anos 1950 e o Real Madrid', 'Major Galopante']
];

const NATIONALITIES = [...new Set(PLAYERS.map(player => player[1]))];
PLAYERS.forEach(([player, nationality, achievement, nickname], index) => {
    addQuestion(
        `De qual país era ${player}?`,
        nationality,
        uniqueAlternatives(nationality, NATIONALITIES, index + 1),
        player === 'Marta' || index >= 12 && index <= 15 || index >= 31 && index <= 38 ? 'Futebol feminino' : 'Jogadores históricos',
        DIFFICULTIES[index % 4],
        `${player} é associado(a) à seleção de ${nationality}; destaque: ${achievement}.`,
        `Uma de suas marcas foi ${achievement}.`,
        player === 'Marta' || index >= 12 && index <= 15 || index >= 31 && index <= 38 ? 'FIFA — perfis e arquivos de competições' : 'FIFA e federações nacionais — perfis históricos'
    );
});

const PLAYER_NAMES = PLAYERS.map(player => player[0]);
PLAYERS.forEach(([player, nationality, achievement, nickname], index) => {
    addQuestion(
        `Adivinhe o jogador: ${nickname}; destaque por ${achievement}. Quem é?`,
        player,
        uniqueAlternatives(player, PLAYER_NAMES, index + 8),
        'Adivinhe o jogador',
        DIFFICULTIES[(index + 2) % 4],
        `${player}, de ${nationality}, é associado(a) a ${achievement}.`,
        `Pista de carreira: ${achievement}.`,
        'FIFA e federações nacionais — perfis históricos'
    );
});

const RULES = [
    ['Quantos jogadores de cada equipe podem estar em campo no início de uma partida?', '11', ['9', '10', '12'], 'Cada equipe começa com até 11 jogadores, incluindo o goleiro.', 'Regras do Jogo — IFAB'],
    ['Qual é o número mínimo de jogadores para uma equipe continuar uma partida?', '7', ['5', '6', '8'], 'Uma equipe com menos de sete jogadores não pode continuar a partida.', 'Regras do Jogo — IFAB'],
    ['Qual tamanho máximo de uma partida adulta padrão, sem contar acréscimos?', '90 minutos', ['80 minutos', '100 minutos', '120 minutos'], 'O tempo normal é de dois períodos de 45 minutos.', 'Regras do Jogo — IFAB'],
    ['Qual é a duração do intervalo entre os períodos, no máximo?', '15 minutos', ['10 minutos', '20 minutos', '30 minutos'], 'O intervalo não pode exceder 15 minutos.', 'Regras do Jogo — IFAB'],
    ['Em que situação um jogador está em posição de impedimento?', 'Quando está mais perto da linha de gol adversária que a bola e o penúltimo adversário, no campo adversário', ['Sempre que recebe a bola atrás da defesa', 'Sempre que está no próprio campo', 'Quando está alinhado com o penúltimo adversário'], 'Estar em posição de impedimento, por si só, não é infração; é preciso participar ativamente da jogada.', 'Regra 11 — IFAB'],
    ['Um jogador pode estar em posição de impedimento diretamente em tiro de meta?', 'Não', ['Sim, sempre', 'Sim, se estiver no campo adversário', 'Somente após o intervalo'], 'Não há impedimento se o jogador recebe a bola diretamente de tiro de meta.', 'Regra 11 — IFAB'],
    ['Um jogador pode estar em posição de impedimento diretamente em arremesso lateral?', 'Não', ['Sim, sempre', 'Sim, se estiver perto do gol', 'Somente na cobrança para trás'], 'Não há impedimento recebido diretamente de arremesso lateral.', 'Regra 11 — IFAB'],
    ['Qual cartão significa expulsão?', 'Vermelho', ['Amarelo', 'Azul', 'Verde'], 'O cartão vermelho indica expulsão; o jogador deve deixar o campo e a área técnica.', 'Regra 12 — IFAB'],
    ['O que acontece quando um jogador recebe dois cartões amarelos na mesma partida?', 'Ele é expulso e recebe cartão vermelho', ['Nada até o fim', 'A equipe perde um gol', 'Ele é substituído obrigatoriamente'], 'Dois cartões amarelos na mesma partida resultam em expulsão.', 'Regra 12 — IFAB'],
    ['Qual é a distância regulamentar da barreira adversária em uma cobrança de falta?', '9,15 metros', ['7 metros', '10 metros', '11 metros'], 'A distância padrão é de 9,15 m (10 jardas), salvo exceções previstas na regra.', 'Regra 13 — IFAB'],
    ['Qual é a distância da marca do pênalti até a linha de gol?', '11 metros', ['9,15 metros', '10 metros', '12 metros'], 'A marca de pênalti fica a 11 m da linha de gol.', 'Regra 14 — IFAB'],
    ['O goleiro pode pegar com as mãos um passe deliberado com o pé feito por um companheiro?', 'Não', ['Sim, em qualquer situação', 'Sim, se o passe for curto', 'Somente dentro da pequena área'], 'O goleiro não pode usar as mãos para jogar uma bola deliberadamente chutada a ele por um companheiro.', 'Regra 12 — IFAB'],
    ['Um gol pode ser marcado diretamente de um arremesso lateral?', 'Não; se entrar diretamente, é concedido tiro de meta ao adversário', ['Sim, se a bola tocar o chão', 'Sim, em qualquer situação', 'Somente no próprio gol'], 'Não se pode marcar gol diretamente de arremesso lateral.', 'Regra 15 — IFAB'],
    ['O que é concedido se a bola ultrapassa a linha lateral?', 'Arremesso lateral para a equipe adversária à que tocou por último', ['Escanteio', 'Tiro de meta', 'Bola ao chão sempre'], 'A reposição é feita por arremesso lateral a favor de quem não tocou por último.', 'Regra 15 — IFAB'],
    ['Quando é concedido um escanteio?', 'Quando a bola cruza a linha de gol por último tocada por um defensor, sem ser gol', ['Quando a bola sai pela linha lateral', 'Após qualquer falta', 'Quando o goleiro segura a bola por seis segundos'], 'O escanteio é concedido quando o último toque antes da saída pela linha de gol foi de um defensor.', 'Regra 17 — IFAB'],
    ['Quando é concedido um tiro de meta?', 'Quando a bola cruza a linha de gol por último tocada por um atacante, sem ser gol', ['Após qualquer impedimento', 'Quando a bola sai pela lateral', 'Após toda defesa do goleiro'], 'O tiro de meta é concedido quando o último toque foi de um atacante antes da saída pela linha de gol.', 'Regra 16 — IFAB'],
    ['O árbitro pode voltar atrás em uma decisão disciplinar após reiniciar o jogo?', 'Em geral, não, salvo exceções previstas nas regras', ['Sim, a qualquer momento', 'Nunca pode corrigir erro', 'Somente se o capitão pedir'], 'A possibilidade de rever uma decisão depende do momento e das exceções da regra.', 'Regra 5 — IFAB'],
    ['Qual sistema auxilia a equipe de arbitragem a revisar certos lances?', 'VAR', ['GLT', 'GPS', 'SAOT'], 'O árbitro assistente de vídeo auxilia na revisão de incidentes definidos pelo protocolo.', 'Protocolo VAR — IFAB'],
    ['O VAR revisa automaticamente qualquer lateral ou escanteio?', 'Não', ['Sim, todos os lances', 'Sim, apenas no primeiro tempo', 'Somente quando solicitado pelo capitão'], 'O protocolo VAR se limita a categorias específicas de incidentes, não a toda decisão de jogo.', 'Protocolo VAR — IFAB'],
    ['Quantas substituições podem ser usadas em muitas competições sob a regra atual?', 'Até cinco, conforme o regulamento da competição', ['Duas em qualquer competição', 'Três em qualquer competição', 'Ilimitadas em toda competição'], 'A regra permite até cinco substituições em competições que adotam essa opção; o regulamento define detalhes.', 'Regra 3 — IFAB'],
    ['Quantas janelas de substituição são normalmente permitidas durante o tempo de jogo, sem contar o intervalo?', 'Três', ['Uma', 'Duas', 'Cinco'], 'As competições podem permitir até três oportunidades de substituição durante o jogo, além do intervalo.', 'Regra 3 — IFAB'],
    ['O que ocorre se um pênalti toca a trave e volta ao cobrador sem tocar em outro jogador?', 'É concedido tiro livre indireto ao adversário', ['O cobrador pode chutar novamente', 'É marcado escanteio', 'O pênalti é repetido'], 'O cobrador não pode tocar a bola novamente antes que outro jogador a toque.', 'Regra 14 — IFAB'],
    ['Qual é a decisão se a bola entra diretamente no próprio gol em um tiro livre?', 'É concedido escanteio ao adversário', ['O gol é válido', 'O tiro livre é repetido', 'É concedido tiro de meta'], 'Não se pode marcar gol contra diretamente em um tiro livre; concede-se escanteio.', 'Regra 13 — IFAB'],
    ['A bola está fora de jogo quando cruza completamente qual limite?', 'A linha lateral ou a linha de gol', ['A linha da grande área', 'O círculo central', 'A linha da pequena área'], 'A bola só está fora quando cruza completamente uma linha de limite ou quando o árbitro interrompe o jogo.', 'Regra 9 — IFAB'],
    ['Um gol é válido se a bola inteira cruzar a linha de gol entre os postes e sob o travessão?', 'Sim, desde que nenhuma infração tenha ocorrido', ['Não, precisa tocar a rede', 'Não, precisa ser chutada dentro da pequena área', 'Sim, mesmo após uma infração'], 'O gol é marcado quando a bola cruza completamente a linha entre postes e travessão, sem infração prévia.', 'Regra 10 — IFAB'],
    ['Qual é a largura máxima regulamentar de um gol?', '7,32 metros', ['6,00 metros', '7,00 metros', '8,00 metros'], 'A distância entre os postes é de 7,32 m.', 'Regra 1 — IFAB'],
    ['Qual é a altura regulamentar do gol, do solo até a parte inferior do travessão?', '2,44 metros', ['2,00 metros', '2,20 metros', '2,60 metros'], 'O travessão fica a 2,44 m do solo.', 'Regra 1 — IFAB'],
    ['O que significa a vantagem aplicada pelo árbitro?', 'Permitir que o jogo continue quando a equipe prejudicada pode se beneficiar', ['Dar um gol à equipe que sofreu a falta', 'Cancelar automaticamente o cartão', 'Aumentar o tempo do jogo'], 'O árbitro pode deixar o jogo seguir se a equipe que sofreu a infração mantiver uma vantagem real.', 'Regra 5 — IFAB'],
    ['Pode ser marcado impedimento diretamente de um escanteio?', 'Não', ['Sim, sempre', 'Sim, se o cobrador tocar duas vezes', 'Somente no segundo tempo'], 'Não há impedimento ao receber a bola diretamente de um escanteio.', 'Regra 11 — IFAB'],
    ['Qual jogador pode usar as mãos dentro da própria área penal, sob as regras?', 'O goleiro, com as restrições previstas nas regras', ['Qualquer defensor', 'Somente o capitão', 'O goleiro e o zagueiro central'], 'O goleiro pode jogar a bola com as mãos dentro de sua própria área penal, observadas as restrições.', 'Regra 12 — IFAB'],
    ['O que é um tiro livre indireto?', 'Um tiro em que o gol só pode ser marcado se outro jogador tocar na bola', ['Um pênalti cobrado da marca', 'Uma cobrança que não pode entrar na área', 'Um tiro livre que sempre vale gol direto'], 'O árbitro sinaliza o tiro indireto com o braço levantado; a bola precisa tocar em outro jogador para o gol valer.', 'Regra 13 — IFAB'],
    ['Qual sinal o árbitro usa para indicar um tiro livre indireto?', 'Mantém um braço levantado até a bola tocar outro jogador ou sair de jogo', ['Cruza os braços', 'Aponta para o centro do campo', 'Levanta os dois braços'], 'O braço levantado distingue a sinalização de um tiro livre indireto.', 'Regra 5 — IFAB'],
    ['Um jogador pode ser punido por impedimento dentro do próprio campo?', 'Não', ['Sim, se estiver atrás do goleiro', 'Sim, após um escanteio', 'Somente se estiver sem a bola'], 'A posição de impedimento só pode existir no campo adversário.', 'Regra 11 — IFAB'],
    ['Qual é a área em que o goleiro pode usar as mãos?', 'A própria área penal', ['O círculo central', 'A área penal adversária', 'Qualquer parte do campo'], 'O goleiro pode usar as mãos dentro de sua própria área penal, respeitando as exceções.', 'Regras 1 e 12 — IFAB'],
    ['O que ocorre se um tiro livre direto entra diretamente no gol adversário?', 'O gol é válido', ['É tiro de meta', 'É escanteio', 'A cobrança é repetida'], 'Um tiro livre direto pode resultar em gol diretamente contra o adversário.', 'Regra 13 — IFAB'],
    ['O que significa a sigla IFAB?', 'International Football Association Board', ['International Federation of Amateur Ball', 'International Football Arbitration Bureau', 'International Federation of Association Teams'], 'A IFAB é responsável pelas Regras do Jogo do futebol.', 'IFAB — sobre a organização'],
    ['O árbitro deve acrescentar tempo por substituições e perda de tempo?', 'Sim', ['Não, o relógio nunca é compensado', 'Somente em finais', 'Somente se o VAR pedir'], 'O árbitro adiciona tempo para compensar atrasos conforme as regras.', 'Regra 7 — IFAB'],
    ['Um jogador pode marcar gol diretamente de um tiro de saída?', 'Sim, contra a equipe adversária', ['Não, em nenhuma circunstância', 'Sim, também contra a própria equipe', 'Somente após um toque do goleiro'], 'É possível marcar diretamente no gol adversário a partir de um tiro de saída.', 'Regra 8 — IFAB'],
    ['Como a partida é reiniciada após uma bola ao chão que entra no gol sem tocar em dois jogadores?', 'Com tiro de meta ou escanteio, conforme o gol em que entrou', ['O gol sempre vale', 'Com pênalti', 'Com novo tiro de saída'], 'A bola ao chão só resulta em gol após tocar em pelo menos dois jogadores; caso contrário, aplica-se o reinício previsto.', 'Regra 8 — IFAB'],
    ['A bola precisa sair da área penal para entrar em jogo em um tiro de meta?', 'Não', ['Sim, sempre', 'Somente em cobranças do goleiro', 'Apenas em pênaltis'], 'A regra atual considera a bola em jogo quando é chutada e se move claramente.', 'Regra 16 — IFAB']
];

RULES.forEach(([question, answer, distractors, explanation, source], index) => {
    addQuestion(question, answer, distractors, 'Regras do futebol', DIFFICULTIES[index % 4], explanation, explanation, source);
});

const COMPETITION_FACTS = [
    ['Qual clube venceu a primeira Copa Libertadores, em 1960?', 'Peñarol', ['Santos', 'Boca Juniors', 'River Plate'], 'O Peñarol, do Uruguai, venceu a edição inaugural da Libertadores.', 'CONMEBOL — arquivo da Libertadores'],
    ['Qual clube brasileiro conquistou a Libertadores de 1981?', 'Flamengo', ['Grêmio', 'São Paulo', 'Palmeiras'], 'O Flamengo conquistou a Libertadores de 1981 antes de vencer o Mundial Interclubes.', 'CONMEBOL — arquivo da Libertadores'],
    ['Qual clube venceu a Libertadores de 1992?', 'São Paulo', ['Santos', 'Vasco da Gama', 'Cruzeiro'], 'O São Paulo venceu a competição em 1992 e também conquistou o título em 1993.', 'CONMEBOL — arquivo da Libertadores'],
    ['Qual clube venceu a Libertadores de 1999?', 'Palmeiras', ['Corinthians', 'Flamengo', 'Atlético Mineiro'], 'O Palmeiras venceu o torneio de 1999 em decisão por pênaltis.', 'CONMEBOL — arquivo da Libertadores'],
    ['Quais clubes brasileiros venceram a Libertadores de 2019 e 2020, respectivamente?', 'Flamengo e Palmeiras', ['Palmeiras e Flamengo', 'Grêmio e Santos', 'São Paulo e Internacional'], 'O Flamengo venceu em 2019 e o Palmeiras em 2020.', 'CONMEBOL — arquivo da Libertadores'],
    ['Qual clube venceu a Libertadores de 2023?', 'Fluminense', ['Boca Juniors', 'Palmeiras', 'River Plate'], 'O Fluminense conquistou sua primeira Libertadores em 2023.', 'CONMEBOL — arquivo da Libertadores'],
    ['Qual clube venceu a Copa Libertadores de 2024?', 'Botafogo', ['Atlético Mineiro', 'Flamengo', 'River Plate'], 'O Botafogo conquistou a Libertadores de 2024.', 'CONMEBOL — arquivo da Libertadores'],
    ['Qual clube venceu a primeira edição da Copa Sul-Americana, em 2002?', 'San Lorenzo', ['Boca Juniors', 'Cienciano', 'Pachuca'], 'O San Lorenzo, da Argentina, venceu a edição inaugural da Sul-Americana.', 'CONMEBOL — arquivo da Sul-Americana'],
    ['Qual clube venceu a Champions League de 1999 em uma virada nos acréscimos?', 'Manchester United', ['Bayern de Munique', 'Real Madrid', 'Juventus'], 'O Manchester United marcou dois gols nos acréscimos contra o Bayern na final de 1999.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2005 após empatar a final em 3 a 3?', 'Liverpool', ['Milan', 'Chelsea', 'Barcelona'], 'O Liverpool venceu o Milan nos pênaltis após buscar o empate na final de Istambul.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a final da Champions League de 2009 contra o Manchester United?', 'Barcelona', ['Real Madrid', 'Chelsea', 'Milan'], 'O Barcelona venceu o Manchester United por 2 a 0 na final de 2009.', 'UEFA — arquivo da Champions League'],
    ['Qual clube conquistou a Champions League de 2012 em Munique?', 'Chelsea', ['Bayern de Munique', 'Borussia Dortmund', 'Real Madrid'], 'O Chelsea venceu o Bayern nos pênaltis na final disputada em Munique.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2013?', 'Bayern de Munique', ['Borussia Dortmund', 'Barcelona', 'Real Madrid'], 'O Bayern derrotou o Borussia Dortmund na final alemã de 2013.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2018?', 'Real Madrid', ['Liverpool', 'Juventus', 'Bayern de Munique'], 'O Real Madrid derrotou o Liverpool e conquistou seu terceiro título seguido no ciclo 2016–2018.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2020?', 'Bayern de Munique', ['Paris Saint-Germain', 'Liverpool', 'Manchester City'], 'O Bayern venceu o PSG por 1 a 0 na final de Lisboa.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2023?', 'Manchester City', ['Inter de Milão', 'Real Madrid', 'Bayern de Munique'], 'O Manchester City conquistou sua primeira Champions League em 2023.', 'UEFA — arquivo da Champions League'],
    ['Qual seleção venceu a Eurocopa de 2016?', 'Portugal', ['França', 'Alemanha', 'Espanha'], 'Portugal venceu a França na final disputada em Saint-Denis.', 'UEFA — arquivo da Eurocopa'],
    ['Qual seleção venceu a Eurocopa de 2020, disputada em 2021?', 'Itália', ['Inglaterra', 'Espanha', 'Portugal'], 'A Itália venceu a Inglaterra nos pênaltis na final de Wembley.', 'UEFA — arquivo da Eurocopa'],
    ['Qual seleção venceu a Eurocopa de 2024?', 'Espanha', ['Inglaterra', 'França', 'Alemanha'], 'A Espanha venceu a Inglaterra na final de Berlim.', 'UEFA — arquivo da Eurocopa'],
    ['Qual seleção venceu a Copa América de 2021?', 'Argentina', ['Brasil', 'Uruguai', 'Colômbia'], 'A Argentina venceu o Brasil no Maracanã e encerrou um longo jejum continental.', 'CONMEBOL — arquivo da Copa América'],
    ['Qual seleção venceu a Copa América de 2024?', 'Argentina', ['Colômbia', 'Uruguai', 'Brasil'], 'A Argentina derrotou a Colômbia na final de 2024.', 'CONMEBOL — arquivo da Copa América'],
    ['Qual clube venceu a Copa do Brasil de 2023?', 'São Paulo', ['Flamengo', 'Corinthians', 'Grêmio'], 'O São Paulo conquistou sua primeira Copa do Brasil em 2023.', 'CBF — arquivo da Copa do Brasil'],
    ['Qual clube venceu a Copa do Brasil de 2024?', 'Flamengo', ['Atlético Mineiro', 'São Paulo', 'Athletico Paranaense'], 'O Flamengo venceu o Atlético Mineiro na final da Copa do Brasil de 2024.', 'CBF — arquivo da Copa do Brasil'],
    ['Qual clube venceu a Copa do Brasil de 2022?', 'Flamengo', ['Corinthians', 'Atlético Mineiro', 'São Paulo'], 'O Flamengo venceu o Corinthians na decisão por pênaltis de 2022.', 'CBF — arquivo da Copa do Brasil'],
    ['Qual clube venceu o primeiro Campeonato Brasileiro reconhecido pela CBF, em 1971?', 'Atlético Mineiro', ['Santos', 'Botafogo', 'São Paulo'], 'O Atlético Mineiro venceu o Campeonato Nacional de Clubes de 1971.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2003, primeira edição em pontos corridos?', 'Cruzeiro', ['Santos', 'São Paulo', 'Corinthians'], 'O Cruzeiro foi campeão da primeira edição em pontos corridos, em 2003.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2010?', 'Fluminense', ['Corinthians', 'Cruzeiro', 'Santos'], 'O Fluminense conquistou o Campeonato Brasileiro de 2010.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2011?', 'Corinthians', ['Vasco da Gama', 'Fluminense', 'Santos'], 'O Corinthians conquistou o Campeonato Brasileiro de 2011.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2012?', 'Fluminense', ['Atlético Mineiro', 'Grêmio', 'São Paulo'], 'O Fluminense foi campeão brasileiro em 2012.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2013?', 'Cruzeiro', ['Atlético Mineiro', 'Flamengo', 'Grêmio'], 'O Cruzeiro venceu o Campeonato Brasileiro de 2013.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2014?', 'Cruzeiro', ['São Paulo', 'Internacional', 'Corinthians'], 'O Cruzeiro conquistou seu segundo título brasileiro consecutivo em 2014.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2015?', 'Corinthians', ['Atlético Mineiro', 'Grêmio', 'Palmeiras'], 'O Corinthians foi campeão brasileiro em 2015.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2016?', 'Palmeiras', ['Santos', 'Flamengo', 'Atlético Mineiro'], 'O Palmeiras conquistou o Campeonato Brasileiro de 2016.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2017?', 'Corinthians', ['Palmeiras', 'Santos', 'Grêmio'], 'O Corinthians conquistou o Campeonato Brasileiro de 2017.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2018?', 'Palmeiras', ['Flamengo', 'Internacional', 'São Paulo'], 'O Palmeiras foi campeão brasileiro em 2018.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2019?', 'Flamengo', ['Santos', 'Palmeiras', 'Grêmio'], 'O Flamengo conquistou o Campeonato Brasileiro de 2019.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2020?', 'Flamengo', ['Internacional', 'Atlético Mineiro', 'São Paulo'], 'O Flamengo venceu o Brasileirão de 2020, decidido na última rodada.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2021?', 'Atlético Mineiro', ['Flamengo', 'Palmeiras', 'Fortaleza'], 'O Atlético Mineiro conquistou o Brasileirão de 2021.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2022?', 'Palmeiras', ['Internacional', 'Fluminense', 'Corinthians'], 'O Palmeiras foi campeão brasileiro em 2022.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2023?', 'Palmeiras', ['Grêmio', 'Atlético Mineiro', 'Flamengo'], 'O Palmeiras conquistou o Campeonato Brasileiro de 2023.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Brasileirão de 2024?', 'Botafogo', ['Palmeiras', 'Flamengo', 'Fortaleza'], 'O Botafogo conquistou o Campeonato Brasileiro de 2024.', 'CBF — arquivo do Campeonato Brasileiro']
];

COMPETITION_FACTS.forEach(([question, answer, distractors, explanation, source], index) => {
    const category = source.startsWith('CBF') ? 'Futebol brasileiro' : source.startsWith('CONMEBOL') ? 'Competições sul-americanas' : 'Competições internacionais';
    addQuestion(question, answer, distractors, category, DIFFICULTIES[(index + 1) % 4], explanation, explanation, source);
});

const TACTICS = [
    ['Quantos defensores aparecem na linha de uma formação 4-3-3?', '4', ['3', '2', '5'], 'O primeiro número costuma indicar os defensores; em 4-3-3 são quatro.', 'Conceitos táticos do futebol'],
    ['Quantos meio-campistas aparecem na linha de uma formação 4-3-3?', '3', ['4', '2', '5'], 'O número do meio em 4-3-3 representa três meio-campistas.', 'Conceitos táticos do futebol'],
    ['Qual esquema clássico utiliza quatro defensores, quatro meio-campistas e dois atacantes?', '4-4-2', ['4-3-3', '3-5-2', '5-3-2'], 'O 4-4-2 organiza quatro jogadores em cada uma das duas linhas após a defesa.', 'Conceitos táticos do futebol'],
    ['O que caracteriza uma marcação individual?', 'Cada defensor acompanha prioritariamente um adversário designado', ['Cada jogador protege apenas uma zona', 'A equipe marca somente após perder a bola', 'O goleiro marca o atacante mais avançado'], 'Na marcação individual, a referência defensiva principal é um adversário.', 'Conceitos táticos do futebol'],
    ['O que caracteriza a marcação por zona?', 'Os defensores protegem espaços e referências de zona', ['Cada defensor segue o mesmo adversário por todo o campo', 'A equipe abandona a defesa', 'Somente o goleiro pode marcar'], 'Na marcação por zona, os jogadores defendem espaços e coberturas coletivas.', 'Conceitos táticos do futebol'],
    ['O que é uma linha alta de defesa?', 'Uma linha defensiva posicionada longe da própria área, avançando no campo', ['Defesa concentrada dentro da pequena área', 'Marcação exclusiva do goleiro', 'Ataque com cinco centroavantes'], 'A linha alta busca comprimir o espaço e pode apoiar a pressão sobre a saída rival.', 'Conceitos táticos do futebol'],
    ['O que significa pressionar a saída de bola?', 'Tentar recuperar a bola perto da área adversária enquanto o rival inicia a construção', ['Recuar todos os jogadores até a própria área', 'Cobrar rapidamente um lateral', 'Manter a bola sem avançar'], 'A pressão alta busca dificultar a construção desde a defesa adversária.', 'Conceitos táticos do futebol'],
    ['Qual é a função típica de um volante?', 'Proteger a defesa e apoiar a saída de bola pelo meio', ['Atuar exclusivamente como goleiro reserva', 'Cobrar todos os escanteios', 'Ficar apenas junto à bandeirinha'], 'O volante costuma atuar à frente da defesa, ajudando na marcação e na circulação.', 'Conceitos táticos do futebol'],
    ['O que é um contra-ataque?', 'Uma transição ofensiva rápida após recuperar a bola', ['Uma reposição de bola ao chão', 'Uma falta cobrada para trás', 'Uma troca de goleiros'], 'O contra-ataque aproveita o espaço deixado pelo adversário após a recuperação da bola.', 'Conceitos táticos do futebol'],
    ['O que é amplitude no ataque?', 'Ocupar os corredores laterais para abrir a defesa adversária', ['Manter todos os atacantes no centro', 'Recuar o time inteiro', 'Aumentar a altura do goleiro'], 'A amplitude estica a linha defensiva rival e abre espaços interiores.', 'Conceitos táticos do futebol'],
    ['O que é um falso 9?', 'Um atacante central que recua para participar da criação e abrir espaços', ['Um goleiro que joga como zagueiro', 'Um ponta que não cruza', 'O nono jogador a entrar em campo'], 'O falso 9 sai da referência fixa de centroavante para conectar o meio-campo e o ataque.', 'Conceitos táticos do futebol'],
    ['Qual esquema costuma ter três zagueiros e alas pelos lados?', '3-5-2', ['4-4-2', '4-3-3', '4-2-3-1'], 'O 3-5-2 frequentemente utiliza três defensores centrais e alas que avançam pelos corredores.', 'Conceitos táticos do futebol'],
    ['O que é uma transição defensiva?', 'A reorganização da equipe logo após perder a posse', ['Uma substituição de zagueiro', 'A saída do goleiro para o ataque', 'A mudança de lado no intervalo'], 'A transição defensiva acontece quando a equipe passa do ataque para a defesa.', 'Conceitos táticos do futebol'],
    ['O que significa dar cobertura a um companheiro na defesa?', 'Posicionar-se para proteger o espaço caso o companheiro seja superado', ['Ficar atrás do árbitro', 'Cobrir a bola com as mãos', 'Substituir o companheiro sem autorização'], 'A cobertura é um princípio coletivo para apoiar o defensor que enfrenta o portador da bola.', 'Conceitos táticos do futebol'],
    ['Qual é um objetivo comum da posse de bola?', 'Controlar o jogo e criar espaços para progredir', ['Impedir qualquer passe para trás', 'Reduzir o tamanho do campo', 'Evitar que o goleiro participe'], 'A posse pode servir para controlar o ritmo, atrair a pressão e encontrar espaços.', 'Conceitos táticos do futebol'],
    ['O que é um bloco baixo?', 'Uma equipe defendendo em linhas próximas e recuadas perto da própria área', ['Uma linha de impedimento no meio-campo', 'Uma cobrança rasteira de falta', 'Um ataque com muitos jogadores na área rival'], 'O bloco baixo prioriza proteger espaços próximos ao próprio gol.', 'Conceitos táticos do futebol'],
    ['O que é um pivô no ataque?', 'Um atacante que protege a bola e conecta os companheiros', ['O árbitro assistente', 'Um lateral que cobra escanteios', 'Um goleiro que sai jogando'], 'O pivô usa o corpo para segurar a bola e permitir a aproximação de outros atacantes.', 'Conceitos táticos do futebol'],
    ['O que significa inverter o jogo?', 'Transferir a bola rapidamente de um lado do campo para o outro', ['Trocar o goleiro pelo atacante', 'Mudar de campo antes do intervalo', 'Reiniciar a partida com escanteio'], 'A inversão explora o lado oposto, que pode estar menos protegido.', 'Conceitos táticos do futebol'],
    ['Em uma formação 4-2-3-1, quantos jogadores compõem a linha de dois volantes?', '2', ['1', '3', '4'], 'O 4-2-3-1 apresenta quatro defensores, dois meio-campistas de base, três jogadores avançados e um atacante.', 'Conceitos táticos do futebol'],
    ['Qual é um princípio típico do jogo de posição?', 'Ocupar espaços de forma coordenada para criar linhas de passe e superioridades', ['Manter todos os jogadores na mesma faixa', 'Evitar receber entre linhas', 'Chutar a bola para longe após cada passe'], 'O jogo de posição organiza os espaços para facilitar a progressão e a criação de vantagens.', 'Conceitos táticos do futebol']
];

TACTICS.forEach(([question, answer, distractors, explanation, source], index) => {
    addQuestion(question, answer, distractors, 'Técnicos e táticas', DIFFICULTIES[(index + 2) % 4], explanation, explanation, source);
});

const STADIUMS = [
    ['Maracanã', 'Rio de Janeiro', 'Brasil'],
    ['Morumbi', 'São Paulo', 'Brasil'],
    ['Wembley', 'Londres', 'Inglaterra'],
    ['Santiago Bernabéu', 'Madri', 'Espanha'],
    ['Camp Nou', 'Barcelona', 'Espanha'],
    ['Allianz Arena', 'Munique', 'Alemanha'],
    ['San Siro', 'Milão', 'Itália'],
    ['La Bombonera', 'Buenos Aires', 'Argentina'],
    ['Estádio Monumental', 'Buenos Aires', 'Argentina'],
    ['Estádio Azteca', 'Cidade do México', 'México'],
    ['Estádio Centenário', 'Montevidéu', 'Uruguai'],
    ['Estádio da Luz', 'Lisboa', 'Portugal'],
    ['Old Trafford', 'Manchester', 'Inglaterra'],
    ['Anfield', 'Liverpool', 'Inglaterra'],
    ['Signal Iduna Park', 'Dortmund', 'Alemanha'],
    ['Parc des Princes', 'Paris', 'França'],
    ['Estádio Olímpico de Roma', 'Roma', 'Itália'],
    ['Estádio de Yokohama', 'Yokohama', 'Japão'],
    ['Estádio Soccer City', 'Joanesburgo', 'África do Sul'],
    ['Lusail', 'Lusail', 'Catar']
];
const STADIUM_CITIES = STADIUMS.map(stadium => stadium[1]);
const STADIUM_COUNTRIES = STADIUMS.map(stadium => stadium[2]);
STADIUMS.forEach(([stadium, city, country], index) => {
    addQuestion(
        `Em qual cidade fica o estádio ${stadium}?`,
        city,
        uniqueAlternatives(city, STADIUM_CITIES, index + 2),
        'Estádios',
        DIFFICULTIES[index % 4],
        `${stadium} está localizado em ${city}, ${country}.`,
        `O estádio está associado ao futebol de ${country}.`,
        'Páginas oficiais dos estádios e federações'
    );
    addQuestion(
        `Em qual país fica o estádio ${stadium}?`,
        country,
        uniqueAlternatives(country, STADIUM_COUNTRIES, index + 4),
        'Estádios',
        DIFFICULTIES[(index + 1) % 4],
        `${stadium} fica em ${city}, ${country}.`,
        `A cidade é ${city}.`,
        'Páginas oficiais dos estádios e federações'
    );
});

const EXTRA_FACTS = [
    ['Quantos títulos mundiais masculinos havia conquistado o Brasil até a Copa de 2022?', '5', ['3', '4', '6'], 'O Brasil conquistou cinco Copas do Mundo masculinas: 1958, 1962, 1970, 1994 e 2002.', 'FIFA — arquivo histórico'],
    ['Quem é o maior artilheiro da história das Copas do Mundo masculinas?', 'Miroslav Klose', ['Ronaldo Nazário', 'Gerd Müller', 'Pelé'], 'O alemão Miroslav Klose marcou 16 gols em Copas do Mundo masculinas.', 'FIFA — estatísticas da Copa do Mundo'],
    ['Qual seleção venceu a Copa do Mundo masculina de 1958?', 'Brasil', ['Suécia', 'França', 'Alemanha Ocidental'], 'O Brasil venceu a Suécia na final de 1958 e conquistou seu primeiro título mundial.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo masculina de 1962?', 'Brasil', ['Tchecoslováquia', 'Chile', 'Inglaterra'], 'O Brasil conquistou o bicampeonato em 1962, no Chile.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo masculina de 1970?', 'Brasil', ['Itália', 'Alemanha Ocidental', 'Uruguai'], 'O Brasil venceu a Itália na final de 1970 e ficou em posse definitiva da Taça Jules Rimet.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo masculina de 1994?', 'Brasil', ['Itália', 'Suécia', 'Argentina'], 'Brasil e Itália empataram sem gols na final; o Brasil venceu nos pênaltis.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo masculina de 2002?', 'Brasil', ['Alemanha', 'Turquia', 'Coreia do Sul'], 'O Brasil venceu a Alemanha por 2 a 0 na final de 2002.', 'FIFA — arquivo histórico'],
    ['Qual jogador marcou o gol decisivo da final masculina da Copa do Mundo de 2010?', 'Andrés Iniesta', ['David Villa', 'Xavi', 'Fernando Torres'], 'Iniesta marcou na prorrogação contra os Países Baixos.', 'FIFA — arquivo histórico'],
    ['Quem marcou o gol do título alemão na final da Copa do Mundo de 2014?', 'Mario Götze', ['Miroslav Klose', 'Thomas Müller', 'André Schürrle'], 'Mario Götze marcou na prorrogação contra a Argentina.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo masculina de 1998?', 'França', ['Brasil', 'Croácia', 'Itália'], 'A França conquistou seu primeiro título mundial ao vencer o Brasil por 3 a 0.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo masculina de 2006?', 'Itália', ['França', 'Alemanha', 'Portugal'], 'A Itália venceu a França nos pênaltis na final de 2006.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo masculina de 2018?', 'França', ['Croácia', 'Bélgica', 'Inglaterra'], 'A França derrotou a Croácia por 4 a 2 na final de 2018.', 'FIFA — arquivo histórico'],
    ['Quantas equipes participaram da primeira Copa do Mundo, em 1930?', '13', ['16', '12', '24'], 'Treze seleções participaram do torneio inaugural no Uruguai.', 'FIFA — arquivo histórico'],
    ['Qual país sediou a primeira Copa do Mundo masculina?', 'Uruguai', ['Brasil', 'Itália', 'Argentina'], 'O Uruguai sediou e venceu a primeira Copa do Mundo, em 1930.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo Feminina de 2023?', 'Espanha', ['Inglaterra', 'Suécia', 'Estados Unidos'], 'A Espanha venceu a Inglaterra na final disputada em Sydney.', 'FIFA — arquivo da Copa do Mundo Feminina'],
    ['Qual seleção venceu a Copa do Mundo Feminina de 2011?', 'Japão', ['Estados Unidos', 'Alemanha', 'Suécia'], 'O Japão venceu os Estados Unidos nos pênaltis na final de 2011.', 'FIFA — arquivo da Copa do Mundo Feminina'],
    ['Qual seleção venceu a Copa do Mundo Feminina de 2019?', 'Estados Unidos', ['Países Baixos', 'Inglaterra', 'Suécia'], 'Os Estados Unidos venceram os Países Baixos na final de 2019.', 'FIFA — arquivo da Copa do Mundo Feminina'],
    ['Quem recebeu o apelido de Rainha do Futebol?', 'Marta', ['Formiga', 'Mia Hamm', 'Megan Rapinoe'], 'Marta é frequentemente chamada de Rainha do Futebol e foi eleita melhor jogadora do mundo várias vezes.', 'FIFA — perfil de Marta'],
    ['Qual seleção venceu o ouro olímpico feminino de futebol em 2020?', 'Canadá', ['Suécia', 'Estados Unidos', 'Brasil'], 'O Canadá venceu a Suécia nos pênaltis na final dos Jogos de Tóquio, realizada em 2021.', 'COI — arquivo olímpico'],
    ['Qual seleção conquistou o ouro olímpico masculino de futebol em 2016?', 'Brasil', ['Alemanha', 'Nigéria', 'México'], 'O Brasil venceu a Alemanha nos pênaltis no Maracanã.', 'COI — arquivo olímpico'],
    ['Qual foi o placar da final da Copa do Mundo masculina de 2018?', 'França 4 x 2 Croácia', ['França 2 x 1 Croácia', 'França 3 x 0 Croácia', 'França 4 x 1 Croácia'], 'A França venceu a Croácia por 4 a 2 em Moscou.', 'FIFA — arquivo histórico'],
    ['Qual foi o placar da final da Copa do Mundo masculina de 2022 no tempo normal e na prorrogação?', '3 x 3', ['2 x 2', '4 x 3', '3 x 2'], 'Argentina e França empataram em 3 a 3; a Argentina venceu nos pênaltis.', 'FIFA — arquivo histórico'],
    ['Qual clube venceu o Mundial de Clubes de 2005 contra o Liverpool?', 'São Paulo', ['Santos', 'Internacional', 'Corinthians'], 'O São Paulo venceu o Liverpool por 1 a 0 na final de Yokohama.', 'FIFA — arquivo de competições'],
    ['Qual clube brasileiro venceu o Mundial de Clubes de 2006?', 'Internacional', ['São Paulo', 'Santos', 'Grêmio'], 'O Internacional venceu o Barcelona na final de 2006.', 'FIFA — arquivo de competições'],
    ['Qual clube venceu o Mundial de Clubes de 2012 contra o Chelsea?', 'Corinthians', ['Santos', 'São Paulo', 'Flamengo'], 'O Corinthians venceu o Chelsea por 1 a 0 na final disputada no Japão.', 'FIFA — arquivo de competições'],
    ['Qual clube venceu a Copa Intercontinental de 1981 contra o Liverpool?', 'Flamengo', ['Grêmio', 'São Paulo', 'Santos'], 'O Flamengo venceu o Liverpool por 3 a 0 em Tóquio.', 'FIFA — arquivo de competições'],
    ['Qual seleção venceu a Euro de 2004?', 'Grécia', ['Portugal', 'República Tcheca', 'França'], 'A Grécia surpreendeu ao vencer Portugal na final da Euro 2004.', 'UEFA — arquivo da Eurocopa'],
    ['Qual seleção venceu a Euro de 2008?', 'Espanha', ['Alemanha', 'Itália', 'Rússia'], 'A Espanha venceu a Alemanha na final da Euro 2008.', 'UEFA — arquivo da Eurocopa'],
    ['Qual seleção venceu a Euro de 2012?', 'Espanha', ['Itália', 'Alemanha', 'Portugal'], 'A Espanha venceu a Itália por 4 a 0 na final de 2012.', 'UEFA — arquivo da Eurocopa'],
    ['Qual seleção venceu a Copa América de 2019?', 'Brasil', ['Peru', 'Argentina', 'Chile'], 'O Brasil venceu o Peru na final da Copa América de 2019.', 'CONMEBOL — arquivo da Copa América'],
    ['Qual seleção venceu a Copa América de 2015?', 'Chile', ['Argentina', 'Brasil', 'Uruguai'], 'O Chile conquistou seu primeiro título da Copa América em 2015.', 'CONMEBOL — arquivo da Copa América'],
    ['Qual seleção venceu a Copa América de 2016?', 'Chile', ['Argentina', 'Colômbia', 'Estados Unidos'], 'O Chile venceu a Argentina nos pênaltis na edição centenária de 2016.', 'CONMEBOL — arquivo da Copa América'],
    ['Qual clube venceu a Libertadores de 2017?', 'Grêmio', ['Lanús', 'River Plate', 'Boca Juniors'], 'O Grêmio venceu o Lanús na final da Libertadores de 2017.', 'CONMEBOL — arquivo da Libertadores'],
    ['Qual clube venceu a Libertadores de 2021?', 'Palmeiras', ['Flamengo', 'Atlético Mineiro', 'River Plate'], 'O Palmeiras venceu o Flamengo na final de Montevidéu.', 'CONMEBOL — arquivo da Libertadores'],
    ['Qual clube venceu a Libertadores de 2022?', 'Flamengo', ['Athletico Paranaense', 'Palmeiras', 'River Plate'], 'O Flamengo venceu o Athletico Paranaense na final de Guayaquil.', 'CONMEBOL — arquivo da Libertadores'],
    ['Qual seleção venceu a Copa do Mundo masculina de 1986?', 'Argentina', ['Alemanha Ocidental', 'Brasil', 'França'], 'A Argentina de Diego Maradona venceu o torneio disputado no México.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo masculina de 1982?', 'Itália', ['Brasil', 'Alemanha Ocidental', 'Argentina'], 'A Itália venceu a Alemanha Ocidental na final de Madri.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo masculina de 1978?', 'Argentina', ['Países Baixos', 'Brasil', 'Itália'], 'A Argentina venceu os Países Baixos na prorrogação da final de 1978.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo masculina de 1954?', 'Alemanha Ocidental', ['Hungria', 'Áustria', 'Brasil'], 'A Alemanha Ocidental venceu a Hungria na final conhecida como Milagre de Berna.', 'FIFA — arquivo histórico'],
    ['Qual clube inglês ficou invicto na Premier League 2003/04?', 'Arsenal', ['Chelsea', 'Liverpool', 'Manchester United'], 'O Arsenal terminou a Premier League 2003/04 sem derrotas.', 'Premier League — arquivo histórico'],
    ['Qual clube venceu a Premier League de 2015/16 em uma campanha surpreendente?', 'Leicester City', ['Tottenham Hotspur', 'Arsenal', 'Chelsea'], 'O Leicester City conquistou seu primeiro título da Premier League em 2015/16.', 'Premier League — arquivo histórico'],
    ['Qual clube venceu a Champions League de 2014 com o gol de Sergio Ramos nos acréscimos?', 'Real Madrid', ['Atlético de Madrid', 'Bayern de Munique', 'Chelsea'], 'O Real Madrid empatou a final contra o Atlético e venceu na prorrogação.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2022?', 'Real Madrid', ['Liverpool', 'Manchester City', 'Bayern de Munique'], 'O Real Madrid venceu o Liverpool na final de Paris.', 'UEFA — arquivo da Champions League'],
    ['Qual país venceu a primeira Eurocopa, em 1960?', 'União Soviética', ['Iugoslávia', 'França', 'Espanha'], 'A União Soviética venceu a primeira edição da Eurocopa, em 1960.', 'UEFA — arquivo da Eurocopa'],
    ['Quantos jogadores podem compor uma barreira defensiva se a equipe escolher colocá-la?', 'Qualquer número de jogadores, respeitando a distância regulamentar', ['Exatamente três', 'Exatamente quatro', 'No máximo dois'], 'As regras não fixam um número de jogadores na barreira; os adversários devem respeitar a distância.', 'Regra 13 — IFAB'],
    ['Qual tecnologia detecta se a bola cruzou completamente a linha do gol?', 'Tecnologia da linha do gol', ['VAR de impedimento', 'GPS do árbitro', 'Áudio do estádio'], 'A tecnologia da linha do gol informa aos árbitros se a bola ultrapassou completamente a linha.', 'Regras do Jogo — IFAB'],
    ['Qual país venceu a Copa do Mundo masculina de 1934?', 'Itália', ['Tchecoslováquia', 'Alemanha', 'Áustria'], 'A Itália venceu a Tchecoslováquia na final de 1934.', 'FIFA — arquivo histórico'],
    ['Qual país venceu a Copa do Mundo masculina de 1938?', 'Itália', ['Hungria', 'Brasil', 'França'], 'A Itália conquistou o bicampeonato mundial em 1938.', 'FIFA — arquivo histórico'],
    ['Qual seleção venceu a Copa do Mundo masculina de 1950?', 'Uruguai', ['Brasil', 'Suécia', 'Espanha'], 'O Uruguai venceu o jogo decisivo contra o Brasil no Maracanã e conquistou a Copa de 1950.', 'FIFA — arquivo histórico'],
    ['Qual clube venceu o Campeonato Brasileiro de 2009?', 'Flamengo', ['Internacional', 'São Paulo', 'Palmeiras'], 'O Flamengo conquistou o Brasileirão de 2009.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Campeonato Brasileiro de 2005?', 'Corinthians', ['Internacional', 'São Paulo', 'Santos'], 'O Corinthians conquistou o Campeonato Brasileiro de 2005.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Campeonato Brasileiro de 2004?', 'Santos', ['Athletico Paranaense', 'São Paulo', 'Corinthians'], 'O Santos venceu o Campeonato Brasileiro de 2004.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Campeonato Brasileiro de 2006?', 'São Paulo', ['Internacional', 'Grêmio', 'Santos'], 'O São Paulo iniciou em 2006 uma sequência de três títulos brasileiros consecutivos.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Campeonato Brasileiro de 2007?', 'São Paulo', ['Santos', 'Fluminense', 'Palmeiras'], 'O São Paulo conquistou o Brasileirão de 2007.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Campeonato Brasileiro de 2008?', 'São Paulo', ['Grêmio', 'Cruzeiro', 'Flamengo'], 'O São Paulo completou o tricampeonato consecutivo em 2008.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Campeonato Brasileiro de 2001?', 'Athletico Paranaense', ['São Caetano', 'Flamengo', 'Grêmio'], 'O Athletico Paranaense venceu o Campeonato Brasileiro de 2001.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Campeonato Brasileiro de 1995?', 'Botafogo', ['Santos', 'Fluminense', 'Grêmio'], 'O Botafogo venceu o Santos na final do Campeonato Brasileiro de 1995.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual clube venceu o Campeonato Brasileiro de 1987 segundo o reconhecimento oficial da CBF?', 'Sport Recife', ['Flamengo', 'Guarani', 'Internacional'], 'A CBF reconhece o Sport como campeão brasileiro de 1987.', 'CBF — arquivo do Campeonato Brasileiro'],
    ['Qual país venceu a Copa do Mundo masculina de 1966?', 'Inglaterra', ['Alemanha Ocidental', 'Portugal', 'União Soviética'], 'A Inglaterra venceu a Alemanha Ocidental na final de 1966.', 'FIFA — arquivo histórico'],
    ['Qual clube venceu a Champions League de 2008?', 'Manchester United', ['Chelsea', 'Barcelona', 'Liverpool'], 'O Manchester United venceu o Chelsea nos pênaltis na final de Moscou.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2010?', 'Internazionale', ['Bayern de Munique', 'Barcelona', 'Real Madrid'], 'A Internazionale venceu o Bayern de Munique na final de Madri.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2011?', 'Barcelona', ['Manchester United', 'Real Madrid', 'Chelsea'], 'O Barcelona venceu o Manchester United na final de Wembley.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2015?', 'Barcelona', ['Juventus', 'Real Madrid', 'Bayern de Munique'], 'O Barcelona venceu a Juventus na final de Berlim.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2019?', 'Liverpool', ['Tottenham', 'Real Madrid', 'Ajax'], 'O Liverpool derrotou o Tottenham na final de Madri.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2021?', 'Chelsea', ['Manchester City', 'Real Madrid', 'Paris Saint-Germain'], 'O Chelsea venceu o Manchester City na final do Porto.', 'UEFA — arquivo da Champions League'],
    ['Qual clube venceu a Champions League de 2024?', 'Real Madrid', ['Borussia Dortmund', 'Bayern de Munique', 'Paris Saint-Germain'], 'O Real Madrid derrotou o Borussia Dortmund na final de Wembley.', 'UEFA — arquivo da Champions League']
];

EXTRA_FACTS.forEach(([question, answer, distractors, explanation, source], index) => {
    const category = source.startsWith('CBF') ? 'Futebol brasileiro'
        : source.startsWith('CONMEBOL') ? 'Competições sul-americanas'
        : source.startsWith('UEFA') ? 'Competições internacionais'
        : source.startsWith('COI') ? 'Futebol feminino'
        : source.startsWith('Regra') ? 'Regras do futebol'
        : source.includes('Feminina') || source.includes('Marta') ? 'Futebol feminino'
        : 'Copa do Mundo';
    addQuestion(question, answer, distractors, category, DIFFICULTIES[(index + 3) % 4], explanation, explanation, source);
});

function validateQuestionBank(questions = QUESTION_BANK) {
    const ids = new Set();
    const texts = new Set();
    const errors = [];
    questions.forEach((question, index) => {
        const label = question && question.id ? question.id : `linha ${index + 1}`;
        if (!question || !question.id || ids.has(question.id)) errors.push(`${label}: ID ausente ou repetido`);
        else ids.add(question.id);
        const normalized = question && typeof question.question === 'string'
            ? question.question.trim().toLocaleLowerCase('pt-BR') : '';
        if (!normalized || texts.has(normalized)) errors.push(`${label}: pergunta ausente ou repetida`);
        else texts.add(normalized);
        if (!Array.isArray(question && question.options) || question.options.length !== 4
            || question.options.some(option => typeof option !== 'string' || !option.trim())
            || new Set(question.options).size !== 4) {
            errors.push(`${label}: deve conter quatro alternativas distintas`);
        }
        if (!Number.isInteger(question && question.correct)
            || question.correct < 0 || question.correct >= (question.options || []).length) {
            errors.push(`${label}: índice de resposta correta inválido`);
        }
        if (!question || !question.category || !DIFFICULTIES.includes(question.difficulty)
            || !question.explanation || !question.source) {
            errors.push(`${label}: categoria, dificuldade, explicação ou fonte ausente`);
        }
    });
    if (errors.length) throw new Error(`Banco de perguntas inválido:\n${errors.join('\n')}`);
    return true;
}

validateQuestionBank();

class User {
    constructor(username, email) {
        this.id = Date.now() + Math.floor(Math.random() * 1000);
        this.username = username.trim();
        this.email = User.normalizeEmail(email);
        this.createdAt = new Date().toISOString();
        this.quizzes = [];
        this.achievements = [];
    }

    static normalizeEmail(email) {
        return String(email || '').trim().toLowerCase();
    }

    addQuiz(quizResult) {
        this.quizzes.push(quizResult);
    }

    getTotalScore() {
        if (!this.quizzes.length) return 0;
        return Math.round(this.quizzes.reduce((sum, quiz) => sum + Number(quiz.score || 0), 0) / this.quizzes.length);
    }

    getBestScore() {
        return this.quizzes.reduce((best, quiz) => Math.max(best, Number(quiz.score || 0)), 0);
    }

    getStatistics() {
        const answers = this.quizzes.flatMap(quiz => quiz.answers || []);
        const correct = answers.filter(answer => answer.isCorrect).length;
        return {
            totalQuizzes: this.quizzes.length,
            bestScore: this.getBestScore(),
            averageScore: this.getTotalScore(),
            totalCorrect: correct,
            totalQuestions: answers.length,
            percentage: answers.length ? Math.round(correct / answers.length * 100) : 0
        };
    }
}

class QuizResult {
    constructor(userId) {
        this.id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        this.userId = userId;
        this.completedAt = new Date().toISOString();
        this.answers = [];
        this.score = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.mode = 'classic';
        this.difficulty = 'aleatorio';
        this.category = 'Todas';
        this.timeUsed = 0;
        this.bestStreak = 0;
    }

    addAnswer(question, selectedOptionIndex, points = 0, skipped = false) {
        if (this.answers.some(answer => answer.questionId === question.id)) return false;
        const isCorrect = !skipped && selectedOptionIndex === question.correct;
        this.answers.push({
            questionId: question.id,
            selectedOption: selectedOptionIndex,
            selectedText: selectedOptionIndex >= 0 ? question.options[selectedOptionIndex] : 'Pergunta pulada',
            correctOption: question.correct,
            correctText: question.options[question.correct],
            isCorrect,
            skipped,
            points: isCorrect ? points : 0,
            question: question.question,
            explanation: question.explanation,
            category: question.category,
            source: question.source || ''
        });
        this.correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
        this.score = this.answers.reduce((sum, answer) => sum + answer.points, 0);
        this.totalQuestions = this.answers.length;
        return true;
    }

    calculateScore() {
        this.answers = this.answers.filter((answer, index, list) =>
            list.findIndex(candidate => candidate.questionId === answer.questionId) === index);
        this.correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
        this.score = this.answers.reduce((sum, answer) => sum + Number(answer.points || 0), 0);
        this.totalQuestions = this.answers.length;
        return this.score;
    }

    getPercentage() {
        const total = this.totalQuestions || this.answers.length || 1;
        return Math.round(this.correctAnswers / total * 100);
    }
}

class Database {
    constructor() {
        this.readError = null;
        try {
            this.users = this.loadUsers();
        } catch (error) {
            console.error('Não foi possível carregar os dados locais do quiz.', error);
            this.readError = error;
            this.users = [];
        }
        this.currentUser = null;
    }

    loadUsers() {
        const data = localStorage.getItem('quiz_users');
        if (!data) return [];
        const parsedData = JSON.parse(data);
        if (!Array.isArray(parsedData)) throw new Error('Os dados locais dos usuários estão inválidos.');
        return parsedData.map(userData => {
            const user = Object.assign(new User(userData.username, userData.email), userData);
            user.quizzes = (userData.quizzes || []).map(quizData => Object.assign(new QuizResult(user.id), quizData));
            return user;
        });
    }

    saveUsers() {
        if (this.readError) {
            return { success: false, message: 'Os dados locais não puderam ser lidos; eles não serão sobrescritos.' };
        }
        try {
            localStorage.setItem('quiz_users', JSON.stringify(this.users));
            return { success: true };
        } catch (error) {
            console.error('Não foi possível salvar os dados locais do quiz.', error);
            return { success: false, message: 'Não foi possível salvar no navegador. Verifique o espaço e as permissões de armazenamento.' };
        }
    }

    createUser(username, email) {
        if (!username.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return { success: false, message: 'Informe um nome e um e-mail válido.' };
        }
        if (this.getUserByEmail(email)) return { success: false, message: 'Usuário com este e-mail já existe.' };
        const user = new User(username, email);
        this.users.push(user);
        const saved = this.saveUsers();
        if (!saved.success) {
            this.users.pop();
            return saved;
        }
        this.currentUser = user;
        return { success: true, message: 'Usuário criado com sucesso.', user };
    }

    getUserByEmail(email) {
        const normalizedEmail = User.normalizeEmail(email);
        return this.users.find(user => User.normalizeEmail(user.email) === normalizedEmail);
    }

    getUserByUsername(username) {
        const normalizedName = String(username || '').trim().toLowerCase();
        return this.users.find(user => user.username.trim().toLowerCase() === normalizedName);
    }

    getAllUsers() {
        return this.users.slice();
    }

    getLeaderboard(limit = 10) {
        return this.getAllUsers()
            .map(user => ({
                id: user.id,
                username: user.username,
                bestScore: user.getBestScore(),
                averageScore: user.getTotalScore(),
                totalQuizzes: user.quizzes.length
            }))
            .sort((a, b) => b.bestScore - a.bestScore || b.averageScore - a.averageScore || b.totalQuizzes - a.totalQuizzes)
            .slice(0, limit);
    }

    loginUser(email, username = '') {
        const user = this.getUserByEmail(email) || this.getUserByUsername(username);
        if (!user) return { success: false, message: 'Usuário não encontrado.' };
        this.currentUser = user;
        return { success: true, message: 'Login realizado com sucesso.', user };
    }

    saveQuizResult(quizResult) {
        if (!this.currentUser) return { success: false, message: 'Nenhum usuário está conectado.' };
        this.currentUser.addQuiz(quizResult);
        const saved = this.saveUsers();
        if (!saved.success) {
            this.currentUser.quizzes.pop();
            return saved;
        }
        return { success: true, message: 'Resultado salvo.' };
    }

    getCurrentUserQuizzes() {
        return this.currentUser ? this.currentUser.quizzes : [];
    }

    getCurrentUserStats() {
        return this.currentUser ? this.currentUser.getStatistics() : null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    logoutUser() {
        this.currentUser = null;
    }

    updateUser(userId, username, email) {
        const user = this.users.find(candidate => candidate.id === userId);
        if (!user) return { success: false, message: 'Usuário não encontrado.' };
        if (!username.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return { success: false, message: 'Informe um nome e um e-mail válido.' };
        }
        const normalizedEmail = User.normalizeEmail(email);
        if (this.users.some(candidate => candidate.id !== userId && User.normalizeEmail(candidate.email) === normalizedEmail)) {
            return { success: false, message: 'Este e-mail já está sendo usado.' };
        }
        const previous = { username: user.username, email: user.email };
        user.username = username.trim();
        user.email = normalizedEmail;
        const saved = this.saveUsers();
        if (!saved.success) {
            Object.assign(user, previous);
            return saved;
        }
        return { success: true, message: 'Dados atualizados.', user };
    }

    deleteUserById(userId) {
        const index = this.users.findIndex(user => user.id === userId);
        if (index < 0) return { success: false, message: 'Usuário não encontrado.' };
        const [deleted] = this.users.splice(index, 1);
        const saved = this.saveUsers();
        if (!saved.success) {
            this.users.splice(index, 0, deleted);
            return saved;
        }
        if (this.currentUser && this.currentUser.id === userId) this.currentUser = null;
        return { success: true };
    }

    deleteCurrentUser() {
        if (!this.currentUser) return { success: false, message: 'Nenhum usuário está conectado.' };
        return this.deleteUserById(this.currentUser.id);
    }

    getFormattedDate(isoString) {
        return new Date(isoString).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }
}

const db = new Database();
