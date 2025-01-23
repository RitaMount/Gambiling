/* crash-game/script.js */

// Variables for the game logic
let crashMultiplier = 1;
let gameInterval;
let amount = 0;
let autoCashout = 0;
let isGameStarted = false;
let gameResult = "";
let randomCrashPoint;

const ctx = document.getElementById('multiplierGraph').getContext('2d');
const multiplierGraph = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Multiplier Over Time',
      data: [],
      borderColor: '#4CAF50',
      fill: false,
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Multiplier'
        },
        min: 1,
        max: 10 // Increased max range
      }
    }
  }
});

// Start the game
function startGame() {
  amount = parseFloat(document.getElementById('amount').value);
  autoCashout = parseFloat(document.getElementById('autoCashout').value) || 0;

  if (isNaN(amount) || amount <= 0) {
    alert("Amount is required and should be greater than 0!");
    return;
  }

  // Generate a random crash point between 1 and 5
  randomCrashPoint = 1 + Math.random() * 4;

  // Hide input and show multiplier
  document.getElementById('gameControls').classList.add('hidden');
  document.getElementById('multiplierDisplay').classList.remove('hidden');
  document.getElementById('cashoutContainer').classList.remove('hidden');

  crashMultiplier = 1;
  isGameStarted = false;

  gameInterval = setInterval(() => {
    crashMultiplier += 0.02;
    updateGraph();

    // Check for auto cashout
    if (autoCashout > 0 && crashMultiplier >= autoCashout && !isGameStarted) {
      autoCashOut();
    }

    // Check for random crash
    if (crashMultiplier >= randomCrashPoint) {
      cashOut(false);
    }
  }, 200);
}

// Update the graph with new data
function updateGraph() {
  const labels = Array.from({ length: 50 }, (_, i) => i + 1);
  multiplierGraph.data.labels = labels;
  multiplierGraph.data.datasets[0].data = Array(labels.length).fill(crashMultiplier);
  multiplierGraph.update();

  document.getElementById('multiplierValue').innerText = crashMultiplier.toFixed(2) + "x";
}

// Auto cashout functionality
function autoCashOut() {
  isGameStarted = true;
  clearInterval(gameInterval);
  gameResult = "You won ₹" + (amount * autoCashout).toFixed(2);
  displayResult(true);
}

// Cashout functionality
function cashOut(userInitiated = true) {
  isGameStarted = true;
  clearInterval(gameInterval);

  if (userInitiated) {
    // User-initiated cashout
    gameResult = "You cashed out at " + crashMultiplier.toFixed(2) + "x. Won ₹" + (amount * crashMultiplier).toFixed(2);
    displayResult(true);
  } else {
    // Automatic crash
    gameResult = "Game crashed at " + crashMultiplier.toFixed(2) + "x. You lost ₹" + amount.toFixed(2);
    displayResult(false);
  }
}

// Display the result
function displayResult(isWin) {
  document.getElementById('resultMessage').classList.remove('hidden');
  document.getElementById('resultText').innerText = gameResult;
  document.getElementById('resultText').style.color = isWin ? '#4CAF50' : 'red';
  document.getElementById('navigationButtons').classList.remove('hidden');
}

// Go back to the game page
function goBackToGame() {
  window.location.href = "index.html";
}

// Go to the home page
function goHome() {
  window.location.href = "../index.html";
}
