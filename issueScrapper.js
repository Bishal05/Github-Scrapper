let request=require("request");
const cheerio = require("cheerio");
let extractRepoLink=require("./extractRepo");

let url="https://github.com/topics";
request(url,cb);

function cb(err,header,html)
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        extractHtml(html);
    }
}

function extractHtml(html)
{
    let cheerioSelector=cheerio.load(html);
    let topicBox=cheerioSelector(".col-12.col-sm-6.col-md-4.mb-4 a");
    // console.log(topicBox.length);
    for(let i=0;i<topicBox.length;i++)
    {
        let topicName=cheerioSelector(topicBox[i]).text();
        let topicLink=cheerioSelector(topicBox[i]).attr("href");
        console.log(topicName.trim().split("\n")[0]);
        topicLink="https://github.com"+topicLink;
        // console.log(topicLink);
        extractRepoLink.extractRepoLink(topicLink);
    } 
}