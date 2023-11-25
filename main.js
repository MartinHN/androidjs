const back = require('androidjs').back;
const path = require('path')
const fs = require('fs');
const localOnly = true;

// console.log(">>>main",mainServer)


const navInfo = { addr: "" }


function navTo(a) {
	if (a !== undefined) { navInfo.addr = a };
	console.log("navigating to", navInfo.addr, a)
	back.send("navTo", navInfo.addr)
}

// const appConf = require('./serverdist/filePaths');



var writablePath = "";
back.on("fsready", (path) => {

	writablePath = path;
	console.log("fs ready at", writablePath);
	if (!fs.existsSync(writablePath)) {
		console.error("fs path do not exists");
	}
	files = fs.readdirSync(writablePath)
	files.forEach(file => {
		console.log("    ", file);
	});

	const mainServer = require('./serverdist/mainServer');
	console.log(Object.keys(mainServer));
	mainServer.startMainServer((c) => {
		console.log("main server started");
		navTo("file:///android_asset/myapp/views/view-dist/index.html")
	})
})



back.on('appready', (appPath) => {
	// console.log("app ready at : ", appPath)
	// if (!mainServer) mainServer = require('./serverdist/mainServer');
	// files = fs.readdirSync(appPath)
	// files.forEach(file => {
	// 	console.log("    ", file);
	// });

	// const viewdist = appPath + "/serverdist/view-dist"//file:///android_asset/myapp/";
	// mainServer.setViewerHTMLBasePath(viewdist)

	// mainServer.startMainServer((conf) => {
	// 	console.log("going local", addr)
	// 	const addr = `http://0.0.0.0:${conf.serverPort}`;
	// 	navTo(addr)
	// 	back.send("appLoaded");

	// })


})



back.on("getCurrentAddr", () => {

	console.log("received getCurrentAddr");
	startSearch();
	navTo()
	// back.send("backlog",JSON.stringify(foundServ))
})

back.on("getLog", () => {
	back.send("backlog", JSON.stringify(foundServ))
})

// console.log("back is working")

let foundServ = { none: "none" }


// browse for all http services
const startSearch = () => {
	if (localOnly) return;

	const bonjourOpts = {
		multicast: true,// use udp multicasting
		// interface: '0.0.0.0', // explicitly specify a network interface. defaults to all
		// port: 5353, // set the udp port
		// ip: '224.0.0.251', // set the udp ip
		ttl: 255, // set the multicast ttl
		loopback: true, // receive your own packets
		reuseAddr: true // set the reuseAddr option when creating the socket (requires node >=0.11.13)
	}
	const bonjour = require('bonjour')(bonjourOpts)
	bonjour.find({ type: 'lumestrioMaster' }, (service) => {
		console.log('Found an Master server:', service)
		foundServ = service;
		navTo(`http://${service.referer.address}:${service.port}`)

	})

}

console.log("backend ready");//,console.log(JSON.stringify(bonjour)))


// const androidBasePath = "/storage/emulated/0/Android/data/com.androidjs.lumestrio/"



// start only once ui ready??!!??
startSearch();
// const testAddr = "https://nodejs.dev/learn/update-all-the-nodejs-dependencies-to-their-latest-version"
// navTo("https://google.com")
