window.GameView = (function GameView (GameLoop) {
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

  async function init () {
    var quips = [
      "This is why we can't have nice things.",
      "Better luck next time!",
      "Vandal! Stop breaking my stuff!",
      "Much Wow! Many points! Very Break!",
      "Holy cow Batman!",
      "That just might be the greatest thing I've ever seen!",
    ];
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
        var quipNum = Math.min(Math.floor(state.points / state.maxPoints * (quips.length-1)), quips.length - 1)
        var quip = quips[quipNum];
        $$('.js-score-quip-here').forEach(el => {
          el.innerHTML = '';
          el.appendChild(document.createTextNode(quip))
        });
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

    // load some sounds
    AudioPool.addMusic('game', new URL('../assets/01_A_Night_Of_Dizzy_Spells.mp3', import.meta.url));
    AudioPool.addSFX('paddle_hit', new URL('../assets/270326__littlerobotsoundfactory__hit-01.wav', import.meta.url));
    AudioPool.addSFX('brick_hit', new URL('../assets/270325__littlerobotsoundfactory__hit-02.wav', import.meta.url));
    AudioPool.addSFX('game_over', new URL('../assets/270328__littlerobotsoundfactory__hero-death-00.wav', import.meta.url));
    AudioPool.addSFX('game_win', new URL('../assets/270333__littlerobotsoundfactory__jingle-win-00.wav', import.meta.url));

    // listen for pause event
    keyboardHandler = KeyboardHandler(true);
    keyboardHandler.addOnceAction('Escape', () => {
      // toggle between
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
})(GameLoop)
