///////////////////////////////////////////////////////////////////////////////////////////SCREEN
const screen = document.querySelector("main");
const krustyKrab = document.querySelector(".screen");

function getScreenBounds() {
  const rect = screen.getBoundingClientRect();
  return { left: rect.left, right: rect.right };
}

function animateScreen() {
  krustyKrab.style.backgroundImage  = "url('../img/badending.png')";
  krustyKrab.classList.add("going-up");
}

////////////////////////////////////////////////////////////////////////////////////////////AUDIO
//ost
const audio = document.querySelector(".audio");
document.addEventListener("DOMContentLoaded", function () {
  var BoutonAudio = document.querySelector(".SoundButton");

  BoutonAudio.addEventListener("click", function () {
    if (audio.paused) {
      BoutonAudio.setAttribute("src", "../img/SoundON.png");
      audio.play();
    } else {
      BoutonAudio.setAttribute("src", "../img/SoundOFF.png");
      audio.pause();
    }
  });

  audio.addEventListener("ended", function () {
    ReplayIntro.removeAttribute("hidden");
  });
});
//others
const pioupiou = document.querySelector(".pioupiou");
const boumEnemy = document.querySelector(".boumEnemy");
const gameover = document.querySelector(".gameover");

let gameOverSoundPlayed = false;

///////////////////////////////////////////////////////////////////////////////////////////////////SHARE

function shareScoreFacebook() {
  const gameUrl = `https://zakinane.github.io/The-Legend-Of-Crabs/`;
  const quote = `I scored ${localStorage.getItem("game")} at this game!`;
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}&quote=${encodeURIComponent(quote)}`;
  window.open(url, '_blank');
}
function shareScoreX() {
  const text = `I scored ${localStorage.getItem("game")} at this game! https://zakinane.github.io/The-Legend-Of-Crabs/`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

///////////////////////////////////////////////////////////////////////////////////////////SCORE DATA
function saveData(highScore) {
  localStorage.setItem("game", highScore);
}

function updateAndSaveData() {
  const highScore = highScoreElement.textContent;
  saveData(highScore);
}

const savedData = localStorage.getItem("game");

////////////////////////////////////////////////////////////////////////////////////////////SCORE
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

class ScoreManager {
  constructor(scoreElement, highScoreElement) {
    this.scoreElement = scoreElement;
    this.highScoreElement = highScoreElement;
    this.currentScore = 0;
    if (savedData) {
      this.highScore = savedData;
    } else {
      this.highScore = this.highScoreElement.textContent;
    }
    this.updateScoreElem();
    this.updateHighScoreElem();
  }
  updateScore(pts) {
    this.currentScore += pts;
    if (this.currentScore > 999999999) this.currentScore = 999999999;
    this.updateScoreElem();
    this.checkAndUpdateHighScore();
    updateAndSaveData();
    adjustDifficulty(this.currentScore); // Adjust difficulty based on score
  }
  updateScoreElem() {
    this.scoreElement.textContent = this.currentScore;
  }
  updateHighScoreElem() {
    this.highScoreElement.textContent = this.highScore;
  }
  checkAndUpdateHighScore() {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      this.updateHighScoreElem();
    }
  }
}

const scoreManager = new ScoreManager(scoreElement, highScoreElement);

///////////////////////////////////////////////////////////////////////////////////////////////ME
const You = document.querySelector(".You");

function getXpos() {
  return You.getBoundingClientRect().left;
}
//money
var audioMoney = document.querySelector(".moneyAudio");
You.addEventListener("mouseover", function () {
  audioMoney.play();
});

//////////////////////////////////////////////////////////////////////////////////////////////ENEMY

const enemies = [];
let enemySpeed = 2; // Initial enemy speed
let spawnInterval = 2000;
let PiouPiou = false;

function createEnemy() {
  const enemy = document.createElement("img");
  enemy.classList.add("enemy");
  enemy.src = "../img/plankton.png";

  // Chance power-up
  const powerUpChance = Math.random() * 20;
  if (powerUpChance < 1) {
    enemy.src = "../img/powerup.png";
    enemy.classList.add("power-up");
  }

  const { left: MAX_LEFT, right: MAX_RIGHT } = getScreenBounds();
  enemy.style.left =
    Math.random() * (MAX_RIGHT - MAX_LEFT - 50) + MAX_LEFT + "px";
  enemy.style.top = "-200px";
  enemies.push(enemy);
  screen.appendChild(enemy);

  // Move enemy downward
  requestAnimationFrame(() => moveEnemy(enemy));

  setTimeout(createEnemy, spawnInterval); // Vitesse spawn enemies
}
setTimeout(createEnemy, spawnInterval);

