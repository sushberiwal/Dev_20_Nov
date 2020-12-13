const id = "pamico3332@nic58.com";
const pw = "12345678";

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

    let firstQuesSolvePromise = solveQuestion(completeLinks[0]);

    for(let i=1 ; i<completeLinks.length ; i++){
      firstQuesSolvePromise = firstQuesSolvePromise.then(function(){
        let nextQuesSolvePromise = solveQuestion(completeLinks[i]);
        return nextQuesSolvePromise;
      })
    }
    return firstQuesSolvePromise;
  })
  .then(function(){
    console.log("All Questions solved Succesfully !!!!");
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



function pasteCode(){
  return new Promise(function(resolve , reject){
    let problemTabClickedPromise = gTab.click('div[data-attr2="Problem"]');
    problemTabClickedPromise.then(function(){
      let waitAndClickPromise = waitAndClick('.custom-input-checkbox');
      return waitAndClickPromise;
    })
    .then(function(){
      let codeTypedPromise = gTab.type(".custominput" , gCode);
      return codeTypedPromise;
    })
    .then(function(){
      let ctrlKeyDownPromise = gTab.keyboard.down("Control");
      return ctrlKeyDownPromise;
    })
    .then(function(){
      let aKeyPressedP = gTab.keyboard.press("A");
      return aKeyPressedP;
    })
    .then(function(){
      let xKeyPressedP = gTab.keyboard.press("X");
      return xKeyPressedP;
    })
    .then(function(){
      let clickedOnCodeBoxPromise = gTab.click(".monaco-scrollable-element.editor-scrollable.vs");
      return clickedOnCodeBoxPromise;
    })
    .then(function(){
      let aKeyPressedP = gTab.keyboard.press("A");
      return aKeyPressedP;
    })
    .then(function(){
      let vKeyPressedP = gTab.keyboard.press("V");
      return vKeyPressedP;
    })
    .then(function(){
      let ctrlKeyUpPromise = gTab.keyboard.up("Control");
      return ctrlKeyUpPromise;
    })
    .then(function(){
      let codeSubmitPromise = gTab.click('.pull-right.btn.btn-primary.hr-monaco-submit');
      return codeSubmitPromise;
    }).then(function(){
      resolve();
    })
    .catch(function(error){
      reject(error);
    })

  })
}


function handleLockBtn(){
  return new Promise(function(resolve , reject){
    let waitPromise = gTab.waitForSelector('.ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled' , {visible:true , timeout:5000});
    waitPromise.then(function(){
      let mouseMovePromise = gTab.mouse.move(10,10);
      return mouseMovePromise;
    })
    .then(function(){
      let clickPromise = gTab.click('.ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled');
      return clickPromise;
    })
    .then(function(){
      //lock btn found
      console.log("lock button found !!");
      resolve();
    })
    .catch(function(error){
      // lock btn not found
      console.log("lock button not found !!");
      resolve();
    })
  })
}

function solveQuestion(quesLink){
  return new Promise( function(resolve , reject){
    let quesGotoPromise = gTab.goto(quesLink);
    quesGotoPromise.then(function(){
      let waitAndClickPromise = waitAndClick('div[data-attr2="Editorial"]');
      return waitAndClickPromise;
    })
    .then(function(){
      let lockBtnPromise = handleLockBtn();
      return lockBtnPromise;
    })
    .then(function(){
      let codePromise = getCode();
      return codePromise;
    })
    .then(function(){
      let codePastedPromise = pasteCode();
      return codePastedPromise;
    })
    .then(function(){
      resolve();
    })
    .catch(function(error){
      reject(error);
    })


  });
}
