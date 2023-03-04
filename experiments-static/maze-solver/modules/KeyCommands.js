window.KeyCommands = function (gameState, eventQueue) {
  var moveNorth = () => eventQueue.push(() => gameState.doCommand('move', 'n'));
  var moveSouth = () => eventQueue.push(() => gameState.doCommand('move', 's'));
  var moveWest = () => eventQueue.push(() => gameState.doCommand('move', 'w'));
  var moveEast = () => eventQueue.push(() => gameState.doCommand('move', 'e'));
  var hintToggle = () => eventQueue.push(() => gameState.doCommand('hintToggle'));
  var breadCrumbsToggle = () => eventQueue.push(() => gameState.doCommand('breadCrumbsToggle'));
  var shortestPathToggle = () => eventQueue.push(() => gameState.doCommand('shortestPathToggle'));
  var scoreToggle = () => eventQueue.push(() => gameState.doCommand('scoreToggle'));

  return {
    'w': moveNorth,
    'i': moveNorth,
    'arrowup': moveNorth,
    's': moveSouth,
    'k': moveSouth,
    'arrowdown': moveSouth,
    'a': moveWest,
    'j': moveWest,
    'arrowleft': moveWest,
    'd': moveEast,
    'l': moveEast,
    'arrowright': moveEast,
    'h': hintToggle,
    'b': breadCrumbsToggle,
    'p': shortestPathToggle,
    'y': scoreToggle,
  }
};
