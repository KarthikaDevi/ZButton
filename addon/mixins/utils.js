import Ember from 'ember';

export default Ember.Mixin.create({
	 didInsertElement : function(){
                var ctype = this.get('ctype'),
                    element = $(this.get('element')),
                    zcComponent = $.fn[ctype],
                    base = this;
                Ember.run.scheduleOnce("afterRender",function(){
                     var instance = zcComponent.apply(element);
                     base.set('component',instance);
                     if(base.get('eventNames') !== undefined){
                             element.bind(base.get('eventNames'),function(ev,ui){
                                 if(base.attrs.events){
                                      base.attrs.events(ev,ui);
                                 }else if(base.get('action')){
                                      base.sendAction('action',ev,ui);
                                 }
                             });
                      }
                });
        },
        willDestroyElement : function(){
                var component = this.get('component'),
                    zcComponent = $.fn[this.get('ctype')];
                if(component){
                        zcComponent.apply($(element),'destroy');
                }
        }

});
