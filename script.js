// Elementos Principais
const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const telaFinal = document.getElementById('tela-final');

const btnIniciar = document.getElementById('btn-iniciar');
const btnReiniciar = document.getElementById('btn-reiniciar');

const pontuacaoSpan = document.getElementById('pontuacao');
const pontuacaoFinal = document.getElementById('pontuacao-final');
const tempoSpan = document.getElementById('tempo');

// SONS DE FEEDBACK
const somAcerto = new Audio('sons/acerto.mp3');
const somErro = new Audio('sons/erro.mp3');

let todasEtapas = []; // irá armazenar todas as perguntas de todos os capítulos
let etapaAtual = 0; // Índice da pergunta atual
let pontuacao = 0; // contador de pontos
let tempoRestante = 90;
let timer = null;

// INICIAR JOGO
btnIniciar.addEventListener('click', () => {
    carregarTodosCapitulos(); // inicia o jogo
});

btnReiniciar.addEventListener('click', () => {
    // Resetar o jogo
    todasEtapas = [];
    etapaAtual = 0;
    pontuacao = 0;
    tempoRestante = 90;

    pontuacaoSpan.textContent = pontuacao;

    telaFinal.classList.remove('ativa');
    telaInicial.classList.add('ativa');
});

// CARREGAR TODOS OS CAPÍTULOS
async function carregarTodosCapitulos() {
    // Lista dos arquivos JSON dos capítulos
    const capitulos = [
        "capitulo1.json",
        "capitulo2.json",
        "capitulo3.json",
        "capitulo4.json",
        "capitulo5.json"
    ];

    try {
        for (let cap of capitulos) {
            const response = await fetch(cap);
            const data = await response.json();
            todasEtapas = todasEtapas.concat(data.etapas); // Une todas as etapas
        }

        //Após carredar os capitulos, inicia o jogo
        iniciarJogo();

    } catch (error) {
        console.error('Erro ao carregar o jogo:', error);
    }
}

// FUNÇÃO INICIAR JOGO
function iniciarJogo() {
    // Esconde tela inicial e mostra tela de jogo
    telaInicial.classList.remove('ativa');
    telaJogo.classList.add('ativa');

    etapaAtual = 0;
    pontuacao = 0;
    tempoRestante = 90;
    atualizarPontuacao();

    // Inicia temporizador
    tempoSpan.textContent = tempoRestante;
    timer = setInterval(() => {
        tempoRestante--;
        tempoSpan.textContent = tempoRestante;

        if (tempoRestante <= 0) {
            clearInterval(timer);
            finalizarJogo();
        }
    }, 1000);

    // Mostra primeira pergunta
    mostrarEtapa();
}

// FUNÇÃO MOSTRAR ETAPA ATUAL
function mostrarEtapa() {
    if (etapaAtual >= todasEtapas.length) {
        etapaAtual = 0; // Se acabar todas perguntas, reinicia lista
    }

    const etapa = todasEtapas[etapaAtual];

    // Cria container de pergunta e opções
    const perguntaContainer = document.getElementById('pergunta');
    const opcoesContainer = document.getElementById('opcoes');

    perguntaContainer.textContent = etapa.descricao;

    // Criar opções embaralhadas (3 aleatórias + 1 correta)
    let opcoes = todasEtapas.map(e => e.nome); // pega todos os nomes
    opcoes = opcoes.sort(() => Math.random() - 0.5).slice(0, 3);

    // Garante que a opção correta esteja presente
    if (!opcoes.includes(etapa.nome)) {
        opcoes[Math.floor(Math.random() * 3)] = etapa.nome;
    }

    // Limpa opções anteriores
    opcoesContainer.innerHTML = "";

    opcoes.forEach(op => {
        const btn = document.createElement('button');
        btn.textContent = op;
        btn.classList.add('btn-opcao'); // você pode estilizar no CSS
        btn.addEventListener('click', () => verificarResposta(btn, op, etapa.nome));
        opcoesContainer.appendChild(btn);
    });
}

// FUNÇÃO VERIFICAR RESPOSTA
function verificarResposta(botao, resposta, correta) {
    const botoes = document.querySelectorAll('.btn-opcao');

    botoes.forEach(b => b.disabled = true);

    if (resposta === correta) {
        pontuacao++;
        botao.classList.add('correto');
        try { somAcerto.currentTime = 0; somAcerto.play(); } catch(e){}
    } else {
        botao.classList.add('incorreto');
        botoes.forEach(b => {
            if (b.textContent === correta) {
                b.classList.add('correto');
            }
        });
        try { somErro.currentTime = 0; somErro.play(); } catch(e){}
    }

    atualizarPontuacao();

    setTimeout(() => {
        etapaAtual++;
        mostrarEtapa();
    }, 1000); // passa para próxima pergunta
}

// ATUALIZA PONTUAÇÃO NA TELA
function atualizarPontuacao() {
    pontuacaoSpan.textContent = pontuacao;
}

// FINALIZAÇÃO DO JOGO
function finalizarJogo() {
    clearInterval(timer);

    telaJogo.classList.remove('ativa');
    telaFinal.classList.add('ativa');

    pontuacaoFinal.textContent = pontuacao;
    document.getElementById('tempo-final').textContent = 90; // tempo total de jogo
}