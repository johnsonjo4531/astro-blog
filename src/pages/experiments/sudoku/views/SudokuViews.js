var encodeStr = x => x.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
  return '&#'+i.charCodeAt(0)+';';
});

function mapJoin (arr, fn) {
  return arr.map(fn).join("");
}

function timeout (ms) {
  return new Promise(res=>setTimeout(res, ms));
}

export class SudokuInputView {
  constructor (model, viewItem) {
    this.model = model;
    this.view = $(viewItem);
    this.lastSize = this.model.boardSize;
    this.model.registerObserver(this);
    this.lastBoardStr = this.model.boardString;
    this.render();
    this.lastUpdateAttempt = Date.now();
  }

  render () {
    var i = 0;
    var cellIdEl = $(document.getSelection().anchorNode);
    if(!cellIdEl.is("input[data-cell-id]")) {
      cellIdEl = cellIdEl.find("input[data-cell-id]");
    }
    var focusedCell = cellIdEl.attr("data-cell-id");
    var selection = [(cellIdEl.get(0) || {}).selectionStart, (cellIdEl.get(0) || {}).selectionEnd];
    this.view.html(
      `
      <div class="sudoku-board">
        ${mapJoin(this.model.board, (row=> {
          var size = Number(this.model.boardSize);
          return `<div class="sudoku-row clearfix row-${size}x${size}">
            ${mapJoin(row, (cellVal=>`<div class="cell cell-${size}x${size}">
              <div class="cell-inner">
                <input data-cell-id="${i++}" type="text" value="${encodeStr(cellVal)}">
              </div>
            </div>`))}
          </div>`;
        }))}
      </div>`
    );
    $(`input[data-cell-id="${focusedCell}"]`).focus();
    var ifTruthy = (_x, predicate=x=>!!x)=>{
      var self = {do: function (fn) { return predicate(_x) ? ifTruthy(fn(_x), predicate) : self; }, _x }
      return self;
    };
    //$(`input[data-cell-id="${focusedCell}"]`).get(0).setSelectionRange(...selection)
    ifTruthy($(`input[data-cell-id="${focusedCell}"]`).get(0)).do(x=>x.setSelectionRange(...selection));
  }

  async debounce (fn, ms) {
    var attempt = Date.now();
    this.lastUpdateAttempt = attempt;
    await timeout(ms);
    if(attempt === this.lastUpdateAttempt) {
      fn();
    }
  }

  // only update if the board size changes
  async update (update) {
    this.debounce(()=>{
      if(this.lastBoardStr === this.model.boardString && this.lastSize === this.model.boardSize) {
        return;
      }
      this.lastBoardStr = this.model.boardString;
      this.lastSize = this.model.boardSize;
      this.render();
    }, 1000/40);
  }

}

function setsAreEqual (set1, set2) {
  return set1.size === set2.size && set1.size == new Set([...set1, ...set2]).size;
}

export class SymbolInputView {
  constructor (model, viewItem) {
    this.model = model;
    this.view = $(viewItem);
    this.lastSymbols = new Set([...this.model.symbols]);
    this.model.registerObserver(this);
    this.render();
  }

  render () {
    var symbols = this.model.symbols;
    var input = $('<input class="form-control" type="text">');
    input.val([...symbols].join(","));
    input.find(`option[value="${this.model.boardSize}"]`).attr("selected", true)
    this.view.empty().append(input);
  }

  update () {
    if(setsAreEqual(this.lastSymbols, this.model.symbols)) {
      return;
    }
    this.lastSymbols = new Set([...this.model.symbols]);
    this.render();
  }
}

export class BoardSizeInputView {
  constructor (model, viewItem) {
    this.model = model;
    this.view = $(viewItem);
    this.lastBoardSize = this.model.boardSize;
    this.model.registerObserver(this);
    this.render();
  }

  render () {
    this.view = this.view.html(`<select class="form-control">
      <option value="4">4x4</option>
      <option value="9">9x9</option>
      <option value="16">16x16</option>
      <option value="25">25x25</option>
    </select>`);

    this.view.find(`option[value="${this.model.boardSize}"]`).attr("selected", true);
    
  }

  update () {
    if(this.lastBoardSize === this.model.boardSize) {
      return;
    }
    this.lastBoardSize = this.model.boardSize;
    this.render();
  }
}
function getSodukuOutputTree (board) {
  var i = 0;
  var size = Number(board.length);
  return `
  <div class="sudoku-board">
    ${mapJoin(board, row=> {
      return `<div class="sudoku-row clearfix row-${size}x${size}">
        ${mapJoin(row, cellVal=>`<div class="cell cell-${size}x${size}">
          <div class="cell-inner">
            ${encodeStr(cellVal)}
          </div>
        </div>`)}
      </div>`;
    })}
  </div>`;
}
export class SudokuOutputView {
  constructor (model, boardOutput) {
    this.model = model;
    this.boardOutput = boardOutput;
    this.lastSize = this.model.boardSize;
    this.render();
  }

  render () {
    
    $(this.boardOutput).html(
      
    );
  }
}

export class OutputView {
  constructor (model, viewItem) {
    this.model = model;
    this.view = $(viewItem);
    this.lastSize = this.model.boardSize;
    //this.render();
    this.model.registerObserver(this);
    this.lastBoardStr = this.model.boardString;
    this.lastStats = this.model.stats;
  }

  render () {
    var infoLine = "No Solutions";
    var showStats = false;
    var showError = false;
    if(this.model.error_message) {
      infoLine = "Error";
      showError = true;
    } else if(this.model.solutions.length > 1) {
      infoLine = "Multiple Solutions";
      showStats = true;
    } else if(this.model.solutions.length == 1) {
      infoLine = "Solved";
      showStats = true;
    }
    var i = 0;
    this.view.html(
      `
      <h2>Output</h2>
      <h3>${infoLine}</h3>
      ${this.model.solutions.map(getSodukuOutputTree).join("")}
      ${showStats ?
        `<pre><code>${this.model.stats}</code></pre>`
        :  "" }
      ${showError ?
        `<pre><code>${this.model.error_message}</code></pre>`
        :  "" }
      `
    );
  }

  async debounce (fn, ms) {
    var attempt = Date.now();
    this.lastUpdateAttempt = attempt;
    await timeout(ms);
    if(attempt === this.lastUpdateAttempt) {
      fn();
    }
  }

  update () {
    this.debounce(()=>{
      if(this.lastBoardStr === this.model.boardString && !this.model.error_message && this.model.stats === this.lastStats) {
        return;
      }
      this.lastBoardStr = this.model.boardString;
      this.render();
    }, 1000/60);
  }
}
  