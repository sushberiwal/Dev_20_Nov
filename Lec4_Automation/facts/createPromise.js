let fs = require("fs");

function promisifiedFile(filePath){
    return new Promise(  function(resolve , reject){
        fs.readFile(filePath , function(error , data){
            if(error){
                reject(error);
            }
            else{
                // data aa chuka
                resolve(data);
            }
        });
    });
}

//B        =       // A
let f1KaPromise =  promisifiedFile("./f1.txt");

console.log(f1KaPromise);

f1KaPromise.then( function(data){
    console.log("Inside then !!");
    console.log("Content = " + data);
})

f1KaPromise.catch( function(error){
    console.log("Inside catch !!!`");
    console.log(error);
});
