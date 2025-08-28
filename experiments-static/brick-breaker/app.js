(function (ViewSwitcher, MenuView, GameView) {
  function onScoreUpdate() {
    $$(".js-scoreboard-here").forEach((el) => {
      scoreboard.render(el);
    });
  }

  function miscSetup() {
    Events.on($("#volume-toggle"), "click", function () {
      if (AudioPool.mute) {
        AudioPool.mute = false;
        this.classList.add("on");
      } else {
        AudioPool.mute = true;
        this.classList.remove("on");
      }
    });
  }

  function main(e) {
    $("#js-reset-scores")[0].addEventListener("click", function () {
      scoreboard.reset();
    });

    miscSetup();

    const CreditsView = ViewStarters.ButtonView(
      "CreditsView",
      $("#credit-display")[0],
      () => {
        MainView.loadView(MenuView.name);
      },
    );
    const HighScoresView = ViewStarters.ButtonView(
      "HighScoresView",
      $("#high-scores-display")[0],
      () => {
        MainView.loadView(MenuView.name);
      },
    );
    const ControlsView = ViewStarters.ButtonView(
      "ControlsView",
      $("#controls-menu")[0],
      () => {
        MainView.loadView(MenuView.name);
      },
    );
    window.MainView = ViewSwitcher();
    MainView.addViews(
      MenuView,
      GameView,
      CreditsView,
      HighScoresView,
      ControlsView,
    );
    MainView.loadView(MenuView.name);
    window.scoreboard = ScoreBoard("High Scores");
    scoreboard.events.addEventListener("high-score-update", onScoreUpdate);
    onScoreUpdate();
  }

  window.addEventListener("load", main);
})(ViewSwitcher, MenuView, GameView);
