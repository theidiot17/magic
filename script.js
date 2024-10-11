// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const gameState = {
  units: [],
  enemies: [],
  selectedUnit: null,
};

// Unit class
class Unit {
  constructor(x, y, color = 'blue') {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.color = color;
    this.speed = 2;
    this.destination = { x: x, y: y };
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

    // Draw selection outline
    if (gameState.selectedUnit === this) {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x - this.size / 2 - 2, this.y - this.size / 2 - 2, this.size + 4, this.size + 4);
    }
  }

  update() {
    // Move towards destination
    const dx = this.destination.x - this.x;
    const dy = this.destination.y - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 1) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }
}

// Enemy class
class Enemy extends Unit {
  constructor(x, y) {
    super(x, y, 'red');
    this.speed = 1.5;
  }

  // You can add enemy-specific methods here
}

// Initialize units
function initGame() {
  // Player units
  gameState.units.push(new Unit(100, 100));
  gameState.units.push(new Unit(150, 100));
  gameState.units.push(new Unit(200, 100));

  // Enemy units
  gameState.enemies.push(new Enemy(600, 500));
  gameState.enemies.push(new Enemy(650, 500));
  gameState.enemies.push(new Enemy(700, 500));

  // Start the game loop
  requestAnimationFrame(gameLoop);
}

// Game loop
function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

// Update game state
function updateGame() {
  gameState.units.forEach((unit) => unit.update());
  gameState.enemies.forEach((enemy) => enemy.update());

  // Simple enemy AI: move towards a point
  gameState.enemies.forEach((enemy) => {
    enemy.destination = { x: 400, y: 300 }; // Enemies move towards the center
  });
}

// Draw the game
function drawGame() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw units
  gameState.units.forEach((unit) => unit.draw());
  gameState.enemies.forEach((enemy) => enemy.draw());
}

// Handle mouse events
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Check if a unit is clicked
  let clickedUnit = null;
  for (const unit of gameState.units) {
    if (
      mouseX >= unit.x - unit.size / 2 &&
      mouseX <= unit.x + unit.size / 2 &&
      mouseY >= unit.y - unit.size / 2 &&
      mouseY <= unit.y + unit.size / 2
    ) {
      clickedUnit = unit;
      break;
    }
  }

  if (clickedUnit) {
    // Select the unit
    gameState.selectedUnit = clickedUnit;
  } else if (gameState.selectedUnit) {
    // Move the selected unit
    gameState.selectedUnit.destination = { x: mouseX, y: mouseY };
  }
});

// Start the game
initGame();
