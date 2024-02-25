const axios  = require('axios');
const express = require('express');
const app = express();

app.set('view engine', 'ejs')

app.use(express.json())
app.use("/newsCrawlerAPI", require("./newsCrawlerAPI"))


// key => 나중에 .env로 이동
const client_id = 'PkSBjzFC9rAYPFp9wsA5';
const client_secret = '9mCcHPPS9W';

app.get('/search/news', (req, res) => {
    
   const api_url = 'https://openapi.naver.com/v1/search/news?display=10&sort=date&query=' + encodeURI(req.query.query); // JSON 결과
//   const api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // XML 결과
//   - 옵션 정리 >> display = 불러올 데이터 수 / sort = 정렬방법 (sim:정확도/date:날짜 내림차순) 

   const headers = {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret };

   axios.get(api_url, {headers})
    .then(response => {
      res.status(200).json(response.data.items);      
    })
    .catch(error => {
      console.log('error = ' + error);
      res.status(error.response.status).end();
    });

 });

 app.get("/news", (req,res)=>{
    res.render("news.ejs")
})

 app.listen(5000, ()=> {
    console.log('http://127.0.0.1:5000/search/news?query=검색어 Start');
  });
 