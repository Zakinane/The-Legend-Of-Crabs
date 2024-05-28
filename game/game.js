////////////////////////////////SCREEN
const screen = document.querySelector("main");
function getScreenBounds() {
  const rect = screen.getBoundingClientRect();
  return { left: rect.left, right: rect.right };
}

////////////////////////////////AUDIO
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
const boumEnemy = document.querySelector(".boumEnemy")

///////////////////////////////////////////////ME
const You = document.querySelector(".You");

function getXpos() {
  return You.getBoundingClientRect().left;
}
//money
You.addEventListener("click", function () {
  var audioMoney = document.querySelector(".moneyAudio");
  audioMoney.play();
});


/////////////////////////////////////////////ENEMY
const enemyTest = document.querySelector(".enemyTest")
// const enemies = [];

// function createEnemy() {
//   const enemy = document.createElement("img");
//   enemy.classList.add("enemy");
//   enemy.src = "../img/plankton.png";
//   enemy.style.left = You.style.left;
//   enemies.push(enemy);
//   screen.appendChild(enemy);

//   setTimeout(createEnemy,1000);
// }
// setTimeout(createEnemy,2000);

function deathEnemy(enemyTest, ProjX, ProjY, ProjW) {
  if (
    ProjY <= enemyTest.y + enemyTest.height &&
    ProjX >= enemyTest.x - enemyTest.width &&
    ProjX + ProjW <= enemyTest.x + enemyTest.width
  ) {
    boumEnemy.play();
    //// enemy.remove();
    enemyTest.remove();
    return 1;
  }
}

/////////////////////////////////////////////ACTIONS  
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
  projectile.style.bottom = "60px";
  pioupiou.play();

  function moveProjectile() {
    let currentBottom = parseInt(projectile.style.bottom);
    projectile.style.bottom = currentBottom + 10 + "px";

    //colision all enemies

    // enemies.forEach((enemy) => {
    //   deathEnemy(enemy,projectile.x,projectile.y,projectile.width);
    // });
    if(deathEnemy(enemyTest,projectile.x,projectile.y,projectile.width)){
      projectile.remove();
    }
    

    //out of screen
    if (currentBottom < 800) {
      requestAnimationFrame(moveProjectile);
    } else {
      projectile.remove();
    }
  }

  // Lancer le déplacement du projectile
  requestAnimationFrame(moveProjectile);
}


//////////////////////////////////////////CONTROLS
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

    // if (timeSinceLastShot > 500) { //latence
    //   ShootUp();
    //   lastShotTime = currentTime;
    // }
    ShootUp(); //A SUP
  }
  if (keys["ArrowLeft"]) {
    goLeft();
  }
  if (keys["ArrowRight"]) {
    goRight();
  }

  requestAnimationFrame(Controls); //?
}
Controls();

//DEATH
