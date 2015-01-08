var cheerio = require('cheerio');
var parse = require('./baseparse'); 
var lineReader = require('line-reader');
var D = require('./pnDao'); 
var baiji = require('../parse/baiji')
var CronJob = require('cron').CronJob;



<<<<<<< .mine
 
=======
baiji.readTask("rs",function(data){
	 data.forEach(function(item,index){
	 	readCatalogMain(item.k,item.id);
	 })
})
>>>>>>> .r250
//爬取第一级分类
var job = new CronJob('*/5 * * * *  *', function(request, response) {
	baiji.readTask("rs",function(data){
		console.log("111111111111")
		 data.forEach(function(item,index){
		 	readCatalogMain(item.k,item.id);
		 })
	})
}, function() {
	console.log("stop")
}, true);
 
//爬取第一级分类
var job = new CronJob('*/5 * * * *  *', function(request, response) {
	baiji.readTask("rs_first",function(data){
		 data.forEach(function(item,index){
		 	readFirstCatalogMain(item.k,item.id);
		 })
	})
}, function() {
	console.log("stop")
}, true);

//爬取第二级分类，获取到详细连接 和下一页连接，或者是一个含有二级分类的连接
var job = new CronJob('*/5 * * * *  *', function(request, response) {
	baiji.readTask("rs_second",function(data){
		 data.forEach(function(item,index){
		 	readSecondCatalogMain(item.k,item.id);
		 })
	})
}, function() {
	console.log("stop")
}, true);


//readSecondCatalogMain("http://china.rs-online.com/web/c/displays-optoelectronics/leds-led-accessories/ir-leds/?pn=5",1);


function readSecondCatalogMain(url,taskid){ 
	parse.readmsg(url,function(datadata) { 
		var $ = cheerio.load(datadata); 
		//如果是二级分类，继续把二级分类保存
		$(".brcategories a").each(function(index,item){
			 var url="http://china.rs-online.com"+$(item).attr("href");
			 baiji.addTask2(url,"rs_second")
		})
		//如果是列表页，抓取详情页的url保存为 pn信息
		$(".partColHeader").each(function(index,item){ 
			 var url="http://china.rs-online.com"+$(item).find(".primarySearchLink").attr("href"); 
			 var t=$(item).find(".defaultSearchText").text().trim()
			 console.log(t);
			 if(t!=""){
			 	insert(t,url)
			 }  
		})	 
		//如果存在分页信息也保存为 rs_second 任务  
 		var nexturl=$(".nextLink").next().attr("href");
 		if(nexturl!=""){
 			console.log("找到下一页连接");
			 baiji.addTask2("http://china.rs-online.com"+$(".nextLink").next().attr("href"),"rs_second")	 
 		} 
		//结束任务
		baiji.endTask(taskid,1);
	}) 
}


 

function readFirstCatalogMain(url,taskid){ 
	parse.readmsg(url,function(datadata) { 
		var $ = cheerio.load(datadata); 
		$(".brcategories a").each(function(index,item){
			 var url="http://china.rs-online.com"+$(item).attr("href");
			 baiji.addTask2(url,"rs_second")
		})
		baiji.endTask(taskid,1);
	}) 
}

function readCatalogMain(url,taskid){ 
	parse.readmsg(url,function(datadata) { 
		var $ = cheerio.load(datadata); 
		$(".allProductTbl a").each(function(index,item){
			 var url="http://china.rs-online.com"+$(item).attr("href");
			 baiji.addTask2(url,"rs_first")
		})
		baiji.endTask(taskid,1);
	}) 
}


 
function insert(pn,url) {
	D.find({
		url: url
	}, "pn_product", function(rows) {
		if (rows.length < 1) {
			D.insert({pn:pn,url:url}, "pn_product")
		} else {
			console.log('i am here')
		}
	})
}