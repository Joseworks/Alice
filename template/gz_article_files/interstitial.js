var interstitial = {
	runtime: 10,
	seconds_left: 0,
	stopped: true,
	auto_finish: false,
	isFinished: false,
	start_delay: 2000,
	finish_delay: 2000,

	countdown: function() {
		jQuery('.interstitial_countdown').html(this.seconds_left + ' second' + (this.seconds_left > 1 ? 's' : ''));

		if (!this.stopped && (this.seconds_left > 0)) {
			this.seconds_left--;
		}

		if (this.seconds_left == 0 && this.auto_finish) {
			// this.finished();
		}

		if (!this.isFinished) {
			obj = this;
			window.setTimeout(
				function() {
					obj.countdown()
				}, 1000
			);
		}
	},

	init: function(seconds, auto_start, auto_finish) {
		this.auto_finish = auto_finish;
		this.setTimer(seconds);
		if ( auto_start && this.isFinished !== true ) {
			this.start();
		}
	},

	start: function() {
		this.stopped = false;
		this.seconds_left = this.runtime;
		jQuery('#interstitial_info').show();
		jQuery('#popTags, .related_posts').addClass('hide');
		jQuery('#interstitial').animate({'opacity': 1}, this.start_delay);
		this.countdown();
	},

	stop: function() {
		this.stopped = true;
	},

	finished: function(skip_finalize) {
		obj = this;
		var finisher_function = function() {
			jQuery('.interstitial_hidden_content').fadeIn(1000);
			// jQuery('#interstitial').animate({'opacity': 0}, 1000, function() {jQuery('#interstitial').hide();});
			jQuery('#interstitial_container').slideUp(1000);
			jQuery('#interstitial_info').hide();
			jQuery('#popTags, .related_posts').removeClass('hide');
			obj.isFinished = true;
			if (!skip_finalize) {
				adRobot.finalize();
			}
		};
		if (skip_finalize === true) {
			// it was empty, just close it now
			finisher_function();
		} else {
			window.setTimeout(finisher_function, this.finish_delay);
		}
	},

	setTimer: function(seconds) {
		seconds += Math.floor(this.finish_delay / 1000);
		this.runtime = seconds;
		if (!this.stopped) {
			this.seconds_left = seconds;
		}
	}
}

function interstitial_init(seconds, auto_start, auto_finish) {
	interstitial.init(seconds, auto_start, auto_finish);
}
function interstitial_start() {
	interstitial.start();
}
function interstitial_stop() {
	interstitial.stop();
}
function interstitial_finished() {
	interstitial.finished();
}
function interstitial_setTimer(seconds) {
	interstitial.setTimer(seconds);
}

