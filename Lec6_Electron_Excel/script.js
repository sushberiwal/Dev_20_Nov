let $ = require("jquery"); // dom manipulation
let fs = require("fs");

// fs.writeFileSync("test.txt" , "testing !!!!");

let remote = require("electron").remote;
const { setuid } = require("process");
let dialog = remote.dialog;
// let path = require("path");
// let fs = remote.require('fs');

// let fs = window.require("fs");

// var remote = require('electron').remote;
// var electronFs = remote.require('fs');
// var electronDialog = remote.dialog;


$(document).ready(function () {
  // console.log("document is loaded !!!");
  let db;
  let lsc;

  $(".cell").on("click", function () {
    // console.log(db);
    // console.log(this);
    let rowId = Number($(this).attr("rowid"));
    let colId = Number($(this).attr("colid"));
    let cellObject = db[rowId][colId];
    $("#formula").val(cellObject.formula);
    // rowId = 1
    // colId  = 1 => "B"
    // address => "B2"
    let address = String.fromCharCode(65 + colId) + (rowId + 1) + "";
    // console.log(address);
    $("#address").val(address);
  });

  $(".cell").on("blur", function () {
    lsc = this;
    let rowId = $(this).attr("rowid");
    let colId = $(this).attr("colid");
    let value = $(this).text();
    let cellObject = db[rowId][colId];
    if (value != cellObject.value) {
      cellObject.value = value;
      // when cell is dependent on formula and then a value is given to that cell from ui then the existing formula should be deleted !!
      deleteFormula(cellObject);
      updateChildrens(cellObject);
    }
  });

  $("#formula").on("blur", function () {
    let formula = $(this).val();
    // console.log(formula);
    // falsy values => null , undefined , false , 0 , ""
    if(formula) {
        let rowId = $(lsc).attr("rowid");
        let colId = $(lsc).attr("colid");
        let cellObject = db[rowId][colId];
        if(cellObject.formula != formula){
          deleteFormula(cellObject);
          let value = solveFormula(formula , cellObject);
          // db update
          cellObject.value = value;
          cellObject.formula = formula;
          // ui update
          $(lsc).text(value);
          updateChildrens(cellObject);
          }
    }
  });
  $(".content").on("scroll" , function(){

    let top = $(this).scrollTop();
    let left = $(this).scrollLeft();
    // console.log(top , left);
     
    $(".top-row , .top-left-cell").css("top" , top+"px");
    $(".left-col , .top-left-cell").css("left" , left+"px");

  })
  $(".cell").on("keyup" , function(){
    console.log("keyup");
    let height = $(this).height();
    let id = $(this).attr("rowid");
    // left col wo wala div uthaunga jjiski cellid == rowid
    $(`.left-col-cell[cellid=${id}]`).height(height);

  })


  // new open save

  $('.new').on("click" , function(){
    console.log("New button is clicked !!");
    // DB empty ya new
    initDB(); // 2600 times 
    // UI New  
    initUI();
  })

  $('.open').on("click" , function(){
    let path = dialog.showOpenDialogSync();
    console.log(path);
    let openedDB = fs.readFileSync(path[0]);
    db = JSON.parse(openedDB);
    // UI set hojae according to DB
    setUI();
})

  $('.save').on("click" , function(){
    console.log("Save button is clicked !!");
    let path = dialog.showSaveDialogSync();
    // console.log(path);
    // let filePath = __dirname;
    if(path){
      fs.writeFileSync(path , JSON.stringify(db));
      alert("File Saved !!");
    }
    else{
      alert("No File Selected !!");
    }
  })


// file and home pe click event attached
  $(".file , .home").on("click" , function(){
    let menu = $(this).text();
    if(menu == "File"){
      $(".file").addClass("active");
      $(".file-menu-options").removeClass("hide");
      $(".home-menu-options").addClass("hide");
      $(".home").removeClass("active");
      
    }
    else{
      // menu == "Home"
      $(".file").removeClass("active");
      $(".file-menu-options").addClass("hide");
      $(".home").addClass("active");
      $(".home-menu-options").removeClass("hide");

    }
  })

  function deleteFormula(cellObject){
    $("#formula").val("");
    cellObject.formula = "";
    for(let i=0 ; i<cellObject.parents.length ; i++){
      // A1
      let {rowId , colId} = getRowIdColIdFromAddress(cellObject.parents[i]);
      let parentCellObject = db[rowId][colId];
      let childrensOfParents = parentCellObject.childrens;
      //[ "" , "" , "B1" , "" ,"" ,"" ];
      let filteredChildrens = childrensOfParents.filter(  function(child){
        return child != cellObject.name;
      });

      parentCellObject.childrens = filteredChildrens;
    }
    cellObject.parents = [];
  }

  function updateChildrens(cellObject){
      // ["B1" , "C1" , "Z1"];
    for(let i=0 ; i<cellObject.childrens.length ; i++){
        //B1 => rowId , colId 
        let {rowId , colId} = getRowIdColIdFromAddress(cellObject.childrens[i]);
        let childrenCellObject = db[rowId][colId];
        let value = solveFormula(childrenCellObject.formula);
        childrenCellObject.value = value;
        // Ui update ????????????
        // div[rowid="0"][colid="1"]
        $(`div[rowid=${rowId}][colid=${colId}]`).text(value);
        updateChildrens(childrenCellObject);
    }
  }


  function solveFormula(formula , selfCellObject) {
    // ( 10 + 20 )
    let fComps = formula.split(" ");
    //[ "(" , "A1" , "+" , "A2" , ")" ];
    for (let i = 0; i < fComps.length; i++) {
      let comp = fComps[i];
      let firstCharacter = comp[0];
      if ((firstCharacter >= "A" && firstCharacter <= "Z") ||(firstCharacter >= "a" && firstCharacter <= "z")) {
        let { rowId, colId } = getRowIdColIdFromAddress(comp);
        // A1
        let cellObject = db[rowId][colId];
        if(selfCellObject){
          // add self to childrens only first time
            cellObject.childrens.push(selfCellObject.name);
            // add parents
            selfCellObject.parents.push(cellObject.name);
        }

        let value = cellObject.value;
        formula = formula.replace( comp , value );
      }
    }
    // formula = ( 10 + 20 ) => infix evaluation
    let value = eval(formula);
    return value;
  }

  // utility functions
  function getRowIdColIdFromAddress(address) {
    let colId =address.charCodeAt(0) <= 90? address.charCodeAt(0) - 65 : address.charCodeAt(0) - 97;
    let rowId = Number(address.substring(1)) - 1;
    return {
        rowId : rowId,
        colId : colId
    }
  }

  function setUI(){
    for(let i=0;i<100 ; i++){
      for(let j=0 ; j<26 ; j++){
        let cellObject = db[i][j];
        $(`div[rowid="${i}"][colid="${j}"]`).text(cellObject.value);
      }
    }
  }

  function initUI(){
    let cells = $(".cell");
    let count=0;
    for(let i=0 ; i<cells.length ; i++){
      $(cells[i]).text("");
      console.log(count);
      count++;
    }
  }

  function initDB() {
    db = [];
    for (let i = 0; i < 100; i++) {
      let row = [];
      for (let j = 0; j < 26; j++) {
        let rowId = i + 1;
        let colId = String.fromCharCode(65 + j);
        let name = colId + rowId + "";
        let cellObject = {
          name: name,
          value: "",
          formula:"",
          childrens:[],
          parents:[]
        };
        row.push(cellObject);
      }
      db.push(row);
    }
    console.log(db);
  }
  initDB();
});
