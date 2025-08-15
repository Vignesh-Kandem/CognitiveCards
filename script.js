const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');


const logos = [
  'Images/img1.jpg',
  'Images/img2.jpg',
  'Images/img3.jpg',
  'Images/img4.jpg',
  'Images/img5.jpg',
  'Images/img6.jpg'
];

let cardsArray = [...logos, ...logos];
cardsArray.sort(() => 0.5 - Math.random());


cardsArray.forEach(logo => {
  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <img src="${logo}" alt="Car Logo" onerror="console.error('❌ Missing logo image:', this.src)">
      </div>
      <div class="card-back">
        <img src="Images/back.jpg" alt="Back" onerror="console.error('❌ Missing back image:', this.src)">
      </div>
    </div>
  `;

  gameBoard.appendChild(card);
});


document.querySelectorAll('.card').forEach(card =>
  card.addEventListener('click', flipCard)
);

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchesFound = 0;

let timer = 0;
let timerInterval = null;
let gameStarted = false;
let moves = 0;

function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerElement.textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  this.classList.add('flip');
  incrementMoves();

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function incrementMoves() {
  moves++;
  movesElement.textContent = moves;
}

function checkForMatch() {
  let isMatch =
    firstCard.querySelector('.card-front img').src ===
    secondCard.querySelector('.card-front img').src;

  if (isMatch) {
    disableCards();
    matchesFound++;
    if (matchesFound === logos.length) {
      stopTimer();
      setTimeout(() => {
        alert(`🎉 You finished in ${timer} seconds with ${moves} moves!`);
      }, 500);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}
