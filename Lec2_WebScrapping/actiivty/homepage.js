// npm install request

let request = require("request");
let fs = require("fs");

// hof 
let link = "https://www.espncricinfo.com/series/_/id/8048/season/2020/indian-premier-league";

request( link , cb );


function cb(error , response , data){
    if(error == null && response.statusCode == 200){
        parseData(data);
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found !!!");
    }
    else{
        console.log(error);
    }
}



function parseData(html){
    fs.writeFileSync("./homepage.html" , html);
}