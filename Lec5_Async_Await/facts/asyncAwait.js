// async keyword
// await keyword only valid in async function

// async keyword => function prefix
// function wo async ban jata hai => node api will handle that function and async function will gives you a
// pending promise

let fs = require("fs");

console.log("start");

async function sayHi() {
    try{
        let f1KaData = await fs.promises.readFile("./f1.txt"); // 2 ghante
        console.log(f1KaData+"");
    }
    catch(error){
        console.log(error);
    } 
}
sayHi();

console.log("end");

