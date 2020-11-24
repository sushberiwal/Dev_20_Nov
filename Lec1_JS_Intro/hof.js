function getFirstName(fullName){
    // "STEVE ROGERS"
    // [ "STEVE" , "ROGERS"  ];
    return fullName.split(" ")[0];
}


function getLastName(fullName){
// "STEVE ROGERS"
    // return "ROGERS";
    return fullName.split(" ")[1];
}



function fun(fullName , fn){
    let name = fn(fullName);
    console.log(name);
}


fun("Steve Rogers" , getFirstName);
fun("Tony Stark" , getLastName);


