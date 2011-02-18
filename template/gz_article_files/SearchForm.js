(function($) {
	$.widget('ui.SearchFormWidget', {
		initialize: function() {
			// set initial placeholder value if empty
			if ( this.controls.q[0].value == '' ) {
				this.controls.q[0].value = this.options.defaultValue;
				this.controls.q.addClass('noq');
			}
			
			this.registerEventHandler(this.controls.form[0], 'submit', this.handleSubmit.bind(this));
			this.registerEventHandler(this.controls.q[0], 'focus', this.inputFocus.bind(this));
			this.registerEventHandler(this.controls.q[0], 'blur', this.inputBlur.bind(this));
		},

		handleSubmit: function(e) {
			Logger.debugLog( 'SearchFormWidget handleSubmit' );
			
			if ( this.controls.q[0].value == '' ) {
				// no search phrase given
				Message.showMessage( 'Please provide a search phrase.', this.controls.q[0], {'stable': false} );
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			this.controls.form[0].action = this.controls.form[0].action +'/'+ escape(this.controls.q[0].value);
			if( this.controls.searchall[0].value == 1 ) {
				this.controls.form[0].action = this.controls.form[0].action + '/all';
			}
		},

		inputFocus: function(e) {
			Logger.debugLog( 'SearchFormWidget inputFocus' );
			if ( this.controls.q[0].value == this.options.defaultValue ) {
				this.controls.q[0].value = '';
			}
			this.controls.q.removeClass( 'noq' );
		},

		inputBlur: function(e) {
			Logger.debugLog( 'SearchFormWidget inputBlur' );
			if ( this.controls.q[0].value == '' ) {
				this.controls.q.addClass( 'noq' );
				this.controls.q[0].value = this.options.defaultValue;
			}
		}
	});

	$.extend($.ui.SearchFormWidget, {
		version: '1.0',
		defaults: {
			controlClass: 'searchControl',
			defaultValue: 'Search' 
		}
	});
})(jQuery);
