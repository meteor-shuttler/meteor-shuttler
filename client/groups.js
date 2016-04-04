var posts = new Mongo.Collection(null, { ref: '/groups:posts' });
posts.after.remove(function(userId, post) {
	groups.links.find.source(posts._transform(post)).forEach(function(group) {
		groups.remove(group._id);
	});
	groups.links.find.target(posts._transform(post)).forEach(function(group) {
		groups.remove(group._id);
	});
});

posts.index= new EasySearch.Index({
	collection: posts,
	fields: ['_id'],
	engine: new EasySearch.Minimongo()
});

posts.helpers({
	posts() {
		return lodash.map(
			groups.links.find.source(this, lodash.merge(
				groups.selection.selectorQuery(),
				{ '_target.collection': '/groups:posts' }
			)).fetch(),
			function(group) { return group.target(); }
		);
	},
	users() {
		return lodash.map(
			groups.links.find.source(this, lodash.merge(
				groups.selection.selectorQuery(),
				{ '_target.collection': '/groups:users' }
			)).fetch(),
			function(group) { return group.target(); }
		);
	}
});

var groups = new Mongo.Collection(null, { ref: '/groups:groups' });
groups.attachGraph();
groups.selection = Shuttler.Selection(groups, { source: 'source' })
	.byPaths(groups, { sources: ['source'], targets: ['target'] })
	.watchSelections().watchPaths(groups)
	.mark('target','_groups')
	.recursionProtection()

groups.deny({
	'update': function() {
		return true;
	},
	'insert': function(userId, group) {
		if (groups.selection.isSelector(group)) {
			return !!groups.links.find(group._source, group._target, groups.selection.selectorQuery()).count();
		}
	}
});

groups.attachRestrictions();

groups.after.remove(function(userId, post) {
	posts.remove(post._target.id);
});

var users = new Mongo.Collection(null, { ref: '/groups:users' });

users.after.remove(function(userId, user) {
	groups.links.find.source(users._transform(user)).forEach(function(group) {
		groups.remove(group._id);
	});
	groups.links.find.target(users._transform(user)).forEach(function(group) {
		groups.remove(group._id);
	});
});

users.index= new EasySearch.Index({
	collection: users,
	fields: ['_id'],
	engine: new EasySearch.Minimongo()
});

Template['/groups'].helpers({
	posts: function() { return posts.find({ _groups: { $exists: false } }); },
	users: function() { return users.find(); }
});

Template['groupsInsertGroup'].events({
	'click': function() {
		if (this._id) {
			var post = posts.insert({});
			groups.link.insert(this, posts.findOne(post));
		} else {
			posts.insert({});
		}
	}
});

Template['groupsInsertUser'].events({
	'click': function() {
		if (this._id) {
		} else {
			users.insert({});
		}
	}
});

Template['groupsUser'].onRendered(function() {
	if (this.data.post) {
		
	} else {
		this.$('>.list-group-item').draggable({ revert: true });
	}
});

Template['groupsUser'].events({
	'click .shuttler-groups-user-ungroup': function() {
		groups.remove(groups.link.find(this.post, this.user)._id);
	}
});

Template['groupsGroup'].onRendered(function() {
	var post = this.data.post;
	this.$('>.list-group-item').droppable({
		accept: "[data-shuttler-groups-user]",
		greedy: true,
		drop: (event, ui) => {
			try {
				groups.link.insert(post, users.findOne(ui.draggable.attr('data-shuttler-groups-user')));
				this.$('[data-shuttler-groups-user='+ui.draggable.attr('data-shuttler-groups-user')+']').last().velocity("transition.shrinkIn");
			} catch(error) {
				this.$('[data-shuttler-groups-user='+ui.draggable.attr('data-shuttler-groups-user')+']').last().velocity("callout.tada");
			}
		},
		hoverClass: "active",
		tolerance: 'pointer'
	});
});

Template.registerHelper('groupsGroupsCollection', function() { return posts; });
Template.registerHelper('groupsUsersCollection', function() { return users; });
Template.registerHelper('groupsIndexes', function() { return [posts.index, users.index]; });