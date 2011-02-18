var Message = {
	options: {
		duration: 3000,
		stable: false,
		nextMessage: '',
		onShow: function() {},
		onComplete: function() {}
	},

	showMessage: function( message, container, options ) {
		// copy default options
		var currentOptions = jQuery.extend({}, this.options, options);

		// send the message
		this.renderMessage( message, container );
		if ( currentOptions.stable != true ) {
			// remove the message in a few seconds
			setTimeout( function() {
				Message.renderMessage(currentOptions.nextMessage, container);

				// follow onComplete method if exists
				if ( currentOptions.onComplete ) {
					currentOptions.onComplete();
				}
			}, currentOptions.duration );
		}

		// fire onShow method if defined
		if ( currentOptions.onShow ) {
			currentOptions.onShow();
		}
	},

	renderMessage: function( message, container ) {
		if( container.nodeName == 'INPUT' ) {
			container.value = message;
		}
		else
		{
			container.innerHTML = message;
		}

		return true;
	}
};