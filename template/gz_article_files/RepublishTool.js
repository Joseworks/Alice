(function($) {
	$.widget('ui.RepublishToolWidget', {

		initialize: function() {
			// setup XHR object
			this.xhr = new XHR({
				klass: 'republishcontrols',
				beforeSend: this.handleAjaxRequest.bind(this),
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});

			var panels = {};
			var should_init_panels = false;
			if( this.controls['republish_dialog'] ) {
				panels['republish'] = {'el':this.controls.republish_dialog, 'focus':this.controls.siteId};
				panels['edit'] = {'el':this.controls.edit_dialog, 'focus':this.controls.siteId};
				this.registerEventHandler( this.controls.republish_form, 'keyup', this.handleKeyUp.bind( this ) );
				this.registerEventHandler( this.controls.republish_form, 'submit', this.republish.bind( this ) );
				this.registerEventHandler( this.controls.edit_form, 'keyup', this.handleKeyUp.bind( this ) );
				this.registerEventHandler( this.controls.edit_form, 'submit', this.edit.bind( this ) );
				should_init_panels = true;
			}
			if( should_init_panels ) {
				var dialogParams = {
						'overlay'	: this.controls.overlay,
						'panels'	: panels,
						'group'		: this.options['dialoggroup'] ? this.options['dialoggroup'] : false
				};
				this.commondialogs.initDialogs( dialogParams );
			}

			this.registerEventHandler( this.element, 'click', this.handleClick.bind( this ) );

			this.subscribeForEvent( 'user.auth.', this.authEventHandler.bind( this ) );
		},

		authEventHandler: function( ev ) {
			if( ev.name == 'user.auth.success' && this.hasLevelOnAnySite( 'authors' ) ) {
				jQuery( '.republish_container' ).show();
				jQuery( '.pm_line.editorControlsWidget' ).show();
			}
			else {
				jQuery( '.republish_container' ).hide();
			}
		},
		
		hasLevelOnAnySite: function( level ) {
			var length = this.options.siteIds.length;
			var hasLevel = false;
			for( var i = 0; i < length; i++ ) {
				hasLevel = this.auth.hasLevel( level, this.options.siteIds[i] );
				if( hasLevel ) {
					break;
				}
			}
			return hasLevel;
		},

		handleClick: function(e) {
			var t = this.getParam('cn', e.target);
			if( t == 'republish_link' ) {
				this.setupDialog();
			}
			if( t == 'republish_link' || t == 'republish_cancel' ) {
				this.commondialogs.toggleDialog( {'which':'republish'} );
			}
			if( t == 'republish_submit' ) {
				this.controls.action.val( 'republish' );
				this.republish();
			}
			if( t == 'republish_promote' ) {
				this.controls.action.val( 'promote' );
				this.republish();
			}
			
			if( t == 'edit_link' ) {
				this.controls.postId.val( this.getParam( 'postid', this.controls.edit_link.get( 0 ) ) );
			}
			if( t == 'edit_link' || t == 'edit_cancel' ) {
				this.commondialogs.toggleDialog( {'which':'edit'} );
			}
			if( t == 'edit_submit' ) {
				this.edit();
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
		
		handleAjaxRequest: function() {
			this.disableForm( true );
		},

		handleAjaxSuccess: function(data) {
			this.controls.progress.hide();
			this.disableForm( false );
			this.showMessage( data['message'], data['success'], data['action'] == 'edit' ? 'edit' : 'republish' );
		},
		

		handleAjaxFail: function() {
			this.controls.progress.hide();
			this.disableForm( false );
			this.showMessage( '<b>Cannot republish the post.</b> Please try again later', false );
		},
		
		setupDialog: function() {
			var select = this.controls.siteId.get( 0 );
			
			for( var i = select.options.length; i > 0; i-- ) {
				select.options[0] = null;
			}

			var opt = new Option( 'select site', -1 );
			select.add( opt, null );
			for( var i = 0; i < this.options.siteIds.length; i++ ) {
				var siteId = this.options.siteIds[i];
				if( !this.auth.hasLevel( 'authors', siteId ) ) {
					continue;
				}
				opt = new Option( this.options.sites[siteId], siteId );
				select.add( opt, null );
			}
			this.controls.postId.val( this.getParam( 'postid', this.controls.republish_link.get( 0 ) ) );
		},
		
		republish: function( e ) {
			if( e !== undefined ) {
				e.stopPropagation();
				e.preventDefault();
			}
			if( this.controls.siteId.val() > 0 ) {
				this.xhr.send( '/index.php', this.controls.republish_form.serialize() );
				this.controls.progress.show();
			}
			else {
				this.showMessage( 'Please select site' );
			}
			return false;
		},
		
		edit: function( e ) {
			if( e !== undefined ) {
				e.stopPropagation();
				e.preventDefault();
			}
			this.xhr.send( '/index.php', this.controls.edit_form.serialize() );
			this.controls.progress.show();
		},
		
		disableForm: function( disable ) {
			var disabled = ( disable == true );
			this.controls.siteId.get( 0 ).disabled = disabled;
			this.controls.republish_submit.get( 0 ).disabled = disabled;
			this.controls.republish_cancel.get( 0 ).disabled = disabled;
			this.controls.edit_time.get( 0 ).disabled = disabled;
			this.controls.edit_submit.get( 0 ).disabled = disabled;
			this.controls.edit_cancel.get( 0 ).disabled = disabled;
		},
		
		showMessage: function( message, closeDialog, whichDialog ) {
			var that = this;
			this.controls.message.html( message ).show();
			if( whichDialog === undefined ) {
				whichDialog = 'republish';
			}
			var closeFunc = function() {
				that.controls.message.hide();
				if( closeDialog ) {
					that.commondialogs.toggleDialog( {'which':whichDialog} );
				}
			};
			setTimeout( closeFunc, 3000 );
		}	
	});

	$.extend($.ui.RepublishToolWidget, {
		version: '1.0',
		defaults: {
			'controlClass' : 'republish_control',
			'externalElement' : '.presence_control_external',
			'show_validation_errors': true
		}
	});

})(jQuery);