/* $Id$ */
(function($){

	var ZButton = function(element,options){
		this._init(element,options);
	}
	ZButton.prototype = {
		options : {
			"style" : "normal", // No I18N
			"text" : undefined, // No I18N
			"icon" : undefined, // No I18N
			"size" : undefined, // No I18N
			"disabled" : false, // No I18N
			"checked" : false, // No I18N
			"loading" : false,  // No I18N -- true|false| {"text":"loading text","icon":"iconClass|svgIcon"}
			"widgetEventPrefix" : "zbutton", // No I18N
		},
		_EVENTS : {
			"CLICKED" : "clicked", // No I18N
			"STATECHANGED" : "state_changed" // No I18N
		},
		_init : function(element,options){
			this.element = element;
			this.options = options;
			this._createButton();
			this._bindEvents();
		},
		_createButton : function(){
			this.element.addClass("zbutton "+(this.options.style === "primary" ? "zbutton--primary" : "")); // No I18N
			if(this.options.size){
				this.element.addClass("zbutton--"+this.options.size); // No I18N
			}
			this.options.text = this.options.text ? this.options.text : this.element.text();
			if(this.options.text){
				this._setButtonText();
			}
			if(this.options.icon){
				this._setIcons();
			}
			if(this.options.disabled || this.element.attr("disabled")){
				this.element.addClass("is-disabled");
			}
		},
		_setIcons : function(){
			var iconSpan = $("<i></i>"); 
			if(this.options.icon.indexOf("#") !== 0){ // No I18N
				iconSpan.attr("class","zbutton__icon "+this.options.icon+""); // No I18N
			}else{
				var svgId = this.options.icon.split(" ")[0], // No I18N
					customClass = this.options.icon.slice(svgId.length).trim();

				this._svgElement = $("<svg class='"+customClass+"'><use xlink:href='"+svgId+"'></use></svg>"); // No I18N
				iconSpan.append(this._svgElement);
			}
			this.element.prepend(iconSpan);
			if(this.options.text){
				this.element.addClass("zbutton--texticon"); 
			}
		},
		_setButtonText : function(){
			var textSpan = $("<span class='zbutton__text'>"+this.options.text+"</span>"); // No I18N
			this.element.text("").append(textSpan); // No I18N
		},
		_bindEvents : function(){
			var base = this;
			this.element.bind("click.zbutton",function(event){ // No I18N
				event.type = base._EVENTS.CLICKED;
				ZComponents._trigger(base.element,base.options,event,{"button":base.element}); // No I18N
				if(base.options.loading){
					base._performLoadingAction();
				}
			});
		},
		option : function(optionName,value){
			if(optionName === "loading" && value !== this.options.loading){ // No I18N
				if(!value){ // loading state is set false
					if(this.options.icon){
						this.element.find("i").removeClass("zbutton--loadingspinner").removeClass(this.options.loading.icon);
						if(!this.element.find("svg").length){
							this.element.find("i").addClass("zbutton__icon "+this.options.icon); // No I18N
						}else{
							this.element.find("i").removeClass("zbutton__icon"); // No I18N
						}
					}else{
						this.element.removeClass("zbutton--texticon").find("i").remove();
					}
					this.element.removeClass("zbutton--loading").find(".zbutton__text").text("").text(this.options.text);
				}else{
					this._performLoadingAction();
				}
				this.options.loading = value;
			}
		},
		_performLoadingAction : function(){ // add the loading icon
			var iconEle = this.element.find("i"),
				loading = this.options.loading;
			if(iconEle.length){ // icon element already present
				iconEle.removeClass("zbutton__icon "+this.options.icon).addClass(loading.icon ? "zbutton__icon "+loading.icon : "zbutton--loadingspinner"); // No I18N
			}else{
				this.element.prepend($("<i class='"+(loading.icon ? loading.icon : 'zbutton--loadingspinner')+ "'></i>")).addClass("zbutton--texticon"); // No I18N
			}
			this.element.addClass("zbutton--loading");
			if(loading.text){
				this.element.find(".zbutton__text").text(loading.text);
			}
		}
	};
	$.fn.zbutton = function(){
		var data = ZComponents.createComponent({
			'element' : $(this), // No I18N
			'component' : ZButton, // No I18N
			'componentName' : 'zbutton', // No I18N
			'parameters' : arguments // No I18N
		});
		return data; // data contains return value from a method or element with which the component is initialized.
	}
	$.fn.zbutton.Constructor = ZButton; // to support extendability
	ZComponents.createButton = function(initObject){
		element = $("<button>").attr("id",initObject.id); // No I18N
		element.appendTo("body");
		return element.zbutton(initObject);
	}
	// Menu Button

	var ZMenuButton = function(element,options){
		this._init(element,options);
	}
	ZMenuButton.prototype = {
		options : {
			"toggle" : false,  // No I18N
			"menuId" : undefined, // No I18N
			"widgetEventPrefix": "zmenubutton" // No I18N
		},
		_createButton : function(){
			this._super(); // setting of icon and text
			this.element.append($("<i class='zbutton__icon zbutton__arrow'></i>")).addClass("zbutton--dropdown"); 
		},
		_bindEvents : function(){
			var base = this;
			this.element.on("click.zmenubutton",function(event){ // No I18N
				base.options.toggle = !base.options.toggle;
				if(base.options.menuId && $.fn.zmenu){
					if(base.options.toggle){ // show the menu
						$("#"+base.options.menuId).zmenu("show",{target: base.element}); // No I18N
					}else{ // hide the menu
						$("#"+base.options.menuId).zmenu("hide"); // No I18N
					}
				}
				event.type = base._EVENTS.CLICKED;
				ZComponents._trigger(base.element,base.options,event,{"button":base.element}); // No I18N
			});
		}
	}
	$.fn.zmenubutton = function(){
		var data = ZComponents.createComponent({
			'element' : $(this), // No I18N
			'component' : ZMenuButton, // No I18N
			'componentName' : 'zmenubutton', // No I18N
			'parameters' : arguments, // No I18N
			'baseClass' :  ZButton // No I18N
		});
		return data; // data contains return value from a method or element with which the component is initialized.
	}
	var ZUploadButton = function(element,options){
		this._init(element,options);
	}
	$.fn.zuploadbutton = function(){
		var data = ZComponents.createComponent({
			'element' : $(this), // No I18N
			'component' : ZUploadButton, // No I18N
			'componentName' : 'zuploadbutton', // No I18N
			'parameters' : arguments, // No I18N
			'baseClass' :  ZButton // No I18N
		});
		return data; // data contains return value from a method or element with which the component is initialized.
	}


})(jQuery);

// If we provide "icon" provision during loading state and svg icon is already present, then to remove the icon class
// while stopped loading as well as to hide the svg element inside <i> tag we need some extra class to specify its in loading state.
