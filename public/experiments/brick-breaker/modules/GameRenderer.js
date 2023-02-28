window.GameRenderer = function GameRenderer (canvas) {
  let onScreenCanvas = canvas;
  var onScreenContext =  canvas.getContext('2d');
  canvas = document.createElement('canvas');
  canvas.width = onScreenCanvas.width;
  canvas.height = onScreenCanvas.height;
  var context =  canvas.getContext('2d');
  const gradient = context.createRadialGradient(0, 0, Math.sqrt(Math.pow(canvas.width,2) + Math.pow(canvas.height, 2)),0,0,0);
  gradient.addColorStop(1,'rgba(255,255,255,0)');
  gradient.addColorStop(0, 'rgba(0,0,0,0.5)');
  var bgImage = ImageAsset(new URL('../assets/congruent_pentagon.png', import.meta.url));
  const fontFamily = "'Press Start 2P', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
  var width = canvas.width;
  var height = canvas.height;
  var unit = canvas.width / 250;

  function clearCanvas () {
    context.clearRect(0, 0, width, height);
  }

  function render (state, elapsed) {
    clearCanvas();
    renderBackground();
    renderPaddle(state.paddle);
    renderBricks(state);
    ParticleSystem.render(elapsed);
    renderBalls(state);
    renderGradient();
    renderCountdown(state);
    drawScore(state);
    drawPaddles(state);
    onScreenContext.drawImage(canvas, 0, 0, canvas.width, canvas.height);
  }

  function renderGradient (state) {
    context.save();
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }

  let prevCountdown = null;
  function renderSound (state) {
    if(prevCountdown != state.countdown) {
      if(state.countdown === 0) {
        AudioPool.playSFX('menu_navigate')
      } else {
        AudioPool.playSFX('menu_click')
      }
      prevCountdown = state.countdown
    }
    for(const ball of state.balls) {
      if(ball && ball.paddleContact || ball.wallContact) {
        AudioPool.playSFX('paddle_hit')
      }
      if(ball.brickContact) {
        AudioPool.playSFX('brick_hit')
      }
    }
  }

  function gradientColor (obj) {
    return Object.assign({}, obj, {
      color: gradient,
    });
  }

  function renderPaddle (paddle) {
    renderRectangle(paddle);
    // renderRectangle(gradientColor(paddle));
  }

  function drawPaddles (state) {
    for(var i = 0; i < state.paddlesLeft; ++i) {
      var rect = Geometry.Rectangle({
        width: state.unit * 10,
        height: state.unit * 2,
        x: 10,
        y: state.height - 10*(i+1) - (i+1)*(state.unit * 2),
      });
      rect.color = state.paddle.color;
      renderRectangle(rect);
    }
  }

  function getFontStyle (spec) {
    return `${Math.min(getFontSizeForWidth(spec.text, spec.width), getFontSizeForHeight(spec.height))}px ${fontFamily}`
  }

  var scoreFont = getFontStyle({
    text: `Score: 888`,
    width: (unit * 30)*(1-0.05*2),
    height: (unit * 5)*(1-0.05*2),
  });

  function drawScore (state) {
    DrawText({
      text: `Score: ${state.points}`,
      rect: Geometry.Rectangle({
        width: unit * 30,
        height: unit * 5,
        x: state.width - unit * 30,
        y: state.height - unit * 5
      }),
      font: scoreFont
    });
  }

  // Used a repeated background.
  // Reference: https://stackoverflow.com/a/14121902/2066736
  function renderBackground () {
    if(!bgImage.dataset.loaded) {
      // Image is not ready don't render background this
      // render cycle.
      return;
    }
    context.save()
    // Create a pattern with this image, and set it to "repeat".
    var ptrn = context.createPattern(bgImage, 'repeat'); 
    context.fillStyle = ptrn;
    // context.fillRect(x, y, width, height);
    context.fillRect(0, 0, canvas.width, canvas.height); 
    // context.fillStyle = gradient;
    // context.fillRect(0, 0, canvas.width, canvas.height); 
    context.restore();
  }

  function renderRectangle (rect) {
    context.save();
    context.beginPath();
    context.fillStyle = rect.color;
    context.fillRect(flr(rect.x), flr(rect.y), flr(rect.width), flr(rect.height)); 
    context.restore();
  }

  function copyIntoOnscreenCanvas(prev, target){
    var onscreenContext = document.getElementById('onscreen').getContext('2d');
    var offscreenContext = offscreenCanvas.getContext('2d');
    
    // cut the drawn rectangle
    var image = offscreenCanvas.getImageData(10,10,280,280); 
    // copy into visual canvas at different position
    onscreenContext.putImageData(image, 0, 0);
  }

  function renderBricks (state) {
    for(var i = 0; i < state.bricks.length; ++i) {
      for(var j = 0; j < state.bricks[i].length; ++j) {
        var rect = state.bricks[i][j]
        renderRectangle(rect);
        // renderRectangle(gradientColor(brick));
      }
    }
  }

  /**
   * A functional binary search method takes a directionDecider function and supplies
   * @param {Number} min 
   * min number to search with
   * @param {Number} max 
   * max number to search with
   * @param {Function} directionDecider
   * directionDecider has signature, (SearchItem: Number) => Direction: Number, 
   * and should return  a positive number for going higher 
   * a negative number for searching lower and 0 if the search element is found.
   */
  function binSearch (min, max, directionDecider) {
    if(min > max) {
      return [max, undefined, min];
    }
    var mid = Math.floor((min + max) / 2)
    var dir = directionDecider(mid);
    if(dir < 0) {
      return binSearch(min, mid - 1, directionDecider);
    } else if (dir > 0) {
      return binSearch(mid + 1, max, directionDecider);
    } else {
      return [mid-1, mid, mid+1]
    }
  }

  function getFontSizeForWidth (text, width) {
    context.save();
    var fontSizes = binSearch(2, width, (size) => {
      var minFontSize = 0;
      context.font = `${size}px ${fontFamily}`;
      return width - context.measureText(text).width;
    });
    context.restore();
    return fontSizes[1] || fontSizes[0];
  }

  function getFontSizeForHeight (height) {
    return getFontSizeForWidth('m', height);
  }

  function DrawText (spec) {
    context.save();
    context.font = spec.font;
    context.textAlign = spec.align || 'center';
    context.textBaseline = spec.baseline || 'middle';
    context.fillText(spec.text, flr(spec.rect.x + 0.5 * spec.rect.width), flr(spec.rect.y + 0.5 * spec.rect.height));
    context.restore();
  }

  var countDownFont = getFontStyle({
    text: `m`,
    width: (unit * 50)*(1-0.05*2),
    height: (unit * 50)*(1-0.05*2),
  });

  function renderCountdown (state) {
    if(state.countdown > 0) {
      DrawText({
        text: '' + state.countdown,
        rect: Geometry.Rectangle({
          x: state.width / 2 - state.unit * 50 / 2,
          y: state.height / 2 - state.unit * 50 / 2,
          width: state.unit * 50,
          height: state.unit * 50,
        }),
        font: countDownFont
      });
    }
  }

  function renderBalls (state) {
    for(var ball of state.balls) {
      renderCircle(ball);
      // renderBall(gradientColor(ball));
    }
  }

  function flr (x) {
    return Math.floor(x);
  }

  function renderCircle (circ) {
    context.save();
    context.beginPath();
    context.arc(flr(circ.x), flr(circ.y), flr(circ.radius), 0, 2 * Math.PI, false);
    context.fillStyle = circ.color;
    if(circ.opacity) {
      context.globalAlpha = circ.opacity;
    }
    context.fill();
    context.restore();
  }

  function init () {

  }
  
  var that = {
    init,
    render,
    renderSound,
    renderCircle,
    get unit () {
      return unit;
    },
    get height () {
      return height;
    },
    get width () {
      return width;
    }
  };
  return that;
}
