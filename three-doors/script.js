let winningDoor;
let betAmount;

function startGame() {
  // Get bet amount
  betAmount = parseFloat(document.getElementById('amount').value);

  // Validate input
  if (isNaN(betAmount) || betAmount <= 0) {
    alert("Please enter a valid bet amount!");
    return;
  }

  // Choose a random winning door (1, 2, or 3)
  winningDoor = Math.floor(Math.random() * 3) + 1;

  // Hide game controls
  document.getElementById('gameControls').classList.add('hidden');
  
  // Show game board
  document.getElementById('gameBoard').classList.remove('hidden');
}

function chooseDoor(selectedDoor) {
  const resultText = document.getElementById('resultText');
  const resultMessage = document.getElementById('resultMessage');

  if (selectedDoor === winningDoor) {
    // Win
    const winnings = betAmount * 1.2;
    resultText.textContent = `Congratulations! You won ₹${winnings.toFixed(2)}`;
    resultText.style.color = '#4CAF50';
  } else {
    // Lose
    resultText.textContent = `Sorry, you lost ₹${betAmount.toFixed(2)}`;
    resultText.style.color = 'red';
  }

  // Show result message
  resultMessage.classList.remove('hidden');
  
  // Disable further door selections
  document.getElementById('doorsContainer').style.pointerEvents = 'none';
}

function restartGame() {
  // Reset game
  document.getElementById('amount').value = '';
  document.getElementById('resultMessage').classList.add('hidden');
  document.getElementById('gameControls').classList.remove('hidden');
  document.getElementById('gameBoard').classList.add('hidden');
  document.getElementById('doorsContainer').style.pointerEvents = 'auto';
}

function goHome() {
  window.location.href = "../index.html";
}
