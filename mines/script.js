let grid = [];
let mines = [];
let betAmount = 0;
let totalMines = 0;
let revealedCells = 0;
let gameActive = false;
let multiplier = 1;

function startGame() {
  // Reset game state
  grid = [];
  mines = [];
  revealedCells = 0;
  multiplier = 1;
  gameActive = true;

  // Get input values
  betAmount = parseFloat(document.getElementById('amount').value);
  totalMines = parseInt(document.getElementById('mines').value);

  // Validate inputs
  if (isNaN(betAmount) || betAmount <= 0) {
    alert("Please enter a valid bet amount!");
    return;
  }
  if (isNaN(totalMines) || totalMines < 1 || totalMines > 24) {
    alert("Please enter a valid number of mines (1-24)!");
    return;
  }

  // Hide controls, show game board
  document.getElementById('gameControls').classList.add('hidden');
  document.getElementById('gameBoard').classList.remove('hidden');
  document.getElementById('cashoutBtn').classList.remove('hidden');

  // Update board info
  document.getElementById('currentBet').textContent = betAmount.toFixed(2);
  document.getElementById('currentMultiplier').textContent = multiplier.toFixed(2) + 'x';

  // Generate mines
  while (mines.length < totalMines) {
    const randomCell = Math.floor(Math.random() * 25);
    if (!mines.includes(randomCell)) {
      mines.push(randomCell);
    }
  }

  // Create grid
  const gridElement = document.getElementById('grid');
  gridElement.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    cell.dataset.index = i;
    cell.addEventListener('click', () => revealCell(i));
    gridElement.appendChild(cell);
  }
}

function revealCell(cellIndex) {
  if (!gameActive) return;

  const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
  
  // Check if cell already revealed
  if (cell.classList.contains('revealed')) return;

  // Check if mine
  if (mines.includes(cellIndex)) {
    cell.classList.add('mine');
    endGame(false);
    return;
  }

  // Reveal cell
  cell.classList.add('revealed');
  revealedCells++;

  // Calculate new multiplier
  multiplier = calculateMultiplier();
  document.getElementById('currentMultiplier').textContent = multiplier.toFixed(2) + 'x';

  // Check win condition
  if (revealedCells === (25 - totalMines)) {
    endGame(true);
  }
}

function calculateMultiplier() {
  const availableCells = 25 - totalMines;
  const revealedPercentage = revealedCells / availableCells;
  return 1 + (revealedPercentage * 24);  // Multiplier ranges from 1x to 25x
}

function cashOut() {
  if (!gameActive) return;
  endGame(true);
}

function endGame(userCashout) {
  gameActive = false;
  const resultText = document.getElementById('resultText');
  const resultMessage = document.getElementById('resultMessage');
  const navigationButtons = document.getElementById('navigationButtons');

  // Reveal all mines
  mines.forEach(mineIndex => {
    const cell = document.querySelector(`.grid-cell[data-index="${mineIndex}"]`);
    cell.classList.add('mine');
  });

  // Determine result
  if (userCashout) {
    const winnings = betAmount * multiplier;
    resultText.textContent = `You won ₹${winnings.toFixed(2)} at ${multiplier.toFixed(2)}x`;
    resultText.style.color = '#4CAF50';
  } else {
    resultText.textContent = `You lost ₹${betAmount.toFixed(2)}`;
    resultText.style.color = 'red';
  }

  // Show result and navigation
  resultMessage.classList.remove('hidden');
  navigationButtons.classList.remove('hidden');
  document.getElementById('gameBoard').classList.add('hidden');
}

function restartGame() {
  // Hide result, show controls
  document.getElementById('resultMessage').classList.add('hidden');
  document.getElementById('gameControls').classList.remove('hidden');
}

function goHome() {
  window.location.href = "../index.html";
}
