window.GameView = (function (showUnshowRenderer, MazeGame, $$) {
  return function (ViewSwitcher, view) {
    var view = showUnshowRenderer(view);

    return {
      render (n) {
        view.render();
        var lastTime = null;
        MazeGame.init(Number(n), {
          onGameOver(gameState){
            ViewSwitcher.setView('gameOver', gameState);
          },
          onScoreUpdate (score) {
            $$('.js-score-here').forEach(el => {
              el.innerHTML = '';
              el.appendChild(document.createTextNode(score));
            });
          },
          onScoreHide () {
            $$('.js-score-here').forEach(el => {
              el.innerHTML = '?';
            });
          },
          onTimeUpdate (gameState) {
            if(lastTime != null && gameState.secondTime - lastTime < 1) {
              return;
            }
            lastTime = gameState.secondTime;
            $$('.js-time-here').forEach(el => {
              el.innerHTML = '';
              el.appendChild(document.createTextNode(gameState.timeString));
            });
          }
        });
      },
      unrender () {
        view.unrender();
      }
    };
  };

})(ViewUtils.showUnshowRenderer, MazeGame, $$);
