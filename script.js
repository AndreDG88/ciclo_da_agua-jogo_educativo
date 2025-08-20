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
let tempoDecorrido = 0;
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
    let tempoRestante = 60;
    tempoDecorrido = 0;
    const tempoSpan = document.getElementById('tempo');
    if (!tempoSpan) return;
    tempoSpan.textContent = tempoRestante;

    // Atualiza o temporizador a cada segundo
    intervaloTempo = setInterval(() => {
        tempoRestante -= 1;
        tempoDecorrido += 1;
        tempoSpan.textContent = tempoRestante;

        // Quando o tempo acabar, finaliza o jogo
        if (tempoRestante <= 0) {
            clearInterval(intervaloTempo);
            exibirTempoEsgotado();
        }
    }, 1000);
}

function pararTemporizador() {
    clearInterval(intervaloTempo);
}

// Exibir mensagem de tempo esgotado
function exibirTempoEsgotado() {
    pararTemporizador();

    telaJogo.classList.remove('ativa');
    telaFinal.classList.add('ativa');
    pontuacaoFinal.textContent = pontuacao;
    document.getElementById('tempo-final').textContent = tempoDecorrido;

    // Altera título para mensagem de tempo esgotado
    const tituloFinal = telaFinal.querySelector('h2');
    tituloFinal.textContent = "⏰ Tempo esgotado!";
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
    // Limpa o container antes de criar
    alvosContainer.innerHTML = '';

    jogoData.etapas.forEach((etapa, index) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('pergunta');

        const alvo = document.createElement('div');
        alvo.classList.add('alvo');
        alvo.textContent = etapa.nome;

        alvo.dataset.index = index;

    // Permitir drop
    alvo.addEventListener('dragover', e => e.preventDefault());

    alvo.addEventListener('drop', e => {
        e.preventDefault();
        const blocoId = e.dataTransfer.getData('text');
        const bloco = document.getElementById(blocoId);

        // Se bloco não existir, aborta
        if (!bloco) return;

        // Verificação do acerto
        if (bloco.dataset.index === alvo.dataset.index) {
            // ACERTO
            let slot = alvo.nextElementSibling;
            if (!slot || !slot.classList.contains('slot-resposta')) {
                slot = document.createElement('div');
                slot.classList.add('slot-resposta');
                alvo.insertAdjacentElement('afterend', slot);
            }

            // Coloca o bloco dentro do slot (assim ele ficará sempre abaixo do alvo)
            slot.appendChild(bloco);

            bloco.setAttribute('draggable', 'false');
            bloco.classList.add('correto');
            bloco.style.transform = ''; // remove possíveis transform de drag

            // Atualiza pontuação
            pontuacao += 1;
            pontuacaoSpan.textContent = pontuacao;

            // Tocar som de acerto
            try {
                somAcerto.currentTime = 0;
                somAcerto.play();
            } catch (err) {
                // se houver falha no som, não trava o jogo
            }
        } else {
            // ERRO: feedback visual + som
            bloco.classList.add('errado');
            try {
                somErro.currentTime = 0;
                somErro.play();
            } catch (err) {}

                setTimeout(() => {
                    bloco.classList.remove('errado');
                    // Voltar o bloco para o container original (se já não estiver lá)
                    if (!blocosContainer.contains(bloco)) {
                        blocosContainer.appendChild(bloco);
                        bloco.style.transform = '';
                    }
                }, 800);
            }

        // Checagem de conclusão
        if (pontuacao === jogoData.etapas.length) {
            setTimeout(finalizarJogo, 500);
        }
    });

        wrapper.appendChild(alvo);
        alvosContainer.appendChild(wrapper);
    });
}

// FINALIZAR JOGO
function finalizarJogo() {
    telaJogo.classList.remove('ativa');
    telaFinal.classList.add('ativa');
    pontuacaoFinal.textContent = pontuacao;
    document.getElementById('tempo-final').textContent = tempoDecorrido;

    // Parar temporizador
    pararTemporizador();

    const tituloFinal = telaFinal.querySelector('h2');
    tituloFinal.textContent = "🎉 Parabéns! Você concluiu o jogo!";
}

// CRIAR BLOCOS ARRASTÁVEIS
function criarBlocos() {
    jogoData.etapas.forEach((etapa, index) => {
        const bloco = document.createElement('div');
        bloco.classList.add('bloco');
        bloco.setAttribute('draggable', 'true');
        bloco.id = `bloco-${index}`;
        bloco.textContent = etapa.descricao;

        bloco.dataset.index = String(index);

        // Evento de drag
        bloco.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text', bloco.id);
        });

        blocosContainer.appendChild(bloco);
    });
}
