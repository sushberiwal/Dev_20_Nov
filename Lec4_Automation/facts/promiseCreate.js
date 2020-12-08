let fs = require("fs");


function createPromise(filePath){
    return new Promise( function(resolve , reject){
        fs.readFile(filePath , function(error , data){
            if(error){
                // data nhi aya
                reject(error);
            }
            else{
                // data aa chuka
                resolve("anything");
            }
        } )
    });
}


let f1KaPromise =  createPromise("./f1.txt");

console.log(f1KaPromise);

f1KaPromise.then( function(data){
    console.log("Inside then !!");
    console.log("Content = " + data);
})

f1KaPromise.catch( function(error){
    console.log("Inside catch !!!`");
    console.log(error);
});