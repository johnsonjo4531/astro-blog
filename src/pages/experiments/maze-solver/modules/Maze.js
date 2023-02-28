window.Maze = (function (cUtils) {
  var oppositeDirection = {
    'n': 's',
    'e': 'w',
    'w': 'e',
    's': 'n',
  };

  function CellLink (spec = {
    node: null,
    direction, 
  }) {
    var that = {};

    var props = cUtils.setValues(spec);
    cUtils.setNonConfigurable(Object.keys(spec), props);
    Object.defineProperties(that, props);
    var linked = false;
    Object.defineProperties(that, {
      isLinked: {
        get () {
          return linked;
        },
        set (val) {
          var boolVal = !!val;
          // set this node to linked
          linked = boolVal;
          // set the linked node back so it is linked to this node
          var oppDir = oppositeDirection[that.direction];
          if(that.node[oppDir].isLinked !== boolVal) {
            that.node[oppDir].isLinked = boolVal;
          }
        },
        configurable: true,
      }
    });

    return that;
  }

  function linkWall (cell, wall, val) {
    cell[wall].isLinked = !!val;
  }

  function wallExists (cell, wall) {
    return cell[wall].isLinked;
  }

  function getLinked (cell, wall) {
    return cell[wall].node && cell[wall].isLinked ? cell[wall].node : null;
  }

  function getUnlinked (cell, wall) {
    return cell[wall].node && !cell[wall].isLinked ? cell[wall].node : null;
  }

  function Cell (userSpec = { }) {
    var defaultSpec = {
      n: CellLink({ direction: 'n' }),
      w: CellLink({ direction: 'w' }),
      s: CellLink({ direction: 's' }),
      e: CellLink({ direction: 'e' }),
      x: 0,
      y: 0,
    };
    var nonOptionSpec = {
      // computed linked neighbor properties
      linked: {
        get n () {
          return getLinked(that, 'n');
        },
        get s () {
          return getLinked(that, 's');
        },
        get e () {
          return getLinked(that, 'e');
        },
        get w () {
          return getLinked(that, 'w');
        }
      },
      // computed unlinked neighbor properties
      unlinked: {
        get n () {
          return getUnlinked(that, 'n');
        },
        get s () {
          return getUnlinked(that, 's');
        },
        get e () {
          return getUnlinked(that, 'e');
        },
        get w () {
          return getUnlinked(that, 'w');
        }
      }
    };
    var spec = Object.assign({}, defaultSpec, userSpec, nonOptionSpec);
    var that = {};

    var props = cUtils.setValues(spec);
    cUtils.setNonConfigurable([...Object.keys(defaultSpec), ...Object.keys(nonOptionSpec)], props);
    cUtils.setNonWritable(['n', 'e', 's', 'w'], props);
    Object.defineProperties(that, props);
    var visited = false;
    Object.defineProperty(that, 'visited', {
      get () {
        return visited;
      }, 
      set (val) {
        // cast to bool
        visited = !!val;
      }
    });
    return that;
  }

  /**
   * construct a non-linked n x n maze 
   */
  function Maze (n) {
    var that = []; 
    for(var i = 0; i < n; ++i) {
      that.push([]);
      for(var j = 0; j < n; ++j) {
        that[i].push(Cell({
          x: j,
          y: i,
        }))
      }
    }

    var empty = [];
    for(var i = 0; i < n; ++i) {
      for(var j = 0; j < n; ++j) {
        // here be dragons! :P Basically it's null if i or j is out of bounds. 
        // Uses 'or' short circuiting and the fact that out of bounds elements 
        // in arrays are just undefined.
        that[i][j].n.node = (that[i-1] || empty)[j] || null;
        that[i][j].s.node = (that[i+1] || empty)[j] || null;
        that[i][j].w.node = (that[i] || empty)[j-1] || null;
        that[i][j].e.node = (that[i] || empty)[j+1] || null;
      }
    }

    return that;
  }

  function wallString(cell,dir) {
    return `x:${cell.x},y:${cell.y},dir:${dir}`
  }

  function getWalls (maze) {
    var rows = maze.length;
    var columns = maze[0].length;
    var wallSet = new Set();
    var walls = [];
    for(var i = 0; i < rows; ++i) {
      for(var j = 0; j < columns; ++j) {
        var currNode = maze[i][j];
        for(var [dir, neighborNode] of Object.entries(currNode.unlinked)) {
          if(!neighborNode) {
            continue;
          }
          if(dir === 'n' || dir === 'w') {
            var id = wallString(neighborNode, oppositeDirection[dir]);
            if(!wallSet.has(id)) {
              walls.push([oppositeDirection[dir], neighborNode]);
              wallSet.add(id);
            }
          } else {
            var id = wallString(currNode, dir);
            if(!wallSet.has(id)) {
              walls.push([dir, currNode]);
              wallSet.add(id)
            }
          }
        }
      }
    }
    return walls;
  }

  /**
   * Source of this code is mdn.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   * @param {Number} min 
   * @param {Number} max 
   */
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min)) + min; 
  }

  function randomItemArr (arr) {
    var randIdx = getRandomInt(0, arr.length);
    return arr[randIdx];
  }

  function randomItemSet (set) {
    var arr = [...set];
    return randomItemArr(arr);
  }

  function randomItem2dArr (arr) {
    var randIdxRow = getRandomInt(0, arr.length);
    var randIdxCol = getRandomInt(0, arr[0].length);
    return arr[randIdxRow][randIdxCol];
  }

  function getNewFrontiers (newMazeItem, frontier, linkedMaze) {
    for(var node of Object.values(newMazeItem.unlinked)) {
      if(node && !linkedMaze.has(node)) {
        frontier.add(node);
      } 
    }
  }

  /**
   * Generates a maze using Prim's algorithm.
   * @param {Number} n 
   * the dimensions of the n x n maze.
   */
  function generateMaze (n) {
    var maze = Maze(n);
    var cols = maze[0].length;
    var rows = maze.length;
    var mazeSize = rows * cols;
    var frontier = new Set();
    var linkedMaze = new Set();

    var newMazeItem = randomItem2dArr(maze);
    linkedMaze.add(newMazeItem);
    getNewFrontiers(newMazeItem, frontier, linkedMaze);

    // run until the maze is all linked
    while(frontier.size > 0) {
      var newMazeItem = randomItemSet(frontier);
      linkedMaze.add(newMazeItem);
      frontier.delete(newMazeItem);
      // get all wall directions adjacent to linkedMaze
      var adjWallDirs = [];
      for(var [dir, neighborNode] of Object.entries(newMazeItem.unlinked)) {
        if(!!neighborNode && linkedMaze.has(neighborNode)) {
          adjWallDirs.push(dir);
        }
      }
      // randomly pick an adjacent wall and link it
      var randomAdjDir = randomItemArr(adjWallDirs);
      newMazeItem[randomAdjDir].isLinked = true;
      getNewFrontiers(newMazeItem, frontier, linkedMaze);
    }

    return {
      matrix: maze,
      walls: getWalls(maze),
    };
  }

  return {
    generate: generateMaze,
  };
})(ClassUtils);
