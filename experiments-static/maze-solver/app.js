(function (ViewSwitcher, GameView, GameOverView, NameEntryView, ScoreBoard, showUnshowRenderer, Events, $$) {

  var viewSwitcher = ViewSwitcher(that => ({
    game: GameView(that, '[data-view="game"]'),
    menu: showUnshowRenderer('[data-view="menu"]'),
    gameOver: GameOverView(that, '[data-view="gameOver"]', ),
    gameStart: showUnshowRenderer('[data-view="gameStart"]'),
    credits: showUnshowRenderer('[data-view="credits"]'),
    highScore: showUnshowRenderer('[data-view="highScore"]'),
    nameEntry: NameEntryView(that, '[data-view="nameEntry"]')
  }));

  $$('[data-scoreboard]').forEach(el => {
    ScoreBoard.render(el, el.dataset.scoreboard);
  })

  $$('[data-view]').forEach(function (el) {
    el.classList.add('hidden');
  });

  $$('[data-view-target]').forEach(function (el) {
    el
  });

  Events.on('[data-view-target]', 'click', function () {
    viewSwitcher.currentView = this.dataset.viewTarget;
  })

  Events.on('.js-startMaze', 'click', function () {
    var n = this.dataset.size;
    viewSwitcher.setView('game', n);
    $$('.js-replay').forEach(x=>x.dataset.size = n);
    $$('.js-maze-size-here').forEach(x => {
      x.innerHTML = '';
      x.appendChild(document.createTextNode(`${n}x${n}`));
    });
  });

  viewSwitcher.currentView = 'menu';

})(ViewSwitcher, GameView, GameOverView, NameEntryView, ScoreBoard, ViewUtils.showUnshowRenderer, Events, $$);
