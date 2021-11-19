const back = require('androidjs').back;
const path = require('path')
const fs = require('fs')
const localOnly = true;

// console.log(">>>main",mainServer)


const navInfo = {addr : ""}


function navTo(a){
	if(a!==undefined){navInfo.addr=a};
	console.log("navigating to",navInfo.addr,a)
	back.send("navTo",navInfo.addr)
}

const appConf = require('./serverdist/filePaths');



back.on("fsready",(writablePath)=>{
console.log("app ready",writablePath);
const conf = require('./serverdist/config').default;
appConf.setRWBasePath(writablePath)
})



back.on('appready',(appPath)=>{
	console.log("app ready at : ",appPath)
	files = fs.readdirSync(appPath)
	files.forEach(file => {
		console.log("    ",file);
	});
	
	const viewdist = appPath+"/serverdist/view-dist"//file:///android_asset/myapp/";
	appConf.setViewerHTMLBasePath(viewdist)

	const mainServer = require('./serverdist/mainServer');
	mainServer.startMainServer((conf)=>{
		const addr = `http://0.0.0.0:${conf.serverPort}`;
	console.log("going local", addr)
	navTo(addr)
	back.send("appLoaded");

	})
	
})



back.on("getCurrentAddr",()=>{

	console.log("received getCurrentAddr");
	startSearch();
	navTo()
	// back.send("backlog",JSON.stringify(foundServ))
})

back.on("getLog",()=>{
	back.send("backlog",JSON.stringify(foundServ))
})

// console.log("back is working")

let foundServ = {none:"none"}


// browse for all http services
const startSearch = ()=>{
	if(localOnly)return;

const bonjourOpts={
	multicast: true ,// use udp multicasting
	// interface: '0.0.0.0', // explicitly specify a network interface. defaults to all
	// port: 5353, // set the udp port
	// ip: '224.0.0.251', // set the udp ip
	ttl: 255, // set the multicast ttl
	loopback: true, // receive your own packets
	reuseAddr: true // set the reuseAddr option when creating the socket (requires node >=0.11.13)
  }
const bonjour = require('bonjour')(bonjourOpts)
bonjour.find({ type: 'lumestrioMaster' },  (service) =>{
	console.log('Found an Master server:', service)
	foundServ=service;
	navTo( `http://${service.referer.address}:${service.port}`)
	
})
}

console.log("backend ready");//,console.log(JSON.stringify(bonjour)))
// start only once ui ready??!!??
startSearch();
// const testAddr = "https://nodejs.dev/learn/update-all-the-nodejs-dependencies-to-their-latest-version"
// navTo("https://google.com")
