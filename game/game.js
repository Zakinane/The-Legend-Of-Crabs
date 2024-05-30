///////////////////////////////////////////////////////////////////////////////////////////SCREEN
const screen = document.querySelector("main");
function getScreenBounds() {
  const rect = screen.getBoundingClientRect();
  return { left: rect.left, right: rect.right };
}

////////////////////////////////////////////////////////////////////////////////////////////AUDIO
//ost
document.addEventListener("DOMContentLoaded", function () {
  var BoutonAudio = document.querySelector(".SoundButton");
  var audio = document.querySelector(".audio");

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
    "../img/Exlosion/1.png",
    "../img/Exlosion/2.png",
    "../img/Exlosion/3.png",
    "../img/Exlosion/4.png",
    "../img/Exlosion/5.png",
    "../img/Exlosion/6.png",
    "../img/Exlosion/7.png",
    "../img/Exlosion/8.png",
  ];
  let frameIndex = 0;

function changeFrame() {//ajout fonction pour set timout
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
}
setTimeout(() => {
  Controls();
}, 4000); //Crabs monte

if ('ontouchstart' in window) {
  let touchX;

  document.addEventListener('touchstart', function (e) {
    touchX = e.touches[0].clientX;
  });

  document.addEventListener('touchmove', function (e) {
    const newX = e.touches[0].clientX;
    if (newX < touchX) {
      goLeft();
    } else if (newX > touchX) {
      goRight();
    }
    touchX = newX;
  });

  document.addEventListener('touchend', function (e) {
    ShootUp();
  });
}