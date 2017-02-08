
/** Módulo general de manejo de BD MySQL basado en un pool de conexiones */

var mysql = require("mysql");

var pool = mysql.createPool({
	connectionLimit: process.env.MYSQL_CONNLIM,
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database: process.env.MYSQL_DB,
	debug: false
});

exports.pool = pool;
