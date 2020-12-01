// async tasks // serial data // promises use

let fs = require("fs");

// promise hell => Chaining

let f1KaPromise =  fs.promises.readFile("./f1.txt");
f1KaPromise.then( function(data){
    console.log("Inside then !!");
    console.log("Content = " + data);
    let f2KaPromise = fs.promises.readFile("./f2.txt");
    f2KaPromise.then( function(data){
        console.log("Inside then !!");
        console.log("Content = " + data);
        let f3KaPromise = fs.promises.readFile("./f3.txt");
        f3KaPromise.then( function(data){
            console.log("Inside then !!");
            console.log("Content = " + data);
        })
    })
})




