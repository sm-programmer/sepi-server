#!/usr/bin/env nodejs

/** Módulo para la puesta a punto de un servidor HTTP */

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var multer = require('multer');
var upload = multer();

var port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(logger);

// Módulo para generar objetos de tipo Text
var Text = require('./objText.js').Text;

/**
 * Muestra en la consola la petición realizada por cualquier cliente.
 * @param {req} La petición HTTP que el cliente remite al servidor.
 * @param {res} La respuesta HTTP que se enviará al cliente.
 * @param {next} Una función de encadenamiento provista internamente para ejecutar la acción deseada. */
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
	
	// Determina la posición de la X para indicar el género
	var coordSexo = (req.body.sexo == 'F') ? 104 : 153;
	
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
		new Text('X', coordSexo, 570), // Sexo
		new Text(fecha.getDate(), 96, 168), // Día
		new Text(mesTxt, 127, 168), // Mes
		new Text(fecha.getFullYear(), 152, 168) // Año
	];
	
	var datosLength = datos.length;
	
	for (var i = 0; i < datosLength; i++) {
		pdfPageCtx.writeText(datos[i].getValue(), datos[i].getX(), datos[i].getY(), inputTxtOpts);
	}

	pdfPageCtx.writeText('ESCOM', 50, 522, inputTxtOpts);
	pdfPageCtx.writeText('M. en C. en Sistemas Computacionales Móviles', 210, 522, inputTxtOpts);

	pdfPageCtx.writeText('IPN - ESCOM', 115, 456, inputTxtOpts);
	pdfPageCtx.writeText('México, D.F.', 327, 456, inputTxtOpts);
	pdfPageCtx.writeText('2010-2015', 440, 456, inputTxtOpts);

	pdfPageCtx.writeText('IPN - ESCOM', 115, 436, inputTxtOpts);
	pdfPageCtx.writeText('México, D.F.', 327, 436, inputTxtOpts);
	pdfPageCtx.writeText('2010-2015', 440, 436, inputTxtOpts);

	pdfPageCtx.writeText('X', 162, 380, inputTxtOpts);
	pdfPageCtx.writeText('X', 240, 380, inputTxtOpts);

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

app.listen(port);
console.log('Listening on port ' + port);
