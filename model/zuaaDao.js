var mysql = require('mysql');
///////////////////////////////////////////
var pool = mysql.createPool({
	host: 'rds3qmfin3qmfin.mysql.rds.aliyuncs.com',
	user: 'db24z2f7wjl7cpfj',
	password: 'aaaaaaaa',
	database: 'db24z2f7wjl7cpfj',
	port: 3306,
	connectionLimit: 10,
	supportBigNumbers: true
});

exports.readMsgByLock = function(sql, tablename, cb) {
	try {
		pool.getConnection(function(err, connection) {
			try {
				connection.query("LOCK TABLES  " + tablename + " write ", function(err, rows, fields) {
					if (err) {
						connection.destroy()
						console.log(tablename + "write 锁失败，释放数据库连接");
					} else {
						console.log(tablename + "write 锁成功");
						console.log( sql); 
						connection.query(sql, function(err1, rows1, fields1) { 
							if (err1) {  
								unlockTableAndDestroyConnection(connection )
							} else { 
								cb(rows1)
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

exports.readMsg = function(sql) {

		try {
			pool.getConnection(function(err, connection) {
				try {
					connection.query(sql, function(err, rows, fields) {
						if (err) {
							connection.destroy()
						} else {
							//console.log(rows)
						};
					}).on('end', function() {
						connection.destroy()
					});
				} catch (e) {}
			})
		} catch (e) {

		}
	}
	///////////////////////////////////////////////
exports.find = function(where, table_name, cb) {
	pool.getConnection(function(err, connection) {
		var sql = ""
		sql = sql + "select * from " + table_name
		sql = sql + " where  "
		var index = 0;
		for (var i in where) {
			val = where[i];
			if (index == 0) {
				sql = sql + i + "=" + "'" + val + "'"
			} else {
				sql = " and "
				sql + i + "=" + "'" + val + "'"
			}
			index = index + 1;
		}
		sql = sql + " limit 10";
		//	 console.log(sql);
		try {
			connection.query(sql, function(err, rows, fields) {
				if (err) {
					connection.destroy()
				};
				//console.log('The solution is: ', rows.length);
				cb(rows);
			}).on('end', function() {
				connection.destroy()
			});
		} catch (e) {

		}
	})
}

exports.list = function(where, table_name, page, size, cb) {
	pool.getConnection(function(err, connection) {
		var sql = ""
		sql = sql + "select * from " + table_name
		if (where != null) {
			var index = 0;
			for (var i in where) {
				val = where[i];
				if (index == 0) {
					sql = sql + " where  "
					sql = sql + i + "=" + "'" + val + "'"
				} else {
					sql = " and "
					sql + i + "=" + "'" + val + "'"
				}
				index = index + 1;
			}
		}
		sql = sql + " limit " + (page - 1) * size + " , " + size;
		//		console.log(sql)
		try {
			connection.query(sql, function(err, rows, fields) {
				if (err) {
					connection.destroy()
				};
				cb(rows);
			}).on('end', function() {
				connection.destroy()
			});
		} catch (e) {

		}
	})
}


exports.count = function(where, table_name, size, cb) {
	pool.getConnection(function(err, connection) {
		var sql = ""
		sql = sql + "select count(1) as count from " + table_name
		if (where != null) {
			var index = 0;
			for (var i in where) {
				val = where[i];
				if (index == 0) {
					sql = sql + " where  "
					sql = sql + i + "=" + "'" + val + "'"
				} else {
					sql = " and "
					sql + i + "=" + "'" + val + "'"
				}
				index = index + 1;
			}
		}
		//		console.log(sql)
		try {
			connection.query(sql, function(err, rows, fields) {
				if (err) {
					connection.destroy()
				};
				rows[0].size = size;
				rows[0].totle = rows[0].count;
				rows[0].pages = (Math.floor((parseInt(rows[0].count) - 1) / size) + 1);
				cb(rows);
			}).on('end', function() {
				connection.destroy()
			});
		} catch (e) {

		}
	})
}

exports.insert = function(where, table_name) {
	pool.getConnection(function(err, connection) {

		var l = 0;
		for (var i in where) {
			l = l + 1;
		}
		var d = [];
		var sql = ""
		sql = sql + "insert into  " + table_name
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
		try {
			connection.query(sql, d, function(err, data) {
				if (err) {
					console.log(err)
					connection.destroy()
				};
				//console.log('The r is: ', data);
			}).on('end', function() {
				connection.destroy()
			});
		} catch (e) {

		}
	});
}



exports.runsql = function(sql, d, cb) {
	pool.getConnection(function(err, connection) {

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