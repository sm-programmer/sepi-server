
/** Módulo de registro de usuarios */

var pool = require("./mysql_db.js").pool;

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
			'insert into ASPIRANTE values(?,?,?,?,?,?,?,?,?,?);',
			[user.curp, user.name, user.surname1, user.surname2, user.sexo, user.address, user.colonia, user.telefono, user.codPostal, user.password],
			function(err, rows) {
				// Libera la conexión de la BD
				conn.release();
				
				// Si hay un error, muy posiblemente ya existe la entrada en la BD; apartar ese caso especial
				if (err) {
					if (err.errno == 1062 && err.sqlState == "23000") {
						res.json({
							"code": 1062,
							"status": "Ya existe un usuario registrado con la CURP proporcionada."
						});
						//res.status(200).send("<p><b>ERROR:</b> </p>");
					} else {
						res.json({
							"code": 999,
							"status": err.message || "Unknown"
						});
						//res.json(err);
					}
				} else {
					res.json({
						"code": 0,
						"status": ""
					});
					//res.status(200).send("<p>El usuario " + user.curp + " ha sido exitosamente registrado en el sistema.</p>");
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

exports.addUserToDB = addUserToDB;
