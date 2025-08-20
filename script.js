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

let pontuacao = 0; // contador de pontos
let jogoData = null; // dados carregados do JSON

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

// INICIAR JOGO
async function iniciarJogo() {
    await carregarJogo();
    if (!jogoData) return;

    // Atualizar título dinamicamente
    tituloJogo.textContent = jogoData.titulo;

    // Criar alvos e blocos arrastáveis
    criarAlvos();
    criarBlocos();
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

            // Apenas mover o bloco para o alvo
            alvo.appendChild(bloco);
            bloco.style.position = 'static';
        });

        alvosContainer.appendChild(alvo);
    });
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