var nodemailer = require("nodemailer");
var async = require('async')


function sendMail(smtpTransport, to, subject, html, cb) {
	smtpTransport.sendMail({
		from: "zuaa <zuaa-q@163.com>", // 发件地址
		to: to,
		subject: subject,
		html: html
	}, function(error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log("Message sent: " + response.message);
			cb()
		}

	});
}

exports.sendtoZuaaWiz = function(subject, msglist) {
	//xuping@mywiz.cn
	var to = "xuping@mywiz.cn"
	var smtpTransport = nodemailer.createTransport("SMTP", {
		host: "smtp.163.com", // 主机
		secureConnection: true, // 使用 SSL
		port: 465, // SMTP 端口
		auth: {
			user: "zuaa-q@163.com", // 账号
			pass: "seedcat" // 密码
		}
	});
	sendMail(smtpTransport, "xuping@mywiz.cn", subject, msglist, function() { 
		smtpTransport.close(); // 如果没用，关闭连接池 
	})

}