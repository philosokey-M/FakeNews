const axios = require('axios');
const cheerio = require('cheerio');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const run = async () => {
    // headless로 크롬 드라이버 실행 
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options())
        .build();
    try {

    //------- 임시 구간-----
        // 사이트로 이동 ( 현재는 간의로 만든 로컬 news.ejs로) => http 통신으로 json 이나 text로 링크 받아오게 변경
        await driver.get('http://localhost:5000/news');
    //------------------

        // user agent 확인 
        let userAgent = await driver.executeScript("return navigator.userAgent;")
        // console.log('UserAgent : ', userAgent);

    //------- 임시 구간-----   => 위에 http 통신으로 json 이나 text로 링크 받아오게 변경하면 삭제     
        // 검색단어를 입력
        let searchInput = await driver.findElement(By.css('input[id="search-input"]'));
        let keyword = "한경"; // 일단 임의로 키워드 넣었는데 API화 한다면 query 받아서 넣어야될듯 // (수정) 나중엔 크롤링할 링크를 받아와서 검색 절차 빼고 수행
        searchInput.sendKeys(keyword, Key.ENTER);
        
        // 뉴스기사 링크 접속 (로딩 고려해 3초정도 기다림) 
        await driver.wait(until.elementLocated(By.css('a')), 3000);
        
        let linkElements = await driver.findElements(By.css('a'))
    //------------------

        // 주소가 n.news.naver.com인지 확인
        let hrefs = [];
        for (let linkElement of linkElements) {
            let href = await linkElement.getAttribute('href');
            if(href.startsWith('https://n.news.naver.com')) {
                hrefs.push(href);
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
            console.log(cleanData);
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
run();




