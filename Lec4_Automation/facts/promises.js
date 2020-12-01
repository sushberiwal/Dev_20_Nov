let fs = require("fs");

     //B        =       // A
let f1KaPromise =  fs.promises.readFile("./f1.txt");

console.log(f1KaPromise);

f1KaPromise.then( function(data){
    console.log("Inside then !!");
    console.log("Content = " + data);
})

f1KaPromise.catch( function(error){
    console.log("Inside catch !!!`");
    console.log(error);
});
