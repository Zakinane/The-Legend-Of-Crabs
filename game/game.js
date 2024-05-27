//SCREEN
const screen = document.querySelector(".screen");
function getScreenBounds() {
  const rect = screen.getBoundingClientRect();
  return { left: rect.left, right: rect.right };
}

//AUDIO
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

//ME
const You = document.querySelector(".You");

function getXpos() {
  return You.getBoundingClientRect().left;
}

//money
You.addEventListener("click", function(){
  var audioMoney = document.querySelector(".moneyAudio");
  audioMoney.play();
});

//ACTIONS
function goLeft() {
  let Xpos = getXpos();
  const { left: MAX_LEFT } = getScreenBounds();
  if (Xpos - 20 > MAX_LEFT) {
    You.style.left = You.offsetLeft - 20 + "px";
  }
}

function goRight() {
  let Xpos = getXpos();
  const { right: MAX_RIGHT } = getScreenBounds();
  if (Xpos + You.offsetWidth + 20 < MAX_RIGHT) {
    You.style.left = You.offsetLeft + 20 + "px";
  }
}

function Shoot(){
  let Xpos = getXpos();
  const projectile = document.createElement("img")
  projectile.src("../img/moneyyy");
  projectile.classList.add = "projectile";
  
}


//CONTROLS
document.addEventListener("keydown", (event) => {
  const touche = event.code;
  console.log(touche);
  switch (touche) {
    case "Space":
      Shoot();
      break;
    case "ArrowLeft":
      goLeft();
      break;
    case "ArrowRight":
      goRight();
      break;
  }
});

//DEATH

