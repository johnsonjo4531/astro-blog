window.MenuView = (function GameView (AudioPool) {
  var buttonMenu = null;

  function render () {
    AudioPool.playMusic('menu');
    buttonMenu.activate();
  }

  function unrender () {
    buttonMenu.deactivate();
  }

  function init () {
    AudioPool.addMusic('menu', new URL('../assets/04_All_of_Us.mp3', import.meta.url));
    AudioPool.addSFX('menu_click', new URL('../assets/270324__littlerobotsoundfactory__menu-navigate-00.wav', import.meta.url));
    AudioPool.addSFX('menu_navigate', new URL('../assets/270322__littlerobotsoundfactory__menu-navigate-02.wav', import.meta.url));
    buttonMenu = ButtonMenu($('#game-menu')[0]);
  }

  return {
    render,
    unrender,
    init,
    name: "MenuView",
  }
})(AudioPool)
