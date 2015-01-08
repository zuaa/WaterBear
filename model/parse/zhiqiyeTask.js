var element = require('./element')
var z = require('./zhiqiye');
var D = require('../zuaaDao');
var CronJob = require('cron').CronJob;

// job for server
var job = new CronJob('1 * * * *  *', function(request, response) {
	 runtask();
}, function() {
	console.log("stop")
}, true);


exports.addtask = function(key, page, pageend) {
	for (var i = page; i < pageend; i++) {
		D.insert({
			k: key,
			page: i
		}, "crm_company_task")
	}
}

function runtask() {
	var sql = "0"
	D.find({
		state: 0
	}, "crm_company_task", function(data) {
		console.log(data);
		data.forEach(function(item) {
			run(item)
			sql = sql + "," + item.id
		})
		D.runsql("update crm_company_task set state=1 where id in (" + sql + ")", "1=1", function(data) {
			console.log(data)
		})
	})
}


exports.gettask = function(cb) {

	var sql = "0"

	D.readMsgByLock("select * from crm_company_task where state =0  order by id   limit 0 , 10 ", "crm_company_task", function(data) {
		console.log(data);
		data.forEach(function(item) {
			cb(item)
			sql = sql + "," + item.id
		})
		D.runsql("update crm_company_task set state=1 where id in (" + sql + ")", "1=1", function(data) {
			console.log(data)
		})
	}) 
}



function run(d) {
	z.search(d.k, d.page, function(data) {
		data.forEach(function(item) {
			console.log(item)
			D.find({
				url: item.url
			}, "crm_company", function(rows) {
				if (rows.length < 1) {
					D.insert(item, "crm_company")
					if (item.photo != "" || item.email != "") {
						D.insert(item, "crm_company_1")
					}
				}
			})
		})
	})
}
