/* crash-game/script.js */

// Variables for the game logic
let crashMultiplier = 1;
let gameInterval;
let amount = 0;
let autoCashout = 0;
let isGameStarted = false;
let gameResult = "";

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
        min: 0
      }
    }
  }
});

// Start the game
function startGame() {
  amount = parseFloat(document.getElementById('amount').value);
  autoCashout = parseFloat(document.getElementById('autoCashout').value);

  if (isNaN(amount) || amount <= 0) {
    alert("Amount is required and should be greater than 0!");
    return;
  }

  // Hide input and show multiplier
  document.getElementById('gameControls').classList.add('hidden');
  document.getElementById('multiplierDisplay').classList.remove('hidden');
  document.getElementById('cashoutContainer').classList.remove('hidden');

  crashMultiplier = 1;
  gameInterval = setInterval(() => {
    crashMultiplier += 0.02; // Slow down multiplier increase rate
    updateGraph();

    if (crashMultiplier >= autoCashout && autoCashout > 0 && !isGameStarted) {
      autoCashOut();
    }
  }, 200); // Increase multiplier every 200ms for slower growth
}

// Update the graph with new data
function updateGraph() {
  const labels = Array.from({ length: crashMultiplier.toFixed(1) }, (_, i) => i + 1);
  multiplierGraph.data.labels = labels;
  multiplierGraph.data.datasets[0].data = Array(labels.length).fill(crashMultiplier);
  multiplierGraph.update();

  document.getElementById('multiplierValue').innerText = crashMultiplier.toFixed(2) + "x";
}

// Auto cashout functionality
function autoCashOut() {
  isGameStarted = true;
  clearInterval(gameInterval);
  alert("Auto Cashout triggered at " + crashMultiplier.toFixed(2) + "x multiplier!");
  gameResult = "You won ₹" + (amount * crashMultiplier).toFixed(2);
  displayResult();
}

// Cashout functionality
function cashOut() {
  isGameStarted = true;
  clearInterval(gameInterval);
  gameResult = "You lost ₹" + amount.toFixed(2);
  displayResult();
}

// Display the result
function displayResult() {
  document.getElementById('resultMessage').classList.remove('hidden');
  document.getElementById('resultText').innerText = gameResult;
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
