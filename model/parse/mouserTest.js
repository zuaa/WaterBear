var mouser = require('./mouser')
console.log(1);

mouser.search("MAX232", function(data) {
 	console.log(data);
 });
