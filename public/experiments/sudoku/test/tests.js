import Model from "../models/SudokuModel.js";
import Controller from "../controllers/SudokuController.js";

QUnit.test( "model test", function( assert ) {
  var model = new Model();
  model.symbols = ["1","2","2","3"];
  assert.equal(model._symbols.size, 3, "Symbols are right size." );
  assert.ok(model._symbols.has("1"), "symbols has symbol 1." );
  assert.ok(model._symbols.has("2"), "symbols has symbol 2." );
  assert.ok(model._symbols.has("3"), "symbols has symbol 3." );
  
  model.boardSize = 9;
  assert.equal(model._board.length, 9, "board has right number of rows" );
  assert.ok(model._board.every(r=>r.length === 9), "board has right number of columns!" );
  assert.equal(model._board[0][0], "-", "Passed!" );

  model.setCell(0,"1");
  assert.equal(model._board[0][0], "1", "Passed!" );
  model.setCell(9*9-1,"2");
  assert.equal(model._board[8][8], "2", "Passed!" );
});

// QUnit.test( "controller test", function( assert ) {
//   assert.ok( 1 == "1", "Passed!" );
// });