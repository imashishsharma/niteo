const express = require('express');
const puppeteer = require('puppeteer');
const countWord = require('./countWords');

const port = 3000;
const URL =  'http://www.ema.europa.eu/ema/';

let app = express();

app.get('/read-web/:search', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const searchKeyword = decodeURIComponent(req.params.search);
    let scrape = async () => {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto(URL, {waitUntil: 'load'});
        await page.waitFor('input[name=q]'); 
        await page.type('input[name=q]', searchKeyword); //typing the search criteria
        await page.click('input[type="submit"]'); //clicking form submit
        await page.waitForSelector('#contentArea'); // waiting for search results to load
        const result = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('#contentArea > div > div > div:nth-child(5)'));
    
          return anchors.map((anchor) => {
              console.log('Value', anchor.textContent);
              return anchor.innerHTML;
          });          
        });
        browser.close();
        return result;
    };

    scrape().then((value) => {
      console.log(value);  //printing to console
      const count = countWord.countWord(value.toString(), searchKeyword);
      console.log('Count is', count);
      res.send([value.toString(), count]); //printing to browser
    });
    
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
