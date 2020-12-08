const id = "yexerax364@5y5u.com";
const pw = "123456789";

const puppeteer = require("puppeteer");
// puppeteer => pending promise

let gTab;

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
      let waitPromise = gTab.waitForSelector("#base-card-1-link" , {visible:true}) //max 30 sec wait
      return waitPromise;
  })
  .then(function(){ 
      // next page => click
      let ipKitClickedPromise = gTab.click("#base-card-1-link");
      return ipKitClickedPromise;
  })
  .then(function(){
    let waitPromise = gTab.waitForSelector("#base-card-1-link" , {visible:true}) //max 30 sec wait
    return waitPromise;
  })
  .then(function(){ 
    // next page => click
    let warmupClickedPromise = gTab.click("#base-card-1-link");
    return warmupClickedPromise;
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

  })
  .catch(function (error) {
    console.log(error);
  });
// catch ka function => failed callback
