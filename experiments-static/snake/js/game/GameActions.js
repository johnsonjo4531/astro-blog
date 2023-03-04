window.GameActions = function GameActions () {

  let GameCommands = {
    moveLeft (elapsed, gameState) {
      if(!gameState.ready || gameState.countdown > 0) return;
      gameState.snake.dir = gameState.snake.dirs.left;
    },
    moveRight (elapsed, gameState) {
      if(!gameState.ready || gameState.countdown > 0) return;
      gameState.snake.dir = gameState.snake.dirs.right;
    },
    moveUp (elapsed, gameState) {
      if(!gameState.ready || gameState.countdown > 0) return;
      gameState.snake.dir = gameState.snake.dirs.up;
    },
    moveDown (elapsed, gameState) {
      if(!gameState.ready || gameState.countdown > 0) return;
      gameState.snake.dir = gameState.snake.dirs.down;
    },
  };

  let keyboard = KeyboardHandler();

  function bothCasesAction (letter, command) {
    keyboard.addOnceAction(letter.toLowerCase(letter), command);
    keyboard.addOnceAction(letter.toUpperCase(letter), command);
  }

  function setupActions() {
    keyboard.addOnceAction('ArrowLeft', GameCommands.moveLeft);
    bothCasesAction('a', GameCommands.moveLeft);
    bothCasesAction('j', GameCommands.moveLeft);
    keyboard.addOnceAction('ArrowRight', GameCommands.moveRight);
    bothCasesAction('d', GameCommands.moveRight);
    bothCasesAction('l', GameCommands.moveRight);
    keyboard.addOnceAction('ArrowUp', GameCommands.moveUp);
    bothCasesAction('w', GameCommands.moveUp);
    bothCasesAction('i', GameCommands.moveUp);
    keyboard.addOnceAction('ArrowDown', GameCommands.moveDown);
    bothCasesAction('s', GameCommands.moveDown);
    bothCasesAction('k', GameCommands.moveDown);
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
