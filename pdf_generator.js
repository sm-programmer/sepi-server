#!/usr/bin/env nodejs

/** Módulo para la generación de archivos PDF */

var hummus = require('hummus');

/**
 * Genera un archivo PDF a partir de una petición HTTP, y regresa el resultado como una respuesta HTTP.
 * @param {req} La petición HTTP que contiene la información para generar el archivo PDF.
 * @param {res} La respuesta HTTP que se utilizará para entregar el archivo PDF.
 */
function generatePDF(req, res) {
	res.writeHead(200, {'Content-Type': 'application/pdf'});
	
	var templateFile = "";
	
	// Determina el tipo de documento a generar
	switch (req.body.docType) {
		// Solicitud de inscripción
		case 1:
			templateFile = __dirname + '/templates/sip01.pdf';
			
			break;
	}
	
	var pdfWriter = hummus.createWriterToModify(
		new hummus.PDFRStreamForFile(templateFile),
		new hummus.PDFStreamForResponse(res)
	);
	
	pdfWriter.end();
	
	res.end();
}
