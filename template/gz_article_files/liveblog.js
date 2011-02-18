var lastIssueDate = new Array();
lastIssueDate['posts'] = null;

var firstRun = new Array();
firstRun['posts'] = true;

// use for timestamping
var count = 1;

var t; // for timeout

var r = false; // running

function stream( data ) {
    if( data ) {
		addItems(data);
    } else {
        if( r ) {
            return;
        }
    	r = true;
    	var req = new $j.post('/index.php',
        	{
        	    'op': 'liveblog',
        	    'lastIssueDate': lastIssueDate['posts']
        	},
    	    function(resp) {
    			addItems(resp);
    	    }, 'json'
    	);
    }
    
    t = setTimeout( 'stream()', (refreshSecs['posts'] * 1000) );
}

function addItems( posts ) {
    len = posts.length;
	r = false;
	for( var p = len; p > 0; p-- ) {
		// give 'em a name
		var post = posts[p-1];
		
		// create the new post div
		var postDiv = '<div class="post">' + post.html + '</div>';
		
		// store the last issued date
		lastIssueDate['posts'] = post.issued;
		
		$j('#'+placeholder['posts']).prepend( postDiv );
		
		if( !firstRun['posts'] ) {
            $j('#'+placeholder['posts']+' div:first').slideDown(2000);
        } else {
            $j('#'+placeholder['posts']+' div:first').show();
        }
        
        // remove older posts from page
	    if( $j('#'+placeholder['posts']).children().length > itemsOnPage['posts'] ) {
            $j('#'+placeholder['posts']+' div.post:last').remove();
		}
	}
	
	firstRun['posts'] = false;
}