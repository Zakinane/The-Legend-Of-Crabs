  const savedData = localStorage.getItem("game");
  const highScoreElement = document.querySelector(".high-score");

  highScoreElement.textContent = localStorage.getItem("game");