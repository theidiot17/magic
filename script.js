// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI elements
const goldCountElement = document.getElementById('goldCount');
const createUnitBtn = document.getElementById('createUnitBtn');

// Game state
const gameState = {
  units: [],
  enemies: [],
  selectedUnit: null,
  gold: 100,
  unitCost: 50,
  enemySpawnInterval: 5000, // Spawn enemy every 5 seconds
  lastEnemySpawn: Date.now(),
};

// Utility functions
function getDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Unit class
class Unit {
  constructor(x, y, color = 'blue') {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.color = color;
    this.speed = 2;
    this.destination = { x: x, y: y };
    this.health = 100;
    this.attackRange = 50;
    this.attackDamage = 10;
    this.attackCooldown = 1000; // 1 second
    this.lastAttackTime = 0;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

    // Draw health bar
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x - this.size / 2, this.y - this.size, (this.size * this.health) / 100, 5);

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

    // Attack enemies if in range
    const now = Date.now();
    if (now - this.lastAttackTime >= this.attackCooldown) {
      const enemy = gameState.enemies.find((e) => getDistance(this, e) <= this.attackRange);
      if (enemy) {
        enemy.takeDamage(this.attackDamage);
        this.lastAttackTime = now;
      }
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      // Remove unit from the game
      const index = gameState.units.indexOf(this);
      if (index > -1) {
        gameState.units.splice(index, 1);
      }
      if (gameState.selectedUnit === this) {
        gameState.selectedUnit = null;
      }
    }
  }
}

// Enemy class
class Enemy extends Unit {
  constructor(x, y) {
    super(x, y, 'red');
    this.speed = 1.5;
  }

  update() {
    // Move towards nearest player unit
    const targetUnit = gameState.units[0];
    if (targetUnit) {
      this.destination = { x: targetUnit.x, y: targetUnit.y };
    } else {
      this.destination = { x: this.x, y: this.y };
    }

    super.update();

    // Attack player units if in range
    const now = Date.now();
    if (now - this.lastAttackTime >= this.attackCooldown) {
      const unit = gameState.units.find((u) => getDistance(this, u) <= this.attackRange);
      if (unit) {
        unit.takeDamage(this.attackDamage);
        this.lastAttackTime = now;
      }
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      // Remove enemy from the game
      const index = gameState.enemies.indexOf(this);
      if (index > -1) {
        gameState.enemies.splice(index, 1);
      }
      // Reward player with gold
      gameState.gold += 20;
    }
  }
}

// Initialize game
function initGame() {
  // Initial player unit
  gameState.units.push(new Unit(100, 100));

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

  // Spawn enemies periodically
  const now = Date.now();
  if (now - gameState.lastEnemySpawn >= gameState.enemySpawnInterval) {
    spawnEnemy();
    gameState.lastEnemySpawn = now;
  }

  // Update UI
  goldCountElement.textContent = gameState.gold;
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

// Create unit button handler
createUnitBtn.addEventListener('click', () => {
  if (gameState.gold >= gameState.unitCost) {
    gameState.gold -= gameState.unitCost;
    // Add new unit at a random position
    const x = Math.random() * (canvas.width / 2);
    const y = Math.random() * canvas.height;
    gameState.units.push(new Unit(x, y));
  } else {
    alert('Not enough gold!');
  }
});

// Spawn an enemy at a random position
function spawnEnemy() {
  const x = canvas.width;
  const y = Math.random() * canvas.height;
  gameState.enemies.push(new Enemy(x, y));
}

// Start the game
initGame();
