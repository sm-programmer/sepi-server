#!/usr/bin/env nodejs

var http = require('http');

var fs = require('fs');
var PDFDocument = require('pdfkit');

function handleRequest(req, res) {
	var pdf = new PDFDocument({
		size: 'LETTER',
		info: {
			title: 'SIP-1: Solicitud de inscripción a estudios de posgrado',
			author:	'SEPI ESCOM'
		}
	});

	pdf.pipe(res);

	pdf.image('img/logo_ipn_negro.jpg', 72, 72, {fit: [100, 100]});

	pdf.fontSize(16);
	pdf.text("INSTITUTO POLITÉCNICO NACIONAL", 144, 72);
	pdf.moveDown(0.1);
	pdf.fontSize(12);
	pdf.text("SECRETARÍA DE INVESTIGACIÓN Y POSGRADO");
	pdf.moveDown(0.1);
	pdf.text("SOLICITUD DE INSCRIPCIÓN A ESTUDIOS DE POSGRADO");

	pdf.text("Hello World!\nThis space for rent...");

	pdf.end();
}

var port = 8080;
var server = http.createServer(handleRequest);

server.listen(port, function() {
	console.log("Server listening on: http://localhost:%s", port);
});
