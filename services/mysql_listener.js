
/** Módulo que proporciona una interfaz orientada a eventos para operar sobre la base de datos */

var events = require("events");
var mysql_listener = new events.EventEmitter();

var addUserToDB = require("./addUserToDB.js").addUserToDB;

mysql_listener.addListener("add_user", addUserToDB);

exports.mysql_listener = mysql_listener;
