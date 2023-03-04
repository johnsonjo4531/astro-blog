window.MazeRenderer = (function (GameOverRenderer) {

  var dirAddition = {
    n: {
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 0,
    },
    w: {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 1,
    },
    e: {
      x1: 1,
      y1: 0,
      x2: 1,
      y2: 1,
    },
    s: {
      x1: 0,
      y1: 1,
      x2: 1,
      y2: 1,
    },
  };

  return function _MazeRenderer (context, {
    mazeSize = 1000, 
    mazeNumRowsCols = 20,
    wallColor = "#fff",
    wallSizeFactor = 0.1,
    borderColor = "#777",
    playerColor = "cornflowerblue",
    startColor = 'rgba(100, 237, 127, 0.5)',
    finishColor = 'rgba(237, 100, 100, 0.5)',
    circleRadiusFactor = 0.5,
    circleStrokeSizeFactor = 0.2,
    hintColor = (alpha) => `rgba(237, 237, 100,${alpha})`,
    fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  } = {}) {
    var cellSize = mazeSize / mazeNumRowsCols;
    var wallSize = cellSize * wallSizeFactor;
    var circleRadius = 0.5 * circleRadiusFactor * cellSize;
    var circleStrokeSize = 0.5 * circleRadiusFactor * circleStrokeSizeFactor * cellSize;

    function clear () {
      context.clearRect(0, 0, mazeSize, mazeSize);
    }

    function renderBorder () {
      context.save();
      context.strokeStyle = borderColor;
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(mazeSize, 0);
      context.lineTo(mazeSize, mazeSize);
      context.lineTo(0, mazeSize);
      context.closePath();
      context.stroke();
      context.restore();
    }

    function renderInnerWalls (maze) {
      context.save();
      context.strokeStyle = wallColor;
      context.strokeSize = wallSize;
      context.beginPath();
      for(var [dir, node] of maze.walls) {
        var deltas = dirAddition[dir];
        context.moveTo((node.x + deltas.x1) * cellSize, (node.y + deltas.y1) * cellSize);
        context.lineTo((node.x + deltas.x2) * cellSize, (node.y + deltas.y2) * cellSize);
      }
      context.stroke();
      context.restore();
    }

    function drawCircle (spec) {
      context.save();
      context.beginPath();
      context.arc(spec.center.x, spec.center.y, spec.radius, 0, 2 * Math.PI, false);
      context.fillStyle = spec.fillStyle;
      context.fill();
      context.lineWidth = spec.strokeSize;
      context.strokeStyle = spec.strokeStyle;
      context.stroke();
  
      context.restore();
    }

    function renderPlayer (player) {
      context.save();
      drawCircle({
        center: {
          x: (player.position.x + 0.5) * cellSize,
          y: (player.position.y + 0.5) * cellSize
        },
        // max-radius should be 1/2 the cell so that it fits in the cell
        radius: circleRadius,
        strokeSize: circleStrokeSize,
        strokeStyle: '#ccc',
        fillStyle: playerColor
      })
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
        return width - context.measureText(text);
      });
      context.restore();
      return fontSizes[1] || fontSizes[0];
    }

    function getFontSizeForHeight (height) {
      return getFontSizeForWidth('m', height);
    }

    function drawCenteredCellText (cell, text, padding=0.2*cellSize) {
      context.save();
      context.font = `${getFontSizeForWidth(text, cellSize-padding*2)}px ${fontFamily}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      // var textHeight = context.measureText('m');
      // var textWidth = context.measureText('Finish');
      context.fillText(text, (cell.x + 0.5) * cellSize, (cell.y + 0.5) * cellSize);
      context.restore();
    }

    function drawSquare (spec) {
      context.save();

      context.fillStyle = spec.fillStyle;
      context.fillRect(spec.x, spec.y, spec.width, spec.height);

      // context.strokeStyle = spec.strokeStyle;
      // context.strokeRect(spec.x, spec.y, spec.width, spec.height);

      context.restore();
    }

    function renderFinish (cell) {
      drawSquare({
        x: cell.x * cellSize,
        y: cell.y * cellSize,
        width: cellSize,
        height: cellSize,
        fillStyle: finishColor,
        strokeStyle: '#ccc',
      });
      drawCenteredCellText(cell, 'Finish');
    }

    function renderStart (cell) {
      drawSquare({
        x: cell.x * cellSize,
        y: cell.y * cellSize,
        width: cellSize,
        height: cellSize,
        fillStyle: startColor,
        strokeStyle: '#ccc',
      });
      drawCenteredCellText(cell, 'Start');
    }

    var fadeAlpha = (function () {
      var t = 0;
      return function _fadeAlpha (delta, max) {
        var maxInterVal = Math.floor(max / 2);
        var fullVal = (t + delta) % max;
        var halfVal = (t + delta) % maxInterVal;
        var changeRatio = +(halfVal / maxInterVal).toFixed(2);
        if(fullVal > halfVal) {
          t += delta;
          t %= max;
          // delta is negative
          return +(1-changeRatio).toPrecision(2);;
        } else { 
          t += delta;
          t %= max;
          // delta is positive
          return changeRatio;
        }
      }
    })();

    var alpha = 0;
    function renderHint (elapsed, cell, timeReset=(2*10**3)) {
      if(!cell) {
        return;
      }
      console.log(alpha);
      alpha = fadeAlpha(elapsed, timeReset);

      drawSquare({
        x: cell.x * cellSize,
        y: cell.y * cellSize,
        width: cellSize,
        height: cellSize,
        fillStyle: hintColor('' + alpha),
        strokeStyle: '#ccc',
      });
    }

    function render (elapsed, maze, gameState) {
      if(gameState.hintOn || gameState.isDirty) {
        clear();
        renderBorder();
        renderInnerWalls(maze);
        renderFinish(gameState.finish);
        renderStart(gameState.start);
        if (gameState.hintOn) {
          renderHint(elapsed, gameState.shortestPath[1]);
        }
        if(gameState.breadCrumbsOn) {
          renderBreadCrumbs(maze.matrix);
        }
        if(gameState.shortestPathOn) {
          renderPathToFinish(gameState.shortestPath);
        }
        renderPlayer(gameState.player);
      }
      gameState.isDirty = false;
    }

    function renderFinishCircle (cell) {
      context.save();
      context.beginPath();
      var centerX = (cell.x + 0.5) * cellSize;
      var centerY = (cell.y + 0.5) * cellSize;
      drawCircle({
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
        strokeSize: 0.2 * cellSize,
        center: {
          x: centerX,
          y: centerY,
        },
        radius: circleRadius,
        strokeSize: circleStrokeSize,
      });
      context.clip();
      // draw checkerboard

      var black = 'rgba(0,0,0,0.5)';
      var white = 'rgba(255,255,255,0.5)';
      ([
        [
          centerX - circleRadius,
          centerY - circleRadius,
          black
        ],
        [
          centerX,
          centerY - circleRadius,
          white
        ],
        [
          centerX - circleRadius,
          centerY,
          white
        ],
        [
          centerX,
          centerY,
          black
        ],
      ]).forEach(function ([x, y, fillStyle]) {
        drawSquare({
          x: x,
          y: y,
          width: cellSize / 2,
          height: cellSize / 2,
          fillStyle: fillStyle,
        });
      });
      context.restore();

      drawCircle({
        fillStyle: 'transparent',
        strokeStyle: hintColor(1),
        strokeSize: 0.2 * cellSize,
        center: {
          x: centerX,
          y: centerY,
        },
        radius: circleRadius,
        strokeSize: circleStrokeSize,
      });
      
    }

    function drawBreadCrumb (cell) {
      var centerX = (cell.x + 0.5) * cellSize;
      var centerY = (cell.y + 0.5) * cellSize;
      drawCircle({
        fillStyle: 'transparent',
        strokeStyle: borderColor,
        strokeSize: 0.2 * cellSize,
        center: {
          x: centerX,
          y: centerY,
        },
        radius: circleRadius,
        strokeSize: circleStrokeSize,
      });
    }

    function renderBreadCrumbs (maze) {
      for(var row of maze) {
        for(var cell of row) {
          if(cell.visited) {
            drawBreadCrumb(cell);
          }
        }
      }
    }

    function renderPathToFinish (path=[]) {
      for(var node of path) {
        renderFinishCircle(node);
      }
    }

    return {
      renderInnerWalls,
      renderBorder,
      clear,
      renderPlayer,
      renderFinish,
      renderStart,
      render
    }
  };
})();
