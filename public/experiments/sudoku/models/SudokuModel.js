import Subject from "../utils/Subject.js";

export default class InputSudokuModel extends Subject {
  constructor () {
    super();
    this._symbols = new Set();
    this._boardSize = 9;
    this.resetBoard();
    this._solutions = [];
    this._stats = "";
    this._error_message = "";
    this.textFile = undefined;
  }

  async setSolutionAndStats () {
    try {
      this._error_message = "";
      var [answers, dlxBoard] = await getSolutions(this.boardClone, this.symbols);
      this._solutions = answers;
      this._stats = dlxBoard.printStats();
      this.notifyObservers();
    } catch (e) {
      console.error(e);
      this._error_message = e.message;
      this._solutions = [];
      this._stats = "";
      this.notifyObservers();
    }
  }

  get error_message () {
    return this._error_message;
  }

  get solutions () {
    return this._solutions;
  }

  get stats () {
    return this._stats;
  }

  resetBoard () {
    this._board = new Array(this._boardSize).fill(0).map(()=>new Array(this._boardSize).fill("-"));
  }

  get boardClone () {
    return this._board.map(a=>a.slice());
  }

  get board () {
    return this._board;
  }

  set boardSize (size) {
    if([2,3,4,5].map(x=>x**2).indexOf(size) === -1) {
      throw new Error("Invalid board size");
    }
    this._boardSize = size;
    this.resetBoard();
    this.notifyObservers();
  }

  get boardSize () {
    return this._boardSize;
  }

  set symbols (symbols) {
    symbols = [...symbols];
    if(symbols.some(x=>x.length !== 1)) {
      throw new Error("Some symbols have length greater than 1.");
    }
    this._symbols = new Set(symbols);
    this.notifyObservers();
  }

  get symbols () {
    return this._symbols;
  }

  setCell (cellIdx, val) {
    var size = this.boardSize;
    var row = Math.floor(cellIdx / size);
    var col = Math.floor(cellIdx % size);
    if(this.board[row][col] === val) {
      return;
    }
    this.board[row][col] = val;
    this.notifyObservers();
  }

  get boardString () {
    return boardToString(this.board);
  }

  setCellRowCol (row, col, val) {
    if(this.board[row][col] === val) {
      return;
    }
    this.board[row][col] = val;
    this.notifyObservers();
  }

  makeInputFile () {
    var data = new Blob([this.boardSize+"\n"+([...this.symbols].join(" "))+"\n"+this.boardString], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (this.textFile !== null) {
      window.URL.revokeObjectURL(this.textFile);
    }

    this.textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return this.textFile;
  }

  getCell (cellIdx) {
    var size = this.boardSize;
    var row = Math.floor(cellIdx / size);
    var col = Math.floor(cellIdx % size);
    return this.board[row][col];
  }
}