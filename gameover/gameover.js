  const savedData = localStorage.getItem("game");
  const highScoreElement = document.querySelector(".high-score");

  highScoreElement.textContent = localStorage.getItem("game");

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