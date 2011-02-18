/* Section: Validator */
/*
   Class: Validator

   Validates a form and shows validation errors on request.

	Arguments:
		options - object with Validator options

	Example:
		>var validator = Validator.Create({
  	>										scope: $('form_to_validate'),
  	>										defaultEffects: function(el) {
		>						  			var ef = new Fx.Style(el, 'opacity', {duration:1200});
		>						  			return [
		>						  				function() {
		>						  					ef.stop();
		>						  					el.show();
		>						  					ef.start(0, 1);
		>						  				},
		>						  				function() {
		>						  					ef.stop();
		>						  					ef.start(1, 0);
		>						  					//el.hide();
		>						  				}
		>						  			];
		>						  	});

   Returns:

     instantiated validator

   See Also:

      <LoginWidget>
*/
var Validator = GawkerBase.extend({
	options: {
		scope: null,
		validators : {
			'valid_minlen'	: function(value, len) { return value.length >= parseInt(len,10); },
			'valid_maxlen'	: function(value, len) { return value.length <= parseInt(len,10); },
			'valid_minval'	: function(value, min) { return parseInt( value, 10 ) >= min; },
			'valid_maxval'	: function(value, max) { return parseInt( value, 10 ) <= max; },
			'valid_minmax'	: function(value, limits) {
				limits = limits.split('_');
				return ( parseInt( value, 10 ) >= limits[0] ) && ( parseInt( value, 10 ) <= limits[1] ); 
			},
			'valid_nonempty': function(value) {
				var regex = /^[\s\S]+$/;
				return regex.test(value);
			},
			'valid_alpha'	: function(value) {
				return ( value == '' || /^[a-zA-Z]+$/.test(value) );
			},
			'valid_alphanum': function(value) {
				return ( value == '' || /^\W+$/.test(value) );
			},
			'valid_number'	: function(value) {
				return ( value == '' || /^\d+$/.test(value) );
			},
			'valid_email'	: function( value ) {
				return ( value == '' || /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i.test(value) );
				// This line is here only to fix syntax highlighting in some editors. '
			},
			'valid_emails_comma' : function( value ) {
				if(value == '') return true;
				else {
					var parts = value.split(',');
					var ret = true;
					for(var i=0, l=parts.length; i<l; i++) {
						var trimmed = parts[i].trim();
						ret = ret && (trimmed == '' || /\w{1,}[@](([\w\-]{1,}[.])){1,}([\w\-]{2,})[,]?$/.test(trimmed)); 
					}
					return ret;
				}				
			},
			'valid_unique_comma' : function( value ) {
				if(value == '') return true;
				else {
					var parts = value.split(',');
					var ret = true;
					var unique = {};
					for(var i=0, l=parts.length; i<l; i++) {
						var trimmed = parts[i].trim();
						if(unique['u'+trimmed]) {
							ret = false;
							break;
						} else unique['u'+trimmed] = true;
					}
					return ret;
				}				
			},
			'valid_limit_comma' : function(value, limit) {
				if(value == '') return true;				
				else {
					limit = parseInt(limit, 10);
					var parts = value.split(',');
					if(parts.length <= limit) return true;
					else return false;					
				}
			},
			'valid_url'		: function( value ){
				return ( value == '' || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(value) );
			},
			'valid_date'		: function(value) {
				var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
		    	if(!regex.test(value)) return false;
		    	var d = new Date(value.replace(regex, '$1/$2/$3'));
		    	return  (parseInt(RegExp.$1, 10) == (1+d.getMonth())) &&
	      		  	(parseInt(RegExp.$2, 10) == d.getDate()) &&
	        		(parseInt(RegExp.$3, 10) == d.getFullYear() );
			},
			'valid_sameas'	: function(value, other_input_id) {
				return value == this.options.scope[0][other_input_id].value;
			}
		},

		effects: {},
		infields: [],
		defaultEffects: function(el) {
			return [
				function() { jQuery(el).show(); },
				function() { jQuery(el).hide(); }
			];
		}		
	},	

	initialize: function(options) {
		this.errorlist = {};
		this.errorlist_visible = {};
		this.input_fields = {};
		
		this.setOptions(options);
		this.options.infields = jQuery( '.validate', this.options.scope[0] );
		for (var i = 0, l = this.options.infields.length; i < l; i++) {
			this.setupInfield(this.options.infields[i]);
		}		
	},

	setupInfield: function(el) {
		//el.errDivs = {};
		this.input_fields[el.name] = {};
		var errClassPart = el.name.replace(/\[/, '_').replace(/\]/, '');
		var errdivs = jQuery( '.'+ errClassPart +'_validmsg', this.options.scope[0] );
		for (var i = 0, l = errdivs.length; i < l; i++) {
			this.setupErrorDiv(errdivs[i], el);
		}
	},

	setupErrorEffects: function(el, key, validator) {
		var getFn = this.options.defaultEffects;
		if(this.options.effects[key]) {
			switch($type(this.options.effects[key])) {
				case 'function':
					getFn = this.options.effects[key];
					break;
				case 'object' :
					if(this.options.effects[key][validator]) getFn = this.options.effects[key][validator];
					break;

			}
		}
		var functions = getFn(el);
		return {show: functions[0], hide: functions[1]};
	},

	setupErrorDiv: function(el, parentinput) {
		for(var validator_name in this.options.validators) {
			if(this.options.validators.hasOwnProperty(validator_name)) {
				if(el.className.indexOf('msg_'+validator_name) > -1) {
					//parentinput.errDivs[validator_name] = this.setupErrorEffects(el, parentinput.name, validator_name);
					this.input_fields[parentinput.name][validator_name] = this.setupErrorEffects(el, parentinput.name, validator_name);
				}
			}
		}
	},

	testRule : function(params, value) {
		var bindfn = this.options.validators[params[0]].bind(this);
		return bindfn(value, params[1]);
	},

	/*
	Property: validate
		Validates the form.

	Example:
		>if(validator.validate()) alert('no errors found');
	*/

	validate: function() {
		var success = true;
		this.errorlist = {};
		for (var i = 0, l = this.options.infields.length; i < l; i++) {
			var rules = this.options.infields[i].className.split(' ');
			inner_cycle :
			for (var j = 0, k = rules.length; j < k; j++) {
				var params = rules[j].split('-');
				if(this.options.validators.hasOwnProperty(params[0])) {
					var result = this.testRule(params, this.options.infields[i].value);
					success = success && result;
					if(!result) {
						this.errorlist[this.options.infields[i].name] = {input_el:this.options.infields[i], failed_validator:params[0]};
						break inner_cycle;
					}
				}
			}
		}
		return success;
	},
	/*
	Property: hideErrors
		Hides the visual feedback elements for errors from previous validation.
		Uses the validation-error and context dependent hide function previously set during
		object instantiation.

	Example:
		> validator.hideErrors();
	*/
	hideErrors : function() {
		// for(var name in this.errorlist_visible) {
		// 	if(this.errorlist_visible.hasOwnProperty(name) && this.errorlist_visible[name]){
		// 		//this.errorlist_visible[name].input_el.errDivs[this.errorlist_visible[name].failed_validator].hide();
		// 		this.input_fields[this.errorlist_visible[name].input_el.name][this.errorlist_visible[name].failed_validator].hide();
		// 	}
		// }
		jQuery('.validationmessage', this.options.scope).hide();
		this.errorlist_visible = {};
		return this;
	},
	/*
	Property: showErrors
		Shows the visual feedback elements for errors from previous validation.
		Uses the validation-error and context dependent show function previously set during
		object instantiation.

	Example:
		> validator.showErrors();
	*/
	showErrors: function() {
		var merged = jQuery.extend(this.errorlist, this.errorlist_visible);
		var focus_set = false;
		for(var name in merged) {
			if(this.errorlist.hasOwnProperty(name)){
				if(this.errorlist_visible[name])
				{
					//var res = this.errorlist_visible[name].input_el.errDivs[this.errorlist_visible[name].failed_validator].hide();
					var res = this.input_fields[this.errorlist_visible[name].input_el.name][this.errorlist_visible[name].failed_validator].hide();
					//if(res && res.chain) res.chain(this.errorlist[name].input_el.errDivs[this.errorlist[name].failed_validator].show);
					if(res && res.chain) res.chain(this.input_fields[this.errorlist[name].input_el.name][this.errorlist[name].failed_validator].show);
					//else this.errorlist[name].input_el.errDivs[this.errorlist[name].failed_validator].show();
					else this.input_fields[this.errorlist[name].input_el.name][this.errorlist[name].failed_validator].show();
				}
				else
				{
					//this.errorlist[name].input_el.errDivs[this.errorlist[name].failed_validator].show();
					this.input_fields[this.errorlist[name].input_el.name][this.errorlist[name].failed_validator].show();
				}
				this.errorlist_visible[name] = this.errorlist[name];
				if(!focus_set) {
					try{ 
						this.errorlist[name]['input_el'].focus();
						focus_set = true;
					} catch(e){}					
				}
			} else {
				//if(this.errorlist_visible[name]) this.errorlist_visible[name].input_el.errDivs[this.errorlist_visible[name].failed_validator].hide();
				if(this.errorlist_visible[name]) this.input_fields[this.errorlist_visible[name].input_el.name][this.errorlist_visible[name].failed_validator].hide();
				this.errorlist_visible[name] = undefined;
			}
		}
		return this;
	},
	/*
	Property: clearErrors
		Hides the visual feedback elements for errors from previous validation and clears these validation results.

	Example:
		> validator.clearErrors();
	*/
	clearErrors: function() {
		this.hideErrors();
		this.errorlist = {};
		return this;
	}
});