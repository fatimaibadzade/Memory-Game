
const FRUITS  = [
  {
      id: "apple",
      svg: "🍎"
  },
  {
      id: "banana",
      svg: "🍌"
  },
  {
      id: "mango",
      svg: "🥭"
  },
  {
      id: "pineapple",
      svg: "🍍"
  },
  {
      id: "strawberry",
      svg: "🍓"
  },
  {
      id: "orange",
      svg: "🍊"
  },
  {
      id: "watermelon",
      svg: "🍉"
  },
  {
      id: "avocado",
      svg: "🥑"
  }
];

const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const pairsEl = document.getElementById("pairs");
const winEl = document.getElementById("win");
const winTextEl = document.getElementById("win-text");

let deck = [];
let flipped = [];
let lock = false;
let moves = 0;
let matches = 0;
let seconds = 0;
let timerId = null;

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(total) {
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function startTimer() {
  if (timerId) return;
  timerId = setInterval(() => {
    seconds += 1;
    timerEl.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function updateStats() {
  movesEl.textContent = String(moves);
  pairsEl.textContent = `${matches}/8`;
  timerEl.textContent = formatTime(seconds);
}

function createCard(fruit, index) {
  const button = document.createElement("button");
  button.className = "card";
  button.type = "button";
  button.setAttribute("aria-label", "Закрытая карточка");
  button.dataset.id = fruit.id;
  button.dataset.index = String(index);
  button.innerHTML = `
    <span class="card-inner">
      <span class="card-face card-back"></span>
   <span class="card-face card-front">
  <span class="fruit">${fruit.svg}</span>
</span>
    </span>
  `;
  button.addEventListener("click", () => onCardClick(button));
  return button;
}

function onCardClick(card) {
  if (lock || card.classList.contains("is-flipped") || card.classList.contains("is-matched")) {
    return;
  }

  startTimer();
  card.classList.add("is-flipped");
  card.setAttribute("aria-label", card.dataset.id);
  flipped.push(card);

  if (flipped.length < 2) return;

  moves += 1;
  updateStats();

  const [first, second] = flipped;
  if (first.dataset.id === second.dataset.id) {
    first.classList.add("is-matched", "is-locked");
    second.classList.add("is-matched", "is-locked");
    flipped = [];
    matches += 1;
    updateStats();
    if (matches === 8) {
      stopTimer();
      winTextEl.textContent = `Все пары найдены за ${moves} ходов и ${formatTime(seconds)}.`;
      winEl.hidden = false;
    }
    return;
  }

  lock = true;
  setTimeout(() => {
    first.classList.remove("is-flipped");
    second.classList.remove("is-flipped");
    first.setAttribute("aria-label", "Закрытая карточка");
    second.setAttribute("aria-label", "Закрытая карточка");
    flipped = [];
    lock = false;
  }, 800);
}

function startGame() {
  stopTimer();
  deck = shuffle([...FRUITS, ...FRUITS]);
  flipped = [];
  lock = false;
  moves = 0;
  matches = 0;
  seconds = 0;
  winEl.hidden = true;
  updateStats();
  boardEl.replaceChildren(...deck.map(createCard));
}

document.getElementById("restart").addEventListener("click", startGame);
document.getElementById("play-again").addEventListener("click", startGame);

startGame();
