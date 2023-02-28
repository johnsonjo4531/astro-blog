window.GameView = (function GameView () {

  window.OverlayViewSet = null;
  let EmptyView = ViewStarters.EmptyView('EmptyView');
  let PauseView = ViewStarters.ButtonView('PauseView', $('#pause-view')[0]);
  let GameOverView = ViewStarters.ButtonView('GameOverView', $('#game-over-view')[0], () => {
    MainView.loadView(MenuView.name);
  });
  var gameLoop = null;
  var keyboardHandler = null;
  
  const displayScore = (state) => {
    $$('.js-score-here').forEach(el => {
      el.innerHTML = '';
      el.appendChild(document.createTextNode(state.points))
    });
  }

  function render () {
    keyboardHandler.activate();
    OverlayViewSet.loadView(EmptyView.name);
    AudioPool.playMusic('game');
    GameLoop.start();
  }

  function unrender () {
    OverlayViewSet.loadView(EmptyView.name);
    keyboardHandler.deactivate();
    GameLoop.end();
  }

  function init () {
    OverlayViewSet =  ViewSwitcher();
    var canvas = $('#game-canvas')[0];
    var renderer = GameRenderer(canvas);
    // start up the game loop
    GameLoop.init(renderer, {
      width: renderer.width,
      height: renderer.height,
      unit: renderer.unit,
      gameOver (state) {
        if(state.winner) {
          AudioPool.playSFX('game_win');
          var header = $('#game-over-header')[0];
          header.innerHTML = 'You Win!';
        } else {
          AudioPool.playSFX('game_over');
          var header = $('#game-over-header')[0];
          header.innerHTML = 'Game Over';
        }
        // display the final score
        displayScore(state);
        // display the quip about the score
        // load game over view or custom name modal
        if(scoreboard.isTopScore(state.points)) {
          var name = PromptScreen(`
          <h2>You got a High Score!</h2>
          <h5>Enter your name below and hit submit click enter! You could hit cancel though if you want to be all secret secret.</h5>
          `).then(function (name) {
            if(name) {
              scoreboard.writeScore(name, state.points);
            }
            AudioPool.playSFX('menu_click');
            OverlayViewSet.loadView(GameOverView.name);
          })
        } else {
          OverlayViewSet.loadView(GameOverView.name);
        }
      }
    },);

    // listen for pause event
    keyboardHandler = KeyboardHandler(true);
    keyboardHandler.addOnceAction('Escape', () => {
      // toggle between
      if(MainView.currentView.name !== GameView.name) {
        return;
      }
      if (OverlayViewSet.currentView.name != PauseView.name) {
        GameLoop.state.paused = true;
        OverlayViewSet.loadView(PauseView.name);
      } else {
        GameLoop.state.paused = false;
        OverlayViewSet.loadView(EmptyView.name);
      }
    });

    Events.on($(`#pause-view [data-view-transition="${EmptyView.name}"]`), 'click', function (e) {
      GameLoop.state.paused = false;
    })

    Events.onPageVisibility(function (e) {
      if(e.hidden) {
        if(MainView.currentView.name === GameView.name && OverlayViewSet.currentView.name === EmptyView.name) {
          GameLoop.state.paused = true;
          OverlayViewSet.loadView(PauseView.name);
        }
      }
    });

    // set up sub-views
    OverlayViewSet.events.addEventListener('view-loaded', function (e) {
      if(e.name === GameOverView.name) {
        keyboardHandler.deactivate();
      } else {
        if(e.name === PauseView.name) {
          displayScore(GameLoop.state);
        }
        keyboardHandler.activate();
      }
    });
    OverlayViewSet.addViews(EmptyView, PauseView, GameOverView);
    OverlayViewSet.loadView(EmptyView.name); 
  }

  return {
    render,
    unrender,
    init,
    name: "GameView",
  }
}());
