let $ = require("jquery"); // dom manipulation


$(document).ready(function(){


    console.log("document is loaded !!!");

    
    $(".cell").on("click" , function(){

        console.log(this);

        let rowId = Number($(this).attr("rowid"))+1;
        let colId = Number($(this).attr("colid"));
        // rowId = 1
        // colId  = 1 => "B"

        // address => "B2"
        let address = String.fromCharCode(65+colId)+rowId+"";
        console.log(address); 

        $("#address").val(address);
    });


})