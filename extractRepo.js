let request=require("request");
const cheerio = require("cheerio");
let path=require("path");
let fs=require("fs");

function extractRepoLink(url){
    request(url,cb);
}

function cb(err,response,html){
    if(err)
    {
        console.log(err);
    }
    else
    {
        extractData(html);
    }
}

function extractData(html)
{
    let cheerioSelector=cheerio.load(html);
    let topicNameElement=cheerioSelector(".container-lg.d-sm-flex.flex-items-center.p-responsive.py-5 h1");
    let topicName=cheerioSelector(topicNameElement).text().trim();
    console.log(topicName);
    let folderPath=path.join(__dirname,topicName);
    dirCreate(folderPath);
    let repoArr=cheerioSelector(".f3.color-text-secondary.text-normal.lh-condensed");
    for(let i=0;i<8;i++)
    {
        let repoAnchors=cheerioSelector(repoArr[i]).find("a");
        // console.log(repoAnchors.length);
        let repoLink=cheerioSelector(repoAnchors[1]).attr("href");
        // repoLink="https://github.com/"+repoLink;
        // console.log(repoLink);
        let fileName=repoLink.split("/").pop();
        let filePath=path.join(folderPath,fileName+".json");
        createfile(filePath);
        let issuePageLink="https://github.com"+repoLink+"/issues";
        getIssues(issuePageLink);

    }
    console.log("-----------------------------------------");
} 

function dirCreate(src)
{
    if(fs.existsSync(src)==false)
    {
        fs.mkdirSync(src);
    }
}

function createfile(src)
{
    if (fs.existsSync(src) == false) {
        fs.openSync(src, "w");
    }
}

function getIssues(url)
{
    request(url,issueCallback);
}

function issueCallback(err,header,html){
    if(err)
    {
        console.log(err);
    }
    else
    {
        extractIssueHtml(html);
    }
}

function extractIssueHtml(html)
{
    let cheerioSelector=cheerio.load(html);
    let allAnchorsTag=cheerioSelector(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open");
    let allIssue=[];
    for(let i=0;i<allAnchorsTag.length;i++)
    {
        let link=cheerioSelector(allAnchorsTag[i]).attr("href");
        let issueName=cheerioSelector(allAnchorsTag[i]).text();
        let issueObj={
            link:"https://github.com"+link,
            issueName:issueName
        }
        allIssue.push(issueObj);
    }
    console.table(allIssue);
}


module.exports={
    extractRepoLink:extractRepoLink
}