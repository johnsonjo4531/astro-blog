window.GameState = function GameState (spec) {
  var that = {};

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  that.didEat = false;

  // spec.gameOver(that);
  /**
   * GameState private variables with getters and setters
   */
  (()=>{
    var _points = 0;
    Object.defineProperty(that, 'points', {
      get () {
        return that.snake.length;
      },
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

  const countDownTime = 3;
  that.countdown = countDownTime;

  that.ready = true;

  var totalTime = 0;
  var lastMove = 0;
  that.update = function (elapsed) {
    if(!that.ready) {
      return;
    }
    totalTime += elapsed;
    if(that.countdown > 0) {
      that.countdown = countDownTime - Math.floor(totalTime / 1000);
      
      if(that.countDown <= 0) {
        that.ready = true;
      }
    }
    if(!that.snake.moving) {
      lastMove = totalTime;
    }
    that.didEat = false;
    const msPerMove = 150;
    var elapsedSinceLastMove = totalTime - lastMove;
    if(elapsedSinceLastMove > 150) {
      that.snake.makeMoves(Math.floor(elapsedSinceLastMove/150));
      lastMove = totalTime;
    }
  }

  function Snake () {
    var moving = false;
    var dirs = {
      'up': {
        'opposite': 'down',
        vector: {
          xDelta: 0,
          yDelta: -1,
        }
      },
      'down': {
        'opposite': 'up',
        vector: {
          xDelta: 0,
          yDelta: 1,
        }
      },
      'right': {
        'opposite': 'left',
        vector: {
          xDelta: 1,
          yDelta: 0,
        }
      },
      'left': {
        'opposite': 'right',
        vector: {
          xDelta: -1,
          yDelta: 0,
        }
      },
    }
    var _dir = null;
    var _parts = [
      {
        x: 24, 
        y: 24
      },
    ];
    var pendingTail = 0;
    var snake = {
      get moving () {
        return moving;
      },
      set moving (value) {
        moving = value;
      },
      set dir (val) {
        if(['up', 'left', 'down', 'right'].indexOf(val) > -1 && (!snake.dir || snake.dir.opposite != val)) {
          if(!moving) moving = true;
          _dir = val;
        }
      },
      get dir () {
        return _dir && dirs[_dir];
      },
      dirs: {
        up: 'up',
        down: 'down',
        left: 'left',
        right: 'right',
      },
      get parts () {
        return _parts;
      },
      makeMoves (moveNumber) {
        for(var i = 0; i < moveNumber; ++i) {
          // add to the front
          var newPart = {
            x: _parts[0].x + snake.dir.vector.xDelta,
            y: _parts[0].y + snake.dir.vector.yDelta,
          };
          if(that.obstacles.intersects(newPart) || snake.intersects(newPart) || newPart.x <= 0 || newPart.x >= 49 || newPart.y <= 0 || newPart.y >= 49) {
            that.gameOver = true;
            spec.gameOver(that);
          };
          _parts.unshift(newPart);
          // remove from back
          if(pendingTail > 0) {
            pendingTail--;
          } else {
            _parts.pop();
          }

          if(that.food.intersects(newPart)) {
            pendingTail += 3;
            // get new food
            that.food = Food();
            that.didEat = true;
          }
        }
      },
      get length () {
        return snake.parts.length + pendingTail;
      },
      intersects (item) {
        for(const part of snake) {
          if(part.x == item.x && part.y == item.y) {
            return true;
          }
        }
        return false;
      },
      *[Symbol.iterator] () {
        yield* snake.parts
      }
    };

    snake.moving = false;

    return snake;
  }

  function Obstacles () {
    const numObstacles = 15;

    var obstacles = [];
    for(var i = 0; i < numObstacles; ++i) {
      obstacles.push(Obstacle());
    }

    function Obstacle () {
      var obstacle = {
        x: getRandomInt(1, 49),
        y: getRandomInt(1, 49),
        intersectsSnake () {
          return that.snake.intersects(obstacle);
        },
        intersectsObstacle () {
          for(var obs of obstacles) {
            if(obs && obs.x == obstacle.x && obs.y === obstacle.y) {
              return true
            }
          }
          return false;
        },
      };
      if(obstacle.intersectsSnake() || obstacle.intersectsObstacle()) {
        return Obstacle();
      } else {
        return obstacle;
      }
    }
    var obstacless = {
      obstacles,
      *[Symbol.iterator] () {
        yield* obstacles;
      },
      intersects (item) {
        for(var obstacle of obstacless) {
          if(obstacle.x === item.x && obstacle.y === item.y) {
            return true;
          }
        }
        return false;
      },
    };
    return obstacless
  }

  function Food () {
    var food = {
      x: getRandomInt(1, 49),
      y: getRandomInt(1, 49),
      intersects (item) {
        if(item.x === food.x && food.y === item.y) {
          return true;
        }
        return false;
      }
    }
    if(that.obstacles.intersects(food) || that.snake.intersects(food)) {
      // get a different coord
      return Food();
    } else {
      return food;
    }
  }

  that.snake = Snake();
  that.obstacles = Obstacles();
  that.food = Food();
  
  return that;
};
