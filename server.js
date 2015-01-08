var express = require('express')
var app = express();
var path = require('path');
var digikey = require('./model/parse/digikey')
var mouser = require('./model/parse/mouser')
var element = require('./model/parse/element')
//var rsOnline =require('./model/parse/rsOnline')
app.configure(function() {
	app.set('port', 18080);
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('waterbear'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.errorHandler());
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.cookieParser('waterbearcookie'));  
app.use(express.session({ cookie: { maxAge: 2 * 60 * 1000 } , secret: "waterbearsecretkey" }));
app.get('/searchmouser', function(request, response) {
	mouser.search(request.param("name").toLowerCase(), function(data) {
		response.json(data);
	})
})
app.get('/searchdigikey', function(request, response) {
	digikey.search(request.param("name"), function(data) {
		response.json(data);
	})
})
app.get('/searchelement', function(request, response) {
	element.search(request.param("name"), function(data) {
		response.json(data);
	})
})
app.listen(18080);
