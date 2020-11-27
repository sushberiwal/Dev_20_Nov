let fs = require("fs");

// async code

console.log("start");

fs.readFile("./f1.txt" , cb);

function cb(error , data){
    console.log("Content = "+ data);
}

console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");

let count=0;
while(true){
console.log(count);
count++;
}

