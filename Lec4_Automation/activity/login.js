const id = "yexerax364@5y5u.com";
const pw = "123456789";

const puppeteer = require("puppeteer");
// puppeteer => pending promise

let gTab;
let gIdx;
let gCode;

// to open a browser
let browserOpenPromise = puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: ["--start-maximized"],
});

// then ka function => success callback
browserOpenPromise
  .then(function (browser) {
    let pagesPromise = browser.pages();
    return pagesPromise; // promise <pending> => promise <pages>
  })
  .then(function (pages) {
    // pages => array => [page]
    let tab = pages[0];
    gTab = tab;
    let pageOpenPromise = tab.goto("https://www.hackerrank.com/auth/login"); // goto => by default delay
    return pageOpenPromise;
  })
  .then(function () {
    // id type
    let idTypedPromise = gTab.type("#input-1" , id);
    return idTypedPromise;
  })
  .then(function(){
    let pwTypedPromise = gTab.type("#input-2" , pw);
    return pwTypedPromise;
  })
  .then(function(){
      let loginClickedPromise = gTab.click(".ui-btn.ui-btn-large.ui-btn-primary");
      return loginClickedPromise; // login 
  })
  // click => navigation => click
  .then(function(){
    let waitAndClickPromise = waitAndClick("#base-card-1-link");
    return waitAndClickPromise;
  })
  .then(function(){
    let waitAndClickPromise = waitAndClick("#base-card-1-link");
    return waitAndClickPromise;
  })
  .then(function(){
      let waitPromise = gTab.waitForSelector(".js-track-click.challenge-list-item" , {visible:true});
      return waitPromise;
  })
  .then(function(){
      let allQuestionsPromise = gTab.$$(".js-track-click.challenge-list-item");
      return allQuestionsPromise;
  })
  .then(function(allQuesElements){
      // [ <a href=""> </a>  , <a href=""> </a>  , <a href=""> </a>  , <a href=""> </a> ] ;
    // let completeLinksPromise = [ Promise<Pending> , Promise<Pending> , Promise<Pending> , Promise<Pending> ];
    let completeLinksPromise = [];
    for(let i=0 ; i<allQuesElements.length ; i++){
        let linkPromise = gTab.evaluate( function(elem){ return elem.getAttribute("href") } , allQuesElements[i] );
        completeLinksPromise.push(linkPromise);
    }
    let pendingPromiseOfAllLinks = Promise.all(completeLinksPromise);
    return pendingPromiseOfAllLinks; // Promise<pending>
  })
  .then(function(allLinks){
      console.log(allLinks);
      //https://www.hackerrank.com
    //   let completeLinks = allLinks.map( function(link){
    //       return `https://www.hackerrank.com${link}`;
    //   })
    let completeLinks = [];
    for(let i=0 ; i<allLinks.length ; i++){
        let completeLink = `https://www.hackerrank.com${allLinks[i]}`;
        completeLinks.push(completeLink);
    }
    console.log(completeLinks);
    let oneQuestionSolvePromise = solveQuestion(completeLinks[0]);
    return oneQuestionSolvePromise;
  })
  .then(function(){
    console.log("One Question solved Succesfully !!!!");
  })
  .catch(function (error) {
    console.log(error);
  });
// catch ka function => failed callback


function waitAndClick(selector){
  return new Promise(function(resolve , reject){
    let waitPromise = gTab.waitForSelector(selector , {visible:true});
    waitPromise.then(function(){
      let clickPromise = gTab.click(selector);
      return clickPromise;
    })
    .then(function(){
      resolve();
    })
    .catch(function(error){
      reject(error);
    })
  })
}


function getCode(){
  return new Promise( function(resolve , reject){
    let waitPromise = gTab.waitForSelector(".hackdown-content h3" , {visible:true});
    waitPromise.then(function(){
      let allCodeNamesElementsPromise = gTab.$$(".hackdown-content h3");
      return allCodeNamesElementsPromise;
    })
    .then(function(allCodeNamesElements){
      // [ <h3>C++</h3> , <h3>Java</h3> , <h3>Python</h3>];
      //let allCodeNamesPromise = [  Promise<pending> , Promise<pending> , Promise<pending> ];
      let allCodeNamesPromise = [];
      for(let i=0 ; i<allCodeNamesElements.length ; i++){
        let namePromise = gTab.evaluate( function(elem){ return elem.textContent;  } , allCodeNamesElements[i] );
        allCodeNamesPromise.push(namePromise);
      }
      let promiseOfAllCodesNames = Promise.all(allCodeNamesPromise);
      return promiseOfAllCodesNames;
    })
    .then(function(codeNames){
       //[C++ , Java , Python];
       let idx;
       for(let i=0 ; i<codeNames.length ; i++){
         if(codeNames[i] == "C++"){
           idx = i;
           break;
         }
       }
       gIdx = idx;
       let allCodeElementsPromise = gTab.$$(".hackdown-content .highlight");
       return allCodeElementsPromise;
    })
    .then(function(allCodeElements){
      // [<div> </div> , <div> </div> , <div> </div>  ]
      let codeDiv = allCodeElements[gIdx];
      let codePromise = gTab.evaluate( function(elem){  return elem.textContent; }  , codeDiv)
      return codePromise;
    })
    .then(function(code){
      // console.log(code);
      gCode = code;
      resolve();
    })
    .catch(function(error){
      reject(error);
    })
  });
}

function solveQuestion(quesLink){
  return new Promise( function(resolve , reject){
    let quesGotoPromise = gTab.goto(quesLink);
    quesGotoPromise.then(function(){
      let waitAndClickPromise = waitAndClick('div[data-attr2="Editorial"]');
      return waitAndClickPromise;
    })
    .then(function(){
      let codePromise = getCode();
      return codePromise;
    })
    .then(function(){
      console.log("Got Code !!");
    })
    .catch(function(error){
      reject(error);
    })


  });
}