function moveEnemy(enemy) {
  let currentTop = parseInt(enemy.style.top);
  enemy.style.top = currentTop + enemySpeed + "px";

  if (currentTop >= screen.offsetHeight) {
    if (!enemy.getAttribute("data-dead")) {
      if (enemy.classList.contains("power-up")) {
        enemy.remove();
        const index = enemies.indexOf(enemy);
        if (index > -1) enemies.splice(index, 1);
      } else {
        animateScreen();
        gameOver();
      }
    }
  } else {
    requestAnimationFrame(() => moveEnemy(enemy));
  }
}


function animateEnemyDeath(enemy) {
  const explosionFrames = [
    "../img/Explosion/1.png",
    "../img/Explosion/2.png",
    "../img/Explosion/3.png",
    "../img/Explosion/4.png",
    "../img/Explosion/5.png",
    "../img/Explosion/6.png",
    "../img/Explosion/7.png",
    "../img/Explosion/8.png",
  ];
  let frameIndex = 0;
  enemy.setAttribute("data-dead", "true");

  function changeFrame() {
    if (frameIndex < explosionFrames.length) {
      enemy.src = explosionFrames[frameIndex];
      frameIndex++;
      setTimeout(changeFrame, 100);
    } else {
      enemy.remove();
      const index = enemies.indexOf(enemy);
      if (index > -1) enemies.splice(index, 1);
    }
  }
  changeFrame();
}

function deathEnemy(enemy, projRect) {
  const enemyRect = enemy.getBoundingClientRect();

  if (
    projRect.top <= enemyRect.bottom &&
    projRect.bottom >= enemyRect.top &&
    projRect.left <= enemyRect.right &&
    projRect.right >= enemyRect.left
  ) {
    if (enemy.classList.contains("power-up")) {
      bigPiouPiou();
      setTimeout(() => {
        enemy.remove();
        const index = enemies.indexOf(enemy);
        if (index > -1) enemies.splice(index, 1);
      }, 0);
    } else {
      boumEnemy.play();
      scoreManager.updateScore(100);
      animateEnemyDeath(enemy);
    }
    return true;
  }
  return false;
}


//////////////////////////////////////////////////////////////////////////////////////////ACTIONS
function goLeft() {
  let Xpos = getXpos();
  const { left: MAX_LEFT } = getScreenBounds();
  if (Xpos - 10 > MAX_LEFT) {
    You.style.left = You.offsetLeft - 10 + "px";
  }
}

function goRight() {
  let Xpos = getXpos();
  const { right: MAX_RIGHT } = getScreenBounds();
  if (Xpos + You.offsetWidth + 10 < MAX_RIGHT) {
    You.style.left = You.offsetLeft + 10 + "px";
  }
}

function ShootUp() {
  const projectile = document.createElement("img");
  projectile.src = "../img/moneyyyy.png";
  projectile.classList.add("projectile");
  screen.appendChild(projectile);
  projectile.style.left = You.style.left;
  projectile.style.bottom = "50px";
  pioupiou.play();

  ////////////////////////////////////////////////////////////PROJECTILES

  function moveProjectile() {
    let currentBottom = parseInt(projectile.style.bottom);
    projectile.style.bottom = currentBottom + 10 + "px"; // vitesse projectiles

    const projRect = projectile.getBoundingClientRect();

    enemies.forEach((enemy, index) => {
      if (deathEnemy(enemy, projRect)) {
        enemies.splice(index, 1);
        projectile.remove();
        return;
      }
    });

    if (currentBottom < screen.offsetHeight) {
      requestAnimationFrame(moveProjectile);
    } else {
      projectile.remove();
    }
  }
  requestAnimationFrame(moveProjectile);
}

//////////////////////////////////////////////////////////////////////////////////////////CONTROLS
// Fluidity
let controlsAnimationFrame;
var keys = {};

document.addEventListener("keydown", (key) => {
  keys[key.code] = true;
});
document.addEventListener("keyup", (key) => {
  keys[key.code] = false;
});

