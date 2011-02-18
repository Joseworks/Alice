var $j = jQuery.noConflict();

// gawker's modifications on jQuery
jQuery.httpData = function( xhr, type, s ) {
	var ct = xhr.getResponseHeader("content-type"),
		isXML = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
		isJSON = type == "json",
		hasXJSON = ( xhr.getResponseHeader("X-JSON") != undefined && xhr.getResponseHeader("X-JSON") != '' ),
		content = xhr.responseText,
		data = isXML ? xhr.responseXML : ( hasXJSON ? xhr.getResponseHeader('X-JSON') : ( isJSON ? content : {} ) );

	if ( content == data ) {
		// we got JSON returned as content
		content = '';
	}

	if ( isXML && data.documentElement.tagName == "parsererror" )
		throw "parsererror";

	// Allow a pre-filtering function to sanitize the response
	// s != null is checked to keep backwards compatibility
	if( s && s.dataFilter )
		data = s.dataFilter( data, type );

	// The filter can actually parse the response
	if( typeof data === "string" ) {
		// Get the JavaScript object, if JSON is used.
		if ( type == "json" ) {
			data = window["eval"]("(" + data + ")");
		}
	}

	if( content.length > 0 ) {
		data.content = content;
	}

	return data;
};