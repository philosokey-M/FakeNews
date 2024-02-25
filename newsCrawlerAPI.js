const express = require("express");
const router = express.Router();
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


// 네이버 API 통해 받은 url 데이터가 json으로 감싼 리스트(urls)로 온다고 가정
router.post("/newsCrawl",async(req,res)=>{
    try {
        // 전송받은 urls 배열형태로 저장
        let urls = req.body.urls;

        // 반환할 배열
        let contents = [];

        // 크롤링 함수 
        const run = async () => {
            // headless로 크롬 드라이버 실행 
            let driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(new chrome.Options())
                .build();

            try {
                // user agent 확인 
                await driver.executeScript("return navigator.userAgent;");

                // 주소가 n.news.naver.com인지 확인
                let hrefs = [];
                for (let url of urls) {
                    if(url.startsWith('https://n.news.naver.com')) {
                        hrefs.push(url);
                    }
                }        
                //  n.news.naver.com인 뉴스기사 원문 크롤링
                for(let href of hrefs) {
                    await driver.get(href);
                    let articleTag = await driver.findElement(By.css('article'));
                    let articleContent = await articleTag.getAttribute('innerHTML');
        
                    // 데이터 정제
                    let rawData = articleContent; 
                    let cleanData = rawData.replace(/<[^>]*>/g, '');
                    contents.push(cleanData);
                }
            }
            catch (e) {
                console.log(e);
            }
            finally {
                //브라우저 끄기
                driver.quit();
            }
        }
        await run();
        res.status(200).json(contents); 
    }catch(e){
        console.error(e);
        res.status(500).send('Server error');
    }
})
module.exports = router