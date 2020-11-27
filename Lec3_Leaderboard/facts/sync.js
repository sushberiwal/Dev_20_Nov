let fs = require("fs");


// sync code => sync code X


console.log("Start");

let f1KaData = fs.readFileSync("./f1.txt"); // 100gb // web => api data 
console.log(f1KaData+"");

// independent
console.log("end");