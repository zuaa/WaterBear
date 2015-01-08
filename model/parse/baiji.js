/**
*存储所有的抓取的信息
*分配任务
*/
var mysql = require('mysql');
var CronJob = require('cron').CronJob;
///////////////////////////////////////////
var pool = mysql.createPool({
	host: 'rdsrieqqfrieqqf.mysql.rds.aliyuncs.com',
	user: 'r8j9jqmpj84rxemv',
	password: 'qegoo2014',
	database: 'r8j9jqmpj84rxemv',
	port: 3306,
	connectionLimit: 10,
	supportBigNumbers: true
});
///////////////////////////////////////////// 
exports.endTask=function(id,state){
	run(pool,"update pn_task set state = ? where id = ?",[state,id],function () {
		 
	})
} 


exports.runjob=function(cb){
	var job = new CronJob('*/10 * * * *  *', function(request, response) {
		cb();
	}, function() {
		console.log("stop")
	}, true);
}
exports.addTask2 = function(key,taskname) { 
	add_Task({"k":key,"taskname":taskname})

}
exports.addTask = function(where) { 
	add_Task(where)
}


function add_Task(where) { 
	pool.getConnection(function(err, connection) {

		var l = 0;
		for (var i in where) {
			l = l + 1;
		}
		var d = [];
		var sql = ""
		sql = sql + "insert into  pn_task" 
		sql = sql + "("
		var index = 0;
		var filses = ""
		var w = ""
		for (var i in where) {
			d[index] = where[i]
			index++;
			filses = filses + " " + i + " "
			w = w + " ? "

			if (index < l) {
				filses = filses + " , "
				w = w + " , "
			}
		}
		sql = sql + filses + ") VALUES ( " + w + " )";
		console.log(sql)
		try {
			connection.query(sql, d, function(err, data) {
				if (err) {
					console.log(err)
					connection.destroy()
				}; 
			}).on('end', function() {
				connection.destroy()
			});
		} catch (e) {

		}
	});
}
 


exports.readTask = function(taskNameOrid,cb) { 
	var sql="select * from pn_task where (state = 0  or state is null ) and( id='"+taskNameOrid+"' or taskname='"+taskNameOrid+"' )limit 0 , 1"
	var tablename="pn_task";
	try {
		pool.getConnection(function(err, connection) {
			try {
				connection.query("LOCK TABLES  " + tablename + " write ", function(err, rows, fields) {
					if (err) {
						connection.destroy()
						console.log(tablename + "write 锁失败，释放数据库连接");
					} else {
						console.log(tablename + "write 锁成功");  
						connection.query(sql, function(err1, rows1, fields1) { 
							if (err1) {  
								unlockTableAndDestroyConnection(connection )
							} else {  
								if(rows1.length>0){
				 					run(pool,"update pn_task set state = 2 where id = ?",[rows1[0].id],function (data) { 
				 						 cb(rows1);
				 					})
				 				}
							};
						}).on('end', function() {
							 unlockTableAndDestroyConnection(connection)
						});

					};
				});
			} catch (e) {}
		})
	} catch (e) {

	}
  
} ;


function run(pool,sql,d,cb) {
	pool.getConnection(function(err, connection) {  
		try {
			connection.query(sql, d, function(err, data) {
				if (err) {
					console.log(err)
					connection.destroy()
				};
				
				cb(data);
			}).on('end', function() {
				connection.destroy()
			});
		} catch (e) {

		}
	});
}

function unlockTableAndDestroyConnection(connection) {
	connection.query("UNLOCK TABLES ", function(err, rows, fields) {
		if (err) {
			connection.destroy()
		} else {
			console.log("UNLOCK TABLES 成功");
		};
	}).on('end', function() {
		connection.destroy()
	});
}
