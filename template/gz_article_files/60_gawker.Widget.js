var gh = {};

jQuery.extend(jQuery.widget.prototype, function() {
	var EventDispatcher = {
		listeners: {},
		event_history: {},
		subscribe: function(what, fn, last_n, which_object) {
			if(this.listeners[what]) {
				this.listeners[what].push({'fn':fn, 'target':which_object});
			} else {
				this.listeners[what] = [{'fn':fn, 'target':which_object}];
			}
			//check for previous events of this type
			if(this.event_history[what]) {
				var l = this.event_history[what].length;
				if (last_n == undefined) {
					// default value: the last event of the kind
					last_n = 1;
				}
				if (last_n >= 0) {
					var i = l - last_n;
				} else {
					var i = 0;
				}

				for(; i < l; i++) {
					try {
						if(this.event_history[what][i]['notifyOnly']) {
							if(this.event_history[what][i]['notifyOnly'] === which_object) fn(this.event_history[what][i]);
						} else {
							fn(this.event_history[what][i]);
						}
					} catch(ex) {}
				}
			}
		},
		notify: function(ev) {
			var name_parts = ev.name.split('.');
			var key = '';
			for (var i = 0, l = name_parts.length; i < l; i++) {
				// namespace key is being calculated
				key += name_parts[i];
				if (i < l-1) {
					key += '.';
				}

				// notifiing subscribers
				if(this.listeners[key]) {
					for(var ii = 0, ll = this.listeners[key].length; ii < ll; ii++) {
						try {
							if(ev['notifyOnly']) {
								if(ev['notifyOnly'] === this.listeners[key][ii]['target']) this.listeners[key][ii]['fn'](ev);
							} else {
								this.listeners[key][ii]['fn'](ev);
							}
						} catch(ex) {
							Logger.debugLog(ex.message);
						}
					}
				}

				// saving to history
				if(this.event_history[key]) {
					this.event_history[key].push(ev);
				} else {
					this.event_history[key] = [ev];
				}
			}
		}
	};

	var DOMEventDispatcher = {
		'observing':[],
		'eventmap':{},
		registerEventDispatcher: function(myeventmap) {
			return function(e) {
				var target = jQuery(e.target);
				for(var control_name in myeventmap) {
					if(myeventmap.hasOwnProperty(control_name)) {
						// loop trough control_names
						var closest = target.closest( '.'+ control_name );
						if ( closest.length > 0 ) {
							// do some bubbling and override target here
							e.target = closest[0];
							myeventmap[control_name](e);
						}
					}
				}
			};
		},
		doRegisterHandler: function(el, event_type, fn, control_name) {
			//did we see it before?
			var ndx = this.observing.indexOf(el);
			if(ndx == -1) {
				//first time
				ndx = this.observing.push(el) - 1;
				this.eventmap['n'+ndx] = {};
			}
			ndx = 'n'+ndx;
			//some handlers are there already
			if(! this.eventmap[ndx][event_type]) {
				//new eventtype
				this.eventmap[ndx][event_type] = {'control_types':{} };
				//we have to attach a real listener now
				this.eventmap[ndx][event_type]['realhandler'] = this.registerEventDispatcher(this.eventmap[ndx][event_type]['control_types']);
				jQuery(el)[event_type](this.eventmap[ndx][event_type]['realhandler']);

			}
			this.eventmap[ndx][event_type]['control_types'][control_name] = fn;
		},
		doTearDownHandler: function(el, event_type, control_name) {
			var ndx = this.observing.indexOf(el);
			if(ndx > -1) {
				ndx = 'n'+ndx;
				if(this.eventmap[ndx] && this.eventmap[ndx][event_type]) {
					if(this.eventmap[ndx][event_type]['control_types'][control_name]) {
						//remove from here
						delete this.eventmap[ndx][event_type]['control_types'][control_name];
						var clearthis = true;
						for(var nm  in this.eventmap[ndx][event_type]['control_types']) {
							if(this.eventmap[ndx][event_type]['control_types'].hasOwnProperty(nm)) {
								clearthis = false;
								break;
							}
						}
						if(clearthis) jQuery(el).unbind(event_type, this.eventmap[ndx][event_type]['realhandler']);
					}
				}
			}
		}
	};

	var GawkerAuth = {
		user: null,
		site: null,
		geoip: '',
		mail2token: '',
		authenticated: false,
		action_url: '/?op=ajax_userstate',
		xhr: null,
		levels: ['removedusers', 'pendingusers', 'maybeusers', 'users', 'commenters', 'starcommenters', 'commentadmins', 'authors', 'editors', 'superusers'],

		getUserState: function() {
			this.xhr = new XHR({
				klass: 'auth',
				'type': 'POST',
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});
			this.xhr.send( this.action_url + '&r='+this.getRevision(), {} );
		},
		getRevision: function() {
			var rev = jQuery.cookie('usrev');
			if(!rev) {
				rev = this.resetRevision();
			}
			return rev;
		},
		resetRevision: function() {
			var rev = Math.floor(Math.random() * 100000);
			jQuery.cookie('usrev', rev, {path:'/', expires:30});
			return rev;
		},
		handleAjaxFail: function(xr, errorcode) {
			switch(errorcode) {
				case 'timeout':
					//console.log('ajax timeout!');
				default:
					EventDispatcher.notify({'name':'user.auth.failure', 'source':this});
					break;
			};
		},
		handleAjaxSuccess: function(data) {
			this.authenticated = false;
			if(data['action'] == 'userstate') {
				this.site = data['site'] ? data['site'] : null;
				this.geoip = data['geoip'] ? data['geoip'] : 'N/A';
				this.formToken = data['formToken'];
				this.mail2token = data['mail2token'] ? data['mail2token'] : 'N/A';
				if(data['success'] == true) {
					this.authenticated = true;
					this.user = data['user'];
					EventDispatcher.notify({'name':'user.auth.success', 'source':this});
				} else {
					EventDispatcher.notify({'name':'user.auth.failure', 'source':this});
				}
			} else {
				EventDispatcher.notify({'name':'user.auth.failure', 'source':this});
			}
		},
		hasLevel: function(level, siteId) {
			siteId = siteId?siteId:'current';
			if(!this.authenticated) return false;
			else return (jQuery.inArray(level, this.levels)==-1 ? false : (jQuery.inArray(this.user.level[siteId], this.levels) >= jQuery.inArray(level, this.levels)));
		},
		fbWhenReady: function(callback_function) {
			FB.Facebook.get_sessionWaitable().waitUntilReady(function() {
				callback_function();
			}.bind(this));
		}
	};

	GawkerAuth.getUserState();

	var CommonDialogs = {
		groups : {},
		initDialogs: function(params) {
			if(!params['group']) params['group'] = 'default';
			if(!this.groups[params['group']]) {
				this.groups[params['group']] = {
					'overlay':{
						'el':params['overlay']?params['overlay']:null,
						'show': params['showOverlay']?params['showOverlay']:function(args) {
								var jwindow = jQuery(window);
								args.el.css({'height':jwindow.height(), 'opacity':0.8}).fadeIn(500, args['callback']?args['callback']:null);
							},
						'hide': params['hideOverlay']?params['hideOverlay']:function(args) {
								args.el.fadeOut(500, args['callback']?args['callback']:null);
						}
					},
					'state':'no_dialog',
					'panels':{}
				};
			}
			if(!params['panels']) params['panels'] = {};
			for(var pn in params['panels']) {
				if(params['panels'].hasOwnProperty(pn)) {
					this.groups[params['group']].panels[pn] = {
						'el':params['panels'][pn]['el']['get']?params['panels'][pn]['el']:jQuery(params['panels'][pn]['el']),
						'focus': params['panels'][pn]['focus']?params['panels'][pn]['focus']:null,
						'show':params['panels'][pn]['show']?params['panels'][pn]['show']:function(args) {
							var jwindow = jQuery(window);
							var lft = Math.ceil((jwindow.width() - args.el.width()) / 2);
							var tp = Math.ceil((jwindow.height() - args.el.height()) / 2);
							args.el.css({'left':lft, 'top':'100px'}).fadeIn(500, args['callback']?args['callback']:null);
						},
						'hide':params['panels'][pn]['hide']?params['panels'][pn]['hide']:function(args) {
							args.el.fadeOut(500, args['callback']?args['callback']:null);
						}
					};
				}
			}
		},
		toggleDialog: function(params) {
			if(!params) params = {};
			var jwindow = jQuery(window);
			if(!params['group']) params['group'] = 'default';
			var obj = this;
			if(this.groups[params['group']]) {
				var whichpanel = this.groups[params['group']].panels[params['which']];
				if(this.groups[params['group']].state == 'no_dialog') {
					//show overlay + show dialog
					if(this.groups[params['group']].panels[params['which']]) {
						this.widget.raiseEvent( 'dialog.beforeOpen.' + params['which'], {} );
						this.groups[params['group']].panels[params['which']].show({
							'el':this.groups[params['group']].panels[params['which']].el,
							'callback':function() {
								obj.widget.raiseEvent( 'dialog.afterOpen.' + params['which'], {} );
								if(whichpanel['focus']) whichpanel.focus.focus();
								if(params['sync_this']) params['sync_this']();
							}
						});
						this.groups[params['group']].overlay.show({'el':this.groups[params['group']].overlay.el});
						this.groups[params['group']].state = 'active:' + params['which'];
					}
				} else {
					var oldpanel = this.groups[params['group']].state.split(':').pop();
					if(oldpanel == params['which'] || !params['which']) {
						//hide dialog + hide overlay
						this.widget.raiseEvent('dialog.beforeClose.' + oldpanel, {});
						this.groups[params['group']].panels[oldpanel].hide( {
							'el':this.groups[params['group']].panels[oldpanel].el,
							'callback':function() {
								if( params['sync_this'] ) {
									params['sync_this']();
								}
								obj.widget.raiseEvent('dialog.afterClose.' + oldpanel, {});
							}
						});
						this.groups[params['group']].overlay.hide({'el':this.groups[params['group']].overlay.el});
						this.groups[params['group']].state = 'no_dialog';
					} else {
						//hide old dialog + show current dialog, don't touch overlay
						this.widget.raiseEvent('dialog.beforeClose.' + oldpanel, {});
						this.widget.raiseEvent( 'dialog.beforeOpen.' + params['which'], {} );
						this.groups[params['group']].panels[oldpanel].hide({'el':this.groups[params['group']].panels[oldpanel].el, 'callback':function(){
							whichpanel.show({
								'el':whichpanel.el,
								'callback':function(){
									obj.widget.raiseEvent('dialog.afterClose.' + oldpanel, {});
									obj.widget.raiseEvent( 'dialog.afterOpen.' + params['which'], {} );
									if(whichpanel['focus']) {
										whichpanel.focus.focus();
									}
									if(params['sync_this']) {
										params['sync_this']();
									}
								}
							});
						}});
						this.groups[params['group']].state = 'active:' + params['which'];
					}
				}
			}
			return 'will_sync';
		}
	};

	//return widget prototype here - above classes are used as private singletons
	return {
		options: {
			'effectsSlideSpeed' : 300
		},
		auth: GawkerAuth,
		commondialogs: CommonDialogs,
		mystate: 'init',

		_init: function() {
			//extending this.element with an external element
			this.commondialogs.widget = this;
			if(this.options.externalElement) {
				var exts = jQuery(this.options.externalElement);
				for(var i=0, l=exts.length; i<l; i++)
				{
					this.element.push(exts.get(i));
				}
			}

			this._effect_queue = [];
			this._effect_busy = false;
			this.setControls();
			(this.initialize && this.initialize());
			Logger.debugLog(this.widgetName +' init done');
		},

		inState: function(whichstate) {
			return (0 == this.mystate.indexOf(whichstate));
		},

		// register a handler for an element for this class
		registerEventHandler: function(for_element, eventType, fn) {
			if (!for_element.get)
			{
				for_element = [for_element];
			}
			for (var i = 0, l = for_element.length; i < l; i++)
			{
				DOMEventDispatcher.doRegisterHandler(for_element[i], eventType, fn, this.getControlClass());
			}
		},

		// unregister a handler for an element for this class
		tearDownEventHandler: function(for_element, eventType) {
			if (!for_element.get)
			{
				for_element = [for_element];
			}
			for (var i = 0, l = for_element.length; i < l; i++)
			{
				DOMEventDispatcher.doTearDownHandler(for_element[i], eventType, this.getControlClass());
			}
		},

		// returns the current instances' control class - if not set, returns the default 'control'
		getControlClass: function() {
			return this.options.controlClass ? this.options.controlClass : 'control';
		},

		// fires a method created in the settings
		fireEvent: function( event, attributes, synced ) {
			if(!synced) synced = false;
			if( this.options[event] ) {
				try {
					if(synced) this.syncEffect({'el':this.options, 'fn':event, 'params': attributes});
					else return this.options[event]( attributes );
				} catch(e) { return null;}
			} else return null;
		},

		syncEffect: function(synced_effect) {
			if(synced_effect) {
				//push into the queue
				this._effect_queue.push(synced_effect);
			} else this._effect_busy = false;
			if(!this._effect_busy && this._effect_queue.length > 0) {
				//first in first out queue
				var first_in_row = this._effect_queue.shift();
				this._effect_busy = true;
				var will_sync = false;
				if(first_in_row['params']) {
					will_sync = (first_in_row.el[first_in_row['fn']](first_in_row['params']) == 'will_sync');
					//Logger.debugLog(first_in_row['fn'] + ' - sync ' +  (will_sync?'later':'now'));
				} else {
					first_in_row.el[first_in_row['fn']]();
					//Logger.debugLog(first_in_row['fn'] + ' ' + this.getParam('cn', first_in_row['el']) + '  - sync ' +  (will_sync?'later':'now'));
				}
				if(!will_sync) this.syncEffect();
			}
		},

		//set the widget's .notifyOnly property to a reference for a host object to limit the event scope
		raiseEvent: function(name, params) {
			var ev = {'name':name, 'source':this, 'params':params};
			if(this.notifyOnly) ev['notifyOnly'] = this.notifyOnly;
			EventDispatcher.notify(ev);
		},

		subscribeForEvent: function(what, fn, last_n) {
			return EventDispatcher.subscribe(what, fn, last_n, this);
		},

		// Lists controlling elements of the widget under widget.controls
		// A control marked by classnames like ...class="control cn_submitButton"... will be listed in widget.controls.submitButton
		setControls: function() {
			this.controls = {};

			// search form control elements, collect their controlNames
			var controlElements = jQuery( '.'+ this.getControlClass(), this.element );
			var controlNames = {};
			for( var i = 0, l = controlElements.length; i < l; i++ ) {
				controlNames[this.getParam( 'cn', controlElements.eq(i) )] = 1;
			}

			// rerun the search - this is needed to have controls with the same controlName under the same key
			for(var controlName in controlNames) {
				if (controlNames.hasOwnProperty(controlName)) {
					this.controls[controlName] = jQuery( '.'+ this.getControlClass() +'.cn_'+ controlName, this.element );
				}
			}
		},

		// Widget param getter.
		// Returns some value stored in a class property. Param values are stored like ...class="paramName_paramValue"...
		getParam: function(paramName, element) {
			if (element == undefined) {
				element = this.element;
			}
			element = jQuery(element);

			var classNames = element.attr('class');
			if (classNames != undefined) {
				classNames = classNames.split(' ');
				for (var i = 0, l = classNames.length; i < l; i++) {
					if (classNames[i].indexOf(paramName +'_') == 0) {
						return classNames[i].substr(paramName.length + 1);
					}
				}
			}

			return null;
		},

		// Widget param setter.
		setParam: function( paramName, value, element ) {
			if ( element == undefined ) {
				element = this.element;
			}

			// checking if it has an actual value, remove if so
			var actualValue = this.getParam( paramName, element );
			if ( actualValue != null ) {
				element.removeClass( paramName +'_'+ actualValue );
			}

			// setting value
			element.addClass( paramName +'_'+ value );
		},

		hideWidget: function() {
			this.element.hide();
		},

		showWidget: function() {
			this.element.show();
		},

		toggleIndicator: function() {
			if (this.controls && this.controls.indicator)
			{
				this.controls.indicator.toggle();
			}
		},

		isEnabled: function() {
			return ( !this.option( 'disabled' ) );
		},

		handleAjaxRequest: function() {},

		handleAjaxFail: function() {
			this.enableInputs();
			this.hideIndicator();
			Logger.debugLog('Network problem has occured.');
		},

		/* Enable/disable input elements
		*****/
		enableInputs: function() {
			jQuery('input, textarea, select, button', this.element).attr('disabled', false)
				.removeClass('ui-state-disabled')
			// TODO: this is the same in 1.4.2
			// jQuery(':input', this.element).attr('disabled', false)
			// 	.removeClass('ui-state-disabled')
		},
		disableInputs: function() {
			jQuery('input[type=checkbox], input[type=text], input[type=password], input[type=radio], input[type=button], input[type=submit], input[type=reset], textarea, select, button', this.element).attr('disabled', true)
				.addClass('ui-state-disabled');
			// TODO: this is the same in 1.4.2
			// jQuery(':input:not[type=hidden]', this.element).attr('disabled', true)
			// 	.addClass('ui-state-disabled');
		},

		/* Enable/disable input elements
		*****/
		showIndicator: function() {
			(this.controls && this.controls.indicator && this.controls.indicator.show());
		},
		hideIndicator: function() {
			jQuery('.indicator', this.element).hide();
		}

	};
}());