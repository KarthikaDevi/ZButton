import Ember from 'ember';

export default Ember.Mixin.create({
	 didInsertElement : function(){
                var ctype = this.get('ctype'),
                    element = this.get('element'),
                    zcComponent = $.fn[ctype];
                console.log(typeof zcComponent,zcComponent);
                var component = zcComponent.apply($(element));
                this.set('component',component);
        },
        willDestroyElement : function(){
                var component = this.get('component'),
                    zcComponent = $.fn[this.get('ctype')];
                if(component){
                        zcComponent.apply($(element),'destroy');
                }
        }

});
