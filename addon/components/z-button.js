import Ember from 'ember';
import Utility from '../mixins/utils';
import layout from '../templates/components/z-button';

export default Ember.Component.extend(Utility,{
   tagName : "button",
   ctype : "zbutton",
   attributeBindings : ['data-style','disabled','data-text','data-size','data-icon','ctype','checked'],
});
