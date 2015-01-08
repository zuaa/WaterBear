
var nodegrass = require('nodegrass');

 nodegrass.get("http://www.mouser.cn/Search/Refine.aspx?Keyword=max232",function(data,status,headers){
     console.log(status);
     console.log(headers);
     console.log(data);
},'utf-8').on('error', function(e) {
     console.log("Got error: " + e.message);
});



