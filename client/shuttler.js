Drop._theme = 'DropBootstrap';

Meteor.users.Schemas = {};

Meteor.users.Schemas.short = new SimpleSchema({
    username: {
        type: String
    },
    password: {
        type: String
    }
});

Template.registerHelper('Meteor', function() { return Meteor; });

AutoForm.hooks({
    PasswordLoginSchema: {
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            if (Meteor.users.findOne({ username: insertDoc.username })) {
                Meteor.loginWithPassword(insertDoc.username, insertDoc.password);
            } else {
                Accounts.createUser(insertDoc);
                Meteor.loginWithPassword(insertDoc.username, insertDoc.password);
            }
            this.done();
            return false;
        }
    }
});