const puppeteer = require("puppeteer");

const id = "yexerax364@5y5u.com";
const pw = "123456789";
let tab;
// puppeteer functions => pending promise

// headless mode

// it will open a browser
let browserPromise = puppeteer.launch({ headless: false ,
    defaultViewport : null ,
    args:["--start-maximized"]
});
browserPromise
  .then(function (browser) {
    let pagesPromise = browser.pages();
    return pagesPromise;
  })
  .then(function (pages) {
    let page = pages[0];
    tab = page;
    let gotoPromise = page.goto("https://www.hackerrank.com/auth/login");
    return gotoPromise;
  })
  .then(function () {
      let idTypedPromise = tab.type("#input-1"  ,id);
      return idTypedPromise;
  })
  .then(function(){
      let pwTypedPromise = tab.type("#input-2" , pw);
      return pwTypedPromise;
  })
  .then(function(){
      let loginPromise = tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
      return loginPromise; // Pending Promise <pending>
  })
  .then(function(){
      console.log("logged in succesfully !!")
  })
  .catch(function(error){
      console.log(error);
  })
