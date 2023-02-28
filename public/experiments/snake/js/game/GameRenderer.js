window.GameRenderer = function GameRenderer (canvas) {
  var context =  canvas.getContext('2d');
  const fontFamily = "'Press Start 2P', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

  var width = canvas.width;
  var height = canvas.height;

  function clearCanvas () {
    context.clearRect(0, 0, width, height);
  }

  function render (state, elapsed) {
    clearCanvas();
    renderSnake(state.snake);
    renderObstacles(state.obstacles);
    renderFood(state.food);
    renderBorder();
    renderCountdown(state);
    renderSound(state);
  }

  function renderBorder () {
    var color = "steelblue";
    var stroke = 'transparent'
    renderRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height/50,
      color,
      strokeColor: stroke,
    })
    renderRectangle({
      x: 0,
      y: 0,
      width: width/50,
      height: height,
      color,
      strokeColor: stroke,
    })
    renderRectangle({
      x: 49*width/50,
      y: 0,
      width: width/50,
      height: height,
      color,
      strokeColor: stroke,
    })
    renderRectangle({
      x: 0,
      y: 49*height/50,
      width: width,
      height: height/50,
      color,
      strokeColor: stroke,
    })
  }

  function renderItem (part, color) {
    renderRectangle({
      x: part.x*width/50,
      y: part.y*height/50,
      width: width/50,
      height: height/50,
      color,
      strokeColor: 'black',
    })
  }

  function renderSnake (snake) {
    for(var part of snake) {
      renderItem(part, "seagreen");
    }
  }

  function renderObstacles (obstacles) {
    for(var part of obstacles) {
      renderItem(part, 'slategrey');
    }
  }

  function renderFood (food) {
    renderItem(food, 'tomato');
  }

  function getFontStyle (spec) {
    return `${Math.min(getFontSizeForWidth(spec.text, spec.width), getFontSizeForHeight(spec.height))}px ${fontFamily}`
  }

  var scoreFont = getFontStyle({
    text: `Score: 888`,
    // 0.05 is the padding
    width: (width * 0.11)*(1-0.05*2),
    height: (width * 0.02)*(1-0.05*2),
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

  function renderRectangle (rect) {
    context.save();
    context.beginPath();
    context.fillStyle = rect.color;
    context.fillRect(flr(rect.x), flr(rect.y), flr(rect.width), flr(rect.height)); 
    context.strokeStyle = rect.strokeColor;
    context.strokeRect(flr(rect.x), flr(rect.y), flr(rect.width), flr(rect.height)); 
    context.restore();
  }

  function strokeRectangle (rect) {
    context.save();
    context.beginPath();
    
    context.restore();
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
    width: (width * 0.2)*(1-0.05*2),
    height: (width * 0.2)*(1-0.05*2),
  });

  function renderCountdown (state) {
    if(state.countdown > 0) {
      DrawText({
        text: '' + state.countdown,
        rect: Geometry.Rectangle({
          x: width / 2 - width*0.2 / 2,
          y: height / 2 - width*0.2 / 2,
          width: width*0.2,
          height: width*0.2,
        }),
        font: countDownFont
      });
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

  function renderSound (state) {
    if(state.gameOver) {
      AudioPool.playSFX('hit');
    }
    if(state.didEat) {
      AudioPool.playSFX('eat');
    }
  }
  
  var that = {
    init,
    render,
    renderSound,
    renderCircle,
    get height () {
      return height;
    },
    get width () {
      return width;
    }
  };
  return that;
}
