// c++ => cout << "" ;
// java => System.out.println("");

console.log("Hello");

// top to bottom
// left to right


// data types => int boolean double float character string

// data types => Number , Boolean , undefined , String , Null , object

// ES6 syntax => ECMASCRIPT 6

// let const
let a = 12;
let b = true;
// by default undefined value 
let c;
let d = 24.56;
let e = 'Hey i am a string';
console.log(a , b , c , d , e );
// let => block scoped variable
if(true){
    let inside = " I am inside if";
}

// console.log(inside);

// const => block scoped , constant => value cannot be changed i.e cannot be reassigned
const pi = 3.14;

console.log(pi);


// == and ===

console.log(10 == "10") // only value is checked
console.log(10 === "10") // value and datatype is checked




// 1d 2d array

// empty array is initialized
let values = [ true , 1 , 2 , 6 , "Hey i am a string" , [ 1 , 23 ,[ "I am third dimension" ]  ,"I am 2nd dimensiuioin" , 4 , 5  ]  ];

console.log( values[5][2]   );



// object => key values pair

// keys => unique , values can be duplicate

let obj = {
    id : "1",
    name : "Steve Rogers",
    movies : ["The First avenger" , "The Winter soldier" ],
    place : "Queens",
    skills : "Martial Arts",
}

console.log(obj);

// dot => literal
console.log(obj.movies);

let key = "id";

// console.log( obj.key );

// bracket notation
console.log( obj[key] ) 












