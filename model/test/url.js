var http = require('http');
var url = require('url');
var nodegrass = require('nodegrass');
var cheerio = require('cheerio');
var parse = require('../parse/baseparse');
var urlstring ="http://heiji10.duapp.com/flyServlet?url=http://www.mouser.cn/Search/Refine.aspx?Keyword=max232"
//console.log(url.parse(urlstring))



 
parse.readmsgGbk(urlstring,function(data){
	console.log(readListUrl(data)) 
})

 
function readListUrl(html) {
	var $ = cheerio.load(html); 
	return $("#ctl00_ContentMain_SearchResultsGrid_grid_ctl03_ctl06_lnkAvailability").text()
}