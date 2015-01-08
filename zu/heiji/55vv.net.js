var baseheiji =require("./base");
var sendZuaaWiz = require("../mymessage/zuaaEmailSender");


//http://55vv.net/mvst/2011/0714/481.html
//http://55vv.net/mvst/2013/0922/1305.html
baseheiji.readmsg("http://55vv.net/mvst/2011/0714/481.html",function($){ 
	$(".show_box_two img").each(function(index,item){ 
		console.log("http://55vv.net"+$(item).attr("src").replace("-lp",""));
			sendZuaaWiz.sendtoZuaaWiz($("title").text(),"http://55vv.net"+$(item).attr("src").replace("-lp",""))
			 sleep(5000);
	}) 
})



function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
 };
