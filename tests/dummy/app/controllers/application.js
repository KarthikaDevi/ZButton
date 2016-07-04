import Ember from 'ember';

export default Ember.Controller.extend({
	actions : {
          handleClick : function(ev,ui){
            console.log("Button Clicked");
          }
        }
});
