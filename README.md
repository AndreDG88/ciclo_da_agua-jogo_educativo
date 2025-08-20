# 🌧️ Ciclo da Água — Jogo Interativo Educativo

Este projeto é um jogo interativo educacional que ensina o Ciclo da Água de forma lúdica e envolvente. O jogador deve arrastar as descrições corretas para os respectivos nomes das etapas do ciclo, ganhando pontos por acertos e recebendo feedback visual e sonoro em caso de erro.

## Funcionalidades:

- Interface responsiva

- Sistema de pontuação

- Temporizador de 60 segundos

- Drag & Drop com feedback

- Tela inicial, jogo e tela de finalização

- Vídeo de fundo diferente para cada tela

- Sons de acerto e erro

- Exibição do tempo total gasto no final do jogo

## Tecnologias Utilizadas:

- HTML5

- CSS3

- JavaScript

- JSON (para estrutura de capítulos)

## Como Executar Localmente:

1. Clone o repositório:

git clone https://github.com/seu-usuario/ciclo-da-agua-jogo.git
cd ciclo-da-agua-jogo


2. Execute um servidor local (por exemplo, com Python ou Node.js):

# Se tiver Python 3
python -m http.server

# Ou com npx
npx serve


3. Acesse no navegador:

http://localhost:8000


Recomendado usar navegadores modernos (Chrome, Edge, Firefox).
Funciona em dispositivos móveis, mas o drag-and-drop não funcionar em dispositivos mobile.

Estrutura de Arquivos:

ciclo-da-agua-jogo/
├── index.html
├── style.css
├── script.js
├── jogo.json
├── sons/
│   ├── acerto.mp3
│   └── erro.mp3
└── videos/
    ├── inicial-final.mp4
    └── jogo.mp4

## Possível Escalaevolução do projeto para Múltiplos Capítulos e Disciplinas:

Se o jogo precisasse ser replicado para dezenas de capítulos de diferentes disciplinas (como ciências, matemática, história etc.), a melhor abordagem seria modularizar e automatizar a estrutura de dados e carregamento dos capítulos.

### Sugestão de Organização e Escalabilidade:

1. Transformar cada capítulo em um arquivo JSON separado

dados/
├── ciencias-capitulo-1.json
├── ciencias-capitulo-2.json
├── historia-capitulo-1.json
└── matematica-capitulo-3.json

Cada arquivo JSON teria o mesmo formato:

{
  "titulo": "Capítulo X - Tema",
  "etapas": [
    { "nome": "Etapa 1", "descricao": "..." },
    { "nome": "Etapa 2", "descricao": "..." }
  ]
}

2. Adicionar uma tela de seleção de capítulo

Ao iniciar o jogo, o usuário escolhe o capítulo/disciplina desejado a partir de uma lista carregada dinamicamente com JavaScript.

3. Carregar JSON com base na escolha do usuário

No script.js, adaptar a função de carregamento para algo como:

async function carregarJogo(caminhoJson) {
  const response = await fetch(caminhoJson);
  jogoData = await response.json();
}

## OBS:
Foi utilizado o drag-and-drop como pedido no briefing do projeto, mas ele não é bem suportado em dispositivos touch, como celulares e tablets, principalmente no Safari (iOS). Seria recomendado usar bibliotecas como: 

- SortableJS

- Interact.js

- Draggable

Elas funcionam bem com toque e mouse, mantendo a responsividade.