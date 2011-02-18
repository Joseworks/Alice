(function($) {
	$.widget('ui.PresenceWidget', {
		validator: null,
		xhr: null,

		initialize: function() {
			this.jwindow = jQuery(window);
			this.xhr = new XHR({
				klass: 'presence',
				beforeSend: this.handleAjaxRequest.bind(this),
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});
			this.registerEventHandler(this.element, 'click', this.handleClicks.bind(this));
			var panels = {};
			if(this.controls['login_form']) {
				panels['login'] = {'el':this.controls.login_dialog, 'focus':this.controls.username};
				this.login_validator = new Validator(jQuery.extend({}, {'scope': this.controls['login_form']} ));
				this.registerEventHandler(this.controls.login_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.login_form, 'submit', this.handleLoginSubmit.bind(this));
			}
			if(this.controls['resetpw_form']) {
				panels['resetpw'] = {'el':this.controls.resetpw_dialog, 'focus':this.controls.resetpwemail};
				this.resetpw_validator = new Validator(jQuery.extend({}, {'scope': this.controls['resetpw_form']} ));
				this.registerEventHandler(this.controls.resetpw_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.resetpw_form, 'submit', this.handleResetPasswordSubmit.bind(this));
			}
			if(this.controls['register_form']) {
				panels['register'] = {'el':this.controls.register_dialog, 'focus':this.controls.register_username};
				this.register_validator = new Validator(jQuery.extend({}, {'scope': this.controls['register_form']} ));
				this.registerEventHandler(this.controls.register_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.register_form, 'submit', this.handleRegisterSubmit.bind(this));
			}
			if(this.controls['emailreminder_form']) {
				panels['emailreminder'] = {'el':this.controls.emailreminder_dialog, 'focus':this.controls.emailreminder_email};
				this.emailreminder_validator = new Validator(jQuery.extend({}, {'scope': this.controls['emailreminder_form']} ));
				this.registerEventHandler(this.controls.emailreminder_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.emailreminder_form, 'submit', this.handleEmailReminderSubmit.bind(this));
			}
			if(this.controls['subscribe_form']) {
				panels['subscribe'] = {'el':this.controls.subscribe_dialog, 'focus':this.controls.subscribe_email};
				this.subscribe_validator = new Validator(jQuery.extend({}, {'scope': this.controls['subscribe_form']} ));
				this.registerEventHandler(this.controls.subscribe_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.subscribe_form, 'submit', this.handleSubscribeSubmit.bind(this));
			}
			if(this.controls['commentsettings_form']) {
				panels['commentsettings'] = {'el':this.controls.commentsettings_dialog};
				this.registerEventHandler(this.controls.commentsettings_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.commentsettings_form, 'submit', this.handleCommentSettingsSubmit.bind(this));
			}
			if(this.controls['avatarupload_form']) {
				panels['avatarupload'] = {'el':this.controls.avatarupload_dialog, 'focus':this.controls.avatarupload_file};
				this.avatarupload_validator = new Validator(jQuery.extend({}, {'scope': this.controls['avatarupload_form']} ));
				this.registerEventHandler(this.controls.avatarupload_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.avatarupload_form, 'submit', this.handleAvataruploadSubmit.bind(this));
				//registering global callback here
				GawkerClientside['callbacks'] = jQuery.extend((GawkerClientside['callbacks']?GawkerClientside['callbacks']:{}), {'avatarUploadResponse' : this.handleAjaxSuccess.bind(this)});
			}
			if(this.controls['profileedit_form'])	{
				panels['profileedit'] = {'el':this.controls.profileedit_dialog, 'focus':this.controls.profileedit_displayname};
				this.profileedit_validator = new Validator(jQuery.extend({}, {'scope': this.controls['profileedit_form']} ));
				this.registerEventHandler(this.controls.profileedit_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.profileedit_form, 'submit', this.handleProfileeditSubmit.bind(this));
			}
			if(this.controls['editreminder_form']) {
				panels['editreminder'] = {'el':this.controls.editreminder_dialog, 'focus':this.controls.editreminder_email};
				this.editreminder_validator = new Validator(jQuery.extend({}, {'scope': this.controls['editreminder_form']} ));
				this.registerEventHandler(this.controls.editreminder_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.editreminder_form, 'submit', this.handleEditReminderSubmit.bind(this));
			}
			if(this.controls['changepassword_form'])	{
				panels['changepassword'] = {'el':this.controls.changepassword_dialog, 'focus':this.controls.changepassword_password};
				this.changepassword_validator = new Validator(jQuery.extend({}, {'scope': this.controls['changepassword_form']} ));
				this.registerEventHandler(this.controls.changepassword_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.changepassword_form, 'submit', this.handleChangepasswordSubmit.bind(this));
			}
			if(this.controls['deleteuser_form'])	{
				panels['deleteuser'] = {'el':this.controls.deleteuser_dialog};
				this.registerEventHandler(this.controls.deleteuser_form, 'submit', this.handleDeleteUserSubmit.bind(this));
			}
			if( this.controls['followus_dialog'] )
			{
					panels['followus'] = { 'el' : this.controls.followus_dialog, 'focus' : this.controls.followus };
			}
			if(this.controls['policy_dialog']) {
				panels['policy'] = {'el':this.controls.policy_dialog};
			}
			this.commondialogs.initDialogs({'overlay':this.controls.overlay, 'panels':panels, 'group':this.options['dialoggroup']?this.options['dialoggroup']:false});
			this.resetWidget();

			this.subscribeForEvent('user.auth.', this.authEventHandler.bind(this));
			this.subscribeForEvent('presence.requiresequence.', this.sequenceHandler.bind(this));
			this.subscribeForEvent('dialog.beforeOpen.resetpw', this.resetResetPwDialog.bind( this ) );
			this.subscribeForEvent('dialog.beforeOpen.changepassword', this.resetChangePasswordDialog.bind( this ) );
			//this.subscribeForEvent('dialog.', function( e ) { console.log( e ); } );
			
			// community policy popup
			this.subscribeForEvent('policypopup.', this.policyPopupHandler.bind(this));
			this.openAfterLogin = null;
		},
		authEventHandler: function(ev) {
			var is_init = this.inState('init');
			var max_name_length = 15;
			switch(ev.name) {
				case 'user.auth.success':
					if(this.controls['profile_link']) this.controls.profile_link.attr('href', '/people/'+this.auth.user.username).html(this.auth.user.smartName.length>max_name_length ? (this.auth.user.smartName.substr(0,max_name_length) + '...') : this.auth.user.smartName);
					if(!is_init) {
						this.fireEvent('onLoginPanelHide', this, true);
						this.syncEffect({'el':this.controls.login_panel, 'fn':'hide'});
					}
					this.fireEvent('onLogoutPanelShow', this, true);
					this.syncEffect({'el':this.controls.logout_panel, 'fn':'show'});
					this.mystate = 'loggedin';
					if(this.controls['profilepagecontrols']) {
						var profile_id = this.getParam('uid', this.controls.profilepagecontrols);
						if(this.auth.user.id === profile_id) {
							//don't show change password link to facebook users
							if(!this.auth.user['fb_uid'] && this.controls['main_changepassword_link']) this.controls.main_changepassword_link.show();
							if(!this.auth.user['fb_uid'] && this.controls['main_deleteuser_link']) this.controls.main_deleteuser_link.show();
							this.controls.profilepagecontrols.show();
							this.setupProfileForms();
							this.xhr.send( 'index.php?op=ajax_emailverification', { 'action' : 'isVerified' } );
						}
					}
					if( typeof( this.openAfterLogin ) == 'function' ) {
						this.syncEffect({'el':this.commondialogs, 'fn':'toggleDialog', 'params':{'which': this.openAfterLogin( this.auth.user ), 'sync_this':this.syncEffect.bind(this)}});
						this.openAfterLogin = null;
					}
					else if( this.auth.showNonAsciiNotification !== undefined && this.auth.showNonAsciiNotification === true ) {
						if( this.auth.user.emailuser ) {
							this.syncEffect({'el':this.commondialogs, 'fn':'toggleDialog', 'params':{'which' : 'resetpw', 'sync_this':this.syncEffect.bind(this)}});
						} else {
							this.syncEffect({'el':this.commondialogs, 'fn':'toggleDialog', 'params':{'which' : 'changepassword', 'sync_this':this.syncEffect.bind(this)}});
						}
					}
					break;
				case 'user.auth.failure':
					jQuery( '#mustaddemail' ).remove();
					if(!is_init) {
						this.fireEvent('onLogoutPanelHide', this, true);
						this.syncEffect({'el':this.controls.logout_panel, 'fn':'hide'});
					}
					this.fireEvent('onLoginPanelShow', this, true);
					this.syncEffect({'el':this.controls.login_panel, 'fn':'show'});
					this.mystate = 'loggedout:no_dialog';
					if(this.controls['profilepagecontrols']) {
						if(this.controls['main_changepassword_link']) this.controls.main_changepassword_link.hide();
						if(this.controls['main_deleteuser_link']) this.controls.main_deleteuser_link.hide();
						this.controls.profilepagecontrols.hide();
						this.controls.profileedit_contactname[0].disabled = true;
						this.controls.profileedit_contactname_panel.hide();
						this.controls.profileedit_contactemail[0].disabled = true;
						this.controls.profileedit_contactemail_panel.hide();
					}
					if (this.options.loginNeeded == true) {
						this.commondialogs.toggleDialog({'which':'login'});
					}
					break;
			}
			//handle #register in url hash use case
			if(is_init && window.location.hash.length > 0) {
				if(window.location.hash.indexOf('register') >= 0) {
					//we could handle invitation codes here
					var hashparts = window.location.hash.split('|');
					if(hashparts.length>1 && this.controls['register_invitecode']) {
						this.controls.register_invitecode.val(hashparts[1]);
						if(hashparts.length>2) {
							this.controls.register_invitecodemod.val(hashparts[2]);
							if(hashparts[2] == 'a') {
								this.controls.register_copy.html('Registering will give you a star user profile with the ability to comment immediately. You will also be able to add other users as friends.');
							} else if(hashparts[2] == 's') {
								this.controls.register_copy.html('Registering will give you a user profile with the ability to comment immediately. You will also be able to add other users as friends.');
							}
						}
					}
					window.location.hash = '';
					this.commondialogs.toggleDialog({'which':'register'});
				} else if(window.location.hash.indexOf('login') >= 0) {
					// pop a loginform
					window.location.hash = '';
					this.commondialogs.toggleDialog({'which':'login'});
				} else if(window.location.hash.indexOf('logout') >= 0) {
					// log out
					window.location.hash = '';
					this.mystate = 'loggedin:logging_out:clicked';
					if (this.auth.user.fb_uid) {
						this.auth.fbWhenReady(function() {
							FB.Connect.logout(function() {
								this.xhr.send(this.options.logout_action_url, {});
							}.bind(this));
						}.bind(this));
					} else {
						this.xhr.send(this.options.logout_action_url, {});
					}
				} else if(window.location.hash.indexOf('profiledialog') >= 0) {
					// pop a loginform
					window.location.hash = '';
					this.commondialogs.toggleDialog({'which':'profileedit'});
				} else if(window.location.hash.indexOf('resetpassword') >= 0) {
					// pop a resetpassword form
					window.location.hash = '';
					this.commondialogs.toggleDialog({'which':'resetpw'});
				} else if(window.location.hash.indexOf('deleteuser') >= 0) {
					if(this.auth.authenticated)
					{
						// pop a delete account form
						window.location.hash = '';
						this.commondialogs.toggleDialog({'which':'deleteuser'});
					}
				}
			}
			
			if(initiateLogin == true)
			{
				this.commondialogs.toggleDialog({'which':'login'});
			}

			if (pageType == 'frontpage') {
				jQuery.cookie('ad_url_visited_'+ this.auth.site.canonicalHost.replace(/\./, '_'), 'true', {expires: 2592000, path: '/'});
			}
		},
		sequenceHandler: function(ev) {
			switch(ev.name) {
				case 'presence.requiresequence.fblogin':
					this.triggerFBLogin();
					break;
				case 'presence.requiresequence.login':
					this.commondialogs.toggleDialog({'which':'login'});
					break;
				case 'presence.requiresequence.register':
					this.commondialogs.toggleDialog({'which':'register'});
					break;
				case 'presence.requiresequence.resetpw':
					this.commondialogs.toggleDialog({'which':'resetpw'});
					break;
			}
		},
		resetChangePasswordDialog: function( e ) {
			this.handleNoAsciiMessage( '#noAsciiNotifyChangePassword' );
		},
		
		resetResetPwDialog: function( e ) {
			if( this.recaptchaKey === undefined ) {
				this.recaptchaKey = jQuery( '#resetPwRecaptcha' ).html();
			}
			this.handleNoAsciiMessage( '#noAsciiNotify' );
			Recaptcha.create( this.recaptchaKey, 'resetPwRecaptcha' );
			jQuery( '#resetPassword1' ).show();
			jQuery( '#resetPassword2' ).hide();
			this.controls.resetpwemail.val( '' );
		},
		
		handleNoAsciiMessage: function( id ) {
			if( this.auth !== undefined && this.auth.showNonAsciiNotification !== undefined && this.auth.showNonAsciiNotification === true ) {
				jQuery( id ).show();
				this.xhr.send( '/?op=ajax_nonasciinotified' );
				this.auth.showNonAsciiNotification = false;
			}
			else {
				jQuery( id ).hide();
			}
		},
		
		handleClicks: function(e) {
			var t = this.getParam('cn', e.target);
			var shouldstop = false;
			switch(t) {
				case 'fb_login':
					shouldstop = true;
					this.triggerFBLogin();
					break;
				case 'login_cancel':
					this.xhr.abort();
					// no break here
				case 'togglelogindialog':
					shouldstop = true;
					if (this.inState('loggedout:no_dialog')) {
						this.resetWidget();
					}
					this.commondialogs.toggleDialog({'which':'login'});
					break;
				case 'logout_link':
					shouldstop = true;
					this.mystate = 'loggedin:logging_out:clicked';
					if (this.auth.user.fb_uid) {
						this.auth.fbWhenReady(function() {
							FB.Connect.logout(function() {
								this.xhr.send(this.options.logout_action_url, {});
							}.bind(this));
						}.bind(this));
					} else {
						this.xhr.send(this.options.logout_action_url, {});
					}
					break;
				case 'toggleresetpwdialog':
				case 'resetpw_cancel':
					shouldstop = true;
					this.commondialogs.toggleDialog({'which':'resetpw'});
					break;
				case 'toggleregisterdialog':
				case 'register_cancel':
					shouldstop = true;
					this.commondialogs.toggleDialog({'which':'register'});
					break;
				case 'emailreminder_cancel':
					shouldstop = true;
					//this.commondialogs.toggleDialog({'which':'emailreminder'});
					this.controls.emailreminder_noemail.val(1);
					this.controls.emailreminder_form.submit();
					break;
				case 'togglesubscribedialog':
				case 'subscribe_cancel':
					shouldstop = true;
					this.commondialogs.toggleDialog({'which':'subscribe'});
					break;
				case 'togglecommentsettingsdialog':
				case 'commentsettings_cancel':
					shouldstop = true;
					this.commondialogs.toggleDialog({'which':'commentsettings'});
					break;
				case 'profileedit_newUsername_change':
				    this.controls.profileedit_newUsername_text.hide();
				    this.controls.profileedit_newUsername_change.hide();
				    this.controls.profileedit_newUsername_change_warn.show();
				    this.controls.profileedit_newUsername.show();
				    this.controls.profileedit_newUsername.focus().select();
				    break;
				case 'toggleprofileeditdialog':
				case 'profileedit_cancel':
					shouldstop = true;
					this.commondialogs.toggleDialog({'which':'profileedit'});
					this.controls.profileedit_newUsername.val( this.auth.user.username );
					this.controls.profileedit_newUsername_change_warn.hide();
				    this.controls.profileedit_newUsername.hide();
					this.controls.profileedit_newUsername_text.show();
				    this.controls.profileedit_newUsername_change.show();
					break;
				case 'profileedit_submit':
				    if( this.controls.profileedit_newUsername.val() != this.auth.user.username ) {
				        if( !confirm("Warning! You are only able to change your username once. Once you save your new username, you will not be able to change it again. Are you sure you want to save?") ) {
				            shouldstop = true;
				        }
			        }
				    break;
				case 'editreminder_cancel':
					shouldstop = true;
					this.controls.editreminder_noemail.val(1);
					this.controls.editreminder_form.submit();
					break;
				case 'togglechangepassworddialog':
				case 'changepassword_cancel':
					shouldstop = true;
					if( this.auth.user ) {
						if( this.auth.user.emailuser ) {
							this.commondialogs.toggleDialog({'which':'resetpw'});
						} else {
							this.commondialogs.toggleDialog({'which':'changepassword'});
						}
					}
					else {
						this.openAfterLogin = function( user ) {
							if( user.emailuser ) {
								return 'resetpw';
							}
							return 'changepassword';
						};
						this.commondialogs.toggleDialog({'which':'login'});
					}
					break;
				case 'toggledeleteuserdialog':
				case 'deleteuser_cancel':
					shouldstop = true;
					if( this.auth.user ) {
						this.commondialogs.toggleDialog({'which':'deleteuser'});
					}
					else {
						this.openAfterLogin = function( user ) {
							return 'deleteuser';
						};
						this.commondialogs.toggleDialog({'which':'login'});
					}
					break;
				case 'toggleavataruploaddialog':
				case 'avatarupload_cancel':
					shouldstop = true;
					this.commondialogs.toggleDialog({'which':'avatarupload'});
					break;
				case 'showfollowus':
					shouldstop = true;
					this.showFollowUs();
					break;
				case 'followus_cancel':
					this.commondialogs.toggleDialog({'which':'followus'});
					shouldstop = true;
					break;
				case 'followus':
					this.followUs();
					shouldstop = true;
					break;
				case 'reverifyemaillink':
				case 'verifyemaillink':
					shouldstop = true;
					this.xhr.send( 'index.php?op=ajax_emailverification', { 'action' : 'verifyEmail' } );
					this.controls.verifyemaillink.hide();
					this.controls.reverifyemaillabel.hide();
					this.controls.verifyemailprogress.show();
					break;
				case 'vernotemailprofile':
					shouldstop = true;
					this.commondialogs.toggleDialog({'which':'commentsettings'});
					this.commondialogs.toggleDialog({'which':'profileedit'});
					break;
				case 'closepolicypopup':
					shouldstop = true;
					this.raiseEvent('policypopup.toggle', {});
					break;
			}
			if(shouldstop) {
				e.stopPropagation();
				e.preventDefault();
			}
		},
		policyPopupHandler: function(ev) {
			switch( ev.name ) {
				case 'policypopup.toggle':
					this.commondialogs.toggleDialog({'which':'policy'});
					break;
			}
		},
		triggerFBLogin: function() {
			FB.Bootstrap.requireFeatures(["Connect"], function() {
				FB.Connect.requireSession(function() {
					this.mystate = 'loggedout:login_dialog_active:request_sent';
					this.auth.fbWhenReady(function() {
						this.xhr.send(this.options.facebook_action_url, {'action': 'loginOrRegister'} );
					}.bind(this));
				}.bind(this), true);
			}.bind(this));
			this.disableInputs('login');
		},
	
		showFollowUs : function()
		{
			this.commondialogs.toggleDialog({'which':'followus'});
		},
		
		followUs : function()
		{
			this.controls.followingus.show();
			this.xhr.send( '/index.php?op=ajax_twitter', { 'action' : 'followUs' } );
		},

		handleKeyUp: function(e) {
			switch (e.keyCode) {
				case jQuery.ui.keyCode.ESCAPE:
					this.commondialogs.toggleDialog();
					break;
			}
		},
		handleLoginSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.login_validator.hideErrors();
			if(this.login_validator.validate()) {
				this.mystate = 'loggedout:login_dialog_active:request_sent';
				this.xhr.send(this.options.login_action_url, this.controls.login_form.serialize() );
				this.disableInputs('login');
			} else {
				if(this.options.show_validation_errors) {
					this.login_validator.showErrors();
				}
			}
		},
		handleResetPasswordSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.resetpw_validator.hideErrors();
			if(this.resetpw_validator.validate()) {
				this.mystate = 'loggedout:resetpw_dialog_active:request_sent';
				this.xhr.send(this.options.resetpw_action_url, this.controls.resetpw_form.serialize() );
				this.disableInputs('resetpw');
			} else {
				if(this.options.show_validation_errors) {
					this.resetpw_validator.showErrors();
				}
			}
		},
		handleRegisterSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.register_validator.hideErrors();
			if(this.register_validator.validate()) {
				if ( this.controls.register_email[0].value == '' ) {
					this.controls.emailreminder_username[0].value = this.controls.register_username[0].value;
					this.controls.emailreminder_password[0].value = this.controls.register_password[0].value;
					this.controls.emailreminder_confirm_password[0].value = this.controls.register_confirm_password[0].value;
					this.controls.emailreminder_remember[0].value = this.controls.register_remember[0].checked;
					this.controls.emailreminder_invitecode[0].value = this.controls.register_invitecode[0].value;
					this.controls.emailreminder_invitecodemod[0].value = this.controls.register_invitecodemod[0].value;
					this.commondialogs.toggleDialog({'which':'emailreminder'});
				}
				else {
					this.mystate = 'loggedout:register_dialog_active:request_sent';
					this.xhr.send(this.options.register_action_url, this.controls.register_form.serialize() );
					this.disableInputs('register');
				}
			} else {
				if(this.options.show_validation_errors) {
					this.register_validator.showErrors();
				}
			}
		},
		handleEmailReminderSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.emailreminder_validator.hideErrors();
			if ( this.emailreminder_validator.validate() || this.controls.emailreminder_noemail.val() == 1 ) {
				this.mystate = 'loggedout:emailreminder_dialog_active:request_sent';
				this.xhr.send(this.options.register_action_url, this.controls.emailreminder_form.serialize() );
				this.disableInputs('emailreminder');
			} else {
				if(this.options.show_validation_errors) {
					this.emailreminder_validator.showErrors();
				}
			}
		},
		handleSubscribeSubmit: function(e) {
			this.subscribe_validator.hideErrors();
			if(!this.subscribe_validator.validate()) {
				e.stopPropagation();
				e.preventDefault();
				if(this.options.show_validation_errors) {
					this.subscribe_validator.showErrors();
				}
			} else {
				this.fireEvent('onSubscribeRequestSent', this);
				//have to disable inputs later, otherwise data won't submit
				var _this = this;
				window.setTimeout(function(){_this.disableInputs('subscribe');}, 300);
			}
		},
		handleCommentSettingsSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.mystate = 'loggedin:commentsettings_dialog_active:request_sent';
			this.xhr.send(this.options.setprofile_action_url, this.controls.commentsettings_form.serialize() );
			this.disableInputs('commentsettings');
		},
		handleAvataruploadSubmit: function(e) {
			this.avatarupload_validator.hideErrors();
			if(!this.avatarupload_validator.validate()) {
				e.stopPropagation();
				e.preventDefault();
				if(this.options.show_validation_errors) {
					this.avatarupload_validator.showErrors();
				}
			} else {
				this.mystate = 'loggedin:avatarupload_dialog_active:avatar_request_sent';
				if(this.controls['avatarupload_indicator']) this.controls.avatarupload_indicator.show();
				this.fireEvent('onAvataruploadRequestSent', this);
				//have to disable inputs later, otherwise data won't submit
				var _this = this;
				window.setTimeout(function(){_this.disableInputs('avatarupload');}, 300);
			}
		},

		handleProfileeditSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.profileedit_validator.hideErrors();
			if(this.profileedit_validator.validate()) {
				if ( this.controls.profileedit_email[0].value == '' ) {
				    this.controls.editreminder_newUsername[0].value = this.controls.profileedit_newUsername[0].value;
					this.controls.editreminder_displayName[0].value = this.controls.profileedit_displayname[0].value;
					this.controls.editreminder_url[0].value = this.controls.profileedit_url[0].value;
					this.controls.editreminder_aimname[0].value = this.controls.profileedit_aimname[0].value;
					this.commondialogs.toggleDialog({'which':'editreminder'});
				}
				else
				{
					this.mystate = 'loggedin:profileedit_dialog_active:request_sent';
					this.xhr.send(this.options.setprofile_action_url, this.controls.profileedit_form.serialize() );
					this.disableInputs('profileedit');
				}
			} else {
				if(this.options.show_validation_errors) {
					this.profileedit_validator.showErrors();
				}
			}
		},
		handleEditReminderSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.editreminder_validator.hideErrors();
			if ( this.editreminder_validator.validate()  || this.controls.editreminder_noemail.val() == 1 ) {
				this.mystate = 'loggedin:editreminder_dialog_active:request_sent';
				this.xhr.send(this.options.setprofile_action_url, this.controls.editreminder_form.serialize() );
				this.disableInputs('editreminder');
			} else {
				if(this.options.show_validation_errors) {
					this.editreminder_validator.showErrors();
				}
			}
		},
		handleChangepasswordSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.changepassword_validator.hideErrors();
			if(this.changepassword_validator.validate()) {
				this.mystate = 'loggedin:changepassword_dialog_active:request_sent';
				this.xhr.send(this.options.setprofile_action_url, this.controls.changepassword_form.serialize() );
				this.disableInputs('changepassword');
			} else {
				if(this.options.show_validation_errors) {
					this.changepassword_validator.showErrors();
				}
			}
		},
		handleDeleteUserSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			if(confirm('Are you sure you want to delete your account?'))
			{
				this.mystate = 'loggedin:deleteuser_dialog_active:request_sent';
				this.xhr.send(this.options.deleteuser_action_url, this.controls.deleteuser_form.serialize() );
				this.disableInputs('deleteuser');
			}
		},

		handleAjaxRequest: function() {
			if(this.inState('loggedin:logging_out:clicked')) {
				if(this.controls['logout_indicator']) this.controls.logout_indicator.show();
				this.fireEvent('onLogoutRequestSent', this);
				this.mystate = 'loggedin:logging_out';
			} else if(this.inState('loggedout:login_dialog_active:request_sent')) {
				if(this.controls['login_indicator']) this.controls.login_indicator.show();
				this.fireEvent('onLoginRequestSent', this);
			} else if(this.inState('loggedout:resetpw_dialog_active:request_sent')) {
				if(this.controls['resetpw_indicator']) this.controls.resetpw_indicator.show();
				this.fireEvent('onResetPWRequestSent', this);
			} else if(this.inState('loggedout:register_dialog_active:request_sent')) {
				if(this.controls['register_indicator']) this.controls.register_indicator.show();
				this.fireEvent('onRegisterRequestSent', this);
			} else if(this.inState('loggedout:emailreminder_dialog_active:request_sent')) {
				if(this.controls['emailreminder_indicator']) this.controls.emailreminder_indicator.show();
				this.fireEvent('onRegisterRequestSent', this);
			} else if(this.inState('loggedin:commentsettings_dialog_active:request_sent')) {
				if(this.controls['commentsettings_indicator']) this.controls.commentsettings_indicator.css('display', 'inline');
				this.fireEvent('onCommentSettingsRequestSent', this);
			} else if(this.inState('loggedin:profileedit_dialog_active:request_sent')) {
				if(this.controls['profileedit_indicator']) this.controls.profileedit_indicator.show();
				this.fireEvent('onProfileEditRequestSent', this);
			} else if(this.inState('loggedin:editreminder_dialog_active:request_sent')) {
				if(this.controls['editreminder_indicator']) this.controls.editreminder_indicator.show();
				this.fireEvent('onProfileEditRequestSent', this);
			} else if(this.inState('loggedin:changepassword_dialog_active:request_sent')) {
				if(this.controls['changepassword_indicator']) this.controls.changepassword_indicator.show();
				this.fireEvent('onChangePasswordRequestSent', this);
			} else if(this.inState('loggedin:deleteuser_dialog_active:request_sent')) {
				if(this.controls['deleteuser_indicator']) this.controls.deleteuser_indicator.show();
				this.fireEvent('onDeleteUserRequestSent', this);
			}

		},
		handleAjaxSuccess: function(data) {
			switch(data['action']) {
				case 'login':
				case 'fblogin':
					Message.showMessage(data.message, this.controls.loginmessage[0]);
					if(this.controls.login_indicator) this.controls.login_indicator.hide();
					this.enableInputs('login');
					if(data['success']) {
						this.auth.user = data.user;
						this.auth.authenticated = true;
						this.auth.showNonAsciiNotification = data['showNonAsciiNotification'] ? data['showNonAsciiNotification'] : false;

						if( data.formToken ) this.auth.formToken = data.formToken;
						this.fireEvent('onLoginSuccess', this, true);
						this.syncEffect({'el':this.commondialogs, 'fn':'toggleDialog', 'params':{'which':'login', 'sync_this':this.syncEffect.bind(this)}});
						this.resetWidget({'except':'login_form'});
						this.syncEffect({'el':this, 'fn':'resetWidget', 'params':{'only':'login_form'}});
						this.raiseEvent('user.auth.success', data);
						this.auth.resetRevision();
					} else {
						this.fireEvent('onLoginFailure', this);
					}
					break;
				case 'logout':
					if(data['success']) {
						this.auth.user = false;
						this.auth.authenticated = false;
						if( data.formToken ) this.auth.formToken = data.formToken;
						this.fireEvent('onLogoutSuccess', this);
						this.raiseEvent('user.auth.failure', data);
						this.auth.resetRevision();
					} else {
						this.fireEvent('onLogoutFailure', this);
					}
					if(this.controls.logout_indicator) this.controls.logout_indicator.hide();
					break;
				case 'register':
					Message.showMessage(data.message, this.controls.registermessage[0]);
					Message.showMessage(data.message, this.controls.emailremindermessage[0]);
					if(this.controls.register_indicator) this.controls.register_indicator.hide();
					if(this.controls.emailreminder_indicator) this.controls.emailreminder_indicator.hide();
					this.enableInputs('register');
					this.enableInputs('emailreminder');
					if(data['success']) {
						this.auth.user = data.user;
						this.auth.authenticated = true;
						if( data.formToken ) this.auth.formToken = data.formToken;
						this.fireEvent('onRegisterSuccess', this, true);
						this.syncEffect({'el':this.commondialogs, 'fn':'toggleDialog', 'params':{'which': ( this.inState('loggedout:register_dialog_active:request_sent') ? 'register' : 'emailreminder' ), 'sync_this':this.syncEffect.bind(this)}});
						this.resetWidget({'except':'register_form'});
						this.resetWidget({'except':'emailreminder_form'});
						this.syncEffect({'el':this, 'fn':'resetWidget', 'params':{'only':'register_form'}});
						this.syncEffect({'el':this, 'fn':'resetWidget', 'params':{'only':'emailreminder_form'}});
						this.raiseEvent('user.auth.success', data);
						this.auth.resetRevision();
					} else {
						this.fireEvent('onRegisterFailure', this);
					}
					break;
				case 'resetpassword':
					if(data['success']) {
						//this.commondialogs.toggleDialog({'which':'resetpw'});
						jQuery('#resetPassword1').hide();
						jQuery('#resetPassword2').show();
						this.fireEvent('onResetPWSuccess', this);
					} else {
						this.fireEvent('onResetPWFailure', this);
					}
					Message.showMessage(data.message, this.controls.resetpwmessage[0]);
					if(this.controls.resetpw_indicator) this.controls.resetpw_indicator.hide();
					this.enableInputs('resetpw');
					break;
				case 'setprofile':
					if(this.inState('loggedin:changepassword_dialog_active:request_sent')) {
						if(data['success']) {
							Message.showMessage( 'Password saved.', this.controls.changepassword_message[0], {stable: false});
							this.commondialogs.toggleDialog({'which':'changepassword'});
						} else {
							Message.showMessage( '<p>To protect your account\'s security, we\'ve locked the ability for this account to change passwords without email authentication.</p><p>To reset your password, please ensure that your email address is up to date in your profile, click the "reset password" link at the top of the page and enter your updated email address.</p><p>If you are still having trouble with your account, please contact us at <a href="mailto:help@gawker.com">help@gawker.com</a></p>', this.controls.changepassword_messagebig[0], {stable: true});
						}
						if(this.controls['changepassword_indicator']) this.controls.changepassword_indicator.hide();
						this.enableInputs('changepassword');
					} else if(this.inState('loggedin:deleteuser_dialog_active:request_sent')) {
						if(data['success']) {
							Message.showMessage( 'Account deleted.', this.controls.deleteuser_message[0], {stable: false});
							this.commondialogs.toggleDialog({'which':'deleteuser'});
						} else {
							Message.showMessage( 'Account deletion failed. Please contact <a href="help@gawker.com">help@gawker.com</a>', this.controls.deleteuser_messagebig[0], {stable: true});
						}
						if(this.controls['deleteuser_indicator']) this.controls.deleteuser_indicator.hide();
						this.enableInputs('deleteuser');
						if(data['success']) {
							location.href = '/people/' + data['username'] + '#logout';
						}
					} else if(this.inState('loggedin:profileedit_dialog_active:request_sent') || this.inState('loggedin:editreminder_dialog_active:request_sent')) {
						if(data['success']) {
							Message.showMessage( 'Profile saved.', this.controls.profileedit_message[0], {stable: false});
							Message.showMessage( 'Profile saved.', this.controls.editreminder_message[0], {stable: false});
							if( data['usernamechanged'] === true ) {
                                location.href = data['redirectUrl'];
							}
							this.auth.user.username = this.controls.profileedit_newUsername.val();
							this.auth.user.smartName = this.controls.profileedit_displayname.val();
							this.auth.user['url'] = this.controls.profileedit_url.val();
							this.auth.user['email'] = this.controls.profileedit_email.val();
							this.auth.user['aimname'] = this.controls.profileedit_aimname.val();
							if(this.controls['profileedit_extended']) {
								for(var i=0,l=this.controls.profileedit_extended.length;i<l;i++) {
									var extname = this.getParam('ext', this.controls.profileedit_extended[i]);
									this.auth.user[extname] = this.controls.profileedit_extended.eq(i).val();
								}
							}
							this.commondialogs.toggleDialog({'which': ( this.inState('loggedin:profileedit_dialog_active:request_sent') ? 'profileedit' : 'editreminder' )});
							this.auth.resetRevision();
							this.xhr.send( 'index.php?op=ajax_emailverification', { 'action' : 'isVerified' } );
						} else {
							Message.showMessage( data['message'], this.controls.profileedit_message[0], {stable: false});
							Message.showMessage( data['message'], this.controls.editreminder_message[0], {stable: false});
							if(this.controls['editreminder_indicator']) this.controls.editreminder_indicator.hide();
							this.enableInputs('editreminder');
							
							this.commondialogs.toggleDialog({'which':'editreminder'});
						}
						if(this.controls['profileedit_indicator']) this.controls.profileedit_indicator.hide();
						this.enableInputs('profileedit');
					} else if(this.inState('loggedin:commentsettings_dialog_active:request_sent')) {
						if(data['success']) {
							this.commondialogs.toggleDialog({'which':'commentsettings'});
							this.auth.user.commentViewMode = data.user.commentViewMode;
							this.auth.user.commentOrder = data.user.commentOrder;
							this.auth.resetRevision();
						} else {
							Message.showMessage( 'Save failed.', this.controls.commentsettings_message[0], {stable: false});
						}
						if(this.controls.commentsettings_indicator) this.controls.commentsettings_indicator.hide();
						this.enableInputs('commentsettings');
					}
					break;
				case 'avatarupload':
					if(data['success']) {
						this.controls['profileedit_avatarimage'].attr({'src':data.big});
						this.auth.user.avatarPath = data.big;
						Message.showMessage( data.message, this.controls.avatarupload_message[0], {stable: false});
						this.mystate = 'loggedin:avatarupload_dialog_active';
						this.commondialogs.toggleDialog({'which':'avatarupload'});
						this.auth.resetRevision();
						this.fireEvent('onAvataruploadSuccess', this);
					} else {
						this.fireEvent('onAvataruploadFailure', this);
						Message.showMessage( data.message, this.controls.avatarupload_message[0], {stable: false});
					}
					if(this.controls['avatarupload_indicator']) this.controls.avatarupload_indicator.hide();
					this.enableInputs('avatarupload');
					break;
				case 'saveLink':
				case 'link':
					if( data['success'] && data['redirectUrl'] )
					{
						location.href = data['redirectUrl'];
					}
					break;
				case 'followUs':
					this.commondialogs.toggleDialog({'which':'followus'});
					break;
				case 'isVerified':
					if( data['success'] )
					{
						if( this.controls['verifyemaillabel'] )
						{
							if( data['verified'] || !this.auth.user['email'] )
							{
								this.controls.verifyemaillabel.hide();
							}
							else 
							{
								this.controls.verifyemaillabel.show();
								if( data['verificationSent'] )
								{
									this.controls.verifyemaillink.hide();
									this.controls.reverifyemaillabel.show();
								}
								else
								{
									this.controls.verifyemaillink.show();
									this.controls.reverifyemaillabel.hide();
								}
							}
						}
						if( this.controls['vernotifemail'] )
						{
							if( data['verified'] )
							{
								this.controls.vernotifemailrow.show();
								this.controls.vernotifemailmsgrow.hide();
								this.controls.vernotifemail.get( 0 ).checked = data['subscribed'];
							}
							else
							{
								this.controls.vernotifemailrow.hide();
								this.controls.vernotifemailmsgrow.show();
								this.controls.vernotifemail.get( 0 ).checked = false;
							}
						}
						if( this.controls['vernotifemail'] )
						{
							
						}
					}
					break;
				case 'verifyEmail':
					this.controls.verifyemaillink.hide();
					this.controls.verifyemailprogress.hide();
					this.controls.reverifyemaillabel.show();
					if( this.controls['profileedit_indicator'] )
					{
						this.controls.profileedit_indicator.hide();
					}
					break;
			};
		},
		handleAjaxFail: function() {
			if(this.inState('loggedin')) {
				if(this.inState('loggedin:logging_out')) {
					if(this.controls.logout_indicator) this.controls.logout_indicator.hide();
					this.fireEvent('onLogoutFailure', this);
					this.mystate = 'loggedin';
				} else if(this.inState('loggedin:commentsettings_dialog_active:request_sent')) {
					if(this.controls['commentsettings_indicator']) this.controls.commentsettings_indicator.css('display', 'none');
					this.fireEvent('onCommentSettingsRequestFail', this);
					this.mystate = 'loggedin:commentsettings_dialog_active';
				} else if(this.inState('loggedin:profileedit_dialog_active:request_sent')) {
					if(this.controls['profileedit_indicator']) this.controls.profileedit_indicator.hide();
					this.fireEvent('onProfileEditRequestFail', this);
					this.mystate = 'loggedin:profileedit_dialog_active';
				} else if(this.inState('loggedout:editreminder_dialog_active:request_sent')) {
					if(this.controls['editreminder_indicator']) this.controls.editreminder_indicator.hide();
					this.fireEvent('onProfileEditRequestFail', this);
					this.mystate = 'loggedout:editreminder_dialog_active';
				} else if(this.inState('loggedin:changepassword_dialog_active:request_sent')) {
					if(this.controls['changepassword_indicator']) this.controls.changepassword_indicator.hide();
					this.fireEvent('onChangePasswordRequestFail', this);
					this.mystate = 'loggedin:changepassword_dialog_active';
				} else if(this.inState('loggedin:deleteuser_dialog_active:request_sent')) {
					if(this.controls['deleteuser_indicator']) this.controls.deleteuser_indicator.hide();
					this.fireEvent('onDeleteUserRequestFail', this);
					this.mystate = 'loggedin:deleteuser_dialog_active';
				}
			} else {
				if(this.inState('loggedout:login_dialog_active:request_sent')) {
					if(this.controls.login_indicator) this.controls.login_indicator.hide();
					this.fireEvent('onLoginRequestFail', this);
					this.mystate = 'loggedout:login_dialog_active';
					this.enableInputs('login');
				} else if(this.inState('loggedout:resetpw_dialog_active:request_sent')) {
					if(this.controls.resetpw_indicator) this.controls.resetpw_indicator.hide();
					this.fireEvent('onResetPWRequestFail', this);
					this.mystate = 'loggedout:resetpw_dialog_active';
					this.enableInputs('resetpw');
				} else if(this.inState('loggedout:register_dialog_active:request_sent')) {
					if(this.controls.register_indicator) this.controls.register_indicator.hide();
					this.fireEvent('onRegisterRequestFail', this);
					this.mystate = 'loggedout:register_dialog_active';
					this.enableInputs('register');
				} else if(this.inState('loggedout:emailreminder_dialog_active:request_sent')) {
					if(this.controls.emailreminder_indicator) this.controls.emailreminder_indicator.hide();
					this.fireEvent('onRegisterRequestFail', this);
					this.mystate = 'loggedout:emailreminder_dialog_active';
					this.enableInputs('emailreminder');
				}
			}
		},
		disableInputs: function(which) {
			switch(which) {
			case 'login':
				this.controls.username[0].disabled = true;
				this.controls.password[0].disabled = true;
				this.controls.login_button[0].disabled = true;
				break;
			case 'resetpw':
				this.controls.resetpwemail[0].disabled = true;
				this.controls.resetpw_submit[0].disabled = true;
				this.controls.resetpw_cancel[0].disabled = true;
				break;
			case 'register':
				this.controls.register_username[0].disabled = true;
				this.controls.register_password[0].disabled = true;
				this.controls.register_confirm_password[0].disabled = true;
				this.controls.register_email[0].disabled = true;
				this.controls.register_remember[0].disabled = true;
				this.controls.register_submit[0].disabled = true;
				this.controls.register_cancel[0].disabled = true;
				break;
			case 'subscribe':
				this.controls.subscribe_email[0].disabled = true;
				this.controls.subscribe_submit[0].disabled = true;
				this.controls.subscribe_cancel[0].disabled = true;
				break;
			case 'commentsettings':
				this.controls.commentsettings_submit[0].disabled = true;
				this.controls.commentsettings_cancel[0].disabled = true;
				this.controls.cvm_featured[0].disabled = true;
				this.controls.cvm_hidden[0].disabled = true;
				this.controls.crm_expanded[0].disabled = true;
				this.controls.crm_collapsed[0].disabled = true;
				this.controls.corder_desc[0].disabled = true;
				this.controls.corder_asc[0].disabled = true;
				break;
			case 'profileedit':
    		    this.controls.profileedit_newUsername[0].disabled = true;
				this.controls.profileedit_displayname[0].disabled = true;
				this.controls.profileedit_url[0].disabled = true;
				this.controls.profileedit_email[0].disabled = true;
				this.controls.profileedit_aimname[0].disabled = true;
				if(this.controls['profileedit_extended']) {
					for(var i=0,l=this.controls.profileedit_extended.length;i<l;i++) {
						var extname = this.getParam('ext', this.controls.profileedit_extended[i]);
						this.controls.profileedit_extended[i].disabled = true;
					}
				}
				if(this.auth.authenticated && this.auth.hasLevel('authors')) {
					this.controls.profileedit_contactname[0].disabled = true;
					this.controls.profileedit_contactemail[0].disabled = true;
				}
				this.controls.profileedit_submit[0].disabled = true;
				this.controls.profileedit_cancel[0].disabled = true;
				break;
			case 'changepassword':
				this.controls.changepassword_password[0].disabled = true;
				this.controls.changepassword_new_password[0].disabled = true;
				this.controls.changepassword_confirm_password[0].disabled = true;
				this.controls.changepassword_submit[0].disabled = true;
				this.controls.changepassword_cancel[0].disabled = true;
				break;
			case 'deleteuser':
				this.controls.deleteuser_submit[0].disabled = true;
				this.controls.deleteuser_cancel[0].disabled = true;
				break;
			case 'avatarupload':
				this.controls.avatarupload_file[0].disabled = true;
				this.controls.avatarupload_submit[0].disabled = true;
				this.controls.avatarupload_cancel[0].disabled = true;
				break;
			}
		},
		enableInputs: function(which) {
			switch(which) {
			case 'login':
				this.controls.username[0].disabled = false;
				this.controls.password[0].disabled = false;
				this.controls.login_button[0].disabled = false;
				break;
			case 'resetpw':
				this.controls.resetpwemail[0].disabled = false;
				this.controls.resetpw_submit[0].disabled = false;
				this.controls.resetpw_cancel[0].disabled = false;
				break;
			case 'register':
				this.controls.register_username[0].disabled = false;
				this.controls.register_password[0].disabled = false;
				this.controls.register_confirm_password[0].disabled = false;
				this.controls.register_email[0].disabled = false;
				this.controls.register_remember[0].disabled = false;
				this.controls.register_submit[0].disabled = false;
				this.controls.register_cancel[0].disabled = false;
				break;
			case 'subscribe':
				this.controls.subscribe_email[0].disabled = false;
				this.controls.subscribe_submit[0].disabled = false;
				this.controls.subscribe_cancel[0].disabled = false;
				break;
			case 'commentsettings':
				this.controls.commentsettings_submit[0].disabled = false;
				this.controls.commentsettings_cancel[0].disabled = false;
				if(this.controls.togglecommentsettingsdialog && this.controls.togglecommentsettingsdialog[1]) this.controls.togglecommentsettingsdialog[1].disabled = false;
				this.controls.cvm_featured[0].disabled = false;
				this.controls.cvm_hidden[0].disabled = false;
				this.controls.crm_expanded[0].disabled = false;
				this.controls.crm_collapsed[0].disabled = false;
				this.controls.corder_desc[0].disabled = false;
				this.controls.corder_asc[0].disabled = false;
				break;
			case 'profileedit':
			    if( this.auth.authenticated && (typeof(this.auth.user.oldUsername) == 'undefined' || this.auth.user.oldUsername == null )) {
			        this.controls.profileedit_newUsername[0].disabled = false;
			        this.controls.profileedit_newUsername.hide();
			    } else {
			        this.controls.profileedit_newUsername[0].disabled = true; // needs forcing
			        this.controls.profileedit_newUsername.parent().hide(); // totally hide field
			    }
				this.controls.profileedit_displayname[0].disabled = false;
				this.controls.profileedit_url[0].disabled = false;
				this.controls.profileedit_email[0].disabled = false;
				this.controls.profileedit_aimname[0].disabled = false;
				if(this.controls['profileedit_extended']) {
					for(var i=0,l=this.controls.profileedit_extended.length;i<l;i++) {
						var extname = this.getParam('ext', this.controls.profileedit_extended[i]);
						this.controls.profileedit_extended[i].disabled = false;
					}
				}
				if(this.auth.authenticated && this.auth.hasLevel('authors')) {
					this.controls.profileedit_contactname[0].disabled = false;
					this.controls.profileedit_contactemail[0].disabled = false;
				}
				this.controls.profileedit_submit[0].disabled = false;
				this.controls.profileedit_cancel[0].disabled = false;
				break;
			case 'changepassword':
				this.controls.changepassword_password[0].disabled = false;
				this.controls.changepassword_new_password[0].disabled = false;
				this.controls.changepassword_confirm_password[0].disabled = false;
				this.controls.changepassword_submit[0].disabled = false;
				this.controls.changepassword_cancel[0].disabled = false;
				break;
			case 'deleteuser':
				this.controls.deleteuser_submit[0].disabled = false;
				this.controls.deleteuser_cancel[0].disabled = false;
				break;
			case 'avatarupload':
				this.controls.avatarupload_file[0].disabled = false;
				this.controls.avatarupload_submit[0].disabled = false;
				this.controls.avatarupload_cancel[0].disabled = false;
				break;
			}
		},
		resetWidget: function(params) {
			if(!params) params={'except':false, 'only':false};
			else {
				if(!params['except']) params['except'] = false;
				if(!params['only']) params['only'] = false;
			}
			var mustbreak = params['only']?true:false;
			switch(params['only']) {
				default:
				case 'login_form':
					if(this.controls['login_form'] && params['except']!=='login_form') {
						this.controls.login_form[0].reset();
						this.login_validator.hideErrors();
						this.controls.login_button[0].value = 'Login';
						this.controls.login_indicator.hide();
						this.enableInputs('login');
					}
					if(mustbreak) break;
				case 'resetpw_form':
					if(this.controls['resetpw_form'] && params['except']!=='resetpw_form') {
						this.controls.resetpw_form[0].reset();
						this.resetpw_validator.hideErrors();
						this.enableInputs('resetpw');
					}
					if(mustbreak) break;
				case 'register_form':
					if(this.controls['register_form'] && params['except']!=='register_form') {
						this.controls.register_form[0].reset();
						this.register_validator.hideErrors();
						this.enableInputs('register');
					}
					if(mustbreak) break;
				case 'subscribe_form':
					if(this.controls['subscribe_form'] && params['except']!=='subscribe_form') {
						this.controls.subscribe_form[0].reset();
						this.subscribe_validator.hideErrors();
						this.enableInputs('subscribe');
					}
					if(mustbreak) break;
				case 'commentsettings_form':
					if(this.controls['commentsettings_form'] && params['except']!=='commentsettings_form') {
						this.controls.commentsettings_form[0].reset();
						this.enableInputs('commentsettings');
					}
					if(mustbreak) break;
				case 'profileedit_form':
					if(this.controls['profileedit_form'] && params['except']!=='profileedit_form') {
						this.controls.profileedit_form[0].reset();
						this.enableInputs('profileedit');
					}
					if(mustbreak) break;
				case 'avatarupload_form':
					if(this.controls['avatarupload_form'] && params['except']!=='avatarupload_form') {
						this.controls.avatarupload_form[0].reset();
						this.enableInputs('avatarupload');
					}
					if(mustbreak) break;
				case 'changepassword_form':
					if(this.controls['changepassword_form'] && params['except']!=='changepassword_form') {
						this.controls.changepassword_form[0].reset();
						this.enableInputs('changepassword');
					}
					if(mustbreak) break;
				case 'deleteuser_form':
					if(this.controls['deleteuser_form'] && params['except']!=='deleteuser_form') {
						this.controls.deleteuser_form[0].reset();
						this.enableInputs('deleteuser');
					}
					if(mustbreak) break;
			}
		},
		setupProfileForms: function() {
			if(this.auth.authenticated) {
				if(this.controls['profileedit_form']) {
				    this.controls.profileedit_newUsername_text.html(this.auth.user.username);
				    this.controls.profileedit_newUsername.val(this.auth.user.username);
					this.controls.profileedit_displayname.val(this.auth.user.smartName);
					this.controls.profileedit_url.val(this.auth.user['url'] ? this.auth.user['url'] : '');
					this.controls.profileedit_email.val(this.auth.user['email'] ? this.auth.user['email'] : '');
					this.controls.profileedit_aimname.val(this.auth.user['aimname'] ? this.auth.user['aimname'] : '');
					if(this.controls['profileedit_extended']) {
						for(var i=0,l=this.controls.profileedit_extended.length;i<l;i++) {
							var extname = this.getParam('ext', this.controls.profileedit_extended[i]);
							this.controls.profileedit_extended.eq(i).val(this.auth.user[extname] ? this.auth.user[extname] : '');
						}
					}
					if(this.auth.hasLevel('authors')) {
						this.controls.profileedit_contactname[0].disabled = false;
						this.controls.profileedit_contactname_panel.show();
						this.controls.profileedit_contactemail[0].disabled = false;
						this.controls.profileedit_contactemail_panel.show();
						this.controls.profileedit_contactname.val(this.auth.user['contactName']?this.auth.user['contactName']:'');
						this.controls.profileedit_contactemail.val(this.auth.user['contactEmail']?this.auth.user['contactEmail']:'');
					} else {
						this.controls.profileedit_contactname.val('');
						this.controls.profileedit_contactemail.val('');
						this.controls.profileedit_contactname[0].disabled = true;
						this.controls.profileedit_contactname_panel.hide();
						this.controls.profileedit_contactemail[0].disabled = true;
						this.controls.profileedit_contactemail_panel.hide();
					}
				}
				if(this.controls['avatarupload_form']) {
					if(this.controls['profileedit_avatarimage']) this.controls['profileedit_avatarimage'].attr({'src':this.options.commenterimage_host_prefix + this.auth.user.avatarPath + this.options.commenterimage_host_postfix});
					this.controls.avatarupload_authtoken.val(this.auth.user['authToken']?this.auth.user['authToken']:'');
				}
				if(this.controls['changepassword_form']) {
					this.controls.changepassword_username.val(this.auth.user.username);
					this.controls.changepassword_id.val(this.auth.user.id);
					this.controls.changepassword_password.val('');
					this.controls.changepassword_new_password.val('');
					this.controls.changepassword_confirm_password.val('');
				}
				if(this.controls['deleteuser_form']) {
					this.controls.deleteuser_username.val(this.auth.user.username);
					this.controls.deleteuser_id.val(this.auth.user.id);
				}
				if(this.controls['commentsettings_form']) {
					if( this.auth.user['commentViewMode'] && this.auth.user['commentViewMode'] == 'featured' ) {
						this.controls.cvm_hidden[0].checked = 'false';
						this.controls.cvm_featured[0].checked = 'true';
					} else {
						this.controls.cvm_featured[0].checked = 'false';
						this.controls.cvm_hidden[0].checked = 'true';
					}
					if( this.auth.user['commentRepliesMode'] && this.auth.user['commentRepliesMode'] == 'expanded' ) {
						this.controls.crm_collapsed[0].checked = 'false';
						this.controls.crm_expanded[0].checked = 'true';
					} else {
						this.controls.crm_expanded[0].checked = 'false';
						this.controls.crm_collapsed[0].checked = 'true';
					}
					if( this.auth.user['commentOrder'] && this.auth.user['commentOrder'] == 'asc' ) {
						this.controls.corder_desc[0].checked = 'false';
						this.controls.corder_asc[0].checked = 'true';
					} else {
						this.controls.corder_asc[0].checked = 'false';
						this.controls.corder_desc[0].checked = 'true';
					}
				}
			}
		}
	});

	$.extend($.ui.PresenceWidget, {
		version: '1.0',
		defaults: {
			controlClass: 'presence_control',
			selectors:{},
			show_validation_errors: true,
			isReloading: true,
			loginNeeded: false,
			facebook_action_url: '/?op=fb',
			login_action_url: '/?op=ajax_login',
			logout_action_url: '/?op=ajax_logout',
			register_action_url: '/?op=register',
			resetpw_action_url: '/?op=emailpassword',
			setprofile_action_url: '/?op=setprofile',
			deleteuser_action_url: '/?op=deleteuser',
			externalElement: '.presence_control_external',
			commenterimage_host_prefix: 'http://cache.gawkerassets.com/assets/images/commenter/',
			commenterimage_host_postfix: '_160.jpg',

			// LOGIN
			'onLoginRequestSent': function(wg) { wg.controls.login_button[0].value='Logging in...';	},
			'onLoginRequestFail': function(wg) { Message.showMessage('Login failed', wg.controls.login_button[0], {'nextMessage': 'Login'}); },
			'onLoginSuccess': function(wg) {
				Message.showMessage('Logged in', wg.controls.login_button[0], {'nextMessage': 'Login'});
				window.setTimeout(function(){wg.syncEffect();}, 500);
				if(wg.options.isReloading == true) window.location.reload();
				return 'will_sync';
			},
			'onLoginFailure': function(wg) { Message.showMessage('Login failed', wg.controls.login_button[0], {'nextMessage': 'Login'}); },
			'onLoginPanelShow':function(wg) {
				wg.controls.login_panel.fadeIn(500, function(){
					wg.syncEffect();
				});
				return 'will_sync';
			},
			'onLoginPanelHide':function(wg) { wg.controls.login_panel.fadeOut(500, function(){wg.syncEffect();}); return 'will_sync';},

			// LOGOUT
			'onLogoutRequestSent': function(wg) {
								wg.controls.logout_link.html('Logging out...');
								wg.controls.profile_link.html('');
							    },
			'onLogoutRequestFail': function(wg) {
								wg.controls.logout_link.html('Logging out...');
								wg.controls.profile_link.html('');
							    },
			'onLogoutSuccess': function(wg) {
				if (wg.options.isReloading == true) {
					window.location.reload();
				} else {
					Message.showMessage('Logged out', wg.controls.logout_link[0], {'nextMessage': 'logout'});
				}
			},
			'onLogoutFailure': function(wg) { Message.showMessage('Logout failed', wg.controls.logout_link[0], {'nextMessage': 'logout'}); },
			'onLogoutPanelShow':function(wg) { wg.controls.logout_panel.fadeIn(500, function(){wg.syncEffect();}); return 'will_sync';},
			'onLogoutPanelHide':function(wg) { wg.controls.logout_panel.fadeOut(500, function(){wg.syncEffect();}); return 'will_sync';},

			// RESET PASSWORD
			'onResetPWRequestSent': function(wg) { wg.controls.resetpw_submit[0].value='Resetting...';},
			'onResetPWRequestFail': function(wg) { Message.showMessage('Reset failed', wg.controls.resetpw_submit[0], {'nextMessage': 'Reset'}); },
			'onResetPWSuccess': function(wg) { Message.showMessage('Password sent', wg.controls.resetpw_submit[0], {'nextMessage': 'Reset'}); },
			'onResetPWFailure': function(wg) { Message.showMessage('Reset failed', wg.controls.resetpw_submit[0], {'nextMessage': 'Reset'}); },

			// REGISTER
			'onRegisterRequestSent': function(wg) { wg.controls.register_submit[0].value='Registering...';},
			'onRegisterRequestFail': function(wg) { Message.showMessage('Register failed', wg.controls.register_submit[0], {'nextMessage': 'Register'}); },
			'onRegisterSuccess': function(wg) { Message.showMessage('Done', wg.controls.register_submit[0], {'nextMessage': 'Register'}); window.setTimeout(function(){wg.syncEffect();}, 1000); return 'will_sync';},
			'onRegisterFailure': function(wg) { Message.showMessage('Register failed', wg.controls.register_submit[0], {'nextMessage': 'Register'}); },

			// SUBSCRIBE
			'onSubscribeRequestSent': function(wg) { wg.controls.subscribe_submit[0].value='Subscribing...';},

			//COMMENT SETTINGS
			'onCommentSettingsRequestSent':function(wg) { },

			// PROFILE EDIT
			'onProfileeditRequestSent': function(wg) { wg.controls.profileedit_submit[0].value='Saving profile...';},
			'onProfileeditRequestFail': function(wg) { Message.showMessage('Profile save failed.', wg.controls.profileedit_submit[0], {'nextMessage': 'Save profile'}); },
			'onProfileeditSuccess': function(wg) { Message.showMessage('Done', wg.controls.profileedit_submit[0], {'nextMessage': 'Save profile'}); },
			'onProfileeditFailure': function(wg) { Message.showMessage('Profile save failed.', wg.controls.profileedit_submit[0], {'nextMessage': 'Save profile'}); },

			// CHANGE PASSWORD
			'onChangepasswordRequestSent': function(wg) { wg.controls.changepassword_submit[0].value='Saving password...';},
			'onChangepasswordRequestFail': function(wg) { Message.showMessage('Password save failed.', wg.controls.changepassword_submit[0], {'nextMessage': 'Save'}); },
			'onChangepasswordSuccess': function(wg) { Message.showMessage('Done', wg.controls.changepassword_submit[0], {'nextMessage': 'Save'}); },
			'onChangepasswordFailure': function(wg) { Message.showMessage('<p>To protect your account\'s security, we\'ve locked the ability for this account to change passwords without email authentication.</p><p>To reset your password, please ensure that your email address is up to date in your profile, click the "reset password" link at the top of the page and enter your updated email address.</p><p>If you are still having trouble with your account, please contact us at <a href="mailto:help@gawker.com">help@gawker.com</a></p>', wg.controls.changepassword_submit[0], {'nextMessage': 'Save', duration: 10000}); },

			// DELETE USER
			'onDeleteUserRequestSent': function(wg) { wg.controls.deleteuser_submit[0].value='Deleting Account...';},
			'onDeleteUserRequestFail': function(wg) { Message.showMessage('Account deletion failed.', wg.controls.deleteuser_submit[0], {'nextMessage': 'Delete Account'}); },
			'onDeleteUserSuccess': function(wg) { Message.showMessage('Done', wg.controls.changepassword_submit[0], {'nextMessage': 'Delete Account'}); },
			'onDeleteUserFailure': function(wg) { Message.showMessage('Account deletion failed. Please contact <a href="mailto:help@gawker.com">help@gawker.com</a>.', wg.controls.deleteuser_submit[0], {'nextMessage': 'Delete Account', duration: 10000}); },

			// AVATARUPLOAD
			'onAvataruploadRequestSent': function(wg) { wg.controls.avatarupload_submit[0].value='Sending image...';},
			'onAvataruploadRequestFail': function(wg) { Message.showMessage('Image upload failed.', wg.controls.avatarupload_submit[0], {'nextMessage': 'upload image'}); },
			'onAvataruploadSuccess': function(wg) { Message.showMessage('Done', wg.controls.avatarupload_submit[0], {'nextMessage': 'upload image'}); },
			'onAvataruploadFailure': function(wg) { Message.showMessage('Image upload failed.', wg.controls.avatarupload_submit[0], {'nextMessage': 'upload image'}); }

		}
	});

})(jQuery);
