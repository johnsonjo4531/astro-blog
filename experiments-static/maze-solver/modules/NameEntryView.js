window.NameEntryView = (function (ScoreBoard, showUnshowRenderer, $$, Events) {
  return function (ViewSwitcher, view) {
    var view = showUnshowRenderer(view);

    return {
      render (gameState) {
        view.render();
        
        function onSubmit () {
          var name = document.getElementById('name-input').value;

          var mazeSize = gameState.maze.matrix.length;
          ScoreBoard.writeScore(mazeSize, [name, gameState.player.score]);

          $$(`[data-scoreboard="${mazeSize}"]`).forEach(el => {
            ScoreBoard.render(el, mazeSize);
          });
          
          ViewSwitcher.setView('gameOver', gameState, true)
        }

        $$('#name-input')[0].focus();
        function enterListener (e) {
          if (ViewSwitcher.currentView !== ViewSwitcher.views.nameEntry) {
            return;
          }
          if(e.key === 'Enter') {
            onSubmit();
          } else {
            Events.once('body', 'keypress', enterListener);    
          }
        }
        Events.once('body', 'keypress', enterListener);
        Events.once('.js-submitName', 'click', onSubmit);
      },
      unrender () {
        view.unrender();
      }
    }
  }
})(ScoreBoard, ViewUtils.showUnshowRenderer, $$, Events)
