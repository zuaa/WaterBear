var fs = require('fs');
var z = require('./zhiqiyeTask');
//z.runtask()
var lineReader = require('line-reader');
var parse = require('./baseparse');
var cheerio = require('cheerio');
var url ="http://top.baidu.com/buzz?b=3&fr=topboards"
parse.readmsgBycode(url,'gb2312', function(datadata) {
	var $ = cheerio.load(datadata); 
	 $(".list-title").each(function (index,item) {
	 	console.log($(item).text().trim());
	 	z.addtask($(item).text().trim(),1,70)
	 }) 
})


