
/** Módulo de registro de usuarios */

var pool = require("./mysql_db.js").pool;
var SQLQuery = require("./SQLQuery.js").SQLQuery;

/**
 * Registra al usuario en la base de datos de alumnos.
 * @param {req} La petición HTTP que el cliente remite al servidor.
 * @param {res} La respuesta HTTP que se enviará al cliente.
 */
function addUserToDB(req, res) {
	// Consigue una conexión con la base de datos
	pool.getConnection(function(err, conn) {
		// En caso de errores, notifica al usuario
		if (err) {
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		
		// Obtén los datos del usuario de la petición HTTP
		var user = req.body;
		
		// Prepara una cadena con el contenido de la página respuesta
		var pageStr = "";
		
		// Intenta insertar al usuario en la base de datos
		conn.query(
			'insert into ASPIRANTE values(?,?,?,?,?,?,?,?,?);',
			[user.curp, user.name, user.surname1, user.surname2, user.sexo, user.address, user.colonia, user.telefono, user.codPostal],
			function(err, rows) {
				// Libera la conexión de la BD
				conn.release();
				
				// Si hay un error, muy posiblemente ya existe la entrada en la BD; apartar ese caso especial
				if (err) {
					if (err.errno == 1062 && err.sqlState == "23000") {
						res.status(200).send("<p><b>ERROR:</b> Ya existe un usuario registrado con la CURP proporcionada.</p>");
					} else {
						res.json(err);
					}
				} else {
					res.status(200).send("<p>El usuario " + user.curp + " ha sido exitosamente registrado en el sistema.</p>");
				}
				
				// Finaliza la escritura en la respuesta HTTP
				res.end();
			}
		);
		
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

/**
 * Realiza la consulta exploratoria: ¿existen filas con la CURP proporcionada por el usuario?
 * @param {conn} La conexión que se realiza a la base de datos.
 * @param {req} La petición HTTP que el cliente remite al servidor.
 * @param {res} La respuesta HTTP que el servidor envía al cliente.
 * @param {callback} Función auxiliar que obtiene los resultados de esta consulta.
 * @param {data} Datos adicionales que se necesitan en todas las transacciones.
 */
function checkIfExists(conn, req, res, callback, data) {
	conn.query(
		'select COUNT(*) as ans from ASPIRANTE where CURP = ?;',
		user.curp,
		function(err, rows) {
			// Si no hay filas con CURP idéntica, crea la entrada en la tabla
			if (rows[0].ans == 0) {
				callback(conn, req, res, null, data);
			} else {
				data += "<p><b>ERROR:</b> Ya existe un usuario con la misma CURP en el sistema.</p>";
			}
		}
	);
}

function performAdd(conn, req, res, callback, data) {
	conn.query(
		'insert into ASPIRANTE values(?,?,?,?,?,?,?,?,?);',
		[user.curp, user.name, user.surname1, user.surname2, user.sexo, user.address, user.colonia, user.telefono, user.codPostal],
		function(err, rows) {
			pageStr += "<p>El usuario " + user.curp + " ha sido exitosamente registrado en el sistema.</p>";
		}
	);
}

exports.addUserToDB = addUserToDB;
