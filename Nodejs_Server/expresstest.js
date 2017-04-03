var express = require('express');
var mysql = require('mysql');
app = express();

//数据库配置
var conn = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'nodemysql',
	port:3306
});
//连接数据库
conn.connect();

//设置所有路由无限制访问，不需要跨域
app.all('*',function(req,res,next){
 	res.header("Access-Control-Allow-Origin","*");
 	res.header("Access-Control-Allow-Headers","X-Requested-With");
 	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
 	res.header("X-Powered-By",'3.2.1');
 	res.header("Content-Type","application/json;charset=utf-8");
 	next();
})

 
//温度
app.get('/tem',function(req,res){
	var tem = [];
	conn.query('SELECT * FROM pet',function(err,rows,fields){
		var i = rows.length;
		var j =i-5;
		var c= 0;
		while(j < i ){
			tem[c] = rows[j].tem;
			c++;
			j++;
		}
		res.send(JSON.stringify(tem));
	})
})
//湿度
app.get('/hum',function(req,res) {
	var hum = [];
	conn.query('SELECT * FROM pet',function(err,rows,fields){
		var i = rows.length;
		var j =i-5;
		var c= 0;
		while(j<i){
			hum[c] = rows[j].hum;
			c++;
			j++;
		}
		res.send(JSON.stringify(hum));
	})
	 
});
//宠物室内室外
app.get('/indoor',function(req,res) {
	var indoor = [];
	conn.query('SELECT * FROM pet',function(err,rows,fields){
		var i = rows.length;
		var j =i-5;
		var c= 0;
		while(j<i){
			indoor[c] = rows[j].indoor;
			c++;
			j++;
		}
		res.send(JSON.stringify(indoor));
	})
	 
});
//时间推送
app.get('/time',function(req,res){
	var time = [];
	conn.query('SELECT * FROM pet',function(err,rows,fields){
		var i = rows.length;
		var j = i - 5;
		var c = 0 ;
		while(j<i){
			var timeorigin= rows[j].time;
			var timeafter= timeorigin.split(" ");
			time[c] = timeafter[1];
			c++;
			j++;
		}

		res.send(JSON.stringify(time));
	})
})
//手表推送
app.get('/watch',function(req,res){
	var tem = [];
	conn.query('SELECT * FROM pet',function(err,rows,fields){
		var indoor;
		if (rows[rows.length-1].indoor == 1) {
			indoor = "在";
		}else{
			indoor = "不";
		}

		var tem = "{ \"temhum\" :" + "\"" + rows[rows.length-1].tem +" "+indoor 
		+" "+ rows[rows.length-1].hum +  "\""  + "}";
		res.send(tem);
	})
})
//端口：3000
var server = app.listen(3000,function(){
 

	console.log("127.0.0.1:3000");
})
