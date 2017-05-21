const net = require('net')
const client = net.connect({port:9000},() => {
	console.log("connected to server!");
	 
		client.write("{\"tem\":\"20\",\"hum\":\"80\",\"indoor\":\"1\"}");
 
	
});
client.on('data',(data) => {
	console.log(data.toString());
	client.end();
});
client.on('end',() => {
	console.log('disconnected from server');
})