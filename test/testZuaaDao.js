// /readMsgByLock
var D = require('../model/zuaaDao');

D.readMsgByLock("select * from crm_company_task order by id desc limit 0 , 10 ", "crm_company_task",function(data){
	console.log(data);
})




