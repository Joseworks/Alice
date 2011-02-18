(function($) {
	$.widget('ui.InflowNotificationWidget', {

		xhr: null,

		initialize: function() {
			// setup XHR object
			var obj = this;
			this.xhr = new XHR({
				klass: 'inflownotification',
				'type': 'POST',
				beforeSend: function(e){
					obj.handleAjaxRequest( e );
				},
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});

			this.registerEventHandler(this.element, 'click', this.handleClick.bind(this));
			this.subscribeForEvent('user.auth.', this.authEventHandler.bind(this));
		},

		authEventHandler: function(ev) {
			switch(ev.name) {
				case 'user.auth.success':
					this.hideWidget();
					this.showWidget();
				break;
				case 'user.auth.failure':
					this.hideWidget();
				break;
			}
		},

		showWidget: function()
		{
			this.countOnly = true;
			this.updatePointer = false;
			this.startIndex = 0;
			this.getNotifications();
		},

		getNotifications: function()
		{
			var params = {
					'countOnly'		: ( this.countOnly ? 1 : 0 ),
					'updatePointer'	: ( this.updatePointer ? 1 : 0 ),
					'startIndex'	: this.startIndex,
					'r'				: this.auth.getRevision()
			}
			this.xhr.send( '/?op=commentinflow', params );
		},

		moreClick: function()
		{
			this.getNotifications();
		},
		
		clearItems: function()
		{
			this.updatePointer = true;
			this.startIndex = 0;
			this.countOnly = true;
			this.getNotifications();
			this.hideWidget();
		},

		displayNotifications: function()
		{
		},

		parseNotifications: function( items )
		{
			var ret = '';
			for (var i = 0, l = items.length; i < l; i++)
			{
				var item = items[i];
				var template = jQuery( '.notificationMsgTemplates span.' + item.type ).html();
				if( !template ) template = '<a href="%userLink%">%userName%</a> replied to your <a href="%commentLink%">comment</a> in <a href="%postLink%">%postName%</a> <span class="atTime">%time%</span>';
				for( var k in item )
				{
					var v = '';
					if( k == 'time' ) v = '<span title="' + item['fullTime'] + '">' + item['time'] + '</span>';
					else v = item[k];
					template = template.replace( '%' + k + '%', v );
				}
				ret += jQuery( '.notificationMsgTemplates span.container' ).html().replace( '%text%', template );
			}
			return ret;
		},

		// formsubmit handler method
		handleClick: function( e ) {
			if( jQuery(e.target).hasClass('.cn_morenotification') )
			{
				if( jQuery(e.target).hasClass('.cn_notificatonheader') ) jQuery( '.notifIndicator' ).show();
				else jQuery( '.moreNotifIndicator' ).show();
				this.moreClick();
				e.stopPropagation();
				e.preventDefault();
			}
			if( jQuery(e.target).hasClass('.cn_clear') )
			{
				this.clearItems();
				e.stopPropagation();
				e.preventDefault();
			}
		},

		// AJAX event handlers
		handleAjaxRequest: function() {
		},

		handleAjaxSuccess: function(data) {
			switch( data.action )
			{
				case 'inflownotifications':
					jQuery( '.notifIndicator' ).hide();
					jQuery( '.moreNotifIndicator' ).hide();
					if( this.countOnly )
					{
						if( data.count > 0 )
						{
							jQuery( 'div.notifMsg', this.element ).html( jQuery( '.notificationMsgTemplates span.header-' + ( data.count == 1 ? 'one' : 'more' ) ).html().replace( '%count%', data.count ) );
							jQuery( '.see_all', this.element ).attr( 'href', data.seeAllLink );
							jQuery( 'div.notifMsg', this.element ).show();
							this.element.show();
						}
						this.countOnly = false;
						this.updatePointer = true;
						this.startIndex = 0;
						this.loadedNotifications = 0;
						this.itemCount = data.count;
						jQuery( 'div.notifMsg', this.element ).show();
						jQuery( 'div.notifications', this.element ).hide();
					}
					else
					{
						this.loadedNotifications += data.items.length;
						var notifCont = jQuery( 'div.notifications div.text', this.element ); 
						notifCont.html( notifCont.html() + this.parseNotifications( data.items ) );
						if( data.items.length > 0 ) this.startIndex = data.items[data.items.length - 1].pos + 1;
						jQuery( 'div.notifMsg', this.element ).hide();
						jQuery( 'div.notifications', this.element ).show();
						if( this.loadedNotifications >= this.itemCount ) jQuery( 'div.notifications div.more', this.element ).hide();
						if( this.updatePointer ) this.updatePointer = false;
					}
					break;
			}
		},

		handleAjaxFail: function() {
			// remove progress indicator
		}


	});

	$.extend($.ui.InflowNotificationWidget, {
		'version': '1.0',
		'defaults': {
			'action_url': '/index.php',
			'controlClass': 'notif_control'
		}
	});

})(jQuery);
