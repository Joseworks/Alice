/* Script: gawker.clientside.js
	Gawker Clientside library

Copyright:
	copyright (c) 2007-2008 Gawker Media, <http://gawker.com>
*/

var GawkerClientside = {
	version: '0.4_jQuery',
	widgets: {},
	pushWidget: function(wtype, winstance) {
		if(winstance) {
			if(this.widgets[wtype]) this.widgets[wtype].push(winstance);
			else this.widgets[wtype] = [winstance];
		}
	},
	destroyWidgets: function(type) {
		if (this.widgets[type] && this.widgets[type].length) {
			for (var i = 0, l = this.widgets[type].length; i < l; i++) {
				this.widgets[type][i].destroy();
			}
		}
		this.widgets[type] = null;
	}
};

var GanjaDate = {
	refineDate: function(date)
	{
		if (date == undefined)
		{
			date = new Date();
		}

		var retval = {
			hours: this.zeroPad(date.getHours(), 2),
			minutes: this.zeroPad(date.getMinutes(), 2),
			seconds: this.zeroPad(date.getSeconds(), 2),
			milliseconds: this.zeroPad(date.getMilliseconds(), 3),
			time: date.getTime()
		};
		retval.MSm = retval.minutes +':'+ retval.seconds +'.'+ retval.milliseconds;
		retval.HMSm = retval.hours +':'+ retval.MSm;

		return retval;
	},

	/**
	* GanjaDate.zeroPad()
	* Adds leading zeros to digits
	*
	* value: in to be padded
	* digits: digit count
	*/
	zeroPad: function(value, digits) {
		value = value.toString();
		while (value.length < digits) {
			value = '0'+ value;
		}

		return value;
	}
};

var Logger = {
	enabled: false,
	buffer: [],
	previousDate: GanjaDate.refineDate(),
	debugLog: function(msg)
	{
		if (this.enabled || jQuery.cookie('____GDClientSide') == 'on')
		{
			try
			{
				var date = GanjaDate.refineDate();
				var delta = GanjaDate.refineDate(new Date(date.time - this.previousDate.time));
				this.previousDate = date;

				if (typeof(msg) == 'object')
				{
					this.writeLog(date.HMSm +' [+'+ delta.MSm +'] =>');
					this.writeLog(msg);
				}
				else
				{
					this.writeLog(date.HMSm +' [+'+ delta.MSm +'] '+ msg);
				}
			}
			catch(e) {};
		}
	},

	/**
	* Logger.writeLog()
	* logs current message
	*
	* msg: message
	*/
	writeLog: function(msg) {
		if (console && console.log)
		{
			console.log(msg);
		}
		else
		{
			// some IE replacement for console
			var consoleText = jQuery('#console');
			if (consoleText.length > 0)
			{
				consoleText.show();
				if (this.buffer.length > 0)
				{
					var buffer = this.buffer;
					this.buffer = [];
					for (var i = 0, l = buffer.length; i < l; i++)
					{
						consoleText.append(buffer[i] +'<br />');
					}
				}
				consoleText.append(msg +'<br />');
			}
			else
			{
				this.buffer.push(msg);
			}
		}
	}
};

var settings = {
	scan_interval: 1500,
	widgets: {}
};
