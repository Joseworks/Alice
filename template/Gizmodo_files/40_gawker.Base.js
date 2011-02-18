var GawkerBase = gClass.extend({

	initialize: function() {},

	setOptions: function( options ) {
		// this flipping needs if we don't want member variables to be totally garbled
		var baseOptions = this.options;
		this.options = options;
		for( optionName in baseOptions ) {
			if ( !this.options[optionName] )
			{
				this.options[optionName] = baseOptions[optionName];
			}
		}
	}

});