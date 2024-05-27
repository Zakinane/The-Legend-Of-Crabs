//AUDIO
document.addEventListener("DOMContentLoaded", function () {
  var BoutonAudio = document.querySelector(".SoundButton");
  var audio = document.querySelector("audio");

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
//CONTROLS
