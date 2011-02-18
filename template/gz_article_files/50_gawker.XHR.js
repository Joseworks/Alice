var XHR = GawkerBase.extend({
	options: {
		type: 'POST',
		dataType: 'json',
		klass: null
	},

	initialize: function( options ) {
		this.setOptions( options );
	},

	send: function( url, queryString ) {
		//Logger.debugLog( this.options.klass +' sending...' );

		this.options.url = url;
		this.options.data = queryString;
		XHRFormToken = jQuery.cookie('form_token');
		if (XHRFormToken) {
			switch ( typeof( this.options.data ) ) {
				case 'undefined':
					this.options.data = {
						'formToken': XHRFormToken
					};
					break;
				case 'string':
					this.options.data += (queryString == '' ? '' : '&') + 'formToken=' + XHRFormToken;
					break;
				default:
					this.options.data.formToken = XHRFormToken;
			}
		}
		this.xhr = jQuery.ajax( this.options );
	},

	getJSON: function( url, callback ) {
		if( callback === undefined ) {
			callback = this.options.success;
		}
		jQuery.getJSON( url, callback );
	},
	
	abort: function() {
		if (this.xhr != undefined) {
			this.xhr.abort();
		}
	}
});
