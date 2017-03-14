#!/usr/bin/env nodejs

/** Módulo para la puesta a punto de un servidor HTTP */

// El servidor en sí
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var multer = require('multer');
var upload = multer();

// Número de puerto de escucha
var port = 8080;

// Métodos permitidos para enviar datos por formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Punto de montaje para servir archivos estáticos
app.use(express.static(__dirname + '/public'));

// Uso de una bitácora
app.use(logger);

// Módulo para leer del servidor archivos JSON
var jsonfile = require("jsonfile");

// Utilizar EJS para permitir maquetado vía plantillas (como en JSP)
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Ruta relativa donde se encuentran los servicios implementados por el servidor
var _servdir = './services/';

// Módulo para generar objetos de tipo Text
var Text = require(_servdir + 'objText.js').Text;

// Centinela que responde a emisión de eventos de manipulación de la BD
var mysql_listener = require(_servdir + 'mysql_listener.js').mysql_listener;

// Módulo que permite acceder al sistema de archivos del servidor
var fs = require('fs');

// Módulo que permite implementar inicios de sesión
var sessions = require(_servdir + 'sessions.js');
var passport = sessions.passport;
var overallSession = sessions.overallSession;
var conEnsLog = require('connect-ensure-login');

app.use(overallSession);
app.use(passport.initialize());
app.use(passport.session());

/**
 * Muestra en la consola la petición realizada por cualquier cliente.
 * @param {req} La petición HTTP que el cliente remite al servidor.
 * @param {res} La respuesta HTTP que se enviará al cliente.
 * @param {next} Una función de encadenamiento provista internamente para ejecutar la acción deseada.
 */
function logger(req, res, next) {
	console.log('Request from: ' + req.ip + ' For: ' + req.path);
	next();
}

app.post('/generatePDF', upload.array(), function(req, res) {
	res.writeHead(200, {'Content-Type': 'application/pdf'});

	var hummus = require('hummus');

	var pdfWriter = hummus.createWriterToModify(
		new hummus.PDFRStreamForFile(__dirname + '/templates/sip01.pdf'),
		new hummus.PDFStreamForResponse(res)
	);

	var inputFont = pdfWriter.getFontForFile(__dirname + '/fonts/Arial_Bold.ttf');
	var inputFntSize = 11;
	var inputTxtOpts = {font:inputFont, size: inputFntSize, colorspace: 'gray', color: 0x00};

	var pdfPage = new hummus.PDFPageModifier(pdfWriter, 0);
	var pdfPageCtx = pdfPage.startContext().getContext();

	var startX01 = 50;

	var apPat = req.body.surname1;
	var apMat = req.body.surname2;
	var nombre = req.body.name;

	var sizeApPat = inputFont.calculateTextDimensions(apPat, inputFntSize);
	var sizeApMat = inputFont.calculateTextDimensions(apMat, inputFntSize);
	var sizeNom = inputFont.calculateTextDimensions(nombre, inputFntSize);

	var pxApPat = startX01;
	var pxApMat = pxApPat + sizeApPat.width + 20;
	var pxNom = pxApMat + sizeApMat.width + 20;
	
	// Determina la posición X para indicar el género y modalidad de estudio
	var coordSexo = (req.body.sexo == 'F') ? 104 : 153;
  var coordEstu = (req.body.statusPrg == "TP") ? 240 : 162;
	
	// Obtén la fecha actual DEL SERVIDOR
	var fecha = new Date();
	var mesTxt = fecha.getMonth() + 1;
	mesTxt = (mesTxt < 10) ? '0' + mesTxt : '' + mesTxt;
	
	var datos = [
		new Text(apPat, pxApPat, 640),
		new Text(apMat, pxApMat, 640),
		new Text(nombre, pxNom, 640),
		new Text(req.body.address, 105, 610),
		new Text(req.body.colonia, 100, 590),
		new Text(req.body.codPostal, 510, 590),
		new Text(req.body.telefono, 477, 610),
		new Text(req.body.email, 310, 570),
		new Text('X', coordSexo, 570),          // Sexo
    new Text(req.body.instNs, 115, 456),    // Institución NS
    new Text(req.body.placeNs, 327, 456),   // Lugar NS
    new Text(req.body.periodNs, 440, 456),  // Periodo NS
    new Text(req.body.instPg, 115, 436),    // Inst. posgrado
    new Text(req.body.placePg, 327, 436),   // Lugar posgrado
    new Text(req.body.periodPg, 440, 436),  // Periodo posgrado
    new Text('X', coordEstu, 380),          // Modalidad de estudio
		new Text(fecha.getDate(), 96, 168),     // Día
		new Text(mesTxt, 127, 168),             // Mes
		new Text(fecha.getFullYear(), 152, 168) // Año
	];
	
	var datosLength = datos.length;
	
	for (var i = 0; i < datosLength; i++) {
		pdfPageCtx.writeText(datos[i].getValue(), datos[i].getX(), datos[i].getY(), inputTxtOpts);
	}

	pdfPageCtx.writeText('ESCOM', 50, 522, inputTxtOpts);
	pdfPageCtx.writeText('M. en C. en Sistemas Computacionales Móviles', 210, 522, inputTxtOpts);

	var clave = "011A6264";
	for (var i = 0; i < clave.length; i++) {
		pdfPageCtx.writeText(clave[i], 44 + 12 * i, 332, inputTxtOpts);
	}

	pdfPageCtx.writeText('Sistemas en Tiempo Real', 140, 332, inputTxtOpts);
	pdfPageCtx.writeText('Sin Asignar', 333, 332, inputTxtOpts);
	pdfPageCtx.writeText('IPN - ESCOM', 447, 332, inputTxtOpts);

	pdfPage.endContext().writePage();
	pdfWriter.end();

	res.end();
});

/**
 * Obtiene los nombres de los archivos de un directorio determinado.
 * @param {dir} El directorio a revisar.
 * @param {filelist} Una lista sobre la cual se agregarán los archivos encontrados.
 */
function walkSync(dir, filelist) {
	var files = fs.readdirSync(dir);
	
	filelist = filelist || [];
	
	files.forEach(function (file) {
		if (fs.statSync(dir + file).isDirectory()) {
			filelist = walkSync(dir + file + '/', filelist);
		} else {
			filelist.push(file);
		}
	});
	
	return filelist;
}

/**
 * Asigna a varias direcciones la muestra de archivos JSON maquetados.
 */
function assignJsonPages() {
	const dirPath = __dirname + '/views/json/';
	
	var jsonFiles = walkSync(dirPath, []);
	
	jsonFiles.forEach(file => {
		fileName = file.split(".")[0];
		
		app.get('/' + fileName + ".html", function(req, res) {
			jsonfile.readFile(dirPath + file, function(err, obj) {
				res.render("general", obj);
			});
		});
	});
}

// Procesar las peticiones de inserción de usuarios
app.post('/signUp', upload.array(), function(req, res) {
	mysql_listener.emit("add_user", req, res);
});

// Procesar las peticiones de inicios de sesión
app.post('/login', passport.authenticate('local', { failureRedirect: '/login.html' }), function(req, res) {
	res.redirect('/');
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

//app.get('/profile', conEnsLog.ensureLoggedIn('/login.html'), function(req, res) {
//	res.json(req.user);
//});

assignJsonPages();

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

app.listen(port);
console.log('Listening on port ' + port);
