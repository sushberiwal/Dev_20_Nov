const id = "pamico3332@nic58.com";
const pw = "12345678";
const puppeteer = require("puppeteer");
const challenges = require("./challenges");

// IIFE => Immediately Invoked Function Expressions

// waitForSelector

// waitForNavigation

(async function(){
    try{
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"],
          });

          let pages = await browser.pages();
          let tab = pages[0];
          await tab.goto("https://www.hackerrank.com/auth/login");
          await tab.type("#input-1" , id);
          await tab.type("#input-2" , pw);
          
          await Promise.all( [ tab.waitForNavigation() , tab.click(".ui-btn.ui-btn-large.ui-btn-primary")]);

          await tab.waitForSelector('div[data-analytics="NavBarProfileDropDown"]' , {visible:true});
          await tab.click('div[data-analytics="NavBarProfileDropDown"]');

          await Promise.all( [ tab.waitForNavigation({waitUntil:"domcontentloaded"}) , tab.click('a[data-analytics="NavBarProfileDropDownAdministration"]') ] );

          await tab.waitForSelector('.nav-tabs.nav.admin-tabbed-nav li' , {visible:true});
          let bothLis = await tab.$$('.nav-tabs.nav.admin-tabbed-nav li');
          let manageChallengeLi = bothLis[1];
          // <li></li>
          await manageChallengeLi.click();
          await tab.waitForSelector('.btn.btn-green.backbone.pull-right' , {visible:true});
          
          // on challenges page
          
          // await addModerators();
    }
    catch(error){
        console.log(error);
    }
})();



//function addModerators
// get all links of questions of current page 
// loop of all links and call
// addModeratorToASingleQues( link  ) => newTab => newTab.goto(link); => newTab.close


