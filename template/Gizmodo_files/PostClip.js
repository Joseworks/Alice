(function($) {
	$.widget('ui.PostClipWidget', {

		xhr: null,

		initialize: function() {			
			// setup XHR object
			this.xhr = new XHR({
				klass: 'postclip',
				beforeSend: this.handleAjaxRequest.bind(this),
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});
			this.registerEventHandler(this.element, 'click', this.handleClick.bind(this));
			this.subscribeForEvent('user.auth.', this.authEventHandler.bind(this));
		},
		
		authEventHandler: function(ev) {
			switch(ev.name) {
				case 'user.auth.success':
					this.showWidget();
				break;
				case 'user.auth.failure':
					this.hideWidget();
				break;
			}
		},
		
		handleClick: function( e ) {
			this.togglePostClip(jQuery(e.target));
			e.stopPropagation();
			e.preventDefault();
		},

		// AJAX event handlers
		handleAjaxRequest: function() {
		},

		handleAjaxSuccess: function(data) {
			// remove progress indicator, and 
			jQuery('.clipid_'+ data.objectId).removeClass('clip-toggle-progress');
			if( data.command == 'tag' ) {
				jQuery('.clipid_'+ data.objectId).removeClass('clip-toggle-off').addClass('clip-toggle-on').attr({'title': 'Un-clip this article'});
			} else {
				jQuery('.clipid_'+ data.objectId).removeClass('clip-toggle-on').addClass('clip-toggle-off').attr({'title': 'Clip this article'});
				// remove post from commenter page
				jQuery('#event_'+data.objectId).fadeOut();
			}
		},

		handleAjaxFail: function() {
			// remove progress indicator
			jQuery('.clip-toggle-progress').removeClass('clip-toggle-progress');
		},
		
		togglePostClip: function(element) {
			var params = {'op': 'saveusertag', 'objectType': 'POST', 'objectId': this.getParam('clipid', element ) };
			if( element.hasClass('clip-toggle-on') ) {
				params.unTagName = 'favorite';
			} else {
				params.tagName = 'favorite';
			}
			// turn on progress indicator
			if( this.controls.postcliptoggle ) this.controls.postcliptoggle.addClass('clip-toggle-progress');
			this.xhr.send( '/', params );
		},

		// togglers
		hideWidget: function() {
			if( this.controls.postcliptoggle ) this.controls.postcliptoggle.hide();
		},

		showWidget: function() {
			if( this.auth.authenticated && this.auth.user.clipped && this.controls.postcliptoggle ) {
				this.controls.postcliptoggle.removeClass('clip-toggle-on').addClass('clip-toggle-off').attr({'title': 'Clip this article'});
				for(var i=0,l=this.auth.user.clipped.length;i<l;i++) {
					jQuery('.clipid_'+ this.auth.user.clipped[i]).removeClass('clip-toggle-off').addClass('clip-toggle-on').attr({'title': 'Un-clip this article'})
				}
				
				this.controls.postcliptoggle.show();
			}
		},

		resetWidget: function() {}

	});

	$.extend($.ui.PostClipWidget, {
		'version': '1.0',
		'defaults': {
			'action_url': '/index.php',
			'controlClass': 'postclipcontrol'
		}
	});

})(jQuery);
