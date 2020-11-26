let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");


// let link = "https://www.espncricinfo.com/series/8048/scorecard/1237181/delhi-capitals-vs-mumbai-indians-final-indian-premier-league-2020-21";


function getMatch(link){
    request( link , cb);
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
    let ch = cheerio.load(html);

    let bothInnings = ch('.card.content-block.match-scorecard-table .Collapsible');
    // [ <div class="Collapsible"></div> , <div class="Collapsible"></div>    ]

    for(let i=0 ; i<bothInnings.length ; i++){
        let teamName = ch(bothInnings[i]).find(".header-title.label").text().split("Innings")[0].trim();
        // Delhi Capitals Innings (20 overs maximum)
        //[  "Delhi Capitals " , " (20 overs maximum)" ];
        console.log(teamName);
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

function checkTeamFolder(teamName){
    // teamFolderPath = "worldcup/Mumbai Indians"
    let teamPath = `worldcup/${teamName}`;
    return fs.existsSync(teamPath);
}

function checkBatsmanFile(teamName , batsmanName){
    // "worldcup/Mumbai Indians/Rohit Sharma.json"
    let batsmanPath = `worldcup/${teamName}/${batsmanName}.json`;
    return fs.existsSync(batsmanPath);
}

function updateBatsmanFile(teamName , batsmanName , runs , balls , fours , sixes){
    let batsmanPath = `worldcup/${teamName}/${batsmanName}.json`;
    let batsmanFile = fs.readFileSync(batsmanPath);
    batsmanFile = JSON.parse(batsmanFile);
    let inning = {
        Runs : runs,
        Balls : balls , 
        Fours : fours , 
        Sixes : sixes
    }
    batsmanFile.push(inning);
    fs.writeFileSync(batsmanPath , JSON.stringify(batsmanFile)); 
}

function createBatsmanFile(teamName , batsmanName , runs , balls , fours , sixes){
    let batsmanPath = `worldcup/${teamName}/${batsmanName}.json`;
    let batsmanFile = [];
    let inning = {
        Runs : runs,
        Balls : balls , 
        Fours : fours , 
        Sixes : sixes
    }
    batsmanFile.push(inning);
    fs.writeFileSync(batsmanPath , JSON.stringify(batsmanFile));
}
function createTeamFolder(teamName){
    let teamPath = `worldcup/${teamName}`;
    fs.mkdirSync(teamPath);
}





function processDetails(teamName , batsmanName , runs , balls , fours , sixes){
    let teamExist = checkTeamFolder(teamName);
    if(teamExist){
        let batsmanExist = checkBatsmanFile(teamName , batsmanName);
        if(batsmanExist){
            updateBatsmanFile(teamName , batsmanName , runs , balls , fours , sixes);
        }
        else{
            createBatsmanFile(teamName , batsmanName , runs , balls , fours , sixes);
        }
    }
    else{
        createTeamFolder(teamName);
        createBatsmanFile(teamName , batsmanName , runs , balls , fours , sixes);
    }
}





// module.exports = {

// }

// module.exports = function

module.exports = getMatch;