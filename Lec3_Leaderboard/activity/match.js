let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");

let leaderboard = [];
let count = 0;
// let link = "https://www.espncricinfo.com/series/8048/scorecard/1237181/delhi-capitals-vs-mumbai-indians-final-indian-premier-league-2020-21";

function getMatch(link){
    console.log("Sending Request !!!");
    count++;
    request( link , cb ); // async task
}



function cb(error , response , data){

    if(error == null && response.statusCode == 200){
        console.log("Received Data !!!");
        count--;
        parseData(data);
        if(count == 0){
            console.table(leaderboard);
        }
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found !!!");
    }
    else{
        console.log(error);
    }
}


function parseData(html){
    let ch = cheerio.load(html);

    let bothInnings = ch('.card.content-block.match-scorecard-table .Collapsible');
    // [ <div class="Collapsible"></div> , <div class="Collapsible"></div>    ]

    for(let i=0 ; i<bothInnings.length ; i++){
        let teamName = ch(bothInnings[i]).find(".header-title.label").text().split("Innings")[0].trim();
        // Delhi Capitals Innings (20 overs maximum)
        //[  "Delhi Capitals " , " (20 overs maximum)" ];
        // console.log(teamName);
        let allTrs = ch(bothInnings[i]).find(".table.batsman tbody tr");
        for(let j=0 ; j<allTrs.length-1 ; j++){
            let allTds = ch(allTrs[j]).find("td");
            if(allTds.length > 1){
                // valid tds
                let batsmanName = ch(allTds[0]).find("a").text().trim();
                let runs = ch(allTds[2]).text().trim();
                let balls = ch(allTds[3]).text().trim();
                let fours = ch(allTds[5]).text().trim();
                let sixes = ch(allTds[6]).text().trim();
                // String interpolation
                // console.log(`Batsman = ${batsmanName} Runs = ${runs} Balls = ${balls} Fours = ${fours} Sixes = ${sixes}`);
                processDetails(teamName , batsmanName , runs , balls , fours , sixes);
            }
        } 
        console.log("#####################################################");
    }
}


function processDetails(teamName , batsmanName , runs , balls , fours , sixes){
    runs = Number(runs);
    balls = Number(balls);
    fours = Number(fours);
    sixes = Number(sixes);

    for(let i=0 ; i<leaderboard.length ; i++){
        if(leaderboard[i].Team == teamName && leaderboard[i].Batsman == batsmanName){
            leaderboard[i].Runs += runs;
            leaderboard[i].Balls += balls;
            leaderboard[i].Fours += fours;
            leaderboard[i].Sixes += sixes;
            return;
        }
    }

    let entry = {
        Team : teamName , 
        Batsman : batsmanName , 
        Runs : runs , 
        Balls : balls , 
        Fours : fours , 
        Sixes : sixes
    }
    leaderboard.push(entry);
}






// module.exports = {
// }
// module.exports = function
module.exports = getMatch;