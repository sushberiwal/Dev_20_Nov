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
          
          await Promise.all( [ tab.waitForNavigation({waitUntil:"networkidle2"}) , tab.click(".ui-btn.ui-btn-large.ui-btn-primary")]);

          await tab.waitForSelector('div[data-analytics="NavBarProfileDropDown"]' , {visible:true});
          await tab.click('div[data-analytics="NavBarProfileDropDown"]');

          await Promise.all( [ tab.waitForNavigation({waitUntil:"networkidle2"}) , tab.click('a[data-analytics="NavBarProfileDropDownAdministration"]') ] );

          await tab.waitForSelector('.nav-tabs.nav.admin-tabbed-nav li' , {visible:true});
          let bothLis = await tab.$$('.nav-tabs.nav.admin-tabbed-nav li');
          let manageChallengeLi = bothLis[1];
          // <li></li>
          await manageChallengeLi.click();
          await tab.waitForSelector('.btn.btn-green.backbone.pull-right' , {visible:true});
          
          // on challenges page          
          await addModerators(browser , tab);

    }
    catch(error){
        console.log(error);
    }
})();

async function addModerators(browser , tab){
    await tab.waitForSelector('.backbone.block-center' , {visible:true});

    let allATags = await tab.$$('.backbone.block-center');
    let completeLinks = [];
    for(let i=0 ; i<allATags.length ; i++){
        let link = await tab.evaluate( function(elem){ return elem.getAttribute("href");  }   , allATags[i]);
        link = `https://www.hackerrank.com${link}`
        completeLinks.push(link);
    }
    // get all links of questions of current page 
    // console.log(completeLinks);

    let allModeratorsAddPromise = [];

    for(let i=0 ; i<completeLinks.length ; i++){
       let moderatorAddPromise = addModeratorToASingleQues( completeLinks[i] , browser );
       allModeratorsAddPromise.push(moderatorAddPromise);
    }

    await Promise.all(allModeratorsAddPromise);

    let allLis = await tab.$$('.pagination li');
    let nextBtn = allLis[allLis.length-2];
    let isDisabled = await tab.evaluate( function(elem){return elem.classList.contains("disabled") ;}    , nextBtn);
    if(!isDisabled){
        await Promise.all( [ tab.waitForNavigation({waitUntil:"networkidle2"}) , nextBtn.click()]);
        await addModerators(browser , tab);
    }
    else{
        return;
    }
}
//function addModerators
// addModeratorToASingleQues( link  ) => newTab => newTab.goto(link); => newTab.close

async function confirmModal(tab){
    try{
        await tab.waitForSelector('#confirm-modal' , {timeout:5000});
        await tab.click('#confirmBtn');
    }
    catch(error){
        return;
    }
}


async function addModeratorToASingleQues(link , browser){
    let newTab = await browser.newPage();
    await newTab.goto(link);
    await confirmModal(newTab);
    await newTab.waitForSelector('li[data-tab="moderators"]' , {visible:true});
    await newTab.click('li[data-tab="moderators"]');
    await newTab.waitForSelector('#moderator' ,{visible:true});
    await newTab.type('#moderator' , "sushant");
    await newTab.click('.btn.moderator-save');
    await newTab.click('.save-challenge.btn.btn-green');
    await newTab.close();
}

