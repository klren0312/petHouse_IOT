/*
{"Red_Led":0,
"Green_Led":0,
"Yellow_Led":0,
"Blue_Led":0,"beep":0,
"temperature":20.000000,
"humidity":42.000000,
"Xg":0.936000,
"Yg":0.963300,
"Zg":0.003900,
"errType":2}
 */

var net = require('net')
var mysql = require('mysql');
var conn = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'nodemysql',
	port:3306
});

conn.connect();

net.createServer(function(socket){
	socket.on('data',function(data){
		console.log('got:',data.toString());

		var text =JSON.parse(data.toString());
		var arr = {};

		arr.tem = text.temperature;
		arr.hum = text.humidity;
		arr.indoor = text.Red_Led;
		arr.time = new Date().toLocaleString();
		arr.x = text.Xg;
		arr.y = text.Yg;
		arr.z = text.Zg;
		conn.query('DELETE FROM pet WHERE id NOT IN ( SELECT id FROM ( SELECT id FROM pet ORDER BY id DESC LIMIT 5 ) foo )',function(error,result,fields){
			if (error) throw error;
		})
		conn.query('INSERT INTO pet SET ?', arr, function(error,result,fields){
			if (error) throw error;
		});

	});
	socket.on('end',function(data){
		console.log('end');
	});
	socket.write('Ready to receive your message!')
	 
}).listen(4001);

