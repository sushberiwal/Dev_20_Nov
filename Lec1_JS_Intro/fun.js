// function body

// callback functioin
function sayHi(name){
    console.log(name + " says Hi !!!!");
    return 10;
}

// function call
// sayHi();
// 

// let val = sayHi("Steve");
// console.log( val );

// variables can be passed as a parameter
// function are variables
// functions can be passed as a parameter

// high order function=
function fun( name , fn ){
    console.log( fn(name) );
}

console.log(fun( "Steve" ,  sayHi  ));

// callback function => function which is passed in a function call
// high order function => function which accepts function as a parameter




