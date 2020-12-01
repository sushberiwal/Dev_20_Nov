let request = require("request");
let cheerio = require("cheerio");

const getMatch = require("./match");


function getAllMatches(link){
    request(link , cb);
}

function cb(error , response , data){
    if(error == null && response.statusCode == 200){
        parseData(data);
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found !!!");
    }
    else{
        console.log(error);
    }
}

function parseData(html){
    // a[data-hover="Scorecard"]
    let ch = cheerio.load(html);
    let allATags = ch('a[data-hover="Scorecard"]');
    console.log(allATags.length);
    // [ <a> </a> , <a> </a> , <a> </a> ,<a> </a> ,<a> </a> ]
    
    for(let i=0 ; i<allATags.length ; i++){
        let link = ch(allATags[i]).attr("href");
        let completeLink = "https://www.espncricinfo.com"+link;
        // console.log(completeLink);
        getMatch(completeLink);
    }
    
}

//module.exports =  {
//   getAllMatches : getAllMatches,
// }


module.exports.getAllMatches = getAllMatches;