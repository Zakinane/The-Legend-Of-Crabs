//Intro AUDIO
document.addEventListener("DOMContentLoaded", function () {
  var BoutonAudio = document.querySelector(".SoundButton");
  var audio = document.querySelector("audio");
  var ReplayIntro = document.querySelector(".ReplayIntro");
  var StartButton = document.querySelector(".Start");


  audio.setAttribute("autoplay", "true");

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
