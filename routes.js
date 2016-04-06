Router.route('/', function() {
	this.render('/');
});
Router.route('/graphs', function() {
	this.render('/graphs');
});
Router.route('/selection', function() {
	this.render('/selection');
});
Router.route('/trees', function() {
	this.render('/trees');
});

Meteor.methods({
	ecmascript: function(str) {
		return str+str;
	}
});