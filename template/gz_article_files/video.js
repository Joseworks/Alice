function newVideoPlayer( videoURL, movieWidth, movieHeight, waterMarkURL, agegate ) {
	videoPlayer( videoURL, movieWidth, movieHeight, waterMarkURL, agegate );
}

function videoPlayer( videoURL, movieWidth, movieHeight, waterMarkURL, agegate ) {
	VideoHandler.load( VideoHandler.parseParams( videoURL, movieWidth, movieHeight, waterMarkURL, agegate ) );
}

var VideoHandler = ( function() {
	
	/***
	 * Source specific parsers to prepare the data before displaying
	 */
	var SourceParser = (function() {
		return {
			'youtube' : function( vd ) {
				return vd;
				var matches = /\/v\/([^?&]+)/.exec( vd.player );
				if( matches !== null ) {
					vd.playerType = 'iframe';
					vd.iframeSrc = 'http://www.youtube.com/embed/' + matches[1];
					vd.iframeParams = [ ['class', 'youtube-player'] ];
				}
				vd.playerType = 'iframe';
				return vd;
			},
			
			'vimeo' : function( vd ) {
				var matches = /clip_id=([0-9]+)/.exec( vd.player );
				if( matches !== null ) {
					vd.playerType = 'iframe';
					vd.iframeSrc = 'http://player.vimeo.com/video/' + matches[1];
					vd.iframeParams = [];
				}
				return vd;
			},
			
			'viddler' : function( vd ) {
				vd.player = vd.player.replace( '/player/', '/simple/' );
				var matches = /\/simple\/([a-zA-Z0-9]+)/.exec( vd.player );
				var idSuffix = '';
				if( matches !== null ) {
					idSuffix = '_' + matches[1];
				}
				vd.objectId = 'viddler' + idSuffix;
				vd.embedName = 'viddler' + idSuffix;
				return vd;
			}
		};
	})();
	
	/***
	 * Handler methods to display videos
	 */
	var View = (function() {
		return {
			/***
			 * HTML5 player for motionbox videos
			 * @param id videoId
			 * @param vd video data
			 * @returns
			 */
			html : function( vd ) {
				var output = '';
				if( vd.addObject ) {
					output += '<object width="' + vd.width + '" height="' + vd.height + '" id="' + vd.outerObjectId + '" type="application/x-shockwave-flash" data="' + vd.origVidSrc + '">';
					output += '<param value="' + vd.origVidSrc + '" name="movie" />';
					output += '<param value="always" name="allowScriptAccess" />';
					output += '<param value="true" name="allowFullScreen" />';
					output += '<param name="autoplay" value="f" />';
					output += '<param name="disablebranding" value="f" />';
					output += '<object' + ( vd.objectId ? ' id="' + vd.objectId + '"' : '' ) + '>';
				}
				output += '<video width="'+ vd.width +'" height="'+ vd.height +'" '; // no height, browser can find it out the proper height for the given width, browsers are good. -- note: not on the iPad.. :)
				if (vd.autoplay) {
					output += 'preload autoplay '; // won't work on iphone OS, keeping it here for other mobile devices
				}
				if( vd.videoId ) {
					output += ' id="' + vd.videoId + '" ';
				}
				if( vd.videoSrc ) {
					output += ' src="' + vd.videoSrc + '" ';
				}
				if( vd.videoType ) {
					output += ' type="' + vd.videoType + '"';
				}
				output += 'poster="' + vd.thumbnail + '" ';
				output += 'controls="controls">';
	
				for( var z in vd.videos ) {
					if( typeof vd.videos[z].url !== 'undefined') {
						output += '	<source src="'+ vd.videos[z].url +'" type=\''+ vd.videos[z].codec +'\' />';
					}
				}
				output += '</video>';
				if( vd.addObject ) {
					output += '</object></object>';
				}
				return { 'output' : output };
			},
			
			standard : function( vd ) {
				if ( /[&?]autoplay=true/.test( location.search ) && vd.source == 'motionbox' ) { vd.player += '&autoPlay=true'; }
				var classId = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
				var objectString = '<object width="' + vd.width + '" height="' + vd.height + '"';
				if( vd.flashData ) {
					objectString += ' data="' + vd.flashData + '"';
				}
				if( vd.objectId ) {
					objectString += ' id="' + vd.objectId + '"';
				}
				var wrapStyle = '';
				if( vd.wrap ) {
					wrapStyle = ' style="float:left; margin-right:1em;margin-bottom:1em;"';
				}
				objectString += ' classid="' + classId + '" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"' + wrapStyle + '><param name="movie" value="' + vd.player + '" /><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" />';
				var flashVars = '';
				for( var item in vd.customParams ) {
					if( typeof vd.customParams[item] != 'string' ) {
						continue;
					}
					var lcname = item.toLowerCase();
					if( lcname == 'flashvars' ) {
						flashVars = vd.customParams[item];
					}
					else if( lcname == 'allowfullscreen' || lcname == 'allowscriptaccess' ) {
						continue;
					}
					objectString += '<param name="' + item + '" value="' + vd.customParams[item] + '" />';
				}
				objectString += '<param name="wmode" value="transparent" />'
				if( !vd.noEmbed ) {
					objectString += '<embed src="' + vd.player + '" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer" allowscriptaccess="always" allowfullscreen="true" width="' + vd.width + '" height="' + vd.height + '"';
					if( flashVars ) {
						objectString += ' flashvars="' + flashVars + '"';
					}
					if( vd.embedName ) {
						objectString += ' name="' + vd.embedName + '"';
					}
					objectString += '></embed>';
				}
				objectString += '</object>';
				return { 'output' : objectString };
			},
			
			flow: function( videoData, id ) {
				var keys = {
						'default' : '#@729b1ef2eb63513996a',
						'deadspin' : '#@c4de160d2885634aef2',
						'fleshbot' : '#@6f4293756ec6f2d0f5e',
						'gawker' : '#@729b1ef2eb63513996a',
						'gizmodo' : '#@165c7e3eaf777189373',
						'io9' : '#@0c6d54676e70351ad8d',
						'jalopnik' : '#@2360a735466fc1bc9d4',
						'jezebel' : '#@071da37431d95497438',
						'kotaku' : '#@0cf9dea9bfc70dce2c8',
						'lifehacker' : '#@0a3b01f1f3c947d395d'
				};
				var swfUrls = {
						'default' : 'http://edge-cache.gawker.com/util/flowplayer/flowplayer.commercial-3.2.2.swf',
						'fleshbot' : 'http://cache.fleshbot.com/assets/util/flowplayer/flowplayer.commercial-3.2.2.swf'
				};
				var hostMatch = location.hostname.match( /([^\.]+)\.[a-z]+$/ );
				if( hostMatch !== null ) {
					var host = hostMatch[1];
					var key = ( keys[host] !== undefined ? keys[host] : keys['default'] );
					var swfUrl = ( swfUrls[host] !== undefined ? swfUrls[host] : swfUrls['default'] );
				}
				output = '<a href="' + videoData.player + '" style="display: block;width: ' + videoData.width + 'px;height: ' + videoData.height + 'px;" id="flowplayer_' + id + '"></a>';
				var fpParams = {
					'key' : key,
					'clip' : {
						'autoPlay' : false,
						'autoBuffering' : true
					},
					'screen': {
						'height' : '100pct',
						'top' : 0
					},
					'plugins': {
						'controls': {
							'timeColor' : '#ffffff',
							'borderRadius' : '0px',
							'slowForward' : true,
							'bufferGradient' : 'none',
							'backgroundColor' : 'rgba(0, 0, 0, 0)',
							'volumeSliderGradient' : 'none',
							'slowBackward' : false,
							'timeBorderRadius' : 20,
							'progressGradient' : 'none',
							'time' : true,
							'height' : 26,
							'volumeColor' : '#4599ff',
							'tooltips' : {
								'marginBottom' : 5,
								'volume' : true,
								'scrubber' : true,
								'buttons': false
							},
							'opacity' : 1,
							'fastBackward' : false,
							'timeFontSize' : 12,
							'volumeSliderColor' : '#ffffff',
							'border' : '0px',
							'bufferColor' : '#a3a3a3',
							'buttonColor' : '#ffffff',
							'mute' : true,
							'autoHide' :  {
								'enabled' : true,
								'hideDelay' : 500,
								'hideStyle' : 'fade',
								'mouseOutDelay' : 500,
								'hideDuration' : 400,
								'fullscreenOnly' : false
							},
							'backgroundGradient' : 'none',
							'width' : '100pct',
							'sliderBorder' : '1px solid rgba(128, 128, 128, 0.7)',
							'display' : 'block',
							'buttonOverColor' : '#ffffff',
							'fullscreen' : true,
							'timeBgColor' : 'rgb(0, 0, 0, 0)',
							'scrubberBarHeightRatio' : 0.2,
							'bottom' : 0,
							'stop' : false,
							'zIndex' : 1,
							'sliderColor' : '#000000',
							'scrubberHeightRatio' : 0.6,
							'tooltipTextColor' : '#ffffff',
							'sliderGradient' : 'none',
							'timeBgHeightRatio' : 0.8,
							'volumeSliderHeightRatio' : 0.6,
							'name' : 'controls',
							'timeSeparator' : ' ',
							'volumeBarHeightRatio' : 0.2,
							'left' : '50pct',
							'tooltipColor' : 'rgba(0, 0, 0, 0)',
							'playlist' : false,
							'durationColor' : '#b8d9ff',
							'play' : true,
							'fastForward' : true,
							'progressColor' : '#4599ff',
							'timeBorder' : '0px solid rgba(0, 0, 0, 0.3)',
							'scrubber' : true,
							'volume' : true,
							'builtIn' : false,
							'volumeBorder' : '1px solid rgba(128, 128, 128, 0.7)'
						}
					}
				};
				return {
					'output' : output,
					'postShow' : function() {
									flowplayer( 'flowplayer_' + id,  swfUrl, fpParams );
								}
				};
			},
			
			iframe : function( vd, vidId ) {
				var output = '<iframe src="' + vd.iframeSrc + '" type="text/html" frameborder="0" width="' + vd.width + '" height="' + vd.height + '"';
				if( vd.iframeParams != undefined ) {
					for( var i = 0; i < vd.iframeParams.length; i++ ) {
						output += ' ' + vd.iframeParams[i][0] + '="' + vd.iframeParams[i][1] + '"' 
					}
				}
				output += '></iframe>';
				return {
					'output' : output,
					'postShow' : function() {}
				}
			},
			
			oldStyle : function( vd, vidId ) {
				var wrapStyle = '';
				if( vd.wrap )
				{
					wrapStyle = 'float:left; margin-right:1em;margin-bottom:1em;';
				}
				return {
					'output' : '<object class="flv gawkerVideo" style="height: '+ vd['height']+'px; width: '+ vd['width'] +'px;' + wrapStyle + '" id="flv_'+vidId+'"></object>',
					'postShow' : function() {
									swfobject.embedSWF("http://cache.gawkerassets.com/assets/util/videoModule.008.2.swf", 'flv_' + vidId, vd['width'], vd['height'], "9.0.0", "expressInstall.swf", vd['flashvars'], vd['params'], vd['attributes']);
								}
				};
			}
		};
	})();
	
	var Create = (function(){
		var setDimensions = function( vd, customWidth, force ) {
			if( customWidth === undefined ) {
				customWidth = 0;
			}
			if( force === undefined ) {
				force = false;
			}
			var newWidth = VideoHandler.defaultWidth;
			var newHeight = VideoHandler.defaultHeight;
			if( customWidth ) {
				newWidth = customWidth;
				newHeight = newHeight * customWidth / VideoHandler.defaultWidth;
			}
			if( isNaN( vd.width ) ) {
				vd.width = newWidth;
			}
			if( isNaN( vd.height ) ) {
				vd.height = newHeight;
			}
			if( ( vd.width == 500 && VideoHandler.defaultWidth != 500 ) || force ) {
				vd.height = vd.height * newWidth / vd.width;
				vd.width = newWidth;
			}
			vd.height = Math.round( vd.height );
		};
		
		return {
			viddlerHTML : function( videoData ) {
				setDimensions( videoData, ( ( document.body.offsetWidth < 300 ) ? document.body.offsetWidth : 300 ), true );
				var vidRegexp = new RegExp( '^(http://[^/]+)/[^/]+/([^/]+)/$' );
				var playerMatch = vidRegexp.exec( videoData.player );
				var videoHost = playerMatch[1];
				var videoId = playerMatch[2];
				var player = videoHost + '/file/' + videoId + '/html5mobile/';
				var thumbnail = videoHost + '/thumbnail/' + videoId + '/'
				return {
					'width' 		: videoData.width, 
					'height' 		: videoData.height, 
					'videoType' 	: 'video/mp4', 
					'videoSrc' 		: player, 
					'thumbnail' 	: thumbnail, 
					'videoId' 		: 'viddlerVideo-' + videoId, 
					'addObject'		: true, 
					'objectId' 		: 'viddlerInner-' + videoId, 
					'outerObjectId'	: 'viddlerOuter-' + videoId, 
					'origVidSrc' 	: videoData.player,
					'handler' 		: View.html
				};
			},
			
			html: function( vd ) {
				if( videoData.native_source.sources.length == 0 ) return {};
				setDimensions( vd, ( ( document.body.offsetWidth < 300 ) ? document.body.offsetWidth : 300 ), true );

				var autoplay = false;
				if( window.autoplay )
					autoplay = true;

				return {
					'videos' 	: vd.native_source.sources,
					'thumbnail'	: vd.native_source.thumbnail,
					'width'		: vd.width,
					'height' 	: vd.height,
					'autoplay' 	: autoplay,
					'handler'	: View.html
				};
			},
			
			standard: function( vd ) {
				vd.handler = View.standard;
				setDimensions( vd );

				return vd;
			},
			
			flow: function( vd ) {
				vd.handler = View.flow;
				setDimensions( vd );

				return vd;
			},
			
			iframe: function( vd ) {
				vd.handler = View.iframe;
				setDimensions( vd );
				return vd;
			},
			
			oldStyle: function( vd ) {
				setDimensions( vd, 0, true );
				//vd.height += 20;
				var flashvars = {
						'bgcolor'			: "#000000",
						'videoURL'			: vd.player,
						'stageWidth'		: vd.width,
						'stageHeight'		: vd.height,
						'waterMarkImageURL'	: vd.watermark
					};
				var params = {
					'quality'			: 'best',
					'scale'				: 'noscale',
					'salign'			: 'tl',
					'allowScriptAccess'	: 'always'
				};
				var attributes = {
					'class': "flv gawkerVideo"
				};

				if (window.permalink) {
					flashvars.permalink =  permalink;
				}
				else {
					flashvars.permalink =  "undefined";
				}

				if (window.autoplay) {
					flashvars.autoplay = autoplay;
					window.autoplay = false;
				}
				else {
					flashvars.autoplay = "undefined";
				}

				return {
					'width'			: vd.width,
					'height'		: vd.height,
					'flashvars'		: flashvars,
					'params'		: params,
					'attributes'	: attributes,
					'handler'		: View.oldStyle
				};
			}
		};
	})();
	
	return {
		'defaultWidth' : 0,
		'defaultHeight' : 0,
		/***
		 * Normalize parameters in different formats
		 * @param videoURL video URL or the object describing the video data
		 * @param movieWidth width of the video
		 * @param movieHeight height of the video
		 * @param waterMarkURL watermark
		 * @param agegate agegate
		 * @returns parsed and normalized video data
		 */
		'parseParams': function( videoURL, movieWidth, movieHeight, waterMarkURL, agegate ) {
			var videoData = {};
			if( typeof videoURL === 'object' && videoURL !== null ) {
				videoData = videoURL;
			}
			else {
				videoData['player'] = videoURL;
				videoData['width'] = !isNaN( movieWidth ) ? movieWidth : 500; 
				videoData['height'] = !isNaN( movieHeight ) ? movieHeight : 500; 
				if( waterMarkURL ) {
					videoData['watermark'] = waterMarkURL;
				}
			}
			if( !videoData.agegate ) {
				if( typeof post_age_limit != 'undefined' ) {
					videoData.agegate = post_age_limit;
				}
				else if( agegate ) {
					videoData['agegate'] = agegate;
				}
			}
			return videoData;
		},
		
		/***
		 * Decides which video player is used, then create the needed handlers 
		 * @param vd video data
		 * @returns returns the video data decorated with handlers
		 */
		
		getData: function( vd ) {
			var isHTML5 = ( navigator.userAgent.match(/iPhone|iPad|iPod|Android/i) != null || location.search.match( /[&?]html5=true/i ) != null );
			vd.playerType = 'flash';
			if( vd.source !== undefined && SourceParser[vd.source] != undefined ) {
				vd = SourceParser[vd.source]( vd );
			}
			var video = null;
			if( vd.playerType == 'iframe' ) {
				video = Create.iframe( vd );
			}
			else if( isHTML5 ) {
				
				if( vd.source !== undefined && vd.source == 'viddler' ) {
					video = Create.viddlerHTML( vd );
				}
				else if( typeof vd.native_source !== 'undefined' ) {
					video = Create.html( vd );
				}
			}
			else if( vd.source && vd.source == 'motionboxTranslated' ) {
				video = Create.flow( vd );
			}
			else if( vd.source ) {
				video = Create.standard( vd );
			}
			else {
				video = Create.oldStyle( vd );
			}
			return video;
		},
		
		/***
		 * Loads the video or returns the necessary data for later use
		 * @param vd video data
		 * @param ajax if true, the method will return the video displaying method instead of running it
		 * @returns method loading the video or nothing (depends on _ajax_)
		 */
		'load': function( vd, ajax ) {
			if( ajax === undefined ) {
				ajax = false;
			}
			var video = this.getData( vd );
			var vidId = Math.round(Math.random()*10000);
			var replacement = '</p><div id="obj_' + vidId + '"></div><p>';
			var handler = function() {
				var data = video.handler( video, vidId );
				jQuery( '#obj_'+ vidId ).get( 0 ).innerHTML = data.output;
				if( data.postShow !== undefined ) {
					data.postShow();
				}
			};
			if( ajax ) {
				return {
					'replacement'	: replacement,
					'handler'		: function() {
										handler();
					}
				};
			}
			//FIXME: agegate is not yet supported when post is dinamically loaded
			document.writeln( replacement );
			if ( vd.agegate ) {  
				GawkerClientside.pushWidget( 'agegate', jQuery( '#obj_' + vidId ).AgeGate( { id: vidId, object: video, limit: vd.agegate, 'handler' : handler } ).data('AgeGate') );
			}
			else {
				handler();
			}
		},
		
		dumpObject: function( vd ,id ) {
			var video = this.getData( vd );
			var data = video.handler( video, id );
			jQuery( '#'+ id ).get( 0 ).innerHTML = data.output;
			if( data.postShow !== undefined ) {
				data.postShow();
			}
		}
	};

} )();

VideoHandler.defaultWidth = 500;
VideoHandler.defaultHeight = 375;
