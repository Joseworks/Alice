(function($) {
	$.widget('ui.AdRobot', {
		xhr: null,
		dw_canvas: null,
		dw_iframe: null,
		ad_queue: [],
		ad_log: {},
		ads: {},
		current_random: null,
		response_cache: {},
		default_sizes: ['728x90', '160x600', '300x250', '300x600'],
		cruncher_running: false,
		dom_is_ready: false,
		special_togglers: {
			'160x600': {
				'hide': {
					'on_ready': function() {
						jQuery('#skyscraper').addClass('hide');
						jQuery('#skySpacer').addClass('hide');
						jQuery('#sidebar').css({backgroundPosition: '0px 0px'});
					}
				},
				'show': {
					'on_ready': function() {
						jQuery('#skyscraper').removeClass('hide');
						jQuery('#skySpacer').removeClass('hide');
					}
				}
			},
			'300x250': {
				'hide': {
					'right_on': function() {
						jQuery('#splashPosts .hide').removeClass('hide');
						jQuery('#ad-300x250').addClass('hide');
						jQuery('#topMenu').animate({width: '1000px'}, 500);
						jQuery('#contentSwitch').animate({width: '650px'}, 500);
					}
				},
				'show': {
					'right_on': function() {
						jQuery('#ad-300x250').removeClass('hide');
					}
				}
			}
		},

		initialize: function() {
			this.xhr = new XHR({
				klass: 'ad',
				beforeSend: this.handleAjaxRequest.bind(this),
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});

			adrobot = this;
			jQuery().ready(function() {
				adrobot.dom_is_ready = true;
				adrobot.finalize();
			});
		},

		addAd: function(params) {
			this.ad_queue.push(params.random);
			this.logAd(params['size'], 'added');
			this.ads[params.random] = {
				'request': params,
				'response': null
			};

			this.nextAd();
		},

		logAd: function(ad_size, action) {
			switch (action) {
				case 'added':
					if (this.ad_log[ad_size]) {
						this.ad_log[ad_size] += 1;
					} else {
						this.ad_log[ad_size] = 1;
					}
					break;
				case 'rendered':
					this.ad_log[ad_size] -= 1;
					break;
			}
		},

		nextAd: function() {
			if (!this.cruncher_running) {
				if (this.ad_queue.length > 0) {
					this.cruncher_running = true;
					next_random = this.ad_queue.shift();
					this.requestAd(this.ads[next_random].request);
				}
			}
		},

		isRendered: function(sizes) {
			for (var i = 0, l = sizes.length; i < l; i++) {
				if (this.ad_log[sizes[i]] > 0 || this.ad_log[sizes[i]] == undefined) {
					return false;
				}
			}

			return true;
		},

		finalize: function() {
			try {
				//all pages
				if (this.isRendered(['160x160']) && jQuery('.ad_160x160 .dfpad').length > 0) {
					this.hideEmpty('#ad_160x160', '160x160');
				}

				//per page-type
				switch (pageType) {
					case 'post':
						if (this.isRendered(['160x600', '728x90', '300x600']) && (interstitial.isFinished == true || this.adIsEmpty('#interstitial')[0]['empty'])) {
							this.finalizePostPage();
						}
						break;

					default:
						if (this.isRendered(['160x600']) && jQuery('.ad_160x600 .dfpad').length > 0) {
							this.hideEmpty('#skyscraper', '160x600');
						}
						break;
				}

				if (this.adIsEmpty('#interstitial')[0]['empty']) {
		 			if (this.adIsEmpty('#ad-300x250')[0].empty) {
						this.hideAd('#ad-300x250', '300x250');
					} else {
						this.showAd('#ad-300x250', '300x250');
					}
				}
				else
				{
					this.hideAd('#ad-300x250', '300x250');
				}
			}
			catch(e) {
				Logger.debugLog(e);
			}
		},

		finalizePostPage: function() {
			if (this.adIsEmpty('#interstitial')[0]['empty']) {
				interstitial.finished(true);
			}

			//prepare jquery objects
			var interruptor_ad = jQuery('.ad_728x90');
			var interruptor = jQuery('.permalink_ads').eq(0);

			//calculate interruptor ad position
			if(interruptor != undefined) {
				var related = jQuery('.related_posts').eq(0);
				var related_items_bottom = related.offset().top + related.height();
				var enoughroom = ( interruptor.offset().top - related_items_bottom > 620 );
			}

			if (this.adIsEmpty('#interstitial')[0]['empty']) {
				//see which ads to show
				var show_interruptor = (interruptor_ad.length > 0 && !this.adIsEmpty('.ad_728x90')[0].empty);
				var	show_300x600 = ((!show_interruptor || enoughroom) && !this.adIsEmpty('#ad_300x600')[0].empty);

				//show them
	 			if (show_interruptor) {
					this.showAd('.ad_728x90', '728x90');
				}
	 			if (show_300x600) {
					this.showAd('#ad_300x600', '300x600');
				}
	 			if (!show_300x600 && !this.adIsEmpty('#skyscraper')[0].empty) {
					this.showAd('#skyscraper', '160x600');
				}
			}

			this.checkRelated(); //show related posts after the ads are shown. only if there is enough room.
		},

		// sends an AJAX request to the adserver
		requestAd: function(params) {
			var request_params = new Array(
				'site_id='+ params.site_id,
				'page_type='+ params.page_type
			);
			if (params.referer) {
				request_params.push('referer='+ params.referer);
			}

			// sizes
			var size = params['size'];
			if (this.default_sizes.indexOf(params['size']) > -1) {
				size = 'defaults';
			}
			request_params.push('size='+ size);

			// tags
			if (typeof(params.tags)=='object' && (params.tags instanceof Array)) {
				for (var i = 0, l = params.tags.length; i < l; i++) {
					request_params.push('tags[]='+ params.tags[i]);
				}
			}

			request_params.push('jsonp=?');
			query_string = request_params.join('&');
			this.ads[params.random].query_string = query_string;
			if (this.response_cache[query_string]) {
				// this caching decreases the load on adserver
				cached_response = this.response_cache[query_string];
				cached_response.random = params.random;
				this.renderAd(this.ads[params.random].request, cached_response);
			} else {
				if (params.forced_zone) {
					this.forceAdZone(params);
				} else {
					url = 'http://' + this.options.adserver_host +'/ad?random='+ params.random +'&'+ query_string;
					this.current_random = params.random;
					this.xhr.getJSON(url);
				}
			}
		},

		forceAdZone: function(params) {
			return this.handleAjaxSuccess({
				'action': 'ad_select',
				'success': true,
				'type': 'zone',
				'random': params.random,
				'keywords': [],
				'params': {
					'ad_zone': params.forced_zone
				}
			});
		},

		// AJAX event handlers
		handleAjaxRequest: function() {},

		handleAjaxSuccess: function(response) {
			this.response_cache[this.ads[response.random].query_string] = response;
			this.renderAd(this.ads[response.random].request, response);
		},

		handleAjaxFail: function() {
			return this.handleAjaxSuccess({
				'action': 'ad_select',
				'success': false,
				'random': this.current_random
			});
		},

		// renderer methods
		renderAd: function(request, response) {
			var target_selector = '#ad_container_'+ response.random;

			if (response.action == 'ad_select' && response.success == true) {
				Logger.debugLog('rendering '+ request['size'] +'@'+ target_selector);
				switch (response.type) {
					case 'zone':
						this.renderDartZone(request, response);
						break;
				}
			} else {
				jQuery(target_selector).html('');
				this.hideEmpty(target_selector, request['size']);
			}

			// cleanup
			this.logAd(request['size'], 'rendered');
			delete this.ads[response.random];
			this.finalize();
			this.nextAd();
		},

		renderDartZone: function(request, response) {
			var script_params = new Array(
				'ptile='+ request.ptile,
				'sz='+ request['size'],
				'ord='+ response.random
			);

			for (i = 0, l = request.keywords.length; i < l; i++) {
				script_params.push(request.keywords[i]);
			}

			if (response.keywords) {
				for (i = 0, l = response.keywords.length; i < l; i++) {
					if (script_params.indexOf(response.keywords[i]) < 0) {
						script_params.push(response.keywords[i]);
					}
				}
			}

			var target_selector = '#ad_container_'+ response.random;
			var script_src = 'http://ad.doubleclick.net/adj/'+ request.site +'/'+ response.params.ad_zone +';'+ script_params.join(';');

			jQuery.writeCapture.writeOnGetElementById = true;
			jQuery.writeCapture.autoAsync();

			var content = [
				'<script type="text/javascript" src="'+ script_src +'"><\/script>',
				'<script type="text/javascript">adRobot.cruncher_running = false;adRobot.nextAd();<\/script>'
			];

			jQuery(target_selector).writeCapture().
				html(content.join("\n"), function() {
					this.hideEmpty(target_selector, request.size)
				}.bind(this));
		},

		// auxilliary shower/hider methods
		hideEmpty: function(target_selector, size) {
			if (this.adIsEmpty(target_selector)[0].empty == true) {
				Logger.debugLog(size +' was empty');
				this.hideAd(target_selector, size);
			}
		},

		adIsEmpty: function(selector) {
			var retval = new Array();
		    var ads = jQuery(selector);
			for (i=0, l = ads.length; i < l; i++) {
				var ad = ads[i];
				var empty = false;
				if (ad.innerHTML.trim().length == 0) {
					empty = true;
				} else {
					jQuery('[src]', ad).each(function(i, element) {
						if (element.src && element.src.match(/817-grey.gif/)) {
							empty = true;
						}
					});
				}
				retval.push({'ad': ad, 'empty': empty, 'selector': selector});
			}

			if(ads.length == 0) {
				retval.push({'ad': undefined, 'empty': true, 'selector': selector});
			}

			return retval;
		},

		showAd: function(selector, size) {
			jQuery(selector).removeClass('hide');
			this.callSpecialTogglers(size, 'show');
		},

		hideAd: function(selector, size) {
			jQuery(selector).addClass('hide');
			this.callSpecialTogglers(size, 'hide');
		},

		callSpecialTogglers: function(size, method) {
			if (this.special_togglers[size] && this.special_togglers[size][method]) {
				var toggler_set = this.special_togglers[size][method];
				if (toggler_set['on_ready']) {
					jQuery().ready(function() {
						toggler_set['on_ready']();
					});
				}
				if (toggler_set['right_on']) {
					toggler_set['right_on']();
				}
			}
		},

		checkRelated: function() {
			var interruptor = jQuery('.permalink_ads').get(0);
			if(interruptor != undefined) {
				var interruptor_top = jQuery('.permalink_ads').get(0).offsetTop;
				var related = jQuery('.related_posts').get(0);
				var related_items = jQuery('.rp_post');
				related_items.each(function(index, node){
					jQuery(node).show();
					if(related.offsetTop + related.offsetHeight + 10 > interruptor.offsetTop) {
						jQuery(node).hide();
					}
				});
			}
		},

		safeWrite: function(selector, content) {
			jQuery.writeCapture.writeOnGetElementById = true;
			jQuery().ready(function() {
				jQuery(selector).writeCapture().html(content);
			});
		}
	});

	$.extend($.ui.AdRobot, {
		'version': '1.0',
		'defaults': {
			'adserver_host': 'localhost:8800',
			'controlClass': 'ad_control'
		}
	});

})(jQuery);
