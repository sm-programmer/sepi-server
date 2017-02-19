
/** Módulo que define el objeto Text */

var Text = function(value, x, y) {
	this.value = value;
	this.x = x;
	this.y = y;
};

Text.prototype.getValue = function() {
	return this.value;
}

Text.prototype.getX = function() {
	return this.x;
}

Text.prototype.getY = function() {
	return this.y;
}

exports.Text = Text;
