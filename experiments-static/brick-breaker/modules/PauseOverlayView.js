window.PauseOverlayView = (function GameView (AudioPool) {
  var buttonMenu = null;

  function render () {
    buttonMenu.activate();
  }

  function unrender () {
    buttonMenu.deactivate();
  }

  function init () {
    buttonMenu = ButtonMenu($('#pause-menu')[0]);
  }

  return {
    render,
    unrender,
    init,
    name: "PauseOverlayView",
  }
})(AudioPool)
