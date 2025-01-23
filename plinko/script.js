class PlinkoGame {
  constructor() {
    this.canvas = document.getElementById('plinkoCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.betAmount = 0;
    this.rows = 0;
    this.multipliers = [
      0.2, 0.4, 0.6, 0.8, 1, 1.5, 2, 3, 4, 5, 10, 20, 50, 100
    ];
  }

  init(rows, betAmount) {
    this.rows = rows;
    this.betAmount = betAmount;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = 500;
    this.drawPlinko();
  }

  drawPlinko() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Board settings
    const pegs = this.rows + 1;
    const pegRadius = 5;
    const horizontalPadding = 50;
    const verticalPadding = 50;
    const boardWidth = this.canvas.width - (2 * horizontalPadding);
    const pegSpacing = boardWidth / (pegs - 1);
    
    // Draw pegs
    this.ctx.fillStyle = '#4CAF50';
    for (let row = 0; row < pegs; row++) {
      for (let col = 0; col <= row; col++) {
        const x = horizontalPadding + (col * pegSpacing) - ((row * pegSpacing) / 2);
        const y = verticalPadding + (row * pegSpacing);
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, pegRadius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Draw multiplier zones
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    const zoneWidth = boardWidth / this.multipliers.length;
    this.multipliers.forEach((multiplier, index) => {
      const x = horizontalPadding + (index * zoneWidth);
      this.ctx.fillRect(x, this.canvas.height - 50, zoneWidth, 50);
      
      // Draw multiplier text
      this.ctx.fillStyle = 'white';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${multiplier}x`, x + (zoneWidth / 2), this.canvas.height - 20);
    });
  }

  dropBall() {
    const startX = this.canvas.width / 2;
    const ballRadius = 10;
    let y = 0;
    let x = startX;
    let row = 0;

    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawPlinko();

      // Draw ball
      this.ctx.beginPath();
      this.ctx.fillStyle = 'red';
      this.ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      this.ctx.fill();

      // Ball physics
      if (row < this.rows) {
        // Randomly go left or right
        x += Math.random() > 0.5 ? 10 : -10;
        y += 20;
        row++;

        requestAnimationFrame(animate);
      } else {
        // Determine final multiplier zone
        const zoneWidth = this.canvas.width / this.multipliers.length;
        const zoneIndex = Math.floor(x / zoneWidth);
        const multiplier = this.multipliers[zoneIndex];
        
        this.endGame(multiplier);
      }
    };

    animate();
  }

  endGame(multiplier) {
    const winnings = this.betAmount * multiplier;
    const resultText = document.getElementById('resultText');
    const resultMessage = document.getElementById('resultMessage');
    const navigationButtons = document.getElementById('navigationButtons');

    if (multiplier >= 1) {
      resultText.textContent = `You won ₹${winnings.toFixed(2)} (${multiplier}x)`;
      resultText.style.color = '#4CAF50';
    } else {
      resultText.textContent = `You lost ₹${this.betAmount.toFixed(2)}`;
      resultText.style.color = 'red';
    }

    resultMessage.classList.remove('hidden');
    navigationButtons.classList.remove('hidden');
    document.getElementById('gameBoard').classList.add('hidden');
    document.getElementById('dropBallBtn').classList.add('hidden');
  }
}

// Game instance
const plinkoGame = new PlinkoGame();

function startGame() {
  // Get input values
  const betAmount = parseFloat(document.getElementById('amount').value);
  const rows = parseInt(document.getElementById('rows').value);

  // Validate inputs
  if (isNaN(betAmount) || betAmount <= 0) {
    alert("Please enter a valid bet amount!");
    return;
  }

  // Hide controls, show game board
  document.getElementById('gameControls').classList.add('hidden');
  document.getElementById('gameBoard').classList.remove('hidden');
  document.getElementById('dropBallBtn').classList.remove('hidden');

  // Update board info
  document.getElementById('currentBet').textContent = betAmount.toFixed(2);
  document.getElementById('currentMultiplier').textContent = '1.00x';

  // Initialize game
  plinkoGame.init(rows, betAmount);
}

function dropBall() {
  plinkoGame.dropBall();
}

function restartGame() {
  // Hide result, show controls
  document.getElementById('resultMessage').classList.add('hidden');
  document.getElementById('gameControls').classList.remove('hidden');
}

function goHome() {
  window.location.href = "../index.html";
}