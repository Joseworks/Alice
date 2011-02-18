/*
	Hooks on a form having
		- op param defined by a hidden field
		- validators set
		- an indicator control
		- a message control
*/

/* extendable events, put them in options
	onInit: function(args) {},
	onHide: function(args) {},
	onShow: function(args) {},
	onReset: function(args) {},
	onClick: function(args) {},
	onAjaxSuccess: function(args) {},
	onAjaxFailure: function(args) {},
	onAuthEvent: function(args) {},
	onKeyUp: function(args) {}
*/
jQuery.extend( settings.widgets, {
	simpleform: {
		klass: 'SimpleFormWidget',
		byselector: {
			'#helpMessage': {
				options: {
					show_validation_errors: true,
					action_url: '/index.php',
					controlClass: 'helpcontrol',
					xhrKlass: 'helpmessage'
				}
			},
			'.newsletter_signup': {
				options: {
					show_validation_errors: true,
					action_url: '/index.php',
					controlClass: 'newsletter_control',
					xhrKlass: 'newsletter_signup',
					message_options: { duration: 10000 },
					onAjaxSuccess: function(args) { args.widget.raiseEvent( 'signup.success' ); }
				}
			},
			'#mail2container': {
				options: {
					externalElement: '.presence_control_external',
					show_validation_errors: true,
					action_url: '/index.php',
					controlClass: 'mail2control',
					xhrKlass: 'mail2',

					onInit: function(args) {
						var panels = {};
						var should_init_panels = false;
						var w = args.widget;
						if(w.controls['overlay']) {
							panels['mail2'] = {
								'el': w.controls.mail2_dialog,
								'focus': w.controls.from
							};
							should_init_panels = true;
						}
						if (should_init_panels) {
							w.commondialogs.initDialogs({
								'overlay': w.controls.overlay,
								'panels': panels,
								'group': w.options['dialoggroup'] ? w.options['dialoggroup'] : false
							});
						}

						w.subscribeForEvent('user.auth.', w.authEventHandler.bind(w));
					},
					onHide: function(args) {},
					onShow: function(args) {},
					onReset: function(args) {},
					onClick: function(args) {
						var controlName = args.widget.getParam('cn', jQuery(args.e.target));
						switch (controlName)
						{
							case 'cancel':
							case 'toggle':
								args.widget.controls.form[0].reset();
								args.widget.validator.hideErrors();
								args.widget.commondialogs.toggleDialog({'which':'mail2'});
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
						}
					},
					onAjaxSuccess: function(args) {
						if (true == args.data.success) {
							setTimeout(function(){
								args.widget.commondialogs.toggleDialog({'which':'mail2'})
							}, 3000);
						}
					},
					onAjaxFailure: function(args) {},
					onAuthEvent: function(args) {
						args.widget.controls.token[0].value = args.widget.auth.mail2token;
					},
					onKeyUp: function(args) {
						switch (args.e.keyCode) {
							case jQuery.ui.keyCode.ESCAPE:
								args.widget.commondialogs.toggleDialog();
								break;
						}
					}
				}
			},
			'.surveyform': {
				options: {
					show_validation_errors: true,
					action_url: '/index.php',
					controlClass: 'surveycontrol',
					xhrKlass: 'survey',
					onShow: function(args) {
						var cookieName = args.widget.getParam('cookie');
						if (true == jQuery.cookie(cookieName))
						{
							args.widget.controls.message[0].innerHTML = 'You took this survey earlier.';
						}
						else
						{
							args.widget.controls.form.show();
						}
					},
					onAjaxSuccess: function(args) {
						if (true == args.data.success) {
							args.widget.controls.form.hide();
						}
					}
				}
			},
			'.guestcommentform': {
				options: {
					show_validation_errors: true,
					action_url: '/index.php',
					controlClass: 'guestcommentcontrol',
					xhrKlass: 'guestcomment',
					onReset: function(args) {
						jQuery('.text', args.widget.element).val('');
						args.widget.controls.message.html('');
						args.widget.element.slideUp();
					},
					onClick: function(args) {
						var controlName = args.widget.getParam( 'cn', jQuery(args.e.target) );
						switch( controlName )
						{
							case 'submit':
								args.widget.controls.form.submit();
								args.e.stopPropagation();
								args.e.preventDefault();
							break;
							case 'reset':
								args.widget.resetWidget();
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
						}
					},
					onAjaxSuccess: function(args) {
						if (true == args.data.success) {
							setTimeout( function() { args.widget.resetWidget(); }, 5000 );
						}
					}
				}
			}
		}
	}
});

