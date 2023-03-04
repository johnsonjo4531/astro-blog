window.MenuView = (function MenuView (AudioPool) {
  var buttonMenu = null;
  let user = null;

  function render () {
    AudioPool.playMusic('menu');
    buttonMenu.activate();
  }

  function unrender () {
    buttonMenu.deactivate();
  }

  function init () {
    buttonMenu = ButtonMenu($('#game-menu')[0]);
  }

  return {
    render,
    unrender,
    init,
    name: "MenuView",
  }
})(AudioPool);
