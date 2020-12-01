let fs = require("fs");


let f1KaPromise = fs.promises.readFile("./f1.txt");

// pending promise => then ka promise

f1KaPromise.then(function(data){
    console.log("F1 ka data = " + data);
    let f2KaPromise = fs.promises.readFile("./f2.txt");
    return f2KaPromise;
})
.then(function(data){
    console.log("F2 ka data = " + data);
})






