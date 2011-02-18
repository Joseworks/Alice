(function($) {
	$.widget('ui.EditorControlsWidget', {

		initialize: function() {
			// setup XHR object
			this.xhr = new XHR({
				klass: 'editorcontrols',
				beforeSend: this.handleAjaxRequest.bind(this),
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});

			var panels = {};
			var should_init_panels = false;
			if(this.controls['tagheader_form']) {
				panels['tagheader'] = {'el':this.controls.tagheader_dialog, 'focus':this.controls.tagheader_entry};
				this.tagheader_validator = new Validator(jQuery.extend({}, {'scope': this.controls['tagheader_form']} ));
				this.registerEventHandler(this.controls.tagheader_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.tagheader_form, 'submit', this.handleTagheaderSubmit.bind(this));
				this.controls.tagheader_form[0].reset();
				should_init_panels = true;
			}
			if(should_init_panels) this.commondialogs.initDialogs({'overlay':this.controls.overlay, 'panels':panels, 'group':this.options['dialoggroup']?this.options['dialoggroup']:false});

			this.registerEventHandler(this.element, 'click', this.handleClick.bind(this));

			this.subscribeForEvent('user.auth.', this.authEventHandler.bind(this));
		},

		authEventHandler: function(ev) {
			switch(ev.name) {
				case 'user.auth.success':
					var should_show = false;
					if(this.controls['for_editors']) {
						if(this.auth.hasLevel('authors')) {
							this.controls.for_editors.show();
							should_show = true;
						} else this.controls.for_editors.hide();
					}
					if(this.controls['slurp_toggle']) {
						if(this.setupSlurpForm()) {
							this.controls.slurp_toggle.show();
							should_show = true;
						} else this.controls.slurp_toggle.hide();
					}
					if(this.controls['tagheader_link']) {
						if(this.controls.tagheader_enabled.html() == 'true') {
							if(this.auth.hasLevel('editors')) {
								//setup form
								this.controls.tagheader_entry.val(this.controls.tagheader_entry_orig.html().trim());
								this.controls.tagheader_postid.val(this.controls.tagheader_postid_orig.html());
								this.controls.tagheader_id.val(this.controls.tagheader_postid_orig.html());
								this.controls.tagheader_tags.val(this.controls.tagheader_tags_orig.html());
								this.controls.tagheader_link.show();
							}
						}
					}
					if(should_show) this.element.eq(0).show();
					else this.element.eq(0).hide()
					break;
				case 'user.auth.failure':
					if(this.controls['for_editors']) this.controls.for_editors.hide();
					if(this.controls['slurp_toggle']) this.controls.slurp_toggle.hide();
					if(this.controls['slurp_dialog']) this.controls.slurp_dialog.hide();
					if(this.controls['tagheader_link']) this.controls.tagheader_link.hide();
					this.element.eq(0).hide();
					break;
			}
		},

		handleClick: function(e) {
			var t = this.getParam('cn', e.target);
			switch(t) {
				case 'slurp_toggle':
				case 'slurp_cancel':
					// open or close dialog
					if( this.option('disabled') == false ) this.toggleSlurpDialog();
					break;
				case 'slurp_button':
					// slurp submitted
					if( this.controls.slurp_select[0].value == -1 ) {
						// with no site selected
						Message.showMessage( 'Please select a site', this.controls.slurp_message[0], {} );
					} else {
						// with site selected
						this.controls.slurp_indicator.show();
						this.xhr.send( '/index.php', this.controls.slurp_form.serialize() );
					}
					break;
				case 'draft_link':
					if( confirm( 'Delete post?') ) {
						// setting post to DRAFT
						var params = [];
						params.push( 'op=changepoststatus' );
						params.push( 'v2=true' );
						params.push( 'id='+ this.getParam( 'postId', this.controls.draft_link ) );
						params.push( 'publishStatus=DRAFT' );
						params.push( 'realm=' );

						this.xhr.send('/index.php', params.join( '&' ));
					}
					break;
				case 'tagheader_link':
				case 'tagheader_cancel':
					if(this.auth.hasLevel('editors')) {
						this.commondialogs.toggleDialog({'which':'tagheader'});
					}
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
		handleTagheaderSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.tagheader_validator.hideErrors();
			if(this.tagheader_validator.validate()) {
				this.mystate = 'tagheader_sent';
				this.xhr.send(this.options.tagheader_action_url, this.controls.tagheader_form.serialize());
			} else {
				this.mystate = 'tagheader_dialog_visible';
				if(this.options.show_validation_errors) {
					this.tagheader_validator.showErrors();
				}
			}
		},

		handleAjaxRequest: function() {
			switch(this.mystate) {
				case 'slurp_sent':
					this.disableInputs('slurp');
					break;
				case 'tagheader_sent':
					this.disableInputs('tagheader');
					this.controls.tagheader_indicator.show();
					break;
			}
		},

		handleAjaxSuccess: function(data) {
			if(data['postSave']) {
				data = {'action':'postSave', 'success':data.postSave.success, 'postid':data.postSave.postId};
			}
			switch( data.action ) {
				case 'addsitetag':
					if(data['success']) {
						// slurp was successful
						this.controls.slurp_indicator.hide();
						Message.showMessage(data.message, this.controls.slurp_message[0], {
							onComplete: function() {
								this.toggleSlurpDialog();
								this.enable();
							}.bind(this)
						});
					} else {
						// slurp failed
						this.controls.slurp_indicator.hide();
						Message.showMessage( data.message, this.controls.slurp_message[0] );
						this.enableInputs('slurp');
					}
					break;
				case 'changeposttag_add':
					if(data['success']) {
						//top was successful
						this.controls.top_link.hide();
						this.controls.untop_link.show();
					}
					break;
				case 'changeposttag_remove':
					if(data['success']) {
						//untop was successful
						this.controls.top_link.show();
						this.controls.untop_link.hide();
					}
					break;
				case 'postSave':
					this.enableInputs('tagheader');
					this.controls.tagheader_indicator.hide();
					if(data['success']) {
						Message.showMessage((data['message']?data['message']:'Tagheader saved.'), this.controls.tagheadermessage[0]);
						this.fireEvent('onTagheaderSuccess', this, true);
						this.syncEffect({'el':this.commondialogs, 'fn':'toggleDialog', 'params':{'which':'tagheader', 'sync_this':this.syncEffect.bind(this)}});
						this.controls.tagheader_entry_orig.html(this.controls.tagheader_entry.val());
						this.mystate = 'idle';
					} else {
						Message.showMessage((data['message']?data['message']:'Tagheader save failed.'), this.controls.tagheadermessage[0]);
						this.mystate = 'tagheader_dialog_visible';
					}
					break;
			}
		},

		handleAjaxFail: function() {
			switch(this.mystate) {
				case 'tagheader_sent':
					this.enableInputs('tagheader');
					this.mystate = 'tagheader_dialog_visible';
					break;
			}
		},

		disableInputs: function(which) {
			switch(which) {
				case 'slurp':
					this.disable();
					jQuery( 'select, button', this.controls.slurp_form ).each( function( i, element ) {
						element.disabled = true;
					});
					break;
				case 'tagheader':
					this.controls.tagheader_entry[0].disabled=true;
					this.controls.tagheader_submit[0].disabled=true;
					this.controls.tagheader_cancel[0].disabled=true;
					break;
			}
		},

		enableInputs: function(which) {
			switch(which) {
				case 'slurp':
					this.enable();
					jQuery( 'select, button', this.controls.slurp_form ).each( function( i, element ) {
						element.disabled = false;
					});
					break;
				case 'tagheader':
					this.controls.tagheader_entry[0].disabled=false;
					this.controls.tagheader_submit[0].disabled=false;
					this.controls.tagheader_cancel[0].disabled=false;
					break;
			}
		},

		toggleSlurpDialog: function() {
			if ( this.controls.slurp_dialog[0].style.display == 'none' ) {
				this.enableInputs('slurp');
				this.controls.slurp_form[0].reset();
			}
			this.controls.slurp_dialog.slideToggle();
		},

		setupSlurpForm: function() {
			// filters options of the select box according to user level
			var options = this.controls.slurp_select[0].options;
			var l = options.length - 1;
			// since we alter the length of the list and indexes too, we
			// have to move from the back to the beginning
			for( var i = l; i > 0; i-- ) {
				if(this.auth.site.siteId == options[i].value || !this.auth.hasLevel('authors', options[i].value)) options[i] = null;
			}

			if(options.length < 3 ) options[0] = null;

			return (options.length > 0);
		}

	});

	$.extend($.ui.EditorControlsWidget, {
		version: '1.0',
		defaults: {
			'controlClass' : 'editor_control',
			'externalElement' : '.presence_control_external, .editorControlsWidget_external',
			'show_validation_errors': true,
			'tagheader_action_url' : '/?op=admin_savepost',

			'onTagheaderSuccess': function(wg) { window.setTimeout(function(){wg.syncEffect();}, 1000); return 'will_sync';}
		}
	});

})(jQuery);