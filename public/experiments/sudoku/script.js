import SudokuController from "./controllers/SudokuController.js";

$(document.body).on("click", ".cell-inner", function (e) {
  $(this).find("input").focus();
});

var controller = new SudokuController();

controller.inputBoard.on("keydown", '.cell-inner input[type="text"]', function (e) {
  controller.cellKeydown(this, e);
});

controller.inputBoard.on("keyup", '.cell-inner input[type="text"]', function (e) {
  controller.cellKeyup(this, e);
});

controller.boardSizeInput.on("change", 'select', function (e) {
  controller.boardSizeInputChange(this);
});
controller.symbolInput.on("change", 'input[type="text"]', function (e) {
  controller.symbolInputChange(this);
});

$("#file_input").on("change", function () {
  var reader = new FileReader();
  reader.onloadend = function (ev) { 
    controller.readBoardFile(this, ev);
  };
  reader.readAsText (this.files[0]);
});

$("#submit").on("click", function (e) {
  controller.outputSolutions();
})

$("#download").on("click", function (e) {
  controller.downloadFile(e);
})

