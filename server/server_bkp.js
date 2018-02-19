const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const sleep = require('sleep');

const port = 3000;
const pageUrl =  'http://www.ema.europa.eu/ema/';
const searchKeyword = 'diagnostic';  //search keyword goes here

const app = express();

function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

app.get('/read-web', (req, res) => {
    let scrape = async () => {
        
        // try {
        //     const browser = await puppeteer.launch({ headless: false });
        //     const page = await browser.newPage();
        //     console.log('start');
        //     page.on('console', (...args) => console.log('PAGE LOG:', ...args));
        //     await page.goto(pageUrl);
        //     await page.waitFor('input[name=q]'); 
        //     await page.type('input[name=q]', searchKeyword); //typing the search criteria
        //     await page.click('input[type="submit"]'); //clicking form submit
        //     await page.waitForSelector('#contentArea');
        //     var num = 0;
        //     for(var i=0; i< 10; i++){
        //         var content = await page.content();
        //         console.log('we have content of page '+num);
                
        //         fs.writeFileSync(`public/${num}.html`, content);
        //         console.log("The file of page " + num + " was saved!");
    
        //         var sleepSecond = getRandomInt(20,40);
        //         console.log("We are waiting "+ sleepSecond + " seconds");
        //         //sleep.sleep(sleepSecond);
        //         var nextPage = 'index.jsp?curl=search.jsp&amp;site=pfoi_collection&amp;entsp=0&amp;sort=date:D:L:d1&amp;client=pfoi_frontend&amp;curl=search.jsp&amp;btnG=Search&amp;entqr=0&amp;oe=UTF-8&amp;proxyreload=1&amp;q=medical+technologies&amp;ie=UTF-8&amp;ud=1&amp;mid=&amp;output=xml_no_dtd&amp;proxystylesheet=pfoi_frontend&amp;filter=0&amp;ulang=&amp;ip=172.16.80.221&amp;access=p&amp;entqrm=0&amp;wc=200&amp;wc_mc=1&amp;start=10';
        //         var next =   await page.$('a[href="#/index.jsp?curl=search.jsp&amp;site=pfoi_collection&amp;entsp=0&amp;sort=date:D:L:d1&amp;client=pfoi_frontend&amp;curl=search.jsp&amp;btnG=Search&amp;entqr=0&amp;oe=UTF-8&amp;proxyreload=1&amp;q=medical+technologies&amp;ie=UTF-8&amp;ud=1&amp;mid=&amp;output=xml_no_dtd&amp;proxystylesheet=pfoi_frontend&amp;filter=0&amp;ulang=&amp;ip=172.16.80.221&amp;access=p&amp;entqrm=0&amp;wc=200&amp;wc_mc=1&amp;start=10"]');
        //         await next.click();
        //         console.log('Click on next');
        //         sleepSecond = getRandomInt(40,80);
        //         console.log("We are waiting "+ sleepSecond + " seconds");
        //         await page.waitForNavigation(5);
        //         //sleep.sleep(sleepSecond);
        //         num += 15;
        //     }
        //     browser.close();
        // } catch (e) {
        //     console.log(e);
        // }


        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto(pageUrl, {waitUntil: 'load'});
        await page.waitFor('input[name=q]'); 
        await page.type('input[name=q]', searchKeyword); //typing the search criteria
        await page.click('input[type="submit"]'); //clicking form submit
        await page.waitForSelector('#contentArea'); // waiting for search results to load
        const result = await page.evaluate(() => {
            // let searchResult = document.getElementsByClassName('#contentArea > div > div');

            page.content((content) => {
                console.log('we have content of page ');
                
                fs.writeFileSync(`public/data.html`, content);
                 console.log("The file of page was saved!");
            });
            

            const anchors = Array.from(document.querySelectorAll('#contentArea > div > div > div:nth-child(5)'));
            const doc = document.querySelectorAll('#contentArea > div > div > div:nth-child(5) > h4:nth-child(1)');
            return anchors.map((anchor) => anchor.textContent);          
         //return doc;
        });

        browser.close();
        return result;
    };

    scrape().then((value) => {
      console.log(value);  //printing to console
      res.send(value); //printing to browser
    });
    
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});

