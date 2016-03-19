var editor = new Shuttler.Editor();

var counter = 1;

var white = new Mongo.Collection(null, { ref: '/graphs:white' });
white.attachSchema(new SimpleSchema({ _id: { type: String, autoValue: function() { if (this.isInsert) return String(counter++); } } }));
editor.queries.insert({ collection: '/graphs:white', color: 'white', name: 'white', query: {} });

var black = new Mongo.Collection(null, { ref: '/graphs:black' });
black.attachSchema(new SimpleSchema({ _id: { type: String, autoValue: function() { if (this.isInsert) return String(counter++); } } }));
editor.queries.insert({ collection: '/graphs:black', color: 'black', name: 'black', query: {} });

var blue = new Mongo.Collection(null, { ref: '/graphs:blue' });
blue.attachSchema(new SimpleSchema({ _id: { type: String, autoValue: function() { if (this.isInsert) return String(counter++); } } }));
blue.attachGraph();
editor.queries.insert({ collection: '/graphs:blue', color: '#4975DC', name: 'blue', query: {} });

var green = new Mongo.Collection(null, { ref: '/graphs:green' });
green.attachSchema(new SimpleSchema({ _id: { type: String, autoValue: function() { if (this.isInsert) return String(counter++); } } }));
green.attachGraph();
editor.queries.insert({ collection: '/graphs:green', color: 'green', name: 'green', query: {} });

var red = new Mongo.Collection(null, { ref: '/graphs:red' });
red.attachSchema(new SimpleSchema({ _id: { type: String, autoValue: function() { if (this.isInsert) return String(counter++); } } }));
red.attachGraph();
editor.queries.insert({ collection: '/graphs:red', color: 'red', name: 'red', query: {} });

white.insert({});
white.insert({});
white.insert({});
white.insert({});
white.insert({});

black.insert({});
black.insert({});
black.insert({});
black.insert({});
black.insert({});

blue.link.insert(white.find().fetch()[2], black.find().fetch()[1]);
red.link.insert(black.find().fetch()[1], black.find().fetch()[4]);
green.link.insert(white.find().fetch()[3], white.find().fetch()[0]);

Template['/graphs'].onRendered(function() {
	lodash.each(editor.queries.find().fetch(), function(query) {
		window[query.name] = Shuttler.collection(query.collection);
	});
});
Template['/graphs'].onDestroyed(function() {
	lodash.each(editor.queries.find().fetch(), function(name) {
		delete window[name];
	});
});
Template['/graphs'].helpers({
	editor: function() { return editor; }
});