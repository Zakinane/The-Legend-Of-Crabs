//HIGH SCORE
const savedData = localStorage.getItem("game");
const highScoreElement = document.querySelector(".high-score");

if(savedData){
  highScoreElement.textContent = localStorage.getItem("game");
} else{
  highScoreElement.textContent = 0;
}

//Intro AUDIO
document.addEventListener("DOMContentLoaded", function () {
  var BoutonAudio = document.querySelector(".SoundButton");
  var audio = document.querySelector("audio");
  var ReplayIntro = document.querySelector(".ReplayIntro");
  var StartButton = document.querySelector(".Start");


  BoutonAudio.addEventListener("click", function () {
    if (audio.paused) {
      BoutonAudio.setAttribute("src", "img/SoundON.png");
      ReplayIntro.setAttribute("hidden", "true");
      audio.play();
    } else {
      BoutonAudio.setAttribute("src", "img/SoundOFF.png");
      audio.pause();
    }
  });

  audio.addEventListener("ended", function () {
    ReplayIntro.Attribute("hidden");
  });

  ReplayIntro.addEventListener("click", function () {
    ReplayIntro.setAttribute("hidden", "true");
    BoutonAudio.setAttribute("src", "img/SoundON.png");
    audio.play();
  });

  setTimeout(() => {
    StartButton.removeAttribute("hidden");
  }, 16000);
  
});
/////SHARE
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