(function($) {
	$.widget('ui.SimpleFormWidget', {

		validator: null,
		xhr: null,

		initialize: function() {
			// add event handlers
			this.registerEventHandler(this.controls.form, 'submit', this.handleSubmit.bind(this));
			this.registerEventHandler(this.element, 'click', this.handleClick.bind(this));
			this.registerEventHandler(this.controls.form, 'keyup', this.handleKeyUp.bind(this));

			// validator
			this.validator = new Validator(jQuery.extend({}, {'scope': this.controls.form} ));

			// setup XHR object
			this.xhr = new XHR({
				klass: this.options.xhrKlass,
				beforeSend: this.handleAjaxRequest.bind(this),
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});

			this.fireEvent('onInit', {'widget': this});
		},

		// formsubmit handler method
		handleSubmit: function(e) {
			this.validator.hideErrors();

			if(this.validator.validate()) {
				// show spinner & send form
				this.xhr.send( this.options.action_url, jQuery( e.target ).serialize() );
			}
			else
			{
				// show errors
				if (this.options.show_validation_errors) {
					this.validator.showErrors();
				}
			}
			e.preventDefault();
			e.stopPropagation();

			return false;
		},

		// click handler
		handleClick: function(e) {
			this.fireEvent( 'onClick', {'e': e, 'widget': this} );
		},

		// AJAX event handlers
		handleAjaxRequest: function() {
			this.disableInputs();
			this.controls.indicator.show();
		},

		handleAjaxSuccess: function(data) {
			Message.showMessage(data.message, this.controls.message[0], this.options.message_options ? this.options.message_options : {} );
			this.enableInputs();
			this.controls.indicator.hide();
			this.fireEvent( 'onAjaxSuccess', {'data': data, 'widget': this} );
		},

		handleAjaxFail: function() {
			var message = 'Error occurred, please try again later.';
			Message.showMessage( message, this.controls.message[0] );

			this.controls.indicator.hide();
			this.enableInputs();
			this.fireEvent( 'onAjaxFailure', {'widget': this} );
		},

		authEventHandler: function(ev) {
			this.fireEvent('onAuthEvent', {'ev': ev, 'widget': this});
		},

		// handle
		handleKeyUp: function(e) {
			this.fireEvent('onKeyUp', {'e': e, 'widget': this});
		},

		// togglers
		hideWidget: function() {
			this.fireEvent( 'onHide', {'widget': this} );
		},

		showWidget: function() {
			this.fireEvent( 'onShow', {'widget': this} );
		},

		resetWidget: function() {
			this.fireEvent( 'onReset', {'widget': this} );
		},

		clearInputs: function() {
			jQuery( 'input:text, textarea', this.element ).each( function( i, element ) {
				element.value = '';
			});
		},

		disableInputs: function() {
			jQuery( 'input, textarea, select', this.element ).each( function( i, element ) {
				element.disabled = true;
			});
		},

		enableInputs: function() {
			jQuery( 'input, textarea, select', this.element ).each( function( i, element ) {
				element.disabled = false;
			});
		}
	});

	$.extend($.ui.SimpleFormWidget, {
		version: '1.0',
		defaults: {}
	});

})(jQuery);