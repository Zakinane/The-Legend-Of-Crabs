//Intro AUDIO
document.addEventListener("DOMContentLoaded", function () {
  var BoutonAudio = document.querySelector(".SoundButton");
  var audio = document.querySelector("audio");
  var ReplayIntro = document.querySelector(".ReplayIntro");

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
    ReplayIntro.removeAttribute("hidden");
  });

  ReplayIntro.addEventListener("click", function () {
    ReplayIntro.setAttribute("hidden", "true");
    BoutonAudio.setAttribute("src", "img/SoundON.png");
    audio.play();
  });
});
