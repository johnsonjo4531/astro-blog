(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
(function (global){
var { parseBoard, BadPuzzleError, boardToString } = require("./utils/boardUtils");
var DLXBoard = require("./components/DLXBoard");

async function getSolutions (board, symbolset) {
  dlxBoard = new DLXBoard(board, symbolset);

  answers = await dlxBoard.solve();
  
  return [
    answers,
    dlxBoard
  ];
}

async function getSolutions (board, symbolset) {
  dlxBoard = new DLXBoard(board, symbolset);

  answers = await dlxBoard.solve();
  
  return [
    answers,
    dlxBoard
  ];
}

global.getSolutions = getSolutions;
global.parseBoard = parseBoard;
global.BadPuzzleError = BadPuzzleError;
global.boardToString = boardToString;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/DLXBoard":4,"./utils/boardUtils":9}],4:[function(require,module,exports){
(function (process){
const { DancingLinksHeaderNode, DancingLinksNode } = require("./DancingLinksNode");
const { range, cartesianProduct } = require("../utils/iterUtils");
const {computeBlockIndex} = require("../utils/boardMath");
const { LowestColStrategy, SingleColStrategy, DoubleColStrategy } = require("./SudokuStrategies");
var Timer = require("../utils/Timer");
var { BadPuzzleError } = require("../utils/io");
var nanosecondTimePrinter = require("../utils/nanosecondTimePrinter");

class MultiMap extends Map {
	set (key, val) {
    var arr = (this.get(key)||[]);
    arr.push(val)
  	super.set(key, arr);
  }
}

// Knuth's X-Algorithm with Dancing Links Board.
module.exports = class DLXBoard {
  constructor (board, symbolset) {
    if(board.length !== symbolset.size) {
      throw new Error("Incorrect number of symbols");
    }
    this.board = board;
    this.size = symbolset.size;
    this.symbolset = symbolset;
    this._root = new DancingLinksHeaderNode();
    this._presolved = 0;
    this._chosenObjects = [];
    this._constructDLXBoard();
    this._mainStrategy = {
      name: "Knuth's DLX Algo",
      time: 0,
      uses: 0,
    };
    this._strategies = [
      new SingleColStrategy(),
      new DoubleColStrategy(),
      new LowestColStrategy()
    ];
    this._solutions = [];
    this._currentStrategy = 0;
    this._lastUsedStrategy = -1;
  }

  _chooseColumnObject() {
    var col = undefined;
    while (!col) {
      col = this._strategies[this._currentStrategy].findCol(this._root);
      if(this._currentStrategy != this._lastUsedStrategy) {
        this._strategies[this._currentStrategy].uses++;
      }
      this._lastUsedStrategy = this._currentStrategy;
      if(!col) {
        this._currentStrategy++;
      }
    }
    this._currentStrategy = 0;
    return col;
  }

  async solve () {
    this._mainStrategy.time = 0;
    this._mainStrategy.uses = 1;
    for(const key of Object.keys(this._strategies)) {
      this._strategies[key].time = 0;
      this._strategies[key].uses = 0;
    }
    var timer = new Timer();
    this._strategies
    this._solutions = [];
    await this._search();
    this._mainStrategy.time += timer.end();
    return this._solutions;
  }

  printStats () {
    var convert = s=>[s.name,s.uses,nanosecondTimePrinter(s.time)];
    var stats = [
      ["Strategy", "Uses", "Time"],
      ...[this._mainStrategy].map(convert),
      ...this._strategies.map(convert)
    ];
    var lengths = stats[0].map((x,i)=>Math.max(...stats.map(s=>(""+s[i]).length)));
    return stats.map(arr=>arr.map((x,i)=>(""+x).padEnd(lengths[i])).join(" ")).join("\n");
  }

  getStats () {
    var convert = s=>[s.name,s.uses,nanosecondTimePrinter(s.time)];
    var stats = [
      ["Strategy", "Uses", "Time"],
      ...[this._mainStrategy].map(convert),
      ...this._strategies.map(convert)
    ];
    var lengths = stats[0].map((x,i)=>Math.max(...stats.map(s=>(""+s[i]).length)));
    return stats.map(arr=>arr.map((x,i)=>(""+x).padEnd(lengths[i])).join(" ")).join("\n");
  }

  async _search (k=this._presolved) {
    if(this._solutions.length > 1) return;
    if(this._root.right == this._root) {
      this._solutions.push(this._getSolution());
      return;
    }
    var col = this._chooseColumnObject();
    col.coverCol();
    for(const rowcell of col.traverseColDown()) {
      this._chosenObjects[k] = rowcell;
      rowcell.chooseRow();
      await new Promise(res=>{
        process.nextTick(()=>res(this._search(k+1)));
      });
      rowcell.unchooseRow();
    }
    col.uncoverCol();
  }

  _constructDLXBoard () {
    var rows = range(0, this.size);
    var cols = range(0, this.size);
    var blocks = range(0,this.size);
    var symbols = [...this.symbolset];
    var headers = [];
    var getHeader = {
      rowCol: (row, col)=> {
        return headers[row*this.size+col];
      },
      rowSymbol: (row, symbolIdx)=> {
        return headers[this.size**2+row*this.size+symbolIdx];
      },
      colSymbol: (col, symbolIdx)=> {
        return headers[this.size**2*2+col*this.size+symbolIdx];
      },
      blockSymbol: (block, symbolIdx)=> {
        return headers[this.size**2*3+block*this.size+symbolIdx];
      }
    }
    var prevHeader = this._root;
    var setHeader = (headers, row, col, block, symbol) => {
      var newHeader = new DancingLinksHeaderNode();
      newHeader.setSolution(row, col, block, symbol);
      prevHeader.insertAfter(newHeader);
      prevHeader = newHeader;
      headers.push(newHeader);
    }
    // create headers
    for(var [row, col] of cartesianProduct(rows, cols)) {
      setHeader(headers, row, col);
    }
    for(var [row, symbol] of cartesianProduct(rows, symbols)) {
      setHeader(headers, row, null, null, symbol);
    }
    for(var [col, symbol] of cartesianProduct(rows, symbols)) {
      setHeader(headers, null, col, null, symbol);
    }
    for(var [block, symbol] of cartesianProduct(blocks, symbols)) {
      setHeader(headers, null, null, block, symbol);
    }
    // create all rows
    var symbolIdxMap = new Map([...this.symbolset].map((x,i)=>[x,i]));
    for(var row = 0; row < this.board.length; ++row) {
      for(var col = 0; col < this.board.length; ++col) {
        var symbol = this.board[row][col];
        var symbols = [];
        var cellSolved = false;
        if(symbol === "-") {
          symbols = this.symbolset;
        } else {
          symbols = [symbol];
          cellSolved = true;
        }
        var block = computeBlockIndex(Math.sqrt(this.size),col,row);
        for(const symbol of symbols) {
          var symbolIdx = symbolIdxMap.get(symbol);
          // add constraint to exact cover matrix.
          var header = null;
          // set up cols in row
          const rowCol =  new DancingLinksNode();
          header = getHeader.rowCol(row, col);
          rowCol.header = header;
          header.appendToCol(rowCol);
          const rowSymbol = new DancingLinksNode();
          header = getHeader.rowSymbol(row, symbolIdx);
          rowSymbol.header = header;
          header.appendToCol(rowSymbol);
          const colSymbol = new DancingLinksNode();
          header = getHeader.colSymbol(col, symbolIdx);
          colSymbol.header = header;
          header.appendToCol(colSymbol);
          const blockSymbol = new DancingLinksNode();
          header = getHeader.blockSymbol(block, symbolIdx);
          blockSymbol.header = header;
          header.appendToCol(blockSymbol);

          // set up row
          rowCol.insertAfter(rowSymbol);
          rowSymbol.insertAfter(colSymbol);
          colSymbol.insertAfter(blockSymbol);

          if(cellSolved) {
            this._chosenObjects.push(rowCol);
          }
        }
      }
    }
    if(this._checkConflictingChosen().length > 0){
      throw new BadPuzzleError("Invalid Sudoku Board Positions");
    }
    this._chosenObjects.forEach(x=>{
      x.header.coverCol();
      x.chooseRow()
    });
    this._presolved = this._chosenObjects.length;
  }

  _getSolution () {
    for(const chosen of this._chosenObjects) {
      const [row, col, block, symbol] = chosen.getSolution();
      this.board[row][col] = symbol;
    }
    return this.board.map(row=>row.slice()).slice();
  }

  _checkConflictingChosen () {
    if(this._chosenObjects.length <= 0) {
      return [];
    }
    var solutions = this._chosenObjects.map(x=>x.getSolution());
    var rows = new MultiMap(solutions.map(c=>[c[0],c]));
    var cols = new MultiMap(solutions.map(c=>[c[1],c]));
    var blocks = new MultiMap(solutions.map(c=>[c[2],c]));
    var symbols = new MultiMap(solutions.map(c=>[c[3],c]));
    var symbolset = [...this.symbolset];
    return symbolset.map((s,i)=> {
      var strI = i + "";
      var row = rows.get(strI);
      var col = cols.get(strI);
      var block = blocks.get(strI);
      var symbol = symbols.get(symbolset[i]);
      var arr = [].concat(
        ...(!row || !col ? [] : row.map(r=>col.filter(c=>r[0]==c[0] && r[1] == c[1] && r !== c).map(c=>["matching row col",r,c])).filter(a=>a.length)),
        ...(!row || !symbol ? [] : row.map(r=>symbol.filter(s=>r[0]==s[0] && r[3] == s[3] && r !== s).map(s=>["matching row symbol",r,s])).filter(a=>a.length)),
        ...(!col || !symbol ? [] : col.map(c=>symbol.filter(s=>c[1]==s[1] && c[3] == s[3] && c !== s).map(s=>["matching col symbol",c,s])).filter(a=>a.length)),
        ...(!block || !symbol ? [] : block.map(b=>symbol.filter(s=>b[2]==s[2] && b[3] == s[3] && b !== s).map(s=>["matching block symbol",b,s])).filter(a=>a.length)),
      );
      return arr.length > 0 ? arr : undefined;
    }).filter(x=>!!x);
  }
}
}).call(this,require('_process'))
},{"../utils/Timer":7,"../utils/boardMath":8,"../utils/io":10,"../utils/iterUtils":11,"../utils/nanosecondTimePrinter":12,"./DancingLinksNode":5,"./SudokuStrategies":6,"_process":2}],5:[function(require,module,exports){
class DancingLinksNode {
  constructor  () {
    this.left = this;
    this.right = this;
    this.up = this;
    this.down = this;
    this.header = null;
  }

  coverRowCell () {
    this.down.up = this.up;
    this.up.down = this.down;
    this.header.size--;
  }

  uncoverRowCell () {
    this.header.size++;
    this.down.up = this;
    this.up.down = this;
  }

  coverRow () {
    for(const node of this.traverseRowRight()) {
      node.coverRowCell();
    }
  }

  chooseRow () {
    //this.header.coverCol();
    for(const neighborRowCell of this.traverseRowRight()) {
      neighborRowCell.header.coverCol();
    }
  }

  unchooseRow () {
    for(const neighborRowCell of this.traverseRowLeft()) {
      neighborRowCell.header.uncoverCol();
    }
    //this.header.uncoverCol();
  }

  uncoverRow () {
    for(const node of this.traverseRowLeft()) {
      node.uncoverRowCell();
    }
  }

  * traverseRowRight () {
    var start = this;
    var node = this.right;
    while(node != start) {
      yield node;
      node = node.right;
    }
  }

  getSolution () {
    var solution = [];
    for(const rowcell of this.traverseRowRight()) {
      const ids = rowcell.header.name.split("-");
      for(var i = 0; i < ids.length; ++i) {
        if(ids[i] !== "null") {
          solution[i] = ids[i];
        }
      }
    }
    return solution;
  }

  * traverseRowLeft () {
    var start = this;
    var node = this.left;
    while(node != start) {
      yield node;
      node = node.left;
    }
  }

  insertAfter (node) {
    node.right = this.right;
    node.left = this;
    this.right.left = node;
    this.right = node;
  }
}

class DancingLinksHeaderNode extends DancingLinksNode {
  constructor (name) {
    super();
    this.header = this;
    this.size = 0;
    this.name = name;
  }

  coverCol () {
    this.right.left = this.left;
    this.left.right = this.right; 
    for(const node of this.traverseColDown()) {
      node.coverRow();
    }
  }

  setSolution (row=null, col=null, block=null, symbol=null) {
    this.name = `${row}-${col}-${block}-${symbol}`;
  }

  uncoverCol () {
    for(const node of this.traverseColUp()) {
      node.uncoverRow();
    }
    this.right.left = this;
    this.left.right = this; 
  }

  * traverseColDown () {
    var start = this.header;
    var node = start.down;
    while(node != start) {
      yield node;
      node = node.down;
    }
  }

  appendToCol (node) {
    this.size++;
    node.down = this;
    node.up = this.up;
    this.up.down = node;
    this.up = node;
  }

  * traverseColUp () {
    var start = this.header;
    var node = start.up;
    while(node != start) {
      yield node;
      node = node.up;
    }
  }
}

module.exports = {
  DancingLinksNode,
  DancingLinksHeaderNode
}
},{}],6:[function(require,module,exports){
var Timer = require("../utils/Timer");

class SudokuStrategy {
  constructor () {
    this.name = "Sudoku Strategy"
    this.time = 0;
    this.uses = 0;
  }

  findCol (root, incUses) {
    var timer = new Timer();
    var col = this.getCol(root);
    this.time += timer.end();
    if(incUses) this.uses++;
    return col;
  }

  getCol () {

  }
}

class LowestColStrategy extends SudokuStrategy {
  constructor() {
    super();
    this.name = "Lowest Possibility";
  }
  getCol (root) {
    var curr = null;
    for(const col of root.traverseRowRight()) {
      if(curr === null || col.size > 0 && col.size < curr.size) {
        curr = col;
        if(col.size == 1) {
          break;
        }
      }
    }
    return curr;
  }
}

class SingleColStrategy extends SudokuStrategy {
  constructor() {
    super();
    this.name = "One Possibility";
  }
  getCol (root) {
    var curr = null;
    for(const col of root.traverseRowRight()) {
      if(col.size <= 1 && (curr === null || col.size > 0)) {
        curr = col;
        break;
      }
    }
    return curr;
  }
}

class DoubleColStrategy extends SudokuStrategy {
  constructor() {
    super();
    this.name = "Two Possibilities";
  }
  getCol (root) {
    var curr = null;
    for(const col of root.traverseRowRight()) {
      if(col.size <= 2 && (curr === null || col.size > 0)) {
        curr = col;
        break;
      }
    }
    return curr;
  }
}

module.exports = {
  SudokuStrategy,
  LowestColStrategy,
  SingleColStrategy,
  DoubleColStrategy,
}
},{"../utils/Timer":7}],7:[function(require,module,exports){
(function (process){
module.exports = class Timer {
  constructor () {
    this.start();
  }

  static get NS_PER_SEC () {
    return 1e9;
  }

  static get MS_PER_SEC () {
    return 1e3;
  }

  hasHRTime () {
    return process && process.hrtime;
  }

  hasPerformanceTimer() {
    return window && window.performance && window.performance.now
  }

  start () {
    if(this.hasHRTime()) {
      this.startTime = process.hrtime(); 
    } else if (this.hasPerformanceTimer()) {
      this.startTime = window.performance.now();
    } else {
      this.startTime = Date.now();
    }
  }

  _convertMsToNano (ms) {
    return Math.floor(ms * (Timer.NS_PER_SEC / Timer.MS_PER_SEC));
  }

  end () {
    if(this.hasHRTime()) {
      var result = process.hrtime(this.startTime);
      return result[0]*Timer.NS_PER_SEC+result[1];
    } else if (this.hasPerformanceTimer()) {
      return this._convertMsToNano(window.performance.now() - this.startTime);
    } else {
      return this._convertMsToNano(Date.now() - this.startTime);
    }
  }
}
}).call(this,require('_process'))
},{"_process":2}],8:[function(require,module,exports){
function computeBlockIndex (boardRootSize, col, row) {
  var colIdx = Math.floor(col / boardRootSize);
  var rowIdx = Math.floor(row / boardRootSize);
  return colIdx + (boardRootSize*rowIdx);
}


module.exports = {
  computeBlockIndex
}
},{}],9:[function(require,module,exports){
class BadPuzzleError extends Error  {
  constructor(message) {
    super(message);
    this.name = "BadPuzzleError";
  }
};

/**
 * parses the board
 * @param {*} input 
 * @throws {BadPuzzleError}
 * @returns {Object} 
 * {
 *  board: // 2d array of board
 *  symbolset: // the set of symbols for the board
 * }
 */
function parseBoard (input) {
  input = input.split("\n");

  var boardSize = Number(input[0])
  var symbolset = new Set(input[1].split(" "));
  if(symbolset.size != boardSize) {
    throw new BadPuzzleError("symbol set size does not match input size given");
  }
  var board = input.slice(2, 2+boardSize).map(s=>{
    var rowcells = s.split(" ");
    if(rowcells.some(s=>s!="-"&&!symbolset.has(s))) {
      throw new BadPuzzleError("symbol cannot be in puzzle");
    }
    if(rowcells.length != boardSize) {
      throw new BadPuzzleError("row size is not the right length");
    }
    return rowcells;
  });

  return {
    boardSize,
    symbolset,
    board
  };
}

function boardToString (board) {
  return board.map(s=>s.join(" ")).join("\n");
}

module.exports = {
  BadPuzzleError,
  parseBoard,
  boardToString
}
},{}],10:[function(require,module,exports){
var fs = require("fs");

function readBoardFile (file) {
  return fs.readFileSync(file, {
    encoding: "utf-8"
  });
}

module.exports = {
  readBoardFile
}

},{"fs":1}],11:[function(require,module,exports){

/**
 * Yields a range of numbers from start inclusive to end exclusive.
 * @param {Number} start 
 * @param {Number} end 
 */
function range (start, end) {
  return {
    *[Symbol.iterator] () {
      for(var i = start; i < end; ++i) {
        yield i;
      }
    }
  };
}

/**
 * 
 * @param {Iterable<A>} X 
 * @param {Iterable<B>} Y 
 */
function * cartesianProduct (X,Y) {
  for(var x of X) {
    for(var y of Y) {
      yield [x,y];
    }
  }
}

module.exports = {
  cartesianProduct,
  range
}
},{}],12:[function(require,module,exports){
module.exports = function nanosecondTimePrinter (inputNanoSec) {
  var NS_TO_SEC = 1e9;
  var SEC_TO_MIN = 60;
  var MIN_TO_HR = 60;
  var nanoseconds = inputNanoSec % NS_TO_SEC;
  inputNanoSec /= NS_TO_SEC;
  inputNanoSec = Math.floor(inputNanoSec);
  var seconds = inputNanoSec % SEC_TO_MIN;
  inputNanoSec /= SEC_TO_MIN;
  inputNanoSec = Math.floor(inputNanoSec);
  var minutes = inputNanoSec % MIN_TO_HR;
  inputNanoSec /= MIN_TO_HR;
  inputNanoSec = Math.floor(inputNanoSec);
  var hours = inputNanoSec;
  var pad = (s,z)=>(""+s).padStart(z,"0")
  var pad2 = s=>pad(s,2);
  return  `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}${nanoseconds > 0 ? "."+pad(nanoseconds,9) : ""}`;
}
},{}]},{},[3]);
