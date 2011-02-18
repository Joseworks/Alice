(function($) {
	$.widget('ui.CommentWidget', {

		controls: {},
		params: {},
		firstRun: true,

		initialize: function() {
			// setup XHR object
			this.xhr = new XHR({
				klass: 'comment',
				'type': 'POST',
				beforeSend: this.handleAjaxRequest.bind(this),
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});

			this.registerEventHandler(this.element, 'click', this.handleClick.bind(this));

			this.subscribeForEvent('comment.commentlistloaded', this.handleCommentlistLoad.bind(this));
			this.subscribeForEvent('comment.commentlistupdated', this.refreshWidget.bind(this));
			this.subscribeForEvent('commentbox.newComment', this.insertNewComment.bind(this));
			this.subscribeForEvent('user.auth.', this.authEventHandler.bind(this));
		},

		authEventHandler: function(ev) {
			switch( ev.name ) {
				case 'user.auth.success':
				case 'user.auth.failure':
					this.setUserRights();
					if( this.firstRun ) {
						this.setCommentParameters();
						this.showWidget();
					}
					break;
			}
		},

		handleClick: function(e) {
			var target = jQuery(e.target);
			var controlType = this.getParam( 'cn', target );

			switch( controlType )
			{
				// comment list related controls
				case 'loadallcomments':
					this.loadCommentsWithPriority(0);
					e.stopPropagation();
					e.preventDefault();
					break;

				case 'loadfeaturedcomments':
					this.loadCommentsWithPriority(1);
					e.stopPropagation();
					e.preventDefault();
					break;

				case 'newdiscussion': // jump to comment form, or wa'?
					this.startNewDiscussion();
					e.stopPropagation();
					e.preventDefault();
					break;

				case 'nextpage': // known as 'showmorecomments'
					this.showMoreComments();
					e.stopPropagation();
					e.preventDefault();
					break;

				case 'threadexpand':
					this.collapseThread( jQuery( e.target ), false );
					e.stopPropagation();
					e.preventDefault();
					break;
				case 'threadcollapse':
					this.collapseThread( jQuery( e.target ), true );
					e.stopPropagation();
					e.preventDefault();
					break;
				case 'expandallthreads':
					this.collapseAllThreads( false );
					e.stopPropagation();
					e.preventDefault();
					break;
				case 'collapseallthreads':
					this.collapseAllThreads(  true );
					e.stopPropagation();
					e.preventDefault();
					break;
				// comment related controls
				case 'reply': // reply comment  -- only a fireEvent, real work done in commentbox.js
					this.replyToComment( target );
					e.stopPropagation();
					e.preventDefault();
					break;

				case 'e': // edit comment
					this.editComment( target );
					e.stopPropagation();
					e.preventDefault();
					break;

				case 'seeallcomments':
					this.loadInthreadComments( target );
					e.stopPropagation();
					e.preventDefault();
					break;
			}
		},


		setCommentParameters: function() {

			// basic comment list settings
			var thread_id = this.getParam('threadid', this.element);
			var root_id = this.getParam('rootid', this.element);
			var override_sort = this.getParam('sortby', this.element);

			// calculate default comment priority
			var priority = 0;
			if( this.options.action_name == 'commentlist' ) {
				if( this.auth.authenticated ) {
					priority = ( this.auth.user.commentViewMode == 'hidden' ) ? 0 : 1;
				} else {
					priority = ( jQuery.cookie('commentViewMode') == 'hidden' ) ? 0 : 1;
				}
			}
			else if( this.options.action_name == 'commentlist_mixed' || this.options.action_name == 'commentlist_tag' ) {
				priority = this.getParam('priority', this.element);
			}

			// create params array
			if( this.options.hiddenReplies == undefined )
			{
				if( this.auth.authenticated )
				{
					this.options.hiddenReplies = ( this.auth.user.commentRepliesMode != 'expanded' );
				}
				else
				{
					var repliesCookie = jQuery.cookie( 'commentRepliesMode' );
					if( repliesCookie )
					{
						this.options.hiddenReplies = ( repliesCookie != 'expanded' );
					}
				}
			}
			this.params = {
				'cpage' : 1,
				'mode' : (this.options.loadMode) ? this.options.loadMode : 'postComments',
				'op' : this.options.action_name,
				'postId' : root_id,
				'priority' : priority,
				'sort' : (override_sort) ? override_sort : ( ( this.auth.authenticated && this.auth.user.commentOrder == 'asc' ) ? 'asc' : 'desc' ),
				'advertisement': (this.element.hasClass('advertisement'))
			};
			if( this.options.hiddenReplies != undefined )
			{
				this.params.replies = ( this.options.hiddenReplies  ? 'collapsed' : 'expanded' );
			}
			if( this.params.append ) this.params.append = 'true';
			if( thread_id ) this.params.cId = thread_id;
			if( this.options.tagData ) this.params.tagData = this.options.tagData;
			if(this.auth.hasLevel('starcommenters')) this.params['admin'] = 'true';
			var rev = jQuery.cookie('cmntrev');
			if(rev) this.params['r'] = rev;
		},

		showWidget: function() {
			if( this.firstRun && this.options.serverSideCommentList )
			{
				var data = this.options.defaultData;
				data.domAlreadyLoaded = true;
				this.raiseEvent( 'comment.commentlistloaded', { 'data' : data } );
				this.firstRun = false;
			}
			else
			{
				this.xhr.send( '/index.php', this.params );
				if( this.firstRun ) this.firstRun = false;
			}
		},

		refreshWidget: function() {
			this.setControls();
			this.toggleEditIcons( 'cn_e' );
			this.toggleEditIcons( 'cn_i' );
		},

		setUserRights: function() {
			// if the logged in user is a star commenter, set 'starcommenter' class on comments wrapper div
			// - controls comment and comment tools visibility
			var site_id = this.getParam('siteid', this.element);
			this.element.removeClass('ul_m').removeClass('ul_sc');
			if( this.auth.authenticated ) {
				if( this.auth.hasLevel('commentadmins', site_id) ) {
					this.element.addClass('ul_m');
				}
				else if( this.auth.hasLevel('starcommenters', site_id) ) {
					this.element.addClass('ul_sc');
				}
			}

			this.toggleEditIcons( 'cn_e' );
			this.toggleEditIcons( 'cn_i' );
		},

		toggleEditIcons: function( classname ) {
			if ( this.auth.authenticated ) {
				if(this.auth.hasLevel( 'commentadmins') && classname != 'cn_i' ) {
					// do not turn on edit icons for admins, they're already there in the admin links section
					jQuery('.cn_tuw').css({'display': 'block'});
				} else {
				        jQuery('.' + classname, this.element).not('.admin_links .cn_e').css({'display':'none'});
				        if ( classname == 'cn_i' ) { jQuery('.' + classname, this.element).parent().parent().css({'min-height':'0'}); }
						jQuery( '.comment.aid_'+ this.auth.user.id +':not(.dsmvwl)').each( function(iteration, currentComment) {
							var delta = (myUserLocation['t']?myUserLocation['t']:Math.floor(new Date().getTime() / 1000)) - parseInt(this.getParam( 'i', currentComment), 10);
							if( delta < 900 ) {
								// for authors whithin the given time frame
								jQuery( '.' + classname, currentComment ).not('.admin_links .cn_e').css({'display':'block'});
								if ( classname == 'cn_i' ) { jQuery('.' + classname, currentComment ).parent().parent().css({'min-height':'80px'}); }
							}
						}.bind(this)
					);
				}
			}
			else
			{
				jQuery('.' + classname).not('.admin_links .cn_e').css({'display':'none'});
				jQuery('.cn_tuw').hide();
				if ( classname == 'cn_i' ) { jQuery('.' + classname).parent().parent().css({'min-height':'0'}); }
			}
		},


		// comment pager
		showMoreComments: function() {
			this.params.cpage = this.params.cpage+1;
			this.params.append = 'true';
			this.controls.pageindicator.show();
			this.showWidget();
		},

		// show comments with the given minpriority
		loadCommentsWithPriority: function( priority ) {
			document.location.hash = '#comments';
			this.params.append = 'false';
			this.params.cpage = 1;
			this.params.priority = priority;
			if( !this.auth.authenticated ) jQuery.cookie('commentViewMode', (priority == 0) ? 'hidden' : 'featured', { path: '/', expires: 365 } );
			this.showWidget();
		},

		// start a new discussion link
		startNewDiscussion: function() {
			// fire event newdiscussion event (commentbox widget will handle it, and open a new inputform)
			this.raiseEvent('comment.newdiscussion', {});
		},

		collapseThread: function( lnk, collapse )
		{
			var thread = lnk.parents( '.threadWrapper' );
			var see = jQuery( '.cn_threadexpand', thread );
			var hide = jQuery( '.cn_threadcollapse', thread );
			var seeallcomments = jQuery( '.cn_seeallcomments, .t_seppa, .permalink_url', thread );
			var replies = jQuery( '.cr', thread );
			if( collapse )
			{
				replies.hide();
				see.show();
				hide.hide();
				seeallcomments.hide();
				// jQuery('.removeme', thread).remove(); // remove opened paged threads
			}
			else
			{
				replies.show();
				see.hide();
				hide.show();
				seeallcomments.show();
			}
		},

		collapseAllThreads: function( collapse )
		{
			if( collapse )
			{
				this.params.replies = 'collapsed';
				this.options.hiddenReplies = true;
			}
			else
			{
				this.params.replies = 'expanded';
				this.options.hiddenReplies = false;
			}
			if( !this.auth.authenticated ) jQuery.cookie('commentRepliesMode', ( collapse ) ? 'collapsed' : 'expanded', { path: '/', expires: 365 } );
			this.setVisibilityControls();
			//this.xhr.send( '/index.php', { 'op' : 'stickcommentrepliesmode', 'crm' : ( collapse ? 'collapsed' : 'expanded' ) } );
		},

		setVisibilityControls : function()
		{
			if( this.params.commentsCollapsed )
			{
				if(this.controls.showfeaturedorhiddencomments) this.controls.showfeaturedorhiddencomments.show();
				if(this.controls.loadallcomments ) this.controls.loadallcomments.hide();
				if(this.controls.loadfeaturedcomments) this.controls.loadfeaturedcomments.hide();
			}
			else if( this.params.hasHiddenItems == true )
			{
				if(this.controls.showfeaturedorhiddencomments) this.controls.showfeaturedorhiddencomments.hide();
				if(this.controls.loadallcomments ) this.controls.loadallcomments.show();
				if(this.controls.loadfeaturedcomments) this.controls.loadfeaturedcomments.hide();
			}
			else
			{
				if(this.controls.showfeaturedorhiddencomments) this.controls.showfeaturedorhiddencomments.hide();
				if(this.controls.loadfeaturedcomments) this.controls.loadfeaturedcomments.show();
				if(this.controls.loadallcomments ) this.controls.loadallcomments.hide();
			}
			var replies = jQuery( '.cr', this.controls.comments_placeholder );
			var see = jQuery( '.cn_threadexpand', this.controls.comments_placeholder );
			var hide = jQuery( '.cn_threadcollapse', this.controls.comments_placeholder );
			var seeallcomments = jQuery( '.cn_seeallcomments, .t_seppa, .permalink_url', this.controls.comments_placeholder );
			if( this.options.hiddenReplies )
			{
				if( this.controls.collapseallthreads ) this.controls.collapseallthreads.hide();
				if( this.controls.expandallthreads ) this.controls.expandallthreads.show();
				replies.hide();
				see.show();
				hide.hide();
				seeallcomments.hide();
				// jQuery('.removeme', this.controls.comments_placeholder ).remove(); // remove all opened paged threads
			}
			else
			{
				if( this.controls.expandallthreads ) this.controls.expandallthreads.hide();
				if( this.controls.collapseallthreads ) this.controls.collapseallthreads.show();
				replies.show();
				see.hide();
				hide.show();
				seeallcomments.show();
			}
			jQuery( 'a.nextpage', this.controls.nextpage ).html( ( !this.auth.authenticated || this.auth.user.commentOrder != 'asc' ? 'Earlier' : 'Later' ) + ' discussions' );
			var collapse = this.options.hiddenReplies;
			jQuery( '.tagpage_comment_footer a' ).each( function() {
				if( this.href.substr( location.href.length ) == '#' )
				{
					return true;
				}
				this.href = this.href.replace( /[?&]replies=[^&]+/, '' );
				if( this.href.indexOf( '?' ) != -1 ) this.href += '&';
				else this.href += '?';
				this.href += 'replies=' + ( collapse ? 'collapsed' : 'expanded' );
			} );
			this.setPipes();
		},

		setPipes : function() {
			var visibleCounter = -1;
			jQuery( '.comment_footer .tools.intelligentPipes span' ).each( function() {
				//if( key == 0 )  return true;
				var jObj = jQuery( this );
				var hasPipe = ( jObj.html().indexOf( ' | ' ) == 0 );
				if( !jObj.is( ':visible' ) )
				{
					if( hasPipe ) jObj.html( jObj.html().substr( 3 ) );
					return true;
				}
				visibleCounter++;

				if( visibleCounter == 0 )
				{
					if( !hasPipe  ) return true;
					jObj.html( jObj.html().substr( 3 ) );
					return true;
				}
				if( !hasPipe ) jObj.html( ' | ' + jObj.html() );
			} );
		},

		replyToComment: function( targetNode ) {
			if( !this.options.hiddenReplies )
			{
				this.collapseThread( targetNode, false );
			}
			// greying comment to be replied
			var replyComment = targetNode.closest('.comment');
			replyComment.addClass('inreply');

			// moving the box around
			var lastElement = replyComment;
			this.raiseEvent('commentbox.moveform', {'targetNode': lastElement});

			// sending a call to CommentBox::setReplyTo()
			commentid = this.getParam('cid', jQuery(replyComment));
			var authorname = '';
			if(jQuery('#c'+ commentid +'_author span', replyComment)[0] != undefined) { authorname = jQuery('#c'+ commentid +'_author span', replyComment)[0].title; }
			if(authorname == '') { authorname = jQuery('#c'+ commentid +'_author', replyComment).text(); }
			this.raiseEvent('comment.reply', {'parentId': commentid, 'replyTo': authorname } );
		},

		editComment: function( targetNode ) {
			var editedComment = targetNode.closest('.comment');
			// already clicked
			if( editedComment.hasClass('control_inprogress') ) return false;
			// close admin links box if opened
			jQuery('.admin_links').hide();
			var p = {
				'op' : 'ajax_getcomment',
				'id' : this.getParam( 'cid', editedComment )
			};
			var edit_xhr = new XHR({
				klass: 'comment',
				'type': 'POST',
				beforeSend: function() {
					jQuery( '.cn_e', editedComment ).addClass('control_inprogress');
				},
				error: function() {
					jQuery( '.cn_e', editedComment ).removeClass('control_inprogress');
				},
				success: function( ev ) {
					jQuery( '.cn_e', editedComment ).removeClass('control_inprogress');
					if( ev ) {
						this.raiseEvent('commentbox.moveform', {'targetNode': editedComment});
						this.raiseEvent('comment.edit', {'comment': ev } );
					} else {
						Message.showMessage( 'Unable to get comment for editing', jQuery('.please_leave_a_message', editedComment).get(0), {stable: false});
					}
				}.bind(this)
			}).send(
				'/index.php',
				{
					'op' : 'ajax_getcomment',
					'id' : this.getParam( 'cid', editedComment )
				}
			);
		},

		insertNewComment: function( ev ) {
			var data = ev.params.data;
			switch( data.action ) {
				case 'postcomment':
				case 'postauthorcomment':
					// comment rendered comes as data.content
					var commentSelector = '.cid_'+ data.objectId;
					if( data.parentType == 'COMMENT' ) {
						// this is a reply, comment goes BEFORE commentbox
						jQuery('.commentbox', this.element).before(data.content);
						var newcomment = jQuery(commentSelector).addClass('cr');
						// remove tier_2 classes from parent comment
						var promotedComment = jQuery('.cid_'+ data.parentId);
						if( promotedComment.hasClass('p_0') && this.auth.hasLevel('starcommenters') && !data.parentLocked) {
							this.raiseEvent('comment.commentpromoted', {'commentId': data.parentId});
							if( data.approvedCommenterId ) {
								jQuery('.cid_'+ data.parentId +' .promotedBy').hide();
								this.raiseEvent('comment.userapproved', {'commenterId': data.approvedCommenterId, 'commentId': data.parentId});
								Message.showMessage( 'Comment and commenter approved', jQuery('.cid_'+ data.parentId +' .please_leave_a_message').get(0), {stable: false});
							}
						}

						var permalinks = jQuery( '.tp_container', jQuery( commentSelector ).parents( '.threadWrapper' ) );
						var childNum = permalinks.attr( 'childnum' );
						if( childNum == 0 ) permalinks.show();
						childNum++;
						permalinks.attr( 'childNum', childNum );
						jQuery( 'span.chnum', permalinks ).html( childNum );
						jQuery( 'span.chpl', permalinks ).html( childNum > 1 ? 'ies' : 'y' );
					} else {
						// this is a new thread, comment goes AFTER commentbox
						// also, wrap the comment box in div.threadWrapper
						var wrapperDiv = jQuery(document.createElement('div'))
							.addClass('threadWrapper')
							.addClass('threadid_'+data.objectId);
						wrapperDiv.append( data.content );
						wrapperDiv.append( jQuery(document.createElement('div')).addClass('showthreadcomments_box') );
						jQuery('.comment_list_placeholder').prepend(wrapperDiv);
						var newcomment = jQuery(commentSelector).removeClass('cr');
					}

					if (this.justLoggedIn == true)
					{
						// render a warning link under the first comment
						var warnLink = jQuery(document.createElement('a'))
							.addClass('cc')
							.addClass('cn_loadallcomments')
							.html('View pending comments')
							.attr('title', 'You just logged in, there may be pending comments');

						newcomment.after(jQuery(document.createElement('div'))
							.addClass('pendingwarning')
							.append(warnLink)
						);

						this.justLoggedIn = false;
					}

					newcomment.show();
					jQuery( '.cn_commentedit', newcomment ).show();

				break;
				case 'editcomment':
					if( data.success ) {
						// update comment content
						jQuery( '.cid_'+ data.commentId +' .ctedit' ).html( data.content );

						var d = new Date();
						var h = d.getHours();
						var am = 'AM';
						if( h > 12 ) {
							h = h-12;
							am = 'PM';
						}
						var m = d.getMinutes();
						if( m < 10 ) m = '0'+ m;
						var dateStamp = (d.getMonth()+1) +'/'+ d.getDate() +'/'+ d.getFullYear().toString().substring(2, 4) +' '+ h +':'+ m +' '+ am;
						jQuery( '.cid_'+ data.commentId +' .cn_e' ).show();

						var meta_edited_div = jQuery( '.cid_'+ data.commentId +' .modifiedBy');
						if(  meta_edited_div.length == 0 ) {
							var mt = jQuery( '.cid_'+ data.commentId +' .metatext' ).append('<div class="modifiedBy"></div>');
							meta_edited_div = jQuery('.modifiedBy', mt);
						}
						jQuery( '.cid_'+ data.commentId +' .modifiedBy' ).text('Edited by '+ this.auth.user.smartName + ' at '+ dateStamp);
					}
				break;
			}
			this.resetURLRevision();
		},

		resetURLRevision: function() {
			var rev = Math.floor(Math.random() * 100000);
			var dt = new Date();
			dt.setTime(dt.getTime() + (30 * 1000)); //30 secs
			jQuery.cookie('cmntrev', rev, {path:'/', expires:dt});
			return rev;
		},

		checkImageSizes: function ( element ) {
			jQuery('.ctedit img', element).load(function(){
				if(jQuery(this).width() > 160){
					jQuery(this).after('<br style="clear: both;" />');
				}
				jQuery(this).unbind('load');
			});
		},

		handleCommentlistLoad: function( ev ) {
			//waiting for dom ready if IE
			if(!(!+"\v1"))
			{
				// non-IE browsers
				this.insertIntoDom(ev.params);
			}
			else
			{
				// IE
				jQuery(document).ready( function(){ this.insertIntoDom(ev.params); }.bind(this, ev.params) );
			}
		},

		insertIntoDom: function (args) {
			if( args.data.content || args.data.domAlreadyLoaded ) {
				if( !args.data.domAlreadyLoaded ) {
					if(args.data.append == 'true') {
						this.controls.comments_placeholder[0].innerHTML += args.data.content;
					} else {
						this.controls.comments_placeholder[0].innerHTML = '';
						this.controls.comments_placeholder[0].innerHTML = args.data.content;
					}
				}

				if( this.controls.nextpage ) {
					if( (args.data.currentPage + 1) < args.data.totalPages ) {
						this.controls.nextpage.show();
					} else {
						this.controls.nextpage.hide();
					}
					this.controls.pageindicator.hide();
				}

				// check image sizes
				this.checkImageSizes(jQuery('.pagedcomment.page_'+args.data.currentPage));

				// jQuery('.pagedcomment.page_'+args.data.currentPage).show();
				if( this.params.cId ) {
					//document.location.hash = 'c'+ args.data.requestedComment;
					// hilite selected comment, and jump to the top of the thread

					this.controls.allcomments_link.show();

					var hilited = jQuery('.cid_'+ this.params.cId);
					this.fireEvent('onScrollTo', {'wg':this, 'which':hilited}, true);
					this.fireEvent('onCommentHilite', {'wg':this, 'which':hilited}, true);
					if( this.controls.nextpage ) this.controls.nextpage.hide();
				}
				if( args.data.totalThreads > 0 || this.params.cId )
				{
					this.params.hasHiddenItems = args.data.hasHiddenItems;
					this.options.hiddenReplies = args.data.hiddenReplies;
					this.setVisibilityControls();
				}

				if( args.data.totalComments && this.controls.individual_postmeta_commentcount ) {
					this.controls.individual_postmeta_commentcount.html(args.data.totalComments).attr('title', 'Read '+ args.data.totalComments +' comments on the post');
					if( args.data.totalComments >= 100 ) {
						this.controls.commentcount_icon_high.show();
						this.controls.commentcount_icon_low.hide();
					}
				}

				// update lytebox images
				myLytebox = new LyteBox();

				// fbml redraw
				if( jQuery('.facebook_enabled').length > 0 ) {
					redrawFBML( jQuery('.pagedcomment.page_'+args.data.pagenum).get(0) );
				}

			}
			this.raiseEvent( 'comment.commentlistupdated', {'last_comment_id': args.data.last_comment_id, 'pagenum': args.data.currentPage} );
		},

		/* AJAX handler functions */
		handleAjaxRequest: function() { },

		handleAjaxSuccess: function(data) {
			if( data.action != 'stickcommentrepliesmode' )
			{
				this.raiseEvent( 'comment.commentlistloaded', {'data': data} );
			}
		},

		handleAjaxFail: function(data) {
			this.controls.comments_placeholder.html('<span class="error">Failed to load comments, please try again later</span>');
		},


		/* in-thread paging functions */
		loadInthreadComments: function( target ) {
			// comment thread ajax properties
			var threadid = this.getParam('threadid', target);
			var p = {
				op: this.params.op,
				postId: this.params.postId,
				priority: this.params.priority,
				replies: this.params.replies,
				sort: this.params.sort,
				admin: this.params.admin,
				hasHiddenItems: this.params.hasHiddenItems,
				advertisement: this.params.advertisement,
				thread_id: threadid,
				childref: ( ( jQuery( '.threadid_'+ threadid +' .comment').length ) - 1 ),
				mode: 'threadComments' // this commentlist mode will use different template
			};
			// start indicator
			jQuery('.threadid_'+ p.thread_id +' .itp_indicator').show();
			// start ajax request
			var inthread_xhr = new XHR({
				klass: 'comment',
				'type': 'POST',
				beforeSend: function() {},
				error: function() {},
				success: this.handleInthreadSuccess.bind(this)
			}).send('/index.php', p);
		},

		handleInthreadSuccess: function( data ) {
			if( data.success == true ) {
				jQuery('.threadid_'+ data.requestedComment +' .tp_container').before(data.content);
				if( data.threadCommentsLeft < 1 ) {
					// hide pager
					jQuery('.threadid_'+ data.requestedComment +' .cn_seeallcomments, .threadid_'+ data.requestedComment +' .t_seppa').remove();
				} else {
					// update pager number
					jQuery('.threadid_'+ data.requestedComment +' .chleft').text(data.threadCommentsLeft);
				}
				this.raiseEvent( 'comment.commentlistupdated', {} );
			}
			jQuery('.threadid_'+ data.requestedComment +' .itp_indicator').hide();
		}

	});

	$.extend($.ui.CommentWidget, {
		'version': '1.0',
		'defaults': {
			'action_name': 'commentlist',
			'onHide': {},
			'onShow': {},
			'onReset': {},
			'controlClass': 'cc',
			'externalElement': '.commentcontrol_external',

			'onScrollTo': function(args) { jQuery.scrollTo(args['which'], 1200, function(){args['wg'].syncEffect();}); return 'will_sync';},
			'onCommentHilite': function(args) { args.which.animate({'backgroundColor': '#ffff99'}, 1500, 'swing', function(){ args.which.animate({'backgroundColor': jQuery('body').css('background-color')}, 900, 'swing', function() { args.wg.syncEffect();}); });  return 'will_sync';}
		}
	});

})(jQuery);