var email = require("emailjs");
var mysql = require('mysql');
var schedule = require('node-schedule');
//数据库配置
var conn = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'nodemysql',
	port:3306
})
//连接数据库
conn.connect();

//配置邮箱
var server = email.server.connect({
	user: "@139.com",
	password:"",
	host:"smtp.139.com",
	ssl:true
});
//每分钟第十秒的时候检测
var rule = new schedule.RecurrenceRule();
rule.second = 10;
var j = schedule.scheduleJob(rule,function(){
    conn.query('SELECT * FROM pet',function(err,rows,fields){
	 	var tem = rows[rows.length-1].tem;
	 	var indoor = rows[rows.length-1].indoor;
	 	var temmsg = {
	 		text:"tempreture is " + tem + ",please  be careful",
	 		from: "@139.com",//发送方
	 		to:"605747907@qq.com",//接收方
	 		subject:"PetHose tem"
	 	};
	  	var indoormsg = {
	 		text:"Pet is not in the home  , please be careful",
	 		from: "@139.com",//发送方
	 		to:"605747907@qq.com",//接收方
	 		subject:"PetHose indoor"
	 	};
	 		
	 	if(tem>=30){
	 		server.send(temmsg,function(err,message){
	 			console.log(err || "ok");
	 		});
	 	}
	 	if(indoor == 0){
	 		server.send(indoormsg,function(err,message){
	 			console.log(err || "ok")
	 		});
	 	};
	});
});