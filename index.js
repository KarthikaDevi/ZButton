/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-zbutton',
  included : function(app){
    this._super.included(app);
    app.import("vendor/js/zcomponents.js");
    app.import("vendor/js/zbutton.js");
    app.import("vendor/css/zbutton.css");
   
  }
};
