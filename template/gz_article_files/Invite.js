(function($) {
	$.widget('ui.InviteWidget', {

		initialize: function() {
			// setup XHR object
			this.xhr = new XHR({
				klass: 'invite',
				beforeSend: this.handleAjaxRequest.bind(this),
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});

			var panels = {};
			var should_init_panels = false;
			if(this.controls['starinvite_form']) {
				panels['starinvite'] = {'el':this.controls.starinvite_dialog, 'focus':this.controls.starinvite_email};
				this.starinvite_validator = new Validator(jQuery.extend({}, {'scope': this.controls['starinvite_form']} ));
				this.registerEventHandler(this.controls.starinvite_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.starinvite_form, 'submit', this.handleStarInviteSubmit.bind(this));
				this.controls.starinvite_form[0].reset();
				should_init_panels = true;
			}
			if(should_init_panels) this.commondialogs.initDialogs({'overlay':this.controls.overlay, 'panels':panels, 'group':this.options['dialoggroup']?this.options['dialoggroup']:false});

			this.registerEventHandler(this.element, 'click', this.handleClick.bind(this));
			this.subscribeForEvent('user.auth.', this.authEventHandler.bind(this));
			this.subscribeForEvent('comment.commentlistupdated', this.commentListUpdated.bind(this) );

		},

		commentListUpdated: function(ev) {
			this.setControls();
		},

		authEventHandler: function(ev) {
			switch(ev.name) {
				case 'user.auth.success':
					var should_show = false;
					if(this.controls['i']) {
						if(this.auth.hasLevel('commentadmins') ) {
							//limits won't apply for admins
							var oldlimit = this.controls.starinvite_email[0].className.split('valid_limit_comma-').pop().split(' ')[0]
							this.controls.starinvite_email.removeClass('valid_limit_comma-' + oldlimit);
							this.starinvite_validator.setupInfield(this.controls.starinvite_email[0]);
							this.controls.starinvite_left.html('');
							should_show = true;
						} else if(this.auth.hasLevel('commenters')) {
							var limit = this.auth.user.invite.limitnormal;
							var epoch = this.auth.user.invite.epoch;
							var timeframe = this.auth.user.invite.timeframe;
							if ( this.auth.hasLevel('starcommenters') ) { limit = this.auth.user.invite.limitstar; }
							limit = parseInt(limit, 10);
							var lft = limit?limit:10;
							if(window['myUserLocation'] && window['myUserLocation']['t'] && this.auth.user['lastInviteTime']) {
								var lit = parseInt(this.auth.user['lastInviteTime'], 10);
								if((myUserLocation.t - lit) < (timeframe - ((lit-epoch) % timeframe))) {
									lft = limit - parseInt( this.auth.user.recentInviteCount, 10);
								}
							}
							var oldlimit = this.controls.starinvite_email[0].className.split('valid_limit_comma-').pop().split(' ')[0]
							this.controls.starinvite_email.removeClass('valid_limit_comma-' + oldlimit).addClass('valid_limit_comma-'+lft);
							this.starinvite_validator.setupInfield(this.controls.starinvite_email[0]);
							this.controls.starinvite_left.html('('+lft + ' left)');
							if(lft > 0) {
								should_show = true;
							}
						}
					}
					if ( should_show ) {
						if ( this.getParam( 'postId', this.controls.i[0] ) ) {
							this.controls.i.show();
						}
					} else this.controls.i.hide()
					break;
				case 'user.auth.failure':
					if(this.controls['i']) { this.controls.i.hide(); }
					break;
			}
		},

		handleClick: function(e) {
			var t = this.getParam('cn', e.target);
			switch(t) {
				case 'i':
					this.toggleInviteDialog();
					postId = this.getParam('postId', e.target);
					commentId = this.getParam('cId', e.target);
					if ( postId ) {
						this.controls.starinvite_postid.val( postId );
					} else {
						this.controls.starinvite_commentid.val( commentId );
					}

					break;
				case 'starinvite_cancel':
					this.toggleInviteDialog();
					break;
				default:
					return true;
					break;
			}

			e.stopPropagation();
			e.preventDefault();
			return false;
		},
		handleKeyUp: function(e) {
			switch (e.keyCode) {
				case jQuery.ui.keyCode.ESCAPE:
					this.commondialogs.toggleDialog();
					break;
			}
		},
		handleStarInviteSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.starinvite_validator.hideErrors();
			if(this.starinvite_validator.validate()) {
				this.mystate = 'starinvite_sent';
				this.xhr.send(this.options.starinvite_action_url, this.controls.starinvite_form.serialize());
			} else {
				this.mystate = 'starinvite_dialog_visible';
				if(this.options.show_validation_errors) {
					this.starinvite_validator.showErrors();
				}
			}
		},

		handleAjaxRequest: function() {
			switch(this.mystate) {
				case 'starinvite_sent':
					this.disableInputs('starinvite');
					this.controls.starinvite_indicator.show();
					break;
			}
		},

		handleAjaxSuccess: function(data) {
			switch( data.action ) {
				case 'starinvite':
					this.enableInputs('starinvite');
					this.controls.starinvite_indicator.hide();
					if(data['success']) {
						if(!this.auth.hasLevel('commentadmins')) {
							var lft = data['left']?data['left']:0;
							var oldlimit = this.controls.starinvite_email[0].className.split('valid_limit_comma-').pop().split(' ')[0];
							this.controls.starinvite_email.removeClass('valid_limit_comma-' + oldlimit).addClass('valid_limit_comma-'+lft);
							this.starinvite_validator.setupInfield(this.controls.starinvite_email[0]);
							this.controls.starinvite_left.html('('+lft + ' left)');
							this.auth.resetRevision();
							if(lft==0) this.controls.i.hide();
							Message.showMessage((data['message']?data['message']:'Invitation(s) sent. ' + lft + ' left.'), this.controls.starinvitemessage[0]);
						} else {
							Message.showMessage((data['message']?data['message']:'Invitation(s) sent.'), this.controls.starinvitemessage[0]);
						}
						this.fireEvent('onInviteSuccess', this, true);
						this.syncEffect({'el':this.commondialogs, 'fn':'toggleDialog', 'params':{'which':'starinvite', 'sync_this':this.syncEffect.bind(this)}});
						this.controls.starinvite_email.val('');
						this.mystate = 'idle';
					} else {
						Message.showMessage((data['message']?data['message']:'Invitation failed.'), this.controls.starinvitemessage[0]);
						this.mystate = 'starinvite_dialog_visible';
					}
					break;
			}
		},

		handleAjaxFail: function() {
			switch(this.mystate) {
				case 'starinvite_sent':
					this.enableInputs('starinvite');
					this.mystate = 'starinvite_dialog_visible';
					break;
			}
		},

		disableInputs: function(which) {
			switch(which) {
				case 'starinvite':
					this.controls.starinvite_email[0].disabled=true;
					this.controls.starinvite_submit[0].disabled=true;
					this.controls.starinvite_cancel[0].disabled=true;
					break;
			}
		},

		enableInputs: function(which) {
			switch(which) {
				case 'starinvite':
					this.controls.starinvite_email[0].disabled=false;
					this.controls.starinvite_submit[0].disabled=false;
					this.controls.starinvite_cancel[0].disabled=false;
					break;
			}
		},

		toggleInviteDialog: function() {
			this.controls.starinvite_postid.val( '' );
			this.controls.starinvite_commentid.val( '' );
			if(this.auth.hasLevel('commentadmins') || this.auth.hasLevel('commenters')) {
				//if(this.controls['starinvite_copy']) this.controls['starinvite_copy'].html('To create invites, paste in a list of comma-separated email addresses, and then click send invites.');
				if(this.controls['starinvite_copy']) this.controls['starinvite_copy'].html('To invite people to this discussion, send them an email invitation by pasting in a list of comma-separated email addresses and then clicking Send invites.');
			} else if(this.auth.hasLevel('starcommenters')) {
				//if(this.controls['starinvite_copy']) this.controls['starinvite_copy'].html('To create invites for new users, paste in a list of comma-separated email addresses, and then click send invites.');
				if(this.controls['starinvite_copy']) this.controls['starinvite_copy'].html('To invite people to this discussion, send them an email invitation by pasting in a list of comma-separated email addresses and then clicking Send invites.');
			}
			this.commondialogs.toggleDialog({'which':'starinvite'});
		}

	});

	$.extend($.ui.InviteWidget, {
		version: '1.0',
		defaults: {
			'controlClass' : 'invc',
			'externalElement' : '.presence_control_external',
			'show_validation_errors': true,
			'starinvite_action_url': '/?op=sendinvite',
			'onInviteSuccess': function(wg) { window.setTimeout(function(){wg.syncEffect();}, 1000); return 'will_sync';}
		}
	});

})(jQuery);
