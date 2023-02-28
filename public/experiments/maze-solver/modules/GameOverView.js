window.GameOverView = (function (ScoreBoard, showUnshowRenderer, $$) {
  return function (ViewSwitcher, view) {
    var view = showUnshowRenderer(view);

    return {
      render (gameState, skipScoreBoard) {
        var n = gameState.maze.matrix.length;
        var score = gameState.player.score;
        if(!skipScoreBoard && ScoreBoard.isTopScore(n, score)) {
          return ViewSwitcher.setView('nameEntry', gameState);
        }
        view.render();
        $$('.js-score-here').forEach(el => {
          el.innerHTML = '';
          el.appendChild(document.createTextNode(score));
        });
        $$('.js-time-here').forEach(el => {
          el.innerHTML = '';
          el.appendChild(document.createTextNode(gameState.timeString));
        });
        
      },
      unrender () {
        view.unrender();
      }
    };
  };

})(ScoreBoard, ViewUtils.showUnshowRenderer, $$);