let lastShotTime = 0;
function Controls() {
  if (keys["Space"]) {
    const currentTime = Date.now();
    const timeSinceLastShot = currentTime - lastShotTime;

    // ver normale
    if (timeSinceLastShot > (PiouPiou ? 100 : 500)) {
      ShootUp();
      lastShotTime = currentTime;
    }
  }
  if (keys["ArrowLeft"]) {
    goLeft();
  }
  if (keys["ArrowRight"]) {
    goRight();
  }

  requestAnimationFrame(Controls);
  checkCollisions();
}
setTimeout(() => {
  Controls();
}, 4000); // Crabs monte apres X ms

/////////////////////////////////////////MOBILE

if ("ontouchstart" in window) {
  let touchX;

  document.addEventListener("touchstart", function (e) {
    touchX = e.touches[0].clientX;
  });

  document.addEventListener("touchmove", function (e) {
    const newX = e.touches[0].clientX;
    if (newX < touchX) {
      goLeft();
    } else if (newX > touchX) {
      goRight();
    }
    touchX = newX;
  });

  document.addEventListener("touchend", function (e) {
    const currentTime = Date.now();
    const timeSinceLastShot = currentTime - lastShotTime;
    if (timeSinceLastShot > (PiouPiou ? 100 : 500)) {
      ShootUp();
      lastShotTime = currentTime;
    }
  });
}

//////////////////////////////////////////////////////////////////////////////////GAME OVER

function animateDeath(You) {
  const explosionFrames = [
    "../img/Explosion/1.png",
    "../img/Explosion/2.png",
    "../img/Explosion/3.png",
    "../img/Explosion/4.png",
    "../img/Explosion/5.png",
    "../img/Explosion/8.png",
    "../img/Explosion/6.png",
    "../img/Explosion/7.png",
  ];
  let frameIndex = 0;

  function changeFrame() {
    if (frameIndex < explosionFrames.length) {
      You.src = explosionFrames[frameIndex];
      frameIndex++;
      setTimeout(changeFrame, 100);
    } else {
      You.remove();
      gameOver();
    }
  }
  changeFrame();
}
function death(enemy, You) {
  const enemyRect = enemy.getBoundingClientRect();
  const YouRect = You.getBoundingClientRect();
  if (
    YouRect.top <= enemyRect.bottom &&
    YouRect.bottom >= enemyRect.top &&
    YouRect.left <= enemyRect.right &&
    YouRect.right >= enemyRect.left
  ) {
    return true;
  }
  return false;
}

function gameOver() {
  function playGameOverSound() {
    if (!gameOverSoundPlayed) {
      gameover.play();
      gameOverSoundPlayed = true;
    }
  }
  playGameOverSound();
  audio.pause();
  animateDeath(You);
  stopGame();
  setTimeout(() => {
    window.location.replace("../gameover/gameover.html");
  }, 3000);
}

function gameOver() {
  function playGameOverSound() {
    if (!gameOverSoundPlayed) {
      gameover.play();
      gameOverSoundPlayed = true;
    }
  }
  playGameOverSound();
  audio.pause();
  animateDeath(You);
  stopGame();
  setTimeout(() => {
    window.location.replace("../gameover/gameover.html");
  }, 6000);
}

function checkCollisions() {
  enemies.forEach((enemy) => {
    if (!enemy.getAttribute("data-dead") && !enemy.classList.contains("power-up")) {
      if (death(enemy, You)) {
        gameOver();
      }
    }
  });
}


function stopGame() {
  enemies.forEach((enemy) => enemy.remove());
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);
  cancelAnimationFrame(controlsAnimationFrame);
}
function handleKeyDown(key) {
  keys[key.code] = true;
}
function handleKeyUp(key) {
  keys[key.code] = false;
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

//////////////////////////////////////////////////////////////////////////////////////NEW FEATURES

function adjustDifficulty(score) {
  if (score >= 1000 && score < 2000) {
    enemySpeed = 4;
    spawnInterval = 1500;
  } else if (score >= 2000 && score < 4000) {
    enemySpeed = 5;
    spawnInterval = 1000;
  } else if (score >= 4000) {
    enemySpeed = 6;
    spawnInterval = 750;
  }
}

function bigPiouPiou() {
  PiouPiou = true;
  audioMoney.play();
  setTimeout(() => {
    PiouPiou = false;
  }, 10000); //10s
}

/////////////////////////////////////////////////////////////////////////////////////// ;D
