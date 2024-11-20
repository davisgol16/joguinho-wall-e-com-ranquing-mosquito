const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playerNameInput = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const inputContainer = document.getElementById("input-container");
const rankingList = document.getElementById("rankingList");

canvas.width = 400;
canvas.height = 600;

let playerName = "";
let score = 0;
let isGameOver = false;

// Carregar imagem do Wall-E
const wallEImage = new Image();
wallEImage.src = "wall-e.png";

// Wall-E
const wallE = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 80,
  width: 50,
  height: 50,
  speed: 5,
};

// Lixo reciclável
const items = [];
const obstacles = [];

// Funções para itens e obstáculos
function createItem() {
  const x = Math.random() * (canvas.width - 30);
  items.push({ x, y: 0, width: 30, height: 30, color: "green" });
}

function createObstacle() {
  const x = Math.random() * (canvas.width - 30);
  obstacles.push({ x, y: 0, width: 30, height: 30, color: "red" });
}

// Movimento do Wall-E
let keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function moveWallE() {
  if (keys["ArrowLeft"] && wallE.x > 0) {
    wallE.x -= wallE.speed;
  }
  if (keys["ArrowRight"] && wallE.x < canvas.width - wallE.width) {
    wallE.x += wallE.speed;
  }
}

// Atualizar elementos
function update() {
  if (isGameOver) return;

  items.forEach((item, index) => {
    item.y += 3;
    if (item.y > canvas.height) items.splice(index, 1);

    if (
      item.x < wallE.x + wallE.width &&
      item.x + item.width > wallE.x &&
      item.y < wallE.y + wallE.height &&
      item.y + item.height > wallE.y
    ) {
      items.splice(index, 1);
      score++;
    }
  });

  obstacles.forEach((obstacle, index) => {
    obstacle.y += 3;
    if (obstacle.y > canvas.height) obstacles.splice(index, 1);

    if (
      obstacle.x < wallE.x + wallE.width &&
      obstacle.x + obstacle.width > wallE.x &&
      obstacle.y < wallE.y + wallE.height &&
      obstacle.y + obstacle.height > wallE.y
    ) {
      endGame();
    }
  });
}

// Desenhar elementos
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(wallEImage, wallE.x, wallE.y, wallE.width, wallE.height);

  items.forEach((item) => {
    ctx.fillStyle = item.color;
    ctx.fillRect(item.x, item.y, item.width, item.height);
  });

  obstacles.forEach((obstacle) => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  document.getElementById("score").textContent = `Pontuação: ${score}`;
}

function endGame() {
  isGameOver = true;
  saveScore(playerName, score);

  alert(`Fim de jogo! Pontuação final: ${score}`);
  document.location.reload();
}

function saveScore(name, score) {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ name, score });

  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem("ranking", JSON.stringify(ranking.slice(0, 5)));

  displayRanking();
}

function displayRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  rankingList.innerHTML = ranking
    .map((entry) => `<li>${entry.name}: ${entry.score} pontos</li>`)
    .join("");
}

function startGame() {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Por favor, insira seu nome!");
    return;
  }

  inputContainer.style.display = "none";
  canvas.style.display = "block";
  score = 0;
  isGameOver = false;

  displayRanking();

  setInterval(createItem, 2000);
  setInterval(createObstacle, 3000);
  gameLoop();
}

function gameLoop() {
  moveWallE();
  update();
  draw();
  if (!isGameOver) requestAnimationFrame(gameLoop);
}

startButton.addEventListener("click", startGame);
displayRanking();
