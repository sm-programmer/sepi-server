
/** Archivo de prueba para la base de datos */

var express = require("express");
var mysql = require("mysql");
var app = express();

var pool = mysql.createPool({
	connectionLimit: process.env.MYSQL_CONNLIM,
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database: process.env.MYSQL_DB,
	debug: false
});

/**
 * Función que se comunica con la base de datos.
 * @param {req} La petición HTTP con los datos a manejar.
 * @param {res} La respuesta HTTP a utilizar una vez completada la acción.
 */
function handle_database(req, res) {
	// Consigue una conexión con la base de datos
	pool.getConnection(function(err, conn) {
		// Avisa en caso de error
		if (err) {
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}

		console.log("Connection performed! Assn. ID: " + conn.threadId);

		// Ejecuta una sentencia determinada (prueba)
		conn.query("show tables", function(err, rows) {
			conn.release();
			if (!err) {
				res.json(rows);
			}
		});

		// En caso de haber un error, notifícalo
		conn.on('error', function(err) {
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		});
	});
}

app.get("/", function(req, res) {
	handle_database(req, res);
});

app.listen(3000);

console.log("App started and listening on port 3000!");
