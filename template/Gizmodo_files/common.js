/* post state change functions */
function changePostStatus( postId, state, realm, linkobj, needsConfirm)
{
	var skip = false;
	if(needsConfirm)
	{
		if( !confirm('Delete post?') )
		{
			skip = true;
		}
	}
	if( !skip )
	{
		var params = new Array;
		params.push( 'op=changepoststatus' );
		params.push( 'id='+ postId );
		params.push( 'publishStatus='+ state );
		params.push( 'realm='+ realm );

		new Ajax.Updater('postStatusResponse', "/index.php", {
			parameters : params.join('&'),
			evalScripts: true
		});
	}
}

function expandTopStories() {
	jQuery('#splashPosts .hide').show();	
	jQuery('#ad-300x250').hide();
	jQuery("#topMenu").animate({ width: "1000px" }, 500 );	
	jQuery("#contentSwitch").animate({ width: "650px" }, 500 );	
	return 0;
}

/* check error message from hashmark */
function checkHashForErrors ()
{
	var messageContainer = 'errorbar';
	var timing = 30000;
	var message;
	
	if(document.location.hash == '#ERR404') {
 		message = 'You were redirected to our front page because the URL you requested is unavailable. Please try again later.';
	}
	else if(document.location.hash == '#ERR500') {
		message = 'You were redirected to our front page because the URL you requested is unavailable. Please try again later.';
	}
	// user profile saving related errors
	else if(document.location.hash == '#passworderror') {
		message = 'Password change failed. Check your username and password and resubmit.';
	}
	else if(document.location.hash == '#emailerror') {
		message = 'Email already used. Please type another one.';
	}
	else if(document.location.hash == '#authrequired') {
		message = 'Authorization required. Please login first.';
	}
	else if(document.location.hash == '#profilesuccess') {
		messageContainer = 'infobar';
 		message = 'Profile successfully updated.';
	}
	else if(document.location.hash == '#random') {
		messageContainer = 'randombar';
		var rndm = Math.floor(1000*Math.random());
 		message = 'You have been redirected to this post from our Random URL. <a href="/random/?rnd=' + rndm + '">Click here</a> for another random post.';
		timing = 60000;
	}
	
	if( message ) {
		var messageContainerElement = document.getElementById(messageContainer);
		messageContainerElement.innerHTML = message;
		messageContainerElement.style.display = 'block';
		setTimeout('document.getElementById(\''+ messageContainer +'\').style.display = \'none\';', timing);
	}
	
}

/* polldaddy vote */
function setVote( pollid, answerid )
{
  var req = jQuery.post( '/index.php', { op: 'polldaddyvote', pollid: pollid, answerid: answerid } );
}

//placeholder for gawkerGallery insert
function gawkerGallery( postId, numImages, title ) {}

function adIsEmpty( selector )
{
	var retval = new Array();
    var ads = jQuery(selector);
	for (i=0; i < ads.length; i++) {
		var ad = ads[i];
		var empty = false;
		if (ad.innerHTML.trim().length == 0) {
			empty = true;
		} else {			
			jQuery('[src]', ad).each( function( i, el ) {
				elsrc = jQuery(el).attr('src');
				if (elsrc != undefined && elsrc.match(/817-grey.gif/)) {
					empty = true;
				}
			});
		}
		retval.push( { 'ad' : ad, 'empty' : empty, 'selector' : selector} );
	}
	return retval;
}

function hideAd( selector, additional_divs ){
	jQuery(selector).addClass('hide');
	if(additional_divs !== undefined)
	{
		for(var key in additional_divs){
			jQuery(key).addClass(additional_divs[key]);
		}
	}
}

function showAd( selector, additional_divs ){
	jQuery(selector).removeClass('hide');
	if(additional_divs !== undefined)
	{
		for(var key in additional_divs){
			jQuery(key).removeClass(additional_divs[key]);
		}
	}
}

function hideEmptyAd( selector, additional_divs )
{
	var empties = adIsEmpty( selector );
	for(i=0; i< empties.length; i++){
		var ad = empties[i].ad;
		var empty = empties[i].empty;
		var selector = empties[i].selector;

		if(empty)
		{
			hideAd(selector, additional_divs);
		}
	}
}

function checkRelated() {
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
}
