window.GameState = function GameState (spec) {
  var that = {};
  that.winner = false;

  that.unit = spec.unit;
  that.width = spec.width;
  that.height = spec.height;
  that.maxPoints = 0;
  that.removedBricks = new Set();

  /**
   * GameState private variables with getters and setters
   */
  (()=>{
    var _points = 0;
    Object.defineProperty(that, 'points', {
      get () {
        return _points;
      },
      set (val) {
        if(Math.floor(val/100) - Math.floor(_points/100) >= 1) {
          that.balls.add(Ball());
        }
        _points = val;
      }
    });
    var _paused = false;
    Object.defineProperty(that, 'paused', {
      get () {
        return _paused;
      },
      set (val) {
        _paused = !!val
      }
    });
    var _ready = false;
    Object.defineProperty(that, 'ready', {
      get () {
        if(that.paused) {
          return false;
        } else {
          return _ready;
        }
      },
      set (val) {
        _ready = !!val;
      }
    });
  })();
  const lineBonus = 25;
  that.paddlesLeft = 3;
  that.gameOver = false;
  const fullSizePaddleWidth = spec.unit * 20;

  

  function doCountDown () {
    that.ready = false;
    that.countdown = 3;
    var countDown = setInterval(function cd () {
      if(that.paused) {
        return;
      }
      that.countdown -= 1;
      if(that.countdown === 0) {
        that.ready = true;
        clearInterval(countDown);
      }
    }, 1000);
  }

  doCountDown();

  function RowRect (rowOfRectangles) {
    var first = rowOfRectangles[0];
    var last = rowOfRectangles[rowOfRectangles.length - 1]
    return Geometry.Rectangle({
      x: first.left,
      y: first.top,
      width: last.right - first.left,
      height: last.bottom - first.top
    });
  }

  function MatrixRect (matrixOfRectangles) {
    var first = matrixOfRectangles[0][0];
    var last = matrixOfRectangles[matrixOfRectangles.length - 1][matrixOfRectangles[0].length - 1];
    return Geometry.Rectangle({
      x: first.left,
      y: first.top,
      width: last.right - first.left,
      height: last.bottom - first.top
    });
  }
  var matrixRect = null;
  var rowRects = [];

  /**
   * Update method for gameloop.
   * @param {Number} elapsed
   * number of milliseconds elapsed since last update 
   */
  that.update = function update (elapsed) {
    for(var ball of that.balls) {
      ball.paddleContact = false;
      ball.brickContact = false;
      ball.wallContact = false;
      if(!that.ready) {
        return;
      }
      if(ball.x + ball.radius > spec.width) {
        ball.reflectLeft();
        ball.wallContact = true;
      }
      if(ball.y - ball.radius < 0) {
        ball.reflectDown();
        ball.wallContact = true;
      }
      if(ball.y - ball.radius > spec.height) {
        // reset ball remove paddle
        that.balls.delete(ball);
        if(that.balls.size === 0) {
          that.paddlesLeft--;
          if(that.paddlesLeft === 0) {
            that.gameOver = true;
            spec.gameOver(that);
            return;
          }
          doCountDown();
          resetPaddle();
          that.balls.add(Ball());
        }
        continue;
      }
      if(ball.x - ball.radius < 0) {
        ball.reflectRight();
        ball.wallContact = true;
      }
      if(ball.boundingRect.intersectsRect(that.paddle)) {
        ball.reflectUp();
        ball.deltaPerMS.x = ball.speed * (ball.x - that.paddle.center.x) / (that.paddle.width / 2);
        ball.paddleContact = true;
      }
      var ballBoundingRect = ball.boundingRect;
      if(ballBoundingRect.intersectsRect(matrixRect)) {
        for(var i = 0; i < that.bricks.length; ++i) {
          const brickRow = that.bricks[i];
          if(brickRow.length === 0 || !ballBoundingRect.intersectsRect(rowRects[i])) {
            continue;
          }
          for(var brick of brickRow) {
            var intersection = ballBoundingRect.intersectsRect(brick);
            if(intersection) { 
              if(i === 0) {
                that.paddle.width = fullSizePaddleWidth / 2;
              }
  
              that.removedBricks.add(brick);
              ball.brickContact = true;
              ball.breaks++;
              that.points += brick.points;
              switch(intersection) {
                case 'top':
                ball.reflectUp();
                break;
                case 'bottom':
                ball.reflectDown();
                break;
                case 'right':
                ball.reflectRight();
                break;
                case 'left':
                ball.reflectLeft();
                break;
              }
            }
          }
        }
      }
      ball.x += ball.deltaPerMS.x * elapsed;
      ball.y += ball.deltaPerMS.y * elapsed;
    }
    if(that.removedBricks.size > 0) {
      that.bricks = that.bricks.map(r => {
        if (r.length == 0) {
          return [];
        }
        var q = r.filter(x => !that.removedBricks.has(x))
        if(q.length === 0) {
          that.points += lineBonus;
        }
        return q;
      });
      
      if(that.bricks.every(x => x.length === 0)) {
        that.gameOver = true;
        that.winner = true;
        // final extra points for more competitive high scores.
        that.points += that.balls.size * 3 + that.paddlesLeft * 5
        spec.gameOver(that);
      }
    }
  };

  /**
   * that.bricks initialization
   */
  (function buildBricks () {
    // rows will be rendered held top to bottom
    var margin = 5;
    var height = 0.35*spec.height;
    var heightOffset = 0.2*spec.height;
    // notice how these two arrays are reversed
    // yellow, orange, blue, green 
    var rowColors = ['#FFD87D', '#FFD87D', '#FFAC69', '#FFAC69', '#85D1C2', '#85D1C2', '#D3F05F', '#D3F05F'].reverse();
    var rowPoints = [1,1,2,2,3,3,5,5].reverse();
    const numRows = rowColors.length;
    const numCols = 14;
    that.maxPoints = rowPoints.reduce((a,b) => a+b*numCols, 0) + rowPoints.length * lineBonus;
    that.bricks = [];
    for(var rowNum = 0; rowNum < numRows; ++rowNum) {
      that.bricks[rowNum] = [];
      for(var cellNum = 0; cellNum < numCols; ++cellNum) {
        that.bricks[rowNum][cellNum] = Geometry.Rectangle({
          // margins on the left and right and all in between
          width: (spec.width-(numCols+1)*margin) / numCols,
          // no margin on the top and bottom but all in between
          height: (height-(numRows-1)*margin) / numRows,
        });
        let brick = that.bricks[rowNum][cellNum];
        // start with a beginning margin
        brick.x = margin*(cellNum+1) + brick.width * cellNum;
        // begin with no margin
        brick.y = heightOffset + margin*(rowNum) + brick.height * rowNum;
        brick.color = rowColors[rowNum];
        brick.points = rowPoints[rowNum];
        brick.broken = false;
      }
    }
    matrixRect = MatrixRect(that.bricks);
    rowRects = that.bricks.map(row => RowRect(row))

  })();

  that.paddle = Geometry.Rectangle({
    width: fullSizePaddleWidth,
    height: spec.unit * 4,
  });

  function unitPerFrame (n) {
    return spec.unit / (1000/60) * n
  }

  resetPaddle();

  that.paddle.y = spec.height - that.paddle.height - that.paddle.height * 2;
  that.paddle.color = 'cornflowerblue';

  function resetPaddle () {
    that.paddle.speed = unitPerFrame(2);
    that.paddle.x = spec.width / 2 - that.paddle.width / 2;
    that.paddle.width = fullSizePaddleWidth;
  }

  function getNextBallColors(arr) {
    return () => {
      var color = arr.shift();
      arr.push(color);
      return color;
    }
  }
  var ballColorGenerator = getNextBallColors(['tomato', 'gold', 'DarkTurquoise', 'DarkSlateGrey', 'LightGreen']);
  function Ball () {
    var ball = {};
    ball = Geometry.Circle({
      radius: spec.unit * 2,
    });

    ball.color= ballColorGenerator();

    var _breaks = 0;
    Object.defineProperty(ball, 'breaks', {
      get () {
        return _breaks;
      },
      set (val) {
        _breaks = val;
        if(val >= 62) {
          ball.speed = unitPerFrame(2.5)
        } else if (val >= 36) {
          ball.speed = unitPerFrame(2)
        } else if (val >= 12) {
          ball.speed = unitPerFrame(1.5)
        } else if (val >= 4) {
          ball.speed = unitPerFrame(1)
        }
      }
    });

    // the balls x and y is it's center
    ball.x = that.paddle.width / 2 + that.paddle.x;
    ball.y = that.paddle.top - that.paddle.height / 2 - ball.radius;
    var _speed = unitPerFrame(0.5)
    Object.defineProperty(ball, 'speed', {
      get () {
        return _speed;
      },
      set (val) {
        if(_speed !== val) {
          ball.deltaPerMS.x *= val / _speed;
          ball.deltaPerMS.y *= val / _speed;
          _speed = val;
        }
      }
    });
    ball.deltaPerMS = {
      x: ball.speed,
      y: -ball.speed,
    };
    ball.paddleContact = false;
    ball.brickContact = false;
    ball.wallContact = false;
    ball.reflectLeft = function () {
      ball.deltaPerMS.x = -1 * Math.abs(ball.deltaPerMS.x);
    }
    ball.reflectRight = function () {
      ball.deltaPerMS.x = Math.abs(ball.deltaPerMS.x);
    }
    ball.reflectDown = function () {
      ball.deltaPerMS.y = Math.abs(ball.deltaPerMS.y);
    }
    ball.reflectUp = function () {
      ball.deltaPerMS.y = -1 * Math.abs(ball.deltaPerMS.y);
    }

    return ball;
  }

  that.balls = new Set([Ball()]);
  
  return that;
};
