Resolutions = new Mongo.Collection('resolutions');

if (Meteor.isClient) {
  Template.body.helpers({
    resolutions: function() {
        return Resolutions.find();
    }
  });

  Template.body.events({
      // on submit, grab the title value
     'submit .new-resolution': function(event) {
         var title = event.target.title.value;
     // insert into db collection
     Resolutions.insert({
         title: title,
         createdAt: new Date()
     });
         // eliminate value from previous field
         event.target.title.value = "";
         // return false so the page doesn't refresh
         return false;
     }
  });
  Template.resolution.events({
      'click .toggle-checked': function(){
          Resolutions.update(this._id, {$set:{checked:!this.checked}});
      },
      'click .delete': function() {
          Resolutions.remove(this._id);
      }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
