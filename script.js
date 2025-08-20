// Elementos Principais
const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const telaFinal = document.getElementById('tela-final');

const btnIniciar = document.getElementById('btn-iniciar');
const btnReiniciar = document.getElementById('btn-reiniciar');

const tituloJogo = document.getElementById('titulo-jogo');
const alvosContainer = document.querySelector('.alvos-container');
const blocosContainer = document.querySelector('.blocos-container');

const pontuacaoSpan = document.getElementById('pontuacao');
const pontuacaoFinal = document.getElementById('pontuacao-final');

// SONS DE FEEDBACK
const somAcerto = new Audio('sons/acerto.mp3');
const somErro = new Audio('sons/erro.mp3');

let pontuacao = 0; // contador de pontos
let jogoData = null; // dados carregados do JSON
let tempo = 0; // tempo em segundos
let intervaloTempo = null;

// INICIAR JOGO
btnIniciar.addEventListener('click', () => {
    telaInicial.classList.remove('ativa');
    telaJogo.classList.add('ativa');
    iniciarJogo();
});

btnReiniciar.addEventListener('click', () => {
    // Resetar pontuação e telas
    pontuacao = 0;
    pontuacaoSpan.textContent = pontuacao;
    alvosContainer.innerHTML = '';
    blocosContainer.innerHTML = '';
    telaFinal.classList.remove('ativa');
    telaInicial.classList.add('ativa');
});

// CARREGAR JSON DO JOGO
async function carregarJogo() {
    try {
        const response = await fetch('jogo.json');
        jogoData = await response.json();
    } catch (error) {
        console.error('Erro ao carregar o jogo:', error);
    }
}

// Iniciar e atualizar o temporizador
function iniciarTemporizador() {
    tempo = 0;
    const tempoSpan = document.getElementById('tempo');
    tempoSpan.textContent = tempo;

    // Atualiza o temporizador a cada segundo
    intervaloTempo = setInterval(() => {
        tempo += 1;
        tempoSpan.textContent = tempo;
    }, 1000);
}

function pararTemporizador() {
    clearInterval(intervaloTempo);
}

// INICIAR JOGO
async function iniciarJogo() {
    await carregarJogo();
    if (!jogoData) return;

    // Atualizar título dinamicamente
    tituloJogo.textContent = jogoData.titulo;

    // Criar alvos e blocos arrastáveis
    criarAlvos();
    criarBlocos();

    // Iniciar temporizador
    iniciarTemporizador();
}

// CRIAR ALVOS
function criarAlvos() {
    jogoData.etapas.forEach(etapa => {
        const alvo = document.createElement('div');
        alvo.classList.add('alvo');
        alvo.textContent = etapa.nome;

    // Permitir drop
    alvo.addEventListener('dragover', e => e.preventDefault());

    alvo.addEventListener('drop', e => {
        const blocoId = e.dataTransfer.getData('text');
        const bloco = document.getElementById(blocoId);

        // Verificação do acerto
        const descricaoCorreta = jogoData.etapas.find(item => item.nome === alvo.textContent).descricao;

        if (bloco.textContent === descricaoCorreta) {
            // ACERTO
            alvo.appendChild(bloco);
            bloco.style.position = 'static';
            bloco.classList.add('correto');
            bloco.setAttribute('draggable', 'false'); // bloqueia movimento
            pontuacao += 1;
            pontuacaoSpan.textContent = pontuacao;

            // Tocar som de acerto
            somAcerto.currentTime = 0;
            somAcerto.play();
        } else {
            // ERRO
            bloco.classList.add('errado');

            // Tocar som de erro
            somErro.currentTime = 0;
            somErro.play();

            setTimeout(() => {
                bloco.classList.remove('errado');
                // Voltar o bloco para o container original
                blocosContainer.appendChild(bloco);
                bloco.style.position = 'static';
            }, 800);
        }

        // Checagem de conclusão
        if (pontuacao === jogoData.etapas.length) {
            setTimeout(finalizarJogo, 500);
        }
    });

    alvosContainer.appendChild(alvo);
    });
}

// FINALIZAR JOGO
function finalizarJogo() {
    telaJogo.classList.remove('ativa');
    telaFinal.classList.add('ativa');
    pontuacaoFinal.textContent = pontuacao;

    // Parar temporizador
    pararTemporizador();
}

// CRIAR BLOCOS ARRASTÁVEIS
function criarBlocos() {
    jogoData.etapas.forEach((etapa, index) => {
        const bloco = document.createElement('div');
        bloco.classList.add('bloco');
        bloco.setAttribute('draggable', 'true');
        bloco.id = `bloco-${index}`;
        bloco.textContent = etapa.descricao;

        // Evento de drag
        bloco.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text', bloco.id);
        });

        blocosContainer.appendChild(bloco);
    });
}
