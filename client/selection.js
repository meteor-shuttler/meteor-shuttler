var editor = new Shuttler.Editor();

var counter = 1;

var white = new Mongo.Collection(null, { ref: '/selection:white' });
white.attachSchema(new SimpleSchema({ _id: { type: String, autoValue: function() { if (this.isInsert) return String(counter++); } } }));
editor.queries.insert({ collection: '/selection:white', color: 'white', name: 'white', query: {} });

var black = new Mongo.Collection(null, { ref: '/selection:black' });
black.attachSchema(new SimpleSchema({ _id: { type: String, autoValue: function() { if (this.isInsert) return String(counter++); } } }));
editor.queries.insert({ collection: '/selection:black', color: 'black', name: 'black', query: {} });

var blue = new Mongo.Collection(null, { ref: '/selection:blue' });
blue.attachSchema(new SimpleSchema({ _id: { type: String, autoValue: function() { if (this.isInsert) return String(counter++); } } }));
blue.attachGraph();
editor.queries.insert({ collection: '/selection:blue', color: '#4975DC', name: 'blue', query: {} });

var green = new Mongo.Collection(null, { ref: '/selection:green' });
green.attachSchema(new SimpleSchema({ _id: { type: String, autoValue: function() { if (this.isInsert) return String(counter++); } } }));
green.attachGraph();
editor.queries.insert({ collection: '/selection:green', color: 'green', name: 'green', query: {} });
green.selection = Shuttler.Selection(green, { source: 'source' })
	.byPaths(green, { sources: ['source'], targets: ['target'] })
	.watchSelections().watchPaths(green)
	.recursionProtection()

var red = new Mongo.Collection(null, { ref: '/selection:red' });
red.attachSchema(new SimpleSchema({ _id: { type: String, autoValue: function() { if (this.isInsert) return String(counter++); } } }));
red.attachGraph();
editor.queries.insert({ collection: '/selection:red', color: 'red', name: 'red', query: {} });
red.selection = Shuttler.Selection(red, { source: 'source' })
	.byPaths(blue, { sources: ['source'], targets: ['target'] })
	.watchSelections().watchPaths(blue)
	.recursionProtection()

green.deny({
    selection: function(target, prev, from, path, selector, selection) {
        return !!red.link.find.target(target);
    }
});

red.after.unlink.target(function(userId, unlinked, linked, fieldNames, modifier, options) {
	if (red.selection.isSelected(unlinked) && !red.links.find.target(unlinked._target).count()) {
		green.selection.selectTarget(unlinked.target());
	}
});

red.after.link.target(function(userId, unlinked, linked, fieldNames, modifier, options) {
	if (red.selection.isSelected(linked)) {
		green.selection.unselectTarget(linked.target());
	}
});

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

Template['/selection'].onRendered(function() {
	lodash.each(editor.queries.find().fetch(), function(query) {
		window[query.name] = Shuttler.collection(query.collection);
	});
});
Template['/selection'].onDestroyed(function() {
	lodash.each(editor.queries.find().fetch(), function(name) {
		delete window[name];
	});
});
Template['/selection'].helpers({
	editor: function() { return editor; }
});