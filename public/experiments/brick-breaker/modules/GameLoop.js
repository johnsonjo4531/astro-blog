window.GameLoop = (function gameLoop (GameState, GameRenderer, GameActions) {

  var running = false;
  var lastTime = null;
  let renderer = { render () {} };
  var state = null;
  let gameStateSpec = null;
  let gameActions = null;

  var Interval = (cb, ms) =>  {
    let interval = null; 
    return {
      activate () {
        var then = Date.now();
        interval = setInterval(() => {
          var now = Date.now();
          var elapsed = now - then;
          cb(elapsed);
          then = now;
        },ms)
      },
      deactivate () {
        if(interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };
  }

  function addParticles (state) {
    for(const brick of state.removedBricks) {
      ParticleSystem.create({
        position: { x: brick.center.x, y: brick.center.y, xMin: brick.left, xMax: brick.right, yMin: brick.top, yMax: brick.bottom },
        speed: { mean: 0.05, stdev: 0.0225},
        lifetime: { mean: 300, stdev: 150 },
        size: { mean: 15, stdev: 10 },
        particlesPerUpdate: 3,
        color: brick.color,
        opacity: 0.5,
        rectangular: true,
        xMaxDir: 1,
        yMaxDir: brick.height / brick.width,
        systemLifetime: 2000,
      }, renderer);
    }
    state.removedBricks = new Set();
  }
  
  function handleInput (elapsed) {
    gameActions.handle(elapsed, state)
  }

  function update (elapsed) {
    //state.update(elapsed);
    state.update(elapsed);
    renderer.renderSound(state);
    addParticles(state);
    ParticleSystem.update(elapsed);
  }

  function render (elapsed) {
    renderer.render(state, elapsed);
  }

  var lag = 0;
  const UPDATE_PER_MS = 16;
  function gameLoop (timeNow) {
    if(!lastTime) {
      lastTime = timeNow;
    }
    var elapsed = timeNow - lastTime;
    lastTime = timeNow;
    var lag = elapsed;
    handleInput(elapsed);
    while(lag > UPDATE_PER_MS) {
      update(UPDATE_PER_MS);
      lag -= UPDATE_PER_MS;
    }
    if(lag > 0) {
      // extra update but atleast we won't be telling render
      // the wrong information
      update(lag);
    }
    render(elapsed);

    if(!state.gameOver && running) {
      requestAnimationFrame(gameLoop);
    } else {
      gameActions.deactivate();
      state = null;
    }
  }
  
  function start () {
    running = true;
    state = GameState(gameStateSpec);
    requestAnimationFrame(gameLoop);
    gameActions.activate();
  }

  function end () {
    running = false;
  }

  function init (newRenderer, spec) {
    renderer = newRenderer;
    gameStateSpec = spec;
    gameActions = GameActions();
    gameActions.setupActions();
  }

  return {
    start,
    end,
    init,
    get state () {
      return state;
    },
  }
})(GameState, GameRenderer, GameActions);
