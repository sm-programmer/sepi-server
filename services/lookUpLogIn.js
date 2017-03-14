
/** Módulo que compara de la base de datos las credenciales de inicio de sesión */

var pool = require("./mysql_db.js").pool;

/**
 * Busca los datos de inicio de sesión de un usuario en una base de datos.
 * @param {username} El nombre de usuario (CURP) a buscar.
 * @param {done} Función que tratará los errores o datos obtenidos de la consulta.
 */
function findUser(username, done) {
	pool.getConnection(function(err, conn) {
		// En caso de errores, notifica al usuario
		if (err) {
			done(new Error("Error in connection database"));
			return;
		}
		
		// Busca al usuario en la base de datos (por ahora sólo aspirante)
		conn.query(
			'select Contra as pwd from ASPIRANTE where CURP = ?;',
			[ username ],
			function (err, rows) {
				// Libera la conexión de la BD
				conn.release();
				
				// Cualquier error que se de se reporta como llega
				if (err) {
					done(new Error(err.message || "Unknown"));
					return;
				}
				
				console.log(rows);
				
				// Si se recibe el arreglo vacío, entonces no existe el usuario: eso es un error
				if (!rows.length) {
					done(new Error('El usuario ' + username + ' no está registrado.'));
				} else {
					done(null, { curp: username, password: rows[0].pwd });
				}
			}
		);
		
		// En caso de haber un error, notifícalo
		conn.on('error', function(err) {
			done(new Error("Error in connection database"));
			return;
		});
	});
}

exports.findUser = findUser;
