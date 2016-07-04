/* $Id$ */
(function($){
	ZComponents.userAgent = navigator.userAgent.toLowerCase();
	ZComponents.zIndex = 1000; // ZIndex can be used for components like dialog.
	ZComponents.$document = $(document);
	ZComponents.$window = $(window);
	ZComponents.keyCode = {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
	
	ZComponents.initDeferredComponents = function(componentsMap, timeout, callback){
		var base = this;
		setTimeout(function(){
			$.each(componentsMap, function(ctype, componentGroup){
				$(componentGroup).each(function(i, component){
					base._initComponent($(component), ctype);		
				});
			});
			if(callback){
				callback(componentsMap);
			}
		},(timeout ? timeout : 10000)); // Default is 10 seconds
	},
	ZComponents.init = function(container,callback,attr){
		container = container ? container : $("body");
		var attrSelector = "["+ (attr ? attr : "data-ctype")+"]", // No I18N
			uiComponents = $(attrSelector, container); 
		if(container.is(attrSelector)){
			uiComponents = $(container).add(uiComponents);
		}
		var base = this;
		if(uiComponents.length){
			ZComponents.eachAsync(uiComponents, {
				delay: 20,
				loop: function(i, ele){
					base._initComponent(ele, undefined, attr);
				},
				end: function(){
					base._end(container, uiComponents, callback);
				}
			});
		}else{
			base._end(container, uiComponents, callback);
		}
	}
	ZComponents.eachAsync = function(array,opts){ // will be modified later
		var i = 0, 
		l = array.length, 
		loop = opts.loop || function(){};
	
		ZComponents.whileAsync(
			$.extend(opts, {
				test: function(){ return i < l; },
				loop: function()
				{ 
					var val = array[i];
					return loop.call(val, i++, val);
				}
			})
		);
	}
	ZComponents.whileAsync = function(opts) // async utility from jquery
	{
		var delay = Math.abs(opts.delay) || 10,
			bulk = isNaN(opts.bulk) ? 500 : Math.abs(opts.bulk),
			test = opts.test || function(){ return true; },
			loop = opts.loop || function(){},
			end  = opts.end  || function(){};
		
		(function(){
			var t = false, 
				begin = new Date();
			while( t = test() ){
				loop();
				if( bulk === 0 || (new Date() - begin) > bulk ){
					break;
				}
			}
			if( t ){
				setTimeout(arguments.callee, delay);
			}else{
				end();
			}
		})();
	}
	ZComponents._initComponent = function(element,ctype,attr){
		attr = attr ? attr : "data-ctype"; // No I18N
		element = $(element);
		var mainParent = undefined;
		if(element.is(":hidden")){ // No I18N
			mainParent = element.parentsUntil(":visible").last().show(); // No I18N
		}
		ctype = !ctype ? element.attr(attr) : ctype;
		element[ctype]();
		if(mainParent){
			mainParent.hide();
		}
	}
	ZComponents._end = function(mainDiv, uiComponents, callback){
		$(document).trigger("componentinitialized", mainDiv); // No I18N
		if(callback){
			callback(uiComponents);
		}
	}
	ZComponents.getMetadata = function(element){
		element = $(element);
		if(element && element.length){
			element = element[0]; // $.data requires DOM element to be passed as argument.
			var metadata = $.data(element,"metadata"); // No I18N
			if(metadata){
				return metadata;
			}else{
				var object = {};
				$.each(element.attributes,function(){ // using element.attributes because element.dataset is not supported in IE 9 and 10.
					     var name = this.nodeName,
						value = this.nodeValue;
                                    if(name !== "events"){
					if(name === "data"){ // No I18N
						// Retrieving options present in data attribute as a json.
						object = $.extend({},object,ZComponents._getObject(value.indexOf("{") < 0 ? "{" + value + "}" : value)); // No I18N
					}else{
						// data-* attributes and other attributes
						name = name.match(/^data-/) ? name.replace(/^data-/,'') : name; // No I18N
						name = name.replace(/-([a-z])/g, function(g){  // No I18N
							return g[1].toUpperCase(); // replacing the hyphenated names to camelCase
						});
						object[name] = (value === "true" || value === "false") ? (value === "true") : ((value.indexOf("{") !== -1) ? ZComponents._getObject(value.indexOf("{") < 0 ? "{" + value + "}" : value) : value); // No I18N
					}		
                                    }		
				});
				$.data(element,"metadata",object); // No I18N
				return object;
			}
		}
	}
	ZComponents._getObject = function(data) {
        if(typeof data !== "string"){ // No I18N
        	return data;
        }
        var modString = data.replace(/'/g,'\"');   // No I18N 
        data = JSON.parse(modString);
        return data;
    }
	ZComponents._trigger = function(element,options,event,data){
		var prop, orig,
			callback = options[ event.type ];
		event = $.Event( event );
		event.type = (options.widgetEventPrefix ? (options.widgetEventPrefix + event.type) : ""+event.type).toLowerCase(); // No I18N
		event.target = element;
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}
		element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( element, [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
	ZComponents._changeOptions = function(options,optionName,value){
		if(optionName !== undefined && value !== undefined){
			options[optionName] = value;
		}
		else if(typeof optionName === "object"){ // No I18N
			$.each(optionName,function(index,value){
				options[index] = value;
			});
		}
		else if(optionName !== undefined && value === undefined){
			return options[optionName];
		}
		else if(optionName === undefined && value === undefined){
			return options;
		}	
	}
	ZComponents.createComponent = function(details){
		var parameters = details.parameters,
			returnValue = details.element;
		$.each(details.element,function(index,element){	// allowing multiple elements to perform same operation(initialization or method invokation) on component.
			var	element = $(element);
				data = element.data(details.componentName);
				if(!data){
					var metadata = ZComponents.getMetadata(element);
					if(metadata.override){ // handling the case where two or more components share the same set of attributes.
						var newArray = {};
						for(var obj in metadata){
							if(obj.indexOf(details.componentName) === 0){
								var result = obj.replace(details.componentName,""), // No I18N
									keyName = result[0].toLowerCase()+result.substring(1);
								newArray[keyName] = metadata[obj];
							}
						};
						metadata = newArray;
					}
					var options = $.extend(true,{},metadata.componentOptions,metadata,typeof parameters === "object" && parameters[0]); // No I18N
					if(details.baseClass){
						ZComponents._extend(details.component,details.baseClass);
					}
					options = $.extend(true, {}, (details.baseClass && details.baseClass.prototype.options) ? details.baseClass.prototype.options : {}, details.component.prototype.options, options);
					data = new details.component(element,options);
					element.data(details.componentName,data);
				}
				// Public Methods Invokation
				var array = $.map(parameters,function(value,index){
					return [value];
				});
				array = array.splice(1);
				if(parameters.length && typeof parameters[0] !== "object" && parameters[0] !== undefined && parameters[0].indexOf('_') === -1){
					try{
						returnValue = data[parameters[0]].apply(data,array);
					}catch(error){
						throw error; // method name given is not supported by this component
					}
				}
		});
		return returnValue;
	}
	ZComponents.debounce = function(callback, wait, immediate){
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate){ 
					callback.apply(context, args);
				}
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow){
				callback.apply(context, args);
			}
		};
	}
	ZComponents._extend = function(target,base){
		target.prototype = $.extend({},base.prototype,target.prototype);
		$.each(target.prototype,function(prop,value){
			if ($.type(value) === "function") { // No I18N
				target.prototype[ prop ] = (function(){
					var _super = function() {
						return base.prototype[ prop ].apply( this, arguments );
					};
					return function(){
						this._super = _super;
						return value.apply( this, arguments );
					};
				})();
			}
		});
	}
	ZComponents._on = function(element, eventNamespace, event, selector, dataObj, handler){
		element = $(element);
		if(element.length && typeof eventNamespace === 'string'){	//No I18N
			if(typeof event === 'object'){	//No I18N
				$.each(event, function(_event, _handler){
					return ZComponents._on(element, eventNamespace, _event, selector, dataObj ,_handler);
				}); 
			}else{
				eventNamespace = ZComponents._getCorrectedNamespace(eventNamespace);
				event = ZComponents._getEventsWithNamespace(event, eventNamespace);
				if(!event){
					return false;
				}
				if(typeof selector === 'object'){	//No I18N
					dataObj = selector;
					selector = undefined;
				}
				element.off(event).on(event, selector, dataObj, handler);	
			}
		}else{
			throw "Element cannot be null and eventNamespace must be a string";	//No I18N
		}
	}
	ZComponents._getCorrectedNamespace = function(namespace){
		if(typeof namespace === 'string' && namespace.length){	//No I18N
			namespace = (namespace.indexOf('.')!==-1)? namespace : '.'+ namespace;	//No I18N
			return namespace;
		}
		return '.defaultNamespace';	//No I18N
	}
	ZComponents._getEventsWithNamespace = function(event, eventNamespace){
		if(typeof event === 'string' && event.length && typeof eventNamespace === 'string'){	//No I18N
			event = event.replace(/\s+/g, ' ').split(' ').join(eventNamespace + ' ') + eventNamespace;	//No I18N
			return event;
		}
		return false;
	}
	ZComponents._off = function(element, eventNamespace, event){
		element = $(element);
		if(element.length){
			eventNamespace = ZComponents._getCorrectedNamespace(eventNamespace);
			event = ZComponents._getEventsWithNamespace(event, eventNamespace);
			element.off(event? event : eventNamespace);
			element.off(eventNamespace);	
		}
	}
	ZComponents.Browser = {
		isIE :  function(){
			return (ZComponents.userAgent.indexOf("msie") !== -1 || ZComponents.userAgent.indexOf(".net") !== -1); // No I18N
		},
		isSafari : function(){
			return (ZComponents.userAgent.indexOf("safari") !== -1 && ZComponents.userAgent.indexOf("chrome") === -1); // No I18N
		}
	}
	ZComponents.getI18NText = function(moduleName, key, defaultKeys, stringArray){
        var ii8nText = $.i18n && $.i18n(moduleName, key, stringArray);
        if((!ii8nText || ii8nText === "[noi18n] "+ key) && defaultKeys){	// No I18N
            ii8nText = defaultKeys[ key ];
            if(stringArray && defaultKeys){
                for (var i = 0; i < stringArray.length; i++) {
                    ii8nText = ii8nText.replace('{'+ i +'}',stringArray[i]);	// No I18N
                }
            }
        }
        return ii8nText;
	}
	ZComponents.create = function(){

	}

})(jQuery);
function ZComponents(){

}
ZComponents.setProperties = function(){
	var doc = document.documentElement,
		body = document.body;
	ZComponents.documentObject = {
		height: Math.max(doc.clientHeight,doc.scrollHeight,doc.offsetHeight,body.offsetHeight,body.scrollHeight),
		width: Math.max(doc.clientWidth,doc.scrollHeight,doc.offsetHeight,body.offsetWidth,body.scrollWidth)
	};
	ZComponents.windowObject = {
		height: doc.clientHeight,
		width: doc.clientWidth
	};
}
ZComponents.hasHandlebars = window.Handlebars ? true : false;
document.addEventListener("DOMContentLoaded", ZComponents.setProperties);
window.addEventListener("load", ZComponents.setProperties);
window.addEventListener("resize", ZComponents.setProperties);



// creating any components

// var createdElementInstance = ZComponents.create({
// 								ctype : "<componentName>";
// 								id : "<elementId>",
// 								options : {} // needed or simply state options itself
// 								items : {}
// 							});

// Example : 

// ZComponents.create({
// 	ctype : "zbutton",
// 	id : 'normalBtn',
// 	text : "Normal Button"
// });

// ZComponents.create({
// 	ctype : "zmenu",
// 	id : "fileMenu",
// 	disabled : "true",
// 	items : [{
// 		"label" : "Item 1",
// 		"icon" : "iconClass"
// 	},{
// 		"type" : "separator"
// 	},{
// 		"label" : "Item 2",
// 		"icon" : "iconClass",
// 		"shortcutkey" : "Cmd+O",
// 	}]
// });

ZComponents.create2 = function(initObject){
	var element,i,
		ctype = initObject.ctype;
	if(ctype === "zbutton" || ctype === "zmenubutton" || ctype === "zsplitbutton"){ // button component
		element = $("<button>");
	}else if(ctype === "zmenu"){ // menu component
		element = $("<ul>");
		for(var j in initObject.items){
			var listElement = $("<li>");
			for(var k in initObject.items[j]){
				k !== "id" && listElement.attr("data-"+k,initObject.items[j][k]);
			}
			listElement.attr("id",j.id);
			element.append(listElement);
		}
	}else if(ctype === "zdialog"){ // dialog component
		element = $("<div>");
	}else if(ctype === "zcombo"){ // combo component
		element = $("<select>");
	}
	for(i in initObject){
		if(i !== "id" && i !== "items"){
			element.attr("data-"+i,initObject[i]);
		}
	}
	element.appendTo("body");
	element.attr("id",initObject.id); // id attr is assigned separately to avoid data-id
	return element[ctype]();
}
// how to handle multi word names. 

ZComponents.create = function(initObject){
	var componentName = initObject.ctype.replace(initObject.ctype.charAt(0),""); // No I18N
	methodName = "create"+componentName.charAt(0).toUpperCase()+componentName.substring(1); // No I18N
	return ZComponents[methodName](initObject);	
}
