Resolutions = new Mongo.Collection('resolutions');

if (Meteor.isClient) {
    Meteor.subscribe("resolutions");

  Template.body.helpers({
    resolutions: function() {
        if(Session.get('hideFinished')) {
            return Resolutions.find({checked:{$ne:true}});
        } else {
            return Resolutions.find();
        }
    },
      hideFinished: function() {
          return Session.get('hideFinished');
      }
  });
  Template.resolution.helpers({
      'isOwner': function () {
          return this.owner === Meteor.userId();
      }
  });
  Template.body.events({
      // on submit, grab the title value
     'submit .new-resolution': function(event) {
         var title = event.target.title.value;
     // insert into db collection
     Meteor.call("addResolution",title);
         // eliminate value from previous field
         event.target.title.value = "";
         // return false so the page doesn't refresh
         return false;
     },
      // store hideFinished value in session
      'change .hide-finished': function(event) {
          Session.set('hideFinished',event.target.checked );
      }
  });
  Template.resolution.events({
      'click .toggle-checked': function(){
          Meteor.call("updateResolution",this._id, !this.checked);
      },
      'click .delete': function() {
          Meteor.call("deleteResolution", this._id);
      },
      'click .toggle-private': function(){
          Meteor.call("setPrivate",this._id, !this.private);
      },
  });

    Accounts.ui.config({
        passwordSignupFields:"USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish("resolutions",function(){
        return Resolutions.find();
    });
}

//add, delete, update securely
Meteor.methods({
    addResolution: function(title){
        Resolutions.insert({
            title: title,
            createdAt: new Date(),
            owner:Meteor.userId()
        });
    },
    deleteResolution: function (id) {
        Resolutions.remove(id);
    },
    updateResolution: function (id, checked) {
        Resolutions.update(id, {$set:{checked:checked}});
    },
    setPrivate: function (id, private) {
        var res = Resolutions.findOne(id);
        if (res.owner !== Meteor.userId()) {
            throw new Meteor.Error('Not Authorized');
        }
        Resolutions.update(id, {$set:{private:private}});
    }
    
});
