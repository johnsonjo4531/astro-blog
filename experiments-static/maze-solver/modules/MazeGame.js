window.MazeGame = (function (Maze, MazeRenderer, GameState) {
  
  var maze = null;
  var canvas = document.getElementById('maze');
  var context = canvas.getContext('2d');
  var mazeRenderer = null;
  var gameState = null;
  var lastTime = null;

  var eventQueue = [];

  Array.from(document.getElementsByClassName('js-setMazeSize')).forEach(function (el) {
      el.addEventListener('click', function () {
      eventQueue.push(()=>reset(Number(this.dataset.size)));
    });
  });

  var keyCommands = KeyCommands(gameState, eventQueue);

  document.body.addEventListener('keyup', function (e) {
    if(!gameState || !gameState.enabled) return;
    var lowerKey = e.key.toLowerCase();
    if(lowerKey in keyCommands) {
      keyCommands[lowerKey]();
    }
  })

  function processEvents (elapsed) {
    for(var eventThunk of eventQueue) {
      eventThunk();
    }
    eventQueue.length = 0;
  }

  function update (elapsed) {
    // update time in seconds
    gameState.time += elapsed;
  }

  function render (elapsed) {
    mazeRenderer.render(elapsed, maze, gameState);
  }

  function gameLoop (elapsed) {
    if(lastTime === null) {
      lastTime = elapsed;
    }
    var delta = elapsed - lastTime;
    processEvents(delta);
    update(delta);
    render(delta);
    lastTime = elapsed;

    if(gameState.enabled) {
      requestAnimationFrame(gameLoop);
    }
  }

  function reset (n, gameOptions) {
    lastTime = null;
    eventQueue = [];
    mazeRenderer = MazeRenderer(context, {
      mazeSize: canvas.width,
      mazeNumRowsCols: n,
    });
    maze = Maze.generate(n);
    gameState = GameState(maze, gameOptions);
    keyCommands = KeyCommands(gameState, eventQueue)
  }
  
  function init (n, gameOptions) {
    reset(n, gameOptions);
    requestAnimationFrame(gameLoop);
  }
  
  return {
    init,
  }
})(Maze, MazeRenderer, GameState);

