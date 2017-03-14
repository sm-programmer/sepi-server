
/** Módulo auxiliar de manejo de sesiones e inicios de sesión */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var findUser = require('./lookUpLogIn.js').findUser;

var storeOptions = {
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_PORT,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database: process.env.MYSQL_DB
};

var sessionStore = new MySQLStore(storeOptions);

var overallSession = session({
	key: process.env.SESSION_KEY,
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false,
	saveUninitialized: false
});

passport.use(new LocalStrategy({
		usernameField: 'curp',
		passwordField: 'password'
	},
	function (username, password, done) {
		findUser(username, function (err, user) {
			console.log(err);
			if (err) return done(err);
			console.log(user);
			if (!user) return done(null, false);
			if (user.password != password) return done(null, false);
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.curp);
});

passport.deserializeUser(function(username, done) {
	findUser(username, function(err, user) {
		if (err) return done(err);
		done(null, user);
	});
});

exports.passport = passport;
exports.overallSession = overallSession;
