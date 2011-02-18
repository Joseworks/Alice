var GM_fbc = GawkerBase.extend({
	initialize: function( appid, receiver) {
		this.logging_enabled = false;
		this.appid = appid;
		this.receiver = receiver;
		this.fbInit();
	},
	fbInit: function() {
		FB.Facebook.init( this.appid, this.receiver );
	},
	fbReady: function( callback, option, optional ) {
		FB.Facebook.get_sessionWaitable().waitUntilReady(function() {
			this.fb_sess = FB.Facebook.apiClient.get_session();
			FB.Facebook.apiClient.users_getInfo( this.fb_sess['uid'], new Array('name'), function(result,ex){
				this.fb_user = result;
				try {
					this.fb_user = this.fb_user[0];
					if( this.fb_user.uid ) {
						if( callback ) {
							switch( callback ) {
								case 'fbComment':
									gmfbc.fbComment( option, optional );
								break;
								case 'fbFriends':
									gmfbc.fbFriends();
								break;
							}
						}
						return true;
					} else {
						return false;
					}	
				} catch( e ) {}
			});
		});
	},
	fbComment: function( id, cid ) {
	    // type hint doesn't seem to do anything here
		jQuery.post( '/?op=fb', { 'action':'publishComment', 'id': id, 'cid' : cid }, function(data){
		    gmfbc.fbPublishComment( data );
		}, "json" );
	},
	fbFriends: function() {
	    // chainable?
		jQuery('#spinner').show();
		jQuery('#fb_friend_finder').load( '/index.php', {'op':'fb','action':'fbFriends'}, function(responseText, textStatus, XMLHttpRequest) {
			if ('success' == textStatus && GawkerClientside && GawkerClientside.widgets && GawkerClientside.widgets.commentadmin) {
				// TODO: because of this call here this whole facebook code should we widgetized in some way
				GawkerClientside.widgets.commentadmin[0].raiseEvent('commenter.fbfriendsloaded', {});
			}
		});
	},
	fbPublishComment: function( data ) {
		try{
		    attachment = {
		        "name": data.template.storytitle,
		        "href": data.template.storylink
            };
            actionLinks = [{ "text": "Read more", "href": data.template.commentlink}];
			retval = FB.Connect.streamPublish(
			    data.template.commentexcerpt,
                attachment,
			    actionLinks
			);
		} catch( e ) { 
		    this._log( e );
		}
	},
	/*******
	 * utility methods below here
	 **/
	_print_r: function( obj ) {
		for (var key in obj) {
			if( typeof(obj[key]) == 'object' ) {
				this._log("KEY " + key + " is OBJ:" );
				this._print_r( obj[key] );
			} else {
				this._log( key + ": " + obj[key]);
			}
		}
	},
	_log: function( str ) {
		if( this.logging_enabled ) {
			if( window.console ) {
				console.log( str );
			}
		}
	}
});

function redrawFBML( node )
{
    try {
    	// only needed if delivering via ajax
    	FB.Bootstrap.requireFeatures(["XFBML"], function() {
    		if( node == undefined ) {
    			FB.XFBML.Host.parseDomTree();
    		} else {
    			FB.XFBML.Host.parseDomElement( node );
    		}
    	});
    } catch( e ) {}
}