(function($) {
	$.widget('ui.HybridLink', {
		xhr: null,

		initialize: function() {
			// setup XHR object
			this.xhr = new XHR({
				klass: 'hybridlink',
				beforeSend: this.handleAjaxRequest.bind(this),
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});

			this.registerEventHandler(this.element, 'click', this.handleClick.bind(this));

			this.showWidget();
		},

		// formsubmit handler method
		handleClick: function(e) {
			var controlName = this.getParam('cn', jQuery(e.target));
			switch (controlName) {
				case 'link':
					// warning count to be decreased or increased
					var params = {
						'op': 'hybrid_add_tag',
						'tagName': this.getParam('tag', jQuery(e.target))
					};
					this.xhr.send('/', params);

					e.stopPropagation();
					e.preventDefault();
					break;
			}
		},

		// AJAX event handlers
		handleAjaxRequest: function() {
			this.controls.indicator.show();
		},

		handleAjaxSuccess: function(data) {
			// this.controls.indicator.hide();
			Message.showMessage(data.message, this.controls.message[0]);
			document.location = data.url;
		},

		handleAjaxFail: function() {
			this.controls.indicator.hide();
			Message.showMessage('Request failed', this.controls.message[0]);
		}
	});

	$.extend($.ui.HybridLink, {
		'version': '1.0',
		'defaults': {
			'controlClass': 'hybrid_control'
		}
	});

})(jQuery);
