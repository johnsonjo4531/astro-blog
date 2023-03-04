import InputSudokuModel from "../models/SudokuModel.js";
import {SudokuInputView, SudokuOutputView, SymbolInputView, BoardSizeInputView, OutputView} from "../views/SudokuViews.js";

export default class SudokuController {
  constructor () {
    this.model = new InputSudokuModel();

    this.boardSizeInput = $("#sudoku-boardSizeInput");
    this.symbolInput = $("#sudoku-symbolInput");
    this.inputBoard = $("#sudoku-inputBoard");
    this.output = $("#output");
    
    this.boardInputView = new SudokuInputView(this.model, this.inputBoard);
    this.symbolInputView = new SymbolInputView(this.model, this.symbolInput);
    this.sizeInputView = new BoardSizeInputView(this.model, this.boardSizeInput);
    this.outputView = new OutputView(this.model, this.output);
  }

  cellKeyup (cell, e) {
    var key = e.key;

    // var val = $(cell).val();
    // if(!val) {
    //   val = "-";
    //   $(cell).val(val);
    // }
    if (!this.validKey(key)) { 
      //e.preventDefault();
      return;
    }
    var cellId = parseInt($(cell).attr("data-cell-id"), 10);
    this.model.setCell(cellId, key);
  }

  validKey (key) {
    var keys = [...this.model.symbols, "-"];
    return new Set(keys).has(key);
  }

  isActionKeyCode (keyCode) {
    return new Set([17,9,16,8]).has(keyCode);
  }

  isDirectionalKeyCode (keyCode) {
    return new Set([37,38,39,40]).has(keyCode);
  }

  cellInBounds (cell) {
    return cell >= 0 && cell < this.model.boardSize*this.model.boardSize;
  }

  changeCell (newCell, oldCell) {
    var squaresRowCol = this.model.boardSize;
    var squaresBoard = this.model.boardSize**2;
    if(Math.abs(newCell - oldCell) === 1) {
      var row = Math.floor(oldCell / squaresRowCol);
      newCell = row*squaresRowCol + (newCell + squaresRowCol) % squaresRowCol;
    } else {
      newCell =  (newCell + squaresBoard) % squaresBoard
    }
    return this.cellInBounds(newCell) ? newCell : oldCell;
  }

  handleDirectionalKeyCode (cell, keyCode) {
    var currCell = parseInt($(cell).attr("data-cell-id"));
    switch(keyCode) {
      case 37:
      // left
      $(`[data-cell-id="${this.changeCell(currCell-1, currCell)}"]`).focus();
      break;
      case 38:
      // up
      $(`[data-cell-id="${this.changeCell(currCell-this.model.boardSize, currCell)}"]`).focus();
      break;
      case 39:
      // right
      $(`[data-cell-id="${this.changeCell(currCell+1, currCell)}"]`).focus();
      break;
      case 40:
      // down
      $(`[data-cell-id="${this.changeCell(currCell+this.model.boardSize, currCell)}"]`).focus();
      break;
    }
  }

  cellKeydown (cell, e) {
    var key = e.key;
    var keyCode = e.keyCode || e.which;
    
    if(!this.validKey(key)) {
      if(this.isDirectionalKeyCode(keyCode)) {
        this.handleDirectionalKeyCode(cell, keyCode);
        return;
      }
      if(this.isActionKeyCode(keyCode)) {
        if(keyCode === 8) {
          $(cell).val("");
          this.cellKeyup(cell,{keyCode: 189, key: "-"});
        }
      }
      e.preventDefault();
      return;
    }
    
    $(cell).val("");
  }

  outputSolutions() {
    this.model.setSolutionAndStats();
  }

  boardSizeInputChange (input, e) {
    this.model.boardSize = parseInt($(input).val(), 10);
  }

  readBoardFile (el, e) {
    var input = el.result;
    var {
      boardSize,
      symbolset,
      board
    } = parseBoard(input);
    this.model.boardSize = boardSize;
    this.model.symbols = symbolset;
    for(var i = 0; i < boardSize;++i) {
      for(var j = 0; j < boardSize;++j) {
        this.model.setCellRowCol(i, j, board[i][j]);
      }  
    }
  }

  downloadFile (e) {
    var link = document.createElement('a');
    var size = Number(this.model.boardSize);
    link.setAttribute('download', `sudoku_board${size}x${size}.txt`);
    link.href = this.model.makeInputFile();
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      var event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });
  }

  symbolInputChange (input, e) {
    this.model.symbols = $(input).val().split(",");
  }
}
