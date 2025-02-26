// Select elements
const cells = document.querySelectorAll("[data-cell]");
const statusMessage = document.getElementById("status-message");
const restartBtn = document.getElementById("restart-btn");
const modal = document.getElementById('game-over-modal');
const modalMessage = document.getElementById('modal-message');
const playAgainBtn = document.getElementById('play-again-btn');
const closeBtn = document.querySelector('.close-btn');
let scoreX = 0;
let scoreO = 0;


// Sound effects
const moveSound = new Audio('move-sound.mp3');
const winSound = new Audio('win-sound.mp3');
const drawSound = new Audio('draw-sound.mp3');

let currentPlayer = "X";
let gameActive = true;
let boardState = Array(9).fill(null); // Represents the game board

// Winning combinations
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Handle cell click
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleCellClick(index));
});

function handleCellClick(index) {
  if (boardState[index] || !gameActive) return; // Prevent clicks if game is over or cell is already taken

  boardState[index] = currentPlayer; // Update the game state
  cells[index].textContent = currentPlayer; // Update the UI
  moveSound.play(); // Play move sound

  if (checkForWin()) {
    if (currentPlayer === "X") {
        scoreX++;
        document.getElementById('score-x').textContent = scoreX; // Update X's score
      } else {
        scoreO++;
        document.getElementById('score-o').textContent = scoreO; // Update O's score
      }
    showModal(`Player ${currentPlayer} Wins!`);
    winSound.play(); // Play win sound
    gameActive = false; // Disable further moves
  } else if (boardState.every(cell => cell)) {
    showModal("It's a Draw!");
    drawSound.play(); // Play draw sound
    gameActive = false; // Disable further moves
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch turns
    statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function checkForWin() {
  return winCombinations.some(combination => {
    const [a, b, c] = combination;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      combination.forEach(index => cells[index].classList.add('highlight')); // Highlight winning cells
      return true;
    }
    return false;
  });
}

// Restart the game
restartBtn.addEventListener("click", restartGame);

function restartGame() {
  boardState.fill(null); // Reset the board state
  cells.forEach(cell => {
    cell.textContent = ''; // Clear cell content
    cell.classList.remove('highlight'); // Remove highlight class
  });
  currentPlayer = "X"; // Reset current player
  gameActive = true; // Enable moves again
  statusMessage.textContent = "Player X's Turn";
}

// Show modal for game over
function showModal(message) {
  modalMessage.textContent = message;
  modal.style.display = 'block'; // Display modal
}

// Close modal when clicking the "x" or "Play Again"
closeBtn.onclick = closeModal;
playAgainBtn.onclick = function () {
  restartGame();
  closeModal();
}

function closeModal() {
  modal.style.display = 'none'; // Hide modal
}
