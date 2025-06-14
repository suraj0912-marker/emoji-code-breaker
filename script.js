let emojis = ["😀", "😎", "🤖", "👻", "🎮", "🍕", "🚀", "🐱"];
let secretCode = [];
let currentGuess = [];
let guessCount = 0;
let gameOver = false;
const maxGuesses = 10;

let totalWins = parseInt(localStorage.getItem("totalWins")) || 0;
let totalLosses = parseInt(localStorage.getItem("totalLosses")) || 0;

const picker = document.getElementById("emoji-picker");
const current = document.getElementById("current-guess");
const board = document.getElementById("game-board");
const msg = document.getElementById("message");
const score = document.getElementById("score");
const submit = document.getElementById("submit-btn");
const reset = document.getElementById("reset-btn");
const level = document.getElementById("difficulty");

const soundClick = document.getElementById("click-sound");
const soundSuccess = document.getElementById("success-sound");
const soundFail = document.getElementById("fail-sound");

function updateDifficulty() {
  if (level.value === "easy") {
    emojis = ["😀", "😎", "🍕", "👻"];
  } else if (level.value === "medium") {
    emojis = ["😀", "😎", "🍕", "👻", "🤖", "🚀"];
  } else {
    emojis = ["😀", "😎", "🍕", "👻", "🤖", "🚀", "🎮", "🐱"];
  }
}

function createCode() {
  secretCode = [];
  while (secretCode.length < 4) {
    let pick = emojis[Math.floor(Math.random() * emojis.length)];
    if (!secretCode.includes(pick)) {
      secretCode.push(pick);
    }
  }
}

function drawPicker() {
  picker.innerHTML = "";
  emojis.forEach((em) => {
    let btn = document.createElement("button");
    btn.textContent = em;
    btn.addEventListener("click", () => {
      if (currentGuess.length < 4 && !gameOver) {
        soundClick.play();
        currentGuess.push(em);
        drawGuess();
      }
    });
    picker.appendChild(btn);
  });
}

function drawGuess() {
  current.innerHTML = "";
  currentGuess.forEach((em) => {
    let box = document.createElement("div");
    box.className = "emoji-box";
    box.textContent = em;
    current.appendChild(box);
  });
}

function updateScore() {
  score.textContent = `Wins: ${totalWins} | Losses: ${totalLosses}`;
}

submit.addEventListener("click", () => {
  if (gameOver) return;
  if (currentGuess.length !== 4) {
    msg.textContent = "Select 4 emojis first.";
    return;
  }

  let row = document.createElement("div");
  row.className = "emoji-row";
  let feedback = [];

  for (let i = 0; i < 4; i++) {
    let box = document.createElement("div");
    box.className = "emoji-box";
    box.textContent = currentGuess[i];

    if (currentGuess[i] === secretCode[i]) {
      box.classList.add("correct");
      feedback.push("correct");
    } else if (secretCode.includes(currentGuess[i])) {
      box.classList.add("partial");
      feedback.push("partial");
    } else {
      box.classList.add("wrong");
      feedback.push("wrong");
    }

    row.appendChild(box);
  }

  board.appendChild(row);
  guessCount++;

  if (feedback.every((f) => f === "correct")) {
    msg.textContent = "🎉 You cracked the code!";
    soundSuccess.play();
    gameOver = true;
    totalWins++;
    localStorage.setItem("totalWins", totalWins);
  } else if (guessCount >= maxGuesses) {
    msg.textContent = `❌ Out of tries. Code was: ${secretCode.join(" ")}`;
    soundFail.play();
    gameOver = true;
    totalLosses++;
    localStorage.setItem("totalLosses", totalLosses);
  } else {
    msg.textContent = `Tries left: ${maxGuesses - guessCount}`;
  }

  updateScore();
  currentGuess = [];
  drawGuess();
});

reset.addEventListener("click", () => {
  board.innerHTML = "";
  currentGuess = [];
  guessCount = 0;
  gameOver = false;
  msg.textContent = "";
  updateDifficulty();
  createCode();
  drawPicker();
  drawGuess();
  updateScore();
});

level.addEventListener("change", () => {
  reset.click();
});

reset.click();
