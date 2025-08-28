window.GameState = function (maze,
  {
    onGameOver = (gameState) => {},
    onScoreUpdate = (score) => {},
    onScoreHide = () => {},
    onTimeUpdate = (time) => {},
  }) {

    var that = {};

  var n = maze.matrix.length;
  var start = maze.matrix[0][0];
  var finish = maze.matrix[n-1][n-1];
  var breadCrumbsOn = true;
  var shortestPathOn = false;
  var hintOn = false;
  var scoreOn = true;

  var shortestPath = getPath(start, finish);
  
  var isDirty = true;

  var time = 0;

  var enabled = true;
  var that = {
    get scoreOn () {
      return scoreOn;
    },
    get hintOn () {
      return hintOn;
    },
    get shortestPathOn () {
      return shortestPathOn;
    },
    get breadCrumbsOn () {
      return breadCrumbsOn;
    },
    get player () {
      return player;
    },
    get shortestPath () {
      return shortestPath;
    },
    get isDirty () {
      return isDirty;
    },
    set isDirty (val) {
      // cast value to boolean
      isDirty = !!val;
    },
    doCommand: doCommand,
    get start () {
      return start;
    },
    get finish () {
      return finish;
    },
    get player () {
      return player;
    },
    get maze () {
      return maze;
    },
    get time () {
      return time;
    },
    get enabled () {
      return enabled;
    },
    set enabled (val) {
      // cast to bool
      enabled = !!val;
    },
    set time (val) {
      time = val
      onTimeUpdate(that);
    },
    get secondTime () {
      return that.time / 10**3;
    },
    get timeString () {
      var padZeros = (str) => ("00" + str).split("").slice(-2).join("");
      var seconds = Math.floor(that.secondTime % 60);
      var minutes = Math.floor(that.secondTime / 60);
      return `${minutes}:${padZeros(seconds)}`;
    }
  };

  // closure to keep player variables hidden
  var player = (function (gameState) {
    var playerPosition = start;
    playerPosition.visited = true;
		var wasOffCourse = false;
		let score = 0;

    var that = {
      get position () {
        return playerPosition;
      },
      set position (newPosition) {
        // only allow non-null linked positions
        var linkedNodes = Object.values(playerPosition.linked);
        var truthyLinkedNodes = linkedNodes.filter(x=>!!x)
        var linkedPositions = new Set(truthyLinkedNodes);
        if(linkedPositions.has(newPosition)) {
          playerPosition = newPosition;
          if(!playerPosition.visited) {
            if(playerPosition == shortestPath[1]) {
              that.score += 5;
            } else if(wasOffCourse) {
              that.score -= 2;
            } else {
              that.score -= 1;
            }
          }
          playerPosition.visited = true;
          if(playerPosition == shortestPath[1]) {
            wasOffCourse = false;
            shortestPath.shift();
            if(shortestPath.length === 1) {
              gameState.enabled = false;
              onGameOver(gameState);
            }
          } else {
            shortestPath.unshift(playerPosition);
            wasOffCourse = true;
          }
        }
      },
      get score () {
        return score;
      },
      // we're allowing negative scores
      set score (newScore) {
        newScore = Number(newScore);
        if(!Number.isNaN(newScore)) {
          score = newScore;
          if(scoreOn) {
            onScoreUpdate(score);
          }
        }
      },
    }

    that.score = 0;

    return that;
  })(that);


  function movePlayer (dir) {

  }

  // since it's a perfect maze we're doing a modified depth first search
  function getPath (start, finish, path=[], prev=null) {
    path.push(start);
    if(start === finish) {
      return path;
    }
    for(var node of Object.values(start.linked)) {
      if(node && node !== prev) {
        var newPath = getPath(node, finish, [...path], start);
        if(newPath) {
          return newPath;
        }
      }
    }
    return false;
  }

  var commands = {
    move (dir) {
      var lastPosition = player.position;
      player.position = player.position.linked[dir];
      if(player.position !== lastPosition) {
        that.isDirty = true;
      }
    },
    breadCrumbsToggle () {
      breadCrumbsOn = !breadCrumbsOn;
      that.isDirty = true;
    },
    shortestPathToggle () {
      shortestPathOn = !shortestPathOn;
      that.isDirty = true;
    },
    hintToggle () {
      hintOn = !hintOn;
      that.isDirty = true;
    },
    scoreToggle () {
      scoreOn = !scoreOn;
      if(!scoreOn) {
        onScoreHide();
      } else {
        onScoreUpdate(player.score);
      }
    }
  };
  function doCommand (cmd, ...args) {
    commands[cmd](...args);
  }
  
  return that;
};
