window.GameLoop = (function GameLoop (GameState, GameRenderer, GameActions) {

	var running = false;
	var lastTime = null;
	let renderer = { render () {} };
	var state = null;
	let gameStateSpec = null;
	let gameActions = null;
	
	function handleInput (elapsed) {
	  gameActions.handle(elapsed, state)
	}
  
	function update (elapsed) {
	  //state.update(elapsed);
	  state.update(elapsed);
	  renderer.renderSound(state);
	}
  
	function render (elapsed) {
	  renderer.render(state, elapsed);
	}
  
	function gameLoop (timeNow) {
    if(!state || state.gameOver || !running) {
      return;
    }
	  if(!lastTime) {
		lastTime = timeNow;
	  }
	  var elapsed = timeNow - lastTime;
    lastTime = timeNow;
    handleInput(elapsed);
		update(elapsed);
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
    lastTime = null;
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
