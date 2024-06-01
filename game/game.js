///////////////////////////////////////////////////////////////////////////////////////////SCREEN
const screen = document.querySelector("main");
function getScreenBounds() {
  const rect = screen.getBoundingClientRect();
  return { left: rect.left, right: rect.right };
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
You.addEventListener("mouseover", function () {
  var audioMoney = document.querySelector(".moneyAudio");
  audioMoney.play();
});

//////////////////////////////////////////////////////////////////////////////////////////////ENEMY

const enemies = [];

function createEnemy() {
  const enemy = document.createElement("img");
  enemy.classList.add("enemy");
  enemy.src = "../img/plankton.png";

  const { left: MAX_LEFT, right: MAX_RIGHT } = getScreenBounds();
  enemy.style.left =
    Math.random() * (MAX_RIGHT - MAX_LEFT - 50) + MAX_LEFT + "px";
  enemy.style.top = "-200px";
  enemies.push(enemy);
  screen.appendChild(enemy);

  // Move enemy downward
  function moveEnemy() {
    let currentTop = parseInt(enemy.style.top);
    enemy.style.top = currentTop + 2 + "px";

    if (deathEnemy) {
      requestAnimationFrame(moveEnemy);
    } else {
      enemy.remove();
    }
  }
  requestAnimationFrame(moveEnemy);

  setTimeout(createEnemy, 2000); //Vitesse spawn enemies
}
setTimeout(createEnemy, 2000);

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

  function changeFrame() {
    //is a func pour set timout
    if (frameIndex < explosionFrames.length) {
      enemy.src = explosionFrames[frameIndex];
      frameIndex++;
      setTimeout(changeFrame, 100);
    } else {
      enemy.remove();
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
    boumEnemy.play();
    scoreManager.updateScore(100);
    animateEnemyDeath(enemy);
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
    projectile.style.bottom = currentBottom + 10 + "px"; //vitesse projectiles

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
//Fluidity
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
    if (timeSinceLastShot > 500) {
      //latence
      ShootUp();
      lastShotTime = currentTime;
    }

    //TIR RAFALE
    // ShootUp();
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
}, 4000); //Crabs monte apres X ms

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
    if (timeSinceLastShot > 500) {
      //latence
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
      GameOverScreen();
    }
  }
  changeFrame();
}

function GameOverScreen() {
  setTimeout(() => {
    window.location.replace("../gameover/gameover.html");
  }, 3000);
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

function checkCollisions() {
  enemies.forEach((enemy) => {
    if (death(enemy, You)) {
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

////////////////////////////////////////////////////////////////////////////////////// :D
