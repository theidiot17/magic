// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI elements
const moneyElement = document.getElementById('money');
const livesElement = document.getElementById('lives');
const waveElement = document.getElementById('wave');
const startWaveBtn = document.getElementById('startWaveBtn');

// Game state
const gameState = {
  money: 100,
  lives: 10,
  wave: 1,
  towers: [],
  enemies: [],
  projectiles: [],
  placingTower: false,
  towerCost: 50,
  enemySpawnInterval: 1000, // Spawn enemy every 1 second
  enemiesPerWave: 10,
  enemiesSpawned: 0,
  lastEnemySpawn: 0,
  waveActive: false,
  path: [
    { x: 0, y: 300 },
    { x: 800, y: 300 },
  ],
  gameOver: false,
};

// Tower class
class Tower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.range = 100;
    this.fireRate = 1000; // Fire every 1 second
    this.lastShotTime = 0;
    this.damage = 20;
  }

  draw() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    const now = Date.now();
    if (now - this.lastShotTime >= this.fireRate) {
      // Find the nearest enemy within range
      const enemy = gameState.enemies.find((e) => getDistance(this, e) <= this.range);
      if (enemy) {
        // Shoot at the enemy
        gameState.projectiles.push(new Projectile(this.x, this.y, enemy, this.damage));
        this.lastShotTime = now;
      }
    }
  }
}

// Enemy class
class Enemy {
  constructor() {
    this.x = gameState.path[0].x;
    this.y = gameState.path[0].y;
    this.size = 20;
    this.speed = 1;
    this.health = 100;
    this.pathIndex = 0;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

    // Draw health bar
    ctx.fillStyle = 'green';
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size,
      (this.size * this.health) / 100,
      5
    );
  }

  update() {
    // Move along the path
    const target = gameState.path[this.pathIndex + 1];
    if (target) {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 1) {
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
      } else {
        this.pathIndex++;
      }
    } else {
      // Reached the end
      this.reachEnd();
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    const index = gameState.enemies.indexOf(this);
    if (index > -1) {
      gameState.enemies.splice(index, 1);
    }
    // Reward player
    gameState.money += 10;
    updateUI();
  }

  reachEnd() {
    // Enemy reaches the end
    const index = gameState.enemies.indexOf(this);
    if (index > -1) {
      gameState.enemies.splice(index, 1);
    }
    gameState.lives--;
    updateUI();
    if (gameState.lives <= 0) {
      gameOver();
    }
  }
}

// Projectile class
class Projectile {
  constructor(x, y, target, damage) {
    this.x = x;
    this.y = y;
    this.size = 5;
    this.speed = 5;
    this.target = target;
    this.damage = damage;
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    // Move towards the target
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > this.speed) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    } else {
      // Hit the target
      this.target.takeDamage(this.damage);
      this.destroy();
    }
  }

  destroy() {
    const index = gameState.projectiles.indexOf(this);
    if (index > -1) {
      gameState.projectiles.splice(index, 1);
    }
  }
}

// Utility functions
function getDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function updateUI() {
  moneyElement.textContent = gameState.money;
  livesElement.textContent = gameState.lives;
  waveElement.textContent = gameState.wave;
}

function gameOver() {
  gameState.gameOver = true;
  alert('Game Over!');
}

// Initialize game
function initGame() {
  // Start the game loop
  requestAnimationFrame(gameLoop);
}

// Game loop
function gameLoop() {
  updateGame();
  drawGame();
  if (!gameState.gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Update game state
function updateGame() {
  // Update towers
  gameState.towers.forEach((tower) => tower.update());

  // Update enemies
  gameState.enemies.forEach((enemy) => enemy.update());

  // Update projectiles
  gameState.projectiles.forEach((projectile) => projectile.update());

  // Spawn enemies during the wave
  if (gameState.waveActive && Date.now() - gameState.lastEnemySpawn >= gameState.enemySpawnInterval) {
    if (gameState.enemiesSpawned < gameState.enemiesPerWave) {
      gameState.enemies.push(new Enemy());
      gameState.enemiesSpawned++;
      gameState.lastEnemySpawn = Date.now();
    } else if (gameState.enemies.length === 0) {
      // Wave completed
      gameState.waveActive = false;
      gameState.wave++;
      updateUI();
    }
  }
}

// Draw the game
function drawGame() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw path
  ctx.strokeStyle = 'gray';
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(gameState.path[0].x, gameState.path[0].y);
  for (let i = 1; i < gameState.path.length; i++) {
    ctx.lineTo(gameState.path[i].x, gameState.path[i].y);
  }
  ctx.stroke();

  // Draw towers
  gameState.towers.forEach((tower) => tower.draw());

  // Draw enemies
  gameState.enemies.forEach((enemy) => enemy.draw());

  // Draw projectiles
  gameState.projectiles.forEach((projectile) => projectile.draw());
}

// Handle mouse events
canvas.addEventListener('click', (e) => {
  if (gameState.placingTower) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if player can afford tower
    if (gameState.money >= gameState.towerCost) {
      // Place tower
      gameState.towers.push(new Tower(mouseX, mouseY));
      gameState.money -= gameState.towerCost;
      updateUI();
    } else {
      alert('Not enough money to place tower!');
    }
  }
});

// Start wave button handler
startWaveBtn.addEventListener('click', () => {
  if (!gameState.waveActive) {
    gameState.waveActive = true;
    gameState.enemiesSpawned = 0;
    gameState.lastEnemySpawn = 0;
  }
});

// Place tower by pressing 'T'
window.addEventListener('keydown', (e) => {
  if (e.key === 't' || e.key === 'T') {
    gameState.placingTower = !gameState.placingTower;
    canvas.style.cursor = gameState.placingTower ? 'crosshair' : 'default';
  }
});

// Start the game
initGame();
