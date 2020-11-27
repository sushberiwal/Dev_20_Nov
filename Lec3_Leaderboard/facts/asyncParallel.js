// async tasks , simultaneously 

let fs = require("fs");


fs.readFile("./f1.txt" , function(error , data){
    console.log("Content = "+ data);
});

fs.readFile("./f2.txt" ,function(error , data){
    console.log("Content = "+ data);
});

fs.readFile("./f3.txt" , function(error , data){
    console.log("Content = "+ data);
});


