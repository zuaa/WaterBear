var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http'); 
exports.readmsg = function(url, cb) {
	try {
		http.get(url,
			function(res) {
				var bufferHelper = new BufferHelper();
				res.on('data',
					function(chunk) {
						bufferHelper.concat(chunk);
					});

				res.on('end',
					function() {
						var html = iconv.decode(bufferHelper.toBuffer(), 'UTF-8');
						var $ = cheerio.load(html);
						console.log(url + "::::" + html.length)
						cb(html);
					});
			});
	} catch (e) {
		console.log(e);
	}
}
exports.readmsgBycode = function(url, code, cb) {
	try {
		http.get(url,
			function(res) {
				var bufferHelper = new BufferHelper();
				res.on('data',
					function(chunk) {
						bufferHelper.concat(chunk);
					});

				res.on('end',
					function() {
						var html = iconv.decode(bufferHelper.toBuffer(), code);
						var $ = cheerio.load(html);
						console.log(url + "::::" + html.length)
						cb(html);
					});
			});
	} catch (e) {
		console.log(e);
	}
}