//데이터 분석용 
const axios =require('axios');
const cheerio = require("cheerio");
const fs = require('fs');

function delay(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function(){
            resolve();
        },ms);
    });
}

function getHTML(url) {
    return new Promise(resolve=>{
        delay(300).then(function() {
            axios.get(url).then(function(data) {
                resolve(data);
            });
        });
    })    
}
/// 크롤링