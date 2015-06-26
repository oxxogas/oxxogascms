/**
 * FTP Client and Websocket server
 * Copyright 2015, by Cesar Anton Dorantes @reicek
 * under license for http://oxxogas.com
 **/

// ******************************************
//		Import configurations
// ******************************************

var config						= require('./config.json');

// ******************************************
//		NodeJS Dependencies
// ******************************************

// Serve-Static 
var serveStatic					= require('serve-static');
// Body-Parser
var bodyParser					= require('body-parser');
// Multer
var multer						= require('multer')
// Express
var express						= require('express');
var app							= express();
// Socket Server
var server						= require('http').Server(app);
// Socket.IO
var io							= require('socket.io')(server);
// FTP
var JSFtp						= require("jsftp");

// ******************************************
//		Socket.IO
// ******************************************
var webSocket;

var startServer		= function() {
    server.listen(config.express.port);
	console.log('*******************************************');
	console.log('FTP to Web Socket service online');
	console.log('Static HTML service online');
	console.log('Listening on port: '+config.express.port);
	console.log('*******************************************');
}

io.on('connection', function (socket) {
	webSocket = socket;
	// Emit test event
	webSocket.emit('test',		{ result: 'Web Socket OK' });
	webSocket.emit('socket',	{ socket: this.socket });
	// Download from FTP
	console.log('-------------------------------------------');
	console.log('Client conected, downloading from FTP');
	console.log('-------------------------------------------');
	iniciarDescargas();
});

// Run server
startServer();

// ******************************************
//		FTP Client
// ******************************************
var ftp							= new JSFtp({
	host	: "oxxogas.com",
	user	: "webdesign01.oxxogas.com",
	pass	: "webdesign01"
});
/* // Detailed server console log
ftp.setDebugMode(true);
ftp.on('jsftp_debug', function(eventType, data) {
  console.log('DEBUG: ', eventType);
  console.log(JSON.stringify(data, null, 2));
});
// */
var numeroSlides, misBilletigas, localizadorEstaciones, contacto, autoTips = "";

var	iniciarDescargas 			= function() {
	getNumeroSlides();
};

var getNumeroSlides				= function() {
	ftp.get('numeroSlides.txt', 'public/js/numeroSlides.json', function(error) {
		if (error){
			webSocket.emit('error',		{ error: error });
		} else 	{
			webSocket.emit('downloaded',	{ file: 'numeroSlides', title: "Slides" });
		};
		getMisBilletigas();
	});
};

var getMisBilletigas			= function() {
	ftp.get('misBilletigas.txt', 'public/js/misBilletigas.json', function(error) {
		if (error){
			webSocket.emit('error',		{ error: error });
		} else 	{
			webSocket.emit('downloaded',	{ file: 'misBilletigas', title: "Billetigas" });
		};
		getContacto();
	});
};

var getContacto					= function() {
	ftp.get('contacto.txt', 'public/js/contacto.json', function(error) {
		if (error){
			webSocket.emit('error',		{ error: error });
		} else 	{
			webSocket.emit('downloaded',	{ file: 'contacto', title: "Contacto" });
		};
		getAutoTips();
	});
};

var getAutoTips					= function() {
	ftp.get('autoTips.txt', 'public/js/autoTips.json', function(error) {
		if (error){
			webSocket.emit('error',		{ error: error });
		} else 	{
			webSocket.emit('downloaded',	{ file: 'autoTips', title: "Autotips" });
		};
		getLocalizadorEstaciones();
	});
};

var getLocalizadorEstaciones	= function() {
	ftp.get('localizadorEstaciones.txt', 'public/js/localizadorEstaciones.json', function(error) {
		if (error){
			webSocket.emit('error',		{ error: error });
		} else 	{
			webSocket.emit('downloaded',	{ file: 'localizadorEstaciones', title: "Estaciones" });
		};
	});
};

// ******************************************
//		Express
// ******************************************

// Data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

// End Points
// app.route('/api/add').post(add);

// Static files server
app.use(serveStatic('./public'));