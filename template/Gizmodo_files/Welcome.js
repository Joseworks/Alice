(function($) {
	$.widget('ui.WelcomeWidget', {

		controls: {},
		params: {},
		firstRun: true,
		signupdone: false,
		facebookdone: false,

		initialize: function() {
			// check cookie, if set don't do anything
			if( jQuery.cookie('__gmg_wlcm') ) return false;

			// setup XHR object
			this.xhr = new XHR({
				klass: 'welcomebox',
				'type': 'POST',
				beforeSend: this.handleAjaxRequest.bind(this),
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});
			
			this.registerEventHandler(this.element, 'click', this.handleClick.bind(this));
			
			this.subscribeForEvent('user.auth.', this.handleAuth.bind(this));

			this.subscribeForEvent('signup.success', this.signupSuccess.bind(this) );
		},
		
		handleAuth: function(ev) {
			switch( ev.name ) {
				case 'user.auth.success':
				case 'user.auth.failure':
					this.showWidget();
					break;
			}
		},
		
		showWidget: function() {
			if( jQuery.cookie('__gmg_wlcm') ) return false; // don't show box if cookie found

			if( !this.auth.user || !this.auth.user.welcomeBoxViewed || this.auth.user.welcomeBoxViewed[this.options.site_id] != 'true') {
				this.element.show();
				this.raiseEvent('welcomebox.toggled',{});
			} else {
				this.hideWidget();
				this.sendWelcomeboxCookie();
			}
		},
		
		signupSuccess: function(e) {
			this.signupdone = true;
			if ( this.facebookdone ) { 
				this.commondialogs.toggleDialog({'which':'welcome'});
				this.raiseEvent('welcomebox.toggled',{});
			}
		},
		
		facebookSuccess: function(e) {
			this.facebookdone = true;
			if ( this.signupdone ) { 
				this.commondialogs.toggleDialog({'which':'welcome'}); 
				this.raiseEvent('welcomebox.toggled',{});
			}
		},
		
		handleClick: function(e) {
			var control_name = this.getParam('cn', jQuery(e.target));
			switch (control_name) {
				case 'cancel':
					this.sendWelcomeboxCookie();
					// set profile entry for logged in users
					if( this.auth.user ) this.xhr.send( '/index.php', {'op': 'setprofile', 'mode': 'comment_preferences', 'welcomeBoxViewed': 'true'} );
					this.hideWidget();
					this.raiseEvent('welcomebox.toggled',{});
					break;
			}
		},
		
		sendWelcomeboxCookie: function() {
			jQuery.cookie('__gmg_wlcm', '1', { path: '/', expires: new Date( 2038, 1, 1 ) } );
		},

		/* AJAX handler functions */
		handleAjaxRequest: function() { },
		handleAjaxSuccess: function(data) {},
		handleAjaxFail: function(data) {}
	});

	$.extend($.ui.WelcomeWidget, {
		'version': '1.0',
		'defaults': {
			'onHide': {},
			'onShow': {},
			'onReset': {},
			'controlClass': 'welcome_control',
			'externalElement': '.presence_control_external'
		}
	});

})(jQuery);
