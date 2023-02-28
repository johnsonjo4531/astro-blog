window.GameActions = function GameActions () {

  let GameCommands = {
    paddleLeft (elapsed, gameState) {
      if(!gameState.ready) return;
      gameState.paddle.x = Math.max(0,gameState.paddle.x - gameState.paddle.speed*elapsed);
    },
    paddleRight (elapsed, gameState) {
      if(!gameState.ready) return;
      gameState.paddle.x = Math.min(gameState.width-gameState.paddle.width,gameState.paddle.x + gameState.paddle.speed*elapsed);
    },
  };

  let keyboard = KeyboardHandler();

  function setupActions() {
    keyboard.addAction('ArrowLeft', GameCommands.paddleLeft); 
    keyboard.addAction('ArrowRight', GameCommands.paddleRight);
  }

  return {
    setupActions,
    keyboard,
    activate () {
      keyboard.activate();
    },
    deactivate () {
      keyboard.deactivate();
    },
    handle (elapsed, gameState) {
      keyboard.handle(elapsed, gameState)
    },
  };
}
