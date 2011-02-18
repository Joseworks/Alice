(function($) {
	$.widget('ui.CommentBoxWidget', {

		controls: {},
		comment_placeholder: 'comment_result_placeholder',
		comment_placeholder_text: 'comment_result_placeholder_text',
		commentbox_opened: false,
		autogrow_on: false,
		colClickHandler: null,
		guest_email: null,
		guest_newsletter: null,
		inreply: false,

		textareaOriginalValue: null,
		textareaOpenedValue: null,

		initialize: function() {

			// can be 'topcommentbox' for top comment box, or empty if post comment box
			this.widgettype = this.getParam('widgettype', this.element);
			var panels = {};
			this.registerEventHandler(this.element, 'click', this.handleClick.bind(this));
			if (this.controls.textarea) {
				this.registerEventHandler(this.controls.textarea, 'focus', this.openWidget.bind(this));
			}
			if(this.controls['guestpanel_form']) {
				panels['guestpanel'] = {'el':this.controls.guestpanel_dialog, 'focus':this.controls.guestpanelemail};
				this.guestpanel_validator = new Validator(jQuery.extend({}, {'scope': this.controls['guestpanel_form']} ));
				this.registerEventHandler(this.controls.guestpanel_form, 'keyup', this.handleKeyUp.bind(this));
				this.registerEventHandler(this.controls.guestpanel_form, 'submit', this.handleGuestPanelSubmit.bind(this));
			}
			if( this.controls['aewrap'] ) {
				this.authoremail_validator = new Validator(jQuery.extend({}, {'scope': this.controls['aewrap']} ));
			}
			this.registerEventHandler( this.controls.authoremail, 'focus', this.authoremailInputFocus.bind(this) );
			this.registerEventHandler( this.controls.authoremail, 'blur', this.authoremailInputBlur.bind(this) );

			// image upload handler
			if(!(!+"\v1")) {
				// normal browsers
				this.registerEventHandler(this.controls.imgupl_form, 'change', this.handleImageUpload.bind(this));
			} else {
				// IE browsers.
				this.controls.imgupl_form.bind('file_upload_change', this.handleImageUpload.bind(this) ); // IE fix
			}
			
			// comment image upload callback
			GawkerClientside['callbacks'] = jQuery.extend((GawkerClientside['callbacks']?GawkerClientside['callbacks']:{}), {'commentimageResponse' : this.handleImageUploadSuccess.bind(this)});

			this.commondialogs.initDialogs({'overlay':this.controls.overlay, 'panels':panels, 'group':this.options['dialoggroup']?this.options['dialoggroup']:false});

			// auth events
			this.subscribeForEvent('user.', this.authEventHandler.bind(this));

			// comment events
			this.subscribeForEvent('comment.commentlistupdated', function() { this.setControls(); }.bind(this));

			this.subscribeForEvent('comment.reply', this.setReplyTo.bind(this));
			this.subscribeForEvent('commentbox.moveform', this.moveForm.bind(this));
			this.subscribeForEvent('comment.edit', this.setEdit.bind(this));

			this.subscribeForEvent('comment.newdiscussion', this.startNewDiscussion.bind(this));
			this.subscribeForEvent('comment.submitcomment', this.submitForm.bind(this));

			this.xhr = new XHR({
				klass:			'commentbox',
				beforeSend:		this.handleAjaxRequest.bind(this),
				error:			this.handleAjaxFail.bind(this),
				success:		this.handleAjaxSuccess.bind(this)
			});

			// set textarea controls original value
			this.textareaOriginalValue = this.controls.textarea.val();

		},

		authEventHandler: function(ev) {
			if( this.auth.formToken )
			{
				this.controls.formtoken_input.val( this.auth.formToken );
			}
			switch( ev.name ) {
				case 'user.auth.success':
					if(this.inState('init')) {
						this.refreshWidget();
					} else if(this.inState('loggedout:waiting_for_authorization')) {
						this.submitForm();
					} else {
						this.justLoggedIn = true;
					}
					this.mystate = 'loggedin';
					if( this.auth.user['twitter_id'] )
					{
						this.controls.tweetthis.show();
					}
					break;
				case 'user.auth.failure':
					this.refreshWidget();
					this.mystate = 'loggedout';
					break;
			}
			// author email box
			if(this.auth.authenticated && this.auth.hasLevel('editors'))
			{
				this.controls.aewrap.show();
			} else {
				this.controls.authoremail.val( this.controls.authoremail.get(0).title );
				this.controls.aewrap.hide();
			}
		},

		handleGuestPanelSubmit: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.guestpanel_validator.hideErrors();
			if(this.guestpanel_validator.validate()) {
				this.mystate = 'loggedout:guestcommenter';
				this.guest_email = this.controls.guestpanelemail.val();
				this.guest_newsletter = this.controls.guestpanel_newsletter[0].checked ? 1 : 0;
				this.commondialogs.toggleDialog({});
				//submit again - now with email
				this.submitForm();
			} else {
				if(this.options.show_validation_errors) {
					this.guestpanel_validator.showErrors();
					this.controls.guestpanelemail.focus();
				}
			}
		},

		handleKeyUp: function(e) {
			switch (e.keyCode) {
				case jQuery.ui.keyCode.ESCAPE:
					this.commondialogs.toggleDialog({});
					break;
			}
		},

		handleClick: function(e) {
			var controlType = this.getParam( 'cn', jQuery(e.target) );
			switch( controlType ) {

				case 'imgopt':
				case 'vidopt':
				case 'imgupl':
				case 'imgurl':
					jQuery('.cb_l', this.element).hide();
					jQuery('.cb_l.cb_'+ controlType, this.element ).show();
					e.stopPropagation();
					e.preventDefault();
					break;
				case 'authoremailtoggle':
					if( this.mystate == 'loggedin:authoremail' ) {
						this.controls.aewrap.removeClass('opened');
						this.controls.authoremail.hide();
						this.mystate = 'loggedin';
					} else {
						this.controls.aewrap.addClass('opened');
						this.controls.authoremail.val( this.controls.authoremail.get(0).title ).show();
						this.mystate = 'loggedin:authoremail';
					}
					e.stopPropagation();
					e.preventDefault();
					break;
				case 'close':
					jQuery('.cb_l', this.element).hide();
					jQuery('.cb_l.cb_default', this.element ).show();
					this.resetExtensions();
					e.stopPropagation();
					e.preventDefault();
					break;

				//guest commenting comes first
				case 'request_fb_login':
					//hide dialog and raise 'presence.requiresequence.fblogin'
					this.commondialogs.toggleDialog({'which':'guestpanel'});
					this.syncEffect({'el':this, 'fn':'raiseEvent', 'params':'presence.requiresequence.fblogin'});
					e.stopPropagation();
					e.preventDefault();
					break;
				case 'requestlogin':
					this.commondialogs.toggleDialog({'which':'login'});
					e.stopPropagation();
					e.preventDefault();
					break;
				case 'requestregister':
					this.commondialogs.toggleDialog({'which':'register'});
					e.stopPropagation();
					e.preventDefault();
					break;
				case 'requestresetpw':
					this.commondialogs.toggleDialog({'which':'resetpw'});
					e.stopPropagation();
					e.preventDefault();
					break;
				case 'guestpanel_cancel':
					this.commondialogs.toggleDialog({});
					break;

				// widget open
				case 'expandform':
				case 'textarea':
					this.openWidget();
					e.stopPropagation();
					e.preventDefault();
					break;

				// widget close
				case 'collapseform':
					if( !this.controls.collapseform.hasClass('inprogress') ) this.resetWidget();
					e.stopPropagation();
					e.preventDefault();
					break;

				// form submit
				case 'submitform':
					this.submitForm();
					e.stopPropagation();
					e.preventDefault();
					break;

				// fbcomment toggle passthru
		        case 'fbcomment':
				case 'fbcommentlabel':
		            break;

				// notify toggle passthru
				case 'notify':
				case 'notifylabel':
					e.stopPropagation();
					e.preventDefault();
					break;
			}
		},

		refreshWidget: function() {
			this.setControls();
			if (this.auth.authenticated && this.auth.user.fb_uid)
			{
				jQuery('.fbuser').show();
			}
			else
			{
				jQuery('.fbuser').hide();
			}
		},

		/*** inputform handler functions - open, close, move, reset, etc.. ***/
		openWidget: function() {
			if( typeof this.controls.textarea != 'undefined' && this.controls.textarea.length > 0 && this.element.hasClass('cb_collapsed') ) {
				this.element.removeClass('cb_collapsed');
				this.setDefaultTextvalue();
				if( !this.autogrow_on ) {
					this.controls.textarea.autogrow();
					this.autogrow_on = true;
				}
				// position the cursor at the beginning of the textarea - before hashtags
				this.setCursorPosition( this.controls.textarea, 0 );
				this.controls.textarea.get(0).focus();
				this.commentbox_opened = true;
				// set tweet this checkbox to false
				this.controls.tweetthischeck.get( 0 ).checked = false;
				// auto-collapse handler
				this.colClickHandler = this.autoCollapseWidget.bind(this);
				jQuery(document).bind("click", this.colClickHandler);
				this.raiseEvent( 'commentbox.open', {} );
			}
		},

		autoCollapseWidget: function( e ) {
			if(
				this.commentbox_opened &&
				(this.controls.textarea.val() == this.textareaOpenedValue || this.controls.textarea.val() == '') &&
				jQuery(e.target).closest('.commentbox').length == 0 &&
				!this.element.hasClass('inedit') &&
				!jQuery(e.target).hasClass('cn_commentreply')
			) {
				this.resetWidget();
				jQuery(document).unbind("click", this.colClickHandler);
			}
		},

		moveForm: function(ev) {
			if( typeof ev != 'undefined' && ev.params.targetNode ) {
				var targetNode = ev.params.targetNode;
			} else {
				var targetNode = jQuery('.input_box_place');
			}
			targetNode.after( this.element[0] );
		},

		resetWidget: function() {
			// clear form values and reset extensions
			this.clearFormValues();
			this.resetExtensions();

			// if( typeof this.controls.textarea != 'undefined' && this.controls.textarea.length > 0 ) { }
			this.element.addClass('cb_collapsed');
			this.controls.textarea.css('height', '');
			this.controls.textarea.val(this.textareaOriginalValue);

			// hide stuffz
			jQuery('.inreply').removeClass('inreply');
			jQuery('.inprogress').removeClass('inprogress');
			jQuery('.inedit').removeClass('inedit');
			this.controls.indicator.hide();

			this.commentbox_opened = false;
			this.inreply = false;

			this.mystate = 'collapsed';
			this.raiseEvent('commentbox.collapse', {});
			this.raiseEvent('commentbox.moveform', {});
		},

		resetExtensions: function() {
			// uploaded file and video
			this.controls.uploadedfile.val('');
			this.controls.uploadedfileformat.val('');
			this.controls.fileupload.val('');
			this.controls.photourl.val('');
			this.controls.videourl.val('');
			// file preview
			this.controls.imagepreview.attr('src', this.controls.emptyimage[0].src);
			this.controls.img_preview_l.hide();
			// hide author email input
			this.controls.authoremail.hide();
			this.controls.aewrap.removeClass('opened');
			// clear author email validation errors
			if( this.authoremail_validator ) this.authoremail_validator.hideErrors();
			// close 'em all
			jQuery('.cb_l', this.element).hide();
			jQuery('.cb_l.cb_default', this.element ).show();
		},

		clearFormValues: function() {
			if( typeof this.controls.textarea != 'undefined' && this.controls.textarea.length > 0 ) {
				this.controls.commentop.val('postcomment');
				this.controls.parenttype_input.val( this.controls.roottype_input.val() );
				this.controls.entryid_input.val( this.controls.rootid_input.val() );
				this.controls.commentid_input.val('');
				// also clear the hidden anon email field
				this.controls.anonemailinput.val('');
				this.controls.anonnewsletter.val('');
				this.controls.authoremailinput.val('');
				this.textareaOpenedValue = '';
			}
			if( this.controls.authoremail ) this.controls.authoremail.val(this.controls.authoremail.get(0).title);
		},

		setDefaultTextvalue: function() {
			this.controls.textarea.val('');
			if( typeof this.controls.hashtag != 'undefined' && this.controls.hashtag.length > 0 ) {
				this.controls.textarea.val("\n\n" + this.controls.hashtag.val());
			}
			this.textareaOpenedValue = this.trimWhiteSpace(this.controls.textarea.val());
		},

		setReplyTo: function( ev ) {
			// set comment parent id
			this.controls.entryid_input.val(ev.params.parentId);
			// set parent type to COMMENT
			this.controls.parenttype_input.val('COMMENT');
			// clear comment id field
			this.controls.commentid_input.val('');

			// add @commenter_name: to comment text
			this.inreply = true;
			this.openWidget();
			var preString = '@'+ ev.params.replyTo +': ';
			if( this.controls.textarea ) this.controls.textarea.val( preString +' '+ this.controls.textarea.val() );

			// set cursor position
			this.setCursorPosition( this.controls.textarea, preString.length );

			// focus textarea
			this.controls.textarea.get(0).focus();
		},

		setEdit: function( ev ) {
			// set commentbox op to editcomment, set comment parent and root
			this.controls.commentop.val('editcomment');
			this.controls.entryid_input.val(ev.params.comment.parentId);
			this.controls.commentid_input.val(ev.params.comment.commentId);
			// open commentbox
			this.openWidget();
			// set the text to the original comment text
			this.controls.textarea.val( ev.params.comment.originalText );
			// trigger a keyup event, this will open the autogrow`d textarea
			this.controls.textarea.trigger('keyup');
			// add the inedit class
			this.controls.form.addClass('inedit');
			
		},

		startNewDiscussion: function( ev ) {
			this.resetWidget();
			document.location.hash = '#commentform';
			this.openWidget();
		},


		/*** form submit and ajax handler functions ***/

		submitForm: function() {
			// do not submit the form if it's empty!
			this.controls.textarea.val(this.trimWhiteSpace(this.controls.textarea.val()));
			if(
				!this.commentbox_opened ||
				(
					( this.controls.textarea.val() == this.textareaOpenedValue || this.controls.textarea.val() == '' ) && ( this.controls.videourl.val() == '' && this.controls.photourl.val() == '' && this.controls.uploadedfile.val() == '' )
				)
			) {
				return false;
			}
			if( this.inState('loggedout:guestcommenter') ) {
				this.controls.commentop.val('postguestcomment');
				this.controls.anonemailinput.val(this.guest_email);
				this.controls.anonnewsletter.val(this.guest_newsletter);
			}
			else if(!this.auth.authenticated) {
				// ask for guestcomment email / login / password
				this.mystate = 'loggedout:waiting_for_authorization';
				this.commondialogs.toggleDialog({'which':'guestpanel'});
				return;
			}
			else if( this.inState('loggedin:authoremail') ) {
				this.authoremail_validator.hideErrors();
				if(!this.authoremail_validator.validate()) {
					if(this.options.show_validation_errors) {
						this.authoremail_validator.showErrors();
						this.controls.authoremail.focus();
						return;
					}
				}
				this.controls.commentop.val('postauthorcomment');
				this.controls.authoremailinput.val( this.controls.authoremail.val() );
			}
			var parameters = this.controls.form.serialize();
			if( this.controls.tweetthischeck.get( 0 ).checked )
			{
				parameters += '&tweetThis=1';
			}
			if( !this.controls.submitform.hasClass('inprogress') ) {
				this.controls.submitform.addClass('inprogress');
				this.controls.collapseform.addClass('inprogress');
				this.controls.indicator.show();
				this.mystate = 'sendingcomment';
				this.xhr.send( '/index.php', parameters );
			}
		},

		handleAjaxRequest: function() {
			// close extensions
		},

		handleAjaxSuccess: function(data) {
			this.raiseEvent( 'commentbox.newComment', { 'data' : data } );

			if( data.formToken ) this.controls.formtoken_input.val( data.formToken );
			if( data.success == true ) {
				this.resetWidget();
				//add a notification
				var notifCont = jQuery( '#inflowNotification .notifMsgFake' );
				if(notifCont.length > 0) {
					notifCont.html( notifCont.html() + data.message );
					notifCont.show();
					jQuery("#inflowNotification").show();
				} else {
					Message.showMessage( data.message, this.controls.message[0], {stable: false, duration: 3000, onShow: function() {this.controls.message.show();}.bind(this), onComplete: function() {this.controls.message.hide();}.bind(this) });
				}
			} else {
				Message.showMessage( data.message, this.controls.message[0], {stable: false, onShow: function() {this.controls.message.show();}.bind(this), onComplete: function() {this.controls.message.hide();}.bind(this) });
			}

			if( this.controls.submitform.hasClass('inprogress') ) {
				this.controls.submitform.removeClass('inprogress');
				this.controls.collapseform.removeClass('inprogress');
				this.controls.indicator.hide();
			}
			this.raiseEvent( 'comment.commentlistupdated', {} );

		},

		handleAjaxFail: function() {
			if( this.controls.submitform.hasClass('inprogress') ) {
				this.controls.submitform.removeClass('inprogress');
				this.controls.collapseform.removeClass('inprogress');
				this.controls.indicator.hide();
			}
		},

		/*** author email stuffz ***/
		authoremailInputBlur: function() {
			if( this.controls.authoremail.val() == '' || this.controls.authoremail.val() == this.controls.authoremail.get(0).title ) {
				this.controls.authoremail.val( this.controls.authoremail.get(0).title );
				this.controls.authoremail.addClass('empty_field');
			}
		},

		authoremailInputFocus: function() {
			if( this.controls.authoremail.val() == '' || this.controls.authoremail.val() == this.controls.authoremail.get(0).title ) {
				this.controls.authoremail.val('');
				this.controls.authoremail.removeClass('empty_field');
			}
		},


		/*** image upload handler functions ***/

		handleImageUpload: function() {
			this.controls.indicator.show();
			this.controls.imgupl_form.submit();
		},

		handleImageUploadSuccess: function(data) {
			this.controls.indicator.hide();
			if( data.success == true ) {
				// set hidden form values
				this.controls.uploadedfile[0].value = data.image;
				this.controls.uploadedfileformat[0].value = data.format;
				// set preview image source
				this.controls.img_preview_l.show();
				this.controls.imagepreview.attr('src', data.thumb);

				Message.showMessage( data.message, this.controls.message[0], {stable: false, onShow: function() {this.controls.message.show();}.bind(this), onComplete: function() {this.controls.message.hide();}.bind(this) });

			} else {

				Message.showMessage( data.message, this.controls.message[0], {stable: false, onShow: function() {this.controls.message.show();}.bind(this), onComplete: function() {this.controls.message.hide();}.bind(this) });

			}
		},


		/*** helper functions ***/

		trimWhiteSpace: function(value) {
			var lines = value.split("\n");

			lines[0] = jQuery.trim(lines[0]);
			lines[lines.length - 1] = jQuery.trim(lines[lines.length - 1]);

			return lines.join("\n");
		},

		setCursorPosition: function( textareaElement, position ) {
			var textElement = jQuery(textareaElement);
			if (textElement.get(0).setSelectionRange) {
				textElement.get(0).setSelectionRange(position, position);
			}
			else if (textElement.get(0).createTextRange) {
				var range = textElement.get(0).createTextRange();
				range.collapse(true);
				range.moveEnd('character', position);
				range.moveStart('character', position);
				range.select();
			}
		}


	});

	$.extend($.ui.CommentBoxWidget, {
		version: '1.0',
		defaults: {
			'onHide': {},
			'onShow': {},
			'onReset': {},
			'controlClass': 'ic',
			'externalElement': '.presence_control_external',
			'show_validation_errors': true
		}
	});

})(jQuery);