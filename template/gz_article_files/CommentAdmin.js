jQuery.extend( settings.widgets, {
	commentadmin: {
		klass: 'CommentAdminWidget',
		byselector: {
			'.commenter_admin': {
				'options': {
					onInit: function( args ) {
						args.widget.subscribeForEvent('user.auth.', args.widget.handleAuth.bind(args.widget));
						args.widget.subscribeForEvent('comment.commentlistloaded', args.widget.showWidget.bind(args.widget));
						args.widget.subscribeForEvent('comment.commentlistupdated', args.widget.refreshWidget.bind(args.widget));
						args.widget.subscribeForEvent('commenter.fbfriendsloaded', args.widget.refreshWidget.bind(args.widget));
						
						// thread move select change handler
						args.widget.registerEventHandler(args.widget.controls.uw_moveto, 'change', args.widget.checkMovetoSelect.bind(args.widget));
					},

					onClick: function( args ) {
						// set comment variables
						var target = jQuery(args.e.target);
						args.widget.commentParams.toolContainer		= target.parent();
						args.widget.commentParams.paramsContainer	= target.closest('.comment');

						if (args.widget.commentParams.paramsContainer.length == 0) {
							// on a commenter page
							args.widget.commentParams.messageContainer	= args.widget.controls.message;
							args.widget.commentParams.commentId			= '';
							args.widget.commentParams.commenterId		= args.widget.getParam('uId');
						}
						else
						{
							// on a permalink page
							args.widget.commentParams.messageContainer	= jQuery( '.please_leave_a_message', args.widget.commentParams.paramsContainer );
							args.widget.commentParams.siteId			= args.widget.auth.site.siteId;
							args.widget.commentParams.commentId			= args.widget.getParam('cid', args.widget.commentParams.paramsContainer);
							args.widget.commentParams.commenterId		= args.widget.getParam('aid', args.widget.commentParams.paramsContainer);
							args.widget.commentParams.rootCommentId		= args.widget.getParam('threadid', args.widget.commentParams.paramsContainer.closest('.threadWrapper'));
							args.widget.commentParams.postId			= args.widget.getParam('rid', args.widget.commentParams.paramsContainer);
						}

						var controlName = args.widget.getParam( 'cn', target );
						switch( controlName ) {
							
							/* comment admin controls in adminlinks box */
							case 'comment_admin_promotecomment':
								args.widget.promoteComment();
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
								
							case 'comment_admin_userlist':
								document.location = '/index.php?op=userlist_search&id='+ args.widget.commentParams.commenterId +'&siteId='+ args.widget.auth.site.siteId;
								args.e.stopPropagation();
								args.e.preventDefault();
								break;

							case 'approvecommenter':
								args.widget.changeUserStatus('approve');
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
							
							case 'promotemoderator':
								args.widget.changeUserStatus('commenteradmin');
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
								
							case 'bancommenter':
								args.widget.changeUserStatus('remove');
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
							
							/* admin controls on comment permalink page */
							case 'p': // promote comment
								args.widget.changeCommentPriority(1, true);
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
							
							case 'po': // promote comment *only*, will not star user
								args.widget.changeCommentPriority(1, false);
								args.e.stopPropagation();
								args.e.preventDefault();
								break;

							case 'd': // demote comment
								args.widget.changeCommentPriority(0, false);
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
								
							case 'r': // remove comment
								args.widget.changeCommentStatus('DELETED');
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
								
							case 'u': // approve comment and user
								args.widget.changeCommentStatus('PUBLISHED');
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
								
							case 'a': // admin links toggle
								args.widget.toggleAdminLinks(target);
								args.e.stopPropagation();
								args.e.preventDefault();
								break;

							case 'tuw': // toggle user warn dialog
							case 'closeuserwarn': // close user warn dialog
								args.widget.toggleWarnDialog(target);
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
								
							case 'submituserwarn':
								args.widget.submitWarning(target);
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
							
							case 'policylink':
								args.widget.raiseEvent('policypopup.toggle', {});
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
								
							/* admin controls on comment permalink and commenter pages */
							case 's':
								args.widget.setStarCommenter(args.widget.getParam('s', target));
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
							
							case 'buddy':
								args.widget.toggleBuddyStatus(args.widget.getParam('bid', target));
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
						
						}
					},

					onMouseOver: function( args ) {},

					onChange: function( args ) {},

					onChangeCommentStatus: function( args ) {
						// setting progress message
						Message.showMessage( args.messageText, args.widget.commentParams.messageContainer[0], {stable: true});
						
						args.widget.xhr.send( '/index.php', {
							'op': 'changecommentstatus',
							'id': args.widget.commentParams.commentId,
							// 'root_comment_id': args.widget.commentParams.rootCommentId,
							'entry_id': args.widget.commentParams.postId,
							'publishStatus': args.publishStatus,
							'user_id': args.widget.commentParams.commenterId
						});
					},
					
					onChangeCommentPriority: function( args ) {
						// setting progress message
						jQuery('.admin_links').hide();
						Message.showMessage( args.messageText, args.widget.commentParams.messageContainer[0], {stable: false});
						
						args.widget.xhr.send( '/index.php', {
							'op': 'ajax_promotethread',
							'comment_id': args.widget.commentParams.commentId,
							'priority': args.priority,
							'star_user': args.star_user
						});
					},

					onChangeUserStatus: function( args ) {
						// setting progress message
						jQuery('#admin-links-'+args.widget.commentParams.commentId).hide();
						Message.showMessage( args.messageText, args.widget.commentParams.messageContainer[0], {stable: true});

						// sending xhr
						args.widget.xhr.send( '/index.php', {
							'op': 'changeuserstatus',
							'action': args.action,
							'siteId': args.widget.commentParams.siteId,
							'postId': args.widget.commentParams.postId,
							'commentId': args.widget.commentParams.commentId,
							'id': args.widget.commentParams.commenterId
						});
					},

					onAjaxSuccess: function( args ) {
						var control = {};
						var message = '';
						switch( args.data.action )
						{
							case 'changecommentstatus':
								if( args.data.success == true ) {
									switch( args.data.publishStatus ) {
										case 'DELETED':
											jQuery( '.cid_'+ args.data.commentId ).hide();
											var threadElement = jQuery('.cid_'+ args.data.commentId).closest('.threadWrapper');
											if( jQuery('.comment:visible', threadElement).length == 0 ) threadElement.hide();
											
											if (jQuery('.cid_'+ args.data.commentId).closest('.threadwrapper_invisible').prev().eq(0)[0].tagName == 'H2')
											{
												// this hack is for the /comments page, aka GBA_site_comments
												jQuery('.cid_'+ args.data.commentId).closest('.threadwrapper_invisible').prev().hide();
											}
											break;
										case 'PUBLISHED':
											if( args.data.userapproved == true ) {
												// approve user and all its comments
												args.widget.raiseEvent('comment.userapproved', {'commenterId': args.data.commenterId, 'commentId': args.data.commentId});
											} else {
												// approve only the selected comment
												jQuery( '.cid_'+ args.data.commentId ).removeClass('cs_draft');
												jQuery( '.cid_'+ args.data.commentId +' .metatext', this.element ).append('<div class="approvedBy"><a href="/people/'+ args.widget.auth.user.username +'">'+ args.widget.auth.user.smartName +'</a> approved this comment</div>');
											}
											break;
									}
									message = args.data.message;
								} else {
									message = 'Failed setting comment status';
								}
								break;
								
							case 'promotethread':
								if( args.data.success == true) {
									if( args.data.priority == 0 ) {
										args.widget.markCommentAsDemoted(args.data.commentId);
									} else {
										args.widget.markCommentAsPromoted(args.data.commentId, true);
									}
									if( args.data.user_starred == true ) {
										jQuery('#comments .aid_'+ args.data.commenterId +' .cn_s').removeClass('s_t').addClass('s_f');
										jQuery('#comments .cid_'+ args.data.commentId +' .metatext .unstarredBy').hide();
										if( jQuery('#comments .cid_'+ args.data.commentId +' .starredBy').length == 0 ) {
											var meta = '<div class="starredBy">'+ args.data.username +' was starred</div>';
											jQuery('#comments .cid_'+ args.data.commentId +' .metatext').append(meta);
										} else {
											jQuery('#comments .cid_'+ args.data.commentId +' .starredBy').show();
										}
									}
									message = args.data.message;
								} else {
									message = 'Thread promotion failed';
									if( args.data.message ) {
										message += ': '+ args.data.message;
									}
								}
								break;

							case 'removeuser':
								if( args.data.success == true ) {
									jQuery('#comments .aid_'+ args.data.commenterId)
										.addClass('us_banned');
										//.hide();
									jQuery('.admin_links').hide();
									message = 'User banned';
								} else {
									message = 'Ban failed';
								}
								break;

							case 'approveuser':
								if( args.data.success == true ) {
									args.widget.raiseEvent('comment.userapproved', {'commenterId': args.data.commenterId, 'commentId': args.data.commentId});
									message = 'User approved';
								} else {
									message = 'Approve failed';
								}
								break;

							case 'setstarcommenter':
								if( args.data.success == true ) {
									if( !args.data.commentId ) {
										// on a commenter page
										args.widget.controls.s_ind.hide();
										args.widget.controls.s.toggleClass('s_t').toggleClass('s_f').show();
									} else {
										// on a permalink page
										jQuery('#comments .aid_'+ args.data.commenterId +' .cn_s').toggleClass('s_t').toggleClass('s_f').show();
										jQuery( '#comments .cid_'+ args.data.commentId ).removeClass('cs_draft');
										jQuery( '#comments .cid_'+ args.data.commentId +' .cn_s_ind' ).hide();
										var username = jQuery('#c'+ args.data.commentId+'_author').text();
										if( args.data.starcommenter == true ) {
											jQuery('#comments .aid_'+ args.data.commenterId +'.p_0').removeClass('p_0').addClass('p_1');
											var meta = '<div class="starredBy">'+ username +' was starred</div>';
											jQuery('#comments .cid_'+ args.data.commentId +' .metatext .unstarredBy').hide();
										} else {
											jQuery('#comments .aid_'+ args.data.commenterId +'.p_1').removeClass('p_1').addClass('p_0');
											var meta = '<div class="unstarredBy">'+ username +' was unstarred</div>';
											jQuery('#comments .cid_'+ args.data.commentId +' .metatext .starredBy').hide();
										}
										jQuery('#comments .cid_'+ args.data.commentId +' .metatext').append(meta);
									}
									message = args.data.message;
								} else {
									if( !args.data.commentId ) {
										// on a commenter page
										args.widget.controls.s_ind.hide();
										args.widget.controls.s.show();
									} else {
										jQuery('#comments .aid_'+ args.data.commenterId +' .cn_s').show();
										jQuery('#comments .cid_'+ args.data.commentId +' .cn_s_ind').hide();
									}
									message = 'Failed setting starcommenter status';
								}
								break;
								
							case 'saveusertag': // buddy toggle success
								if( args.data.success == true ) {
									if( args.data.command == 'tag' ) {
										args.widget.auth.user.buddies[args.widget.auth.user.buddies.length] = args.data.objectId;
									} else {
										var b = args.widget.auth.user.buddies;
										var nb = [];
										for( var i = 0; i < b.length; i++ ) {
											if( b[i] != args.data.objectId) {
												nb[nb.length] = b[i];
											}
										}
										args.widget.auth.user.buddies = nb;
									}
									args.widget.auth.resetRevision();
									jQuery('.bid_'+ args.data.objectId).toggleClass('buddy_true');
								} else {
									message = 'Failed setting buddy status';
								}
								break;
								
							case 'ajax_warncommenter':
								args.widget.controls.progress.hide();
								if( args.data.success ) {
									// hide and move the admin links dialog to a safe place
									args.widget.toggleWarnDialog();
							
									var policylink = '(see <a href="/communitypolicy" class="ca cn_policylink">Community Policy</a>)';
									var msg = '';
									msg += '<a href="/people/'+ args.widget.auth.user.username +'/">'+ args.widget.auth.user.displayName +'</a> ';
									if( args.data.type ) {
										switch( args.data.type ) {
											case 'warn':
												msg += 'warned ';
												break;
											case 'suspend':
												msg += 'suspended ';
												break;
											case 'ban':
												msg += 'banned ';
												break;
										}
										msg += 'this user';
									}
									
									if( args.data.tagname ) {
										if( args.data.type ) msg += ' and ';
										msg += 'moved this <a href="/comment/'+ args.data.moved_id +'">thread</a> to <a href="/tag/'+ args.data.tagname +'">#'+ args.data.tagname +'</a>';
										jQuery( '.cid_'+ args.data.root_id +' .ctext').html('<div class="metatext smalltype"></div>');
										jQuery( '.cid_'+ args.data.root_id +' .metatext').append('<div class="warnedBy">'+ msg +' '+ policylink +'</div>');
										// hide the replies in thread
										args.widget.hideCommentReplies( args.data.id );
										// hide the show/hide replies link
										jQuery( '.threadid_'+ args.data.root_id +' .tp_container').hide();
										// jQuery( '.threadid_'+ args.data.root_id +' .cr').hide();
										// jQuery( '.threadid_'+ args.data.root_id +' .cn_threadcollapse, .threadid_'+ args.data.root_id +' .cn_threadexpand').hide();
									} else {
										jQuery( '.cid_'+ args.data.id +' .metatext').append('<div class="warnedBy">'+ msg +' '+ policylink +'</div>');
									}
									// reset controls
									args.widget.setControls();
									
									// reset form values
									args.widget.controls.uw_state.val('');
									args.widget.controls.uw_moveto.val('');
									args.widget.controls.uw_moveto_other.val('');
								} else {
									Message.showMessage( args.data.reason, args.widget.controls.uw_message[0], {
										stable: true,
										onComplete: function() {}
									});
								}
								break;
						}
						if (message != '' && ( args.data.commentId || args.data.action == 'setstarcommenter')) {
							Message.showMessage( message, args.widget.commentParams.messageContainer[0], {
								stable: false,
								onComplete: function() {}
							});
						}
					},

					onAjaxFailure: function( args ) {
						var container = jQuery('.cid_'+ args.data.commentId);
						jQuery('.control', container).hide();

						var messageText = ( args.data.message ) ? args.data.message : 'Operation failed';

						Message.showMessage( messageText, args.widget.commentParams.messageContainer[0], {
							stable: false,
							onComplete: function() {
								jQuery('.control', container).show();
							}
						});
					}
				}
			},

			'.commenteradmin_container': {
				'options': {
					onInit: function( args ) {
						args.widget.registerEventHandler(args.widget.element, 'mouseover', args.widget.handleMouseOver.bind(args.widget));
						// args.widget.registerEventHandler(args.widget.controls.limit[0], 'change', args.widget.handleChange.bind(args.widget));
						args.widget.registerEventHandler(args.widget.element, 'change', args.widget.handleChange.bind(args.widget));

						// load comments for every user
						if (args.widget.controls.status_toggle)
						{
							for (var i = 0, l = args.widget.controls.status_toggle.length; i < l; i++) {
								var userId = args.widget.getParam('uId', args.widget.controls.status_toggle[i]);
								args.widget.loadUserComments(userId);
							}
						}
					},

					onClick: function( args ) {
						var target = jQuery(args.e.target);
						args.widget.commentParams.commenterId = args.widget.getParam( 'uId', target );

						var controlName = args.widget.getParam( 'cn', target );
						switch( controlName ) {
							case 'status_toggle':
								var userId = args.widget.getParam( 'uId', target );
								args.widget.toggleStatus( userId );

								args.e.stopPropagation();
								args.e.preventDefault();
								break;

							case 'comment_admin_changecommentstatus':
								args.widget.commentParams.commentId			= args.widget.getParam( 'cId', target );
								args.widget.commentParams.commenterId		= args.widget.getParam( 'uId', target );
								args.widget.commentParams.postId			= args.widget.getParam( 'pId', target );
								args.widget.changeCommentStatus( args.widget.getParam('status', target) );

								args.e.stopPropagation();
								args.e.preventDefault();
								break;

							case 'comment_admin_pendinguser':
								args.widget.changeUserStatus('pending');
								args.e.stopPropagation();
								args.e.preventDefault();
								break;

							case 'comment_admin_approveuser':
								args.widget.changeUserStatus('approve');
								args.e.stopPropagation();
								args.e.preventDefault();
								break;

							case 'comment_admin_maybeuser':
								args.widget.changeUserStatus('maybe');
								args.e.stopPropagation();
								args.e.preventDefault();
								break;

							case 'comment_admin_removeuser':
								args.widget.changeUserStatus('remove');
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
								
							case 'comment_admin_disableuser':
								if(window.confirm('Are you SURE you want to disable this account? Doing so will render the account unusable and delete its entire comment history.')) {
									args.widget.changeUserStatus('disable');
								}								
								args.e.stopPropagation();
								args.e.preventDefault();
								break;
							case 'comment_admin_enableuser':
								if(window.confirm('Are you SURE you want to enable this account? Doing so will allow this user to login and leave comments, as well as restore all deleted comments.')) {
									args.widget.changeUserStatus('enable');
								}								
								args.e.stopPropagation();
								args.e.preventDefault();
								break;

							case 'paging':
								args.widget.paging( args.widget.getParam('refId', target ) );

								args.e.stopPropagation();
								args.e.preventDefault();
								break;

							case 'search':
								args.widget.submitForm( 'searchForm' );

								args.e.stopPropagation();
								args.e.preventDefault();
								break;
						}
					},

					onMouseOver: function( args ) {
						var target = jQuery(args.e.target);
						userId = args.widget.getParam( 'uId', target );
						var controlName = args.widget.getParam( 'cn', target );
						switch( controlName ) {
							case 'userline':
								for(var i = 0, l = args.widget.controls.userline.length; i < l; i++) {
									var currentUserId = args.widget.getParam( 'uId', args.widget.controls.userline[i] );
									jQuery( '#comments_'+ currentUserId ).hide();
									jQuery( '#user_'+ currentUserId )[0].style.backgroundColor = '';
								}

								jQuery( '#comments_'+ userId ).show();
								jQuery( '#user_'+ userId )[0].style.backgroundColor = '#eee';

								args.e.stopPropagation();
								args.e.preventDefault();
							break;
						}
					},

					onChange: function( args ) {
						var target = jQuery(args.e.target);
						var controlName = args.widget.getParam( 'cn', target );
						switch( controlName ) {
							case 'includeGroup':
							case 'siteId':
							case 'limit':
								args.widget.submitForm( 'filterForm' );
							break;
						}
					},

					onChangeCommentStatus: function( args ) {
						if( args.publishStatus == 'PUBLISHED' )
						{
							jQuery( '#approve_'+ args.widget.commentParams.commentId )[0].innerHTML = 'Approving comment';
						}
						if( args.publishStatus == 'DELETED' )
						{
							jQuery( '#delete_'+ args.widget.commentParams.commentId )[0].innerHTML = 'Deleting comment';
						}

						args.widget.xhr.send( '/index.php', {
							'op': 'changecommentstatus',
							'id': args.widget.commentParams.commentId,
							'entry_id': args.widget.commentParams.postId,
							'user_id': args.widget.commentParams.commenterId,
							'publishStatus': args.publishStatus
						});
					},

					onChangeUserStatus: function( args ) {
						var userId = args.widget.commentParams.commenterId;
						jQuery( '#action_indicator_'+ userId ).show();

						// sending xhr
						var params = {
							'op': 'changeuserstatus',
							'reloadGroups': true,
							'action': args.action,
							'id': userId
						};
						if ( args.widget.controls.affectedSiteId[0].value != -1 ) {
							params['siteId'] = args.widget.controls.affectedSiteId[0].value;
						}

						args.widget.xhr.send( '/index.php', params );
					},

					onAjaxSuccess: function( args ) {
						var control = {};
						switch( args.data.action )
						{
							case 'pendinguser':
							case 'maybeuser':
							case 'approveuser':
							case 'removeuser':
							case 'disableuser':
							case 'enableuser':
								if(args.data.success == true)
								{
									jQuery( '#action_indicator_'+ args.data.commenterId ).hide();
									jQuery( '#user_'+ args.data.commenterId ).addClass( 'lined' );
									jQuery( '#marker_'+ args.data.commenterId ).attr( 'class', args.data.action );
									jQuery( '.cn_status_toggle' ).filter( '.uId_'+ args.data.commenterId )[0].innerHTML = args.data.group_label;
									if(args.data.action == 'disableuser') {
										jQuery( '.cn_status_toggle' ).filter( '.uId_'+ args.data.commenterId )[0].innerHTML = 'DISABLED';
										jQuery( '.cn_comment_admin_disableuser' ).filter( '.uId_'+ args.data.commenterId ).hide();
										//jQuery( '.cn_comment_admin_enableuser' ).filter( '.uId_'+ args.data.commenterId ).show();
										args.widget.loadUserComments(args.data.commenterId);	
									}
									if(args.data.action == 'enableuser') {
										jQuery( '.cn_comment_admin_disableuser' ).filter( '.uId_'+ args.data.commenterId ).show();
										jQuery( '.cn_comment_admin_enableuser' ).filter( '.uId_'+ args.data.commenterId ).hide();
									}
									args.widget.loadStatus( args.data.commenterId );
								}
								else
								{
									jQuery( '#action_indicator_'+ args.data.commenterId ).hide();
									alert(args.data.message);
								}
								break;

							case 'changecommentstatus':
								if( args.data.publishStatus == 'PUBLISHED' )
								{
									jQuery( '#approve_'+ args.data.commentId )[0].innerHTML = args.data.message;
								}
								if( args.publishStatus == 'DELETED' )
								{
									jQuery( '#delete_'+ args.data.commentId )[0].innerHTML = args.data.message;
								}
								args.widget.loadUserComments( args.data.userId );
								break;
						}
					},

					onAjaxFailure: function( args ) {
						jQuery( '#action_indicator_'+ args.data.commenterId ).hide();
					}					
				}
			}
		}
	}
});

(function($) {
	$.widget('ui.CommentAdminWidget', {

		controls: {},
		params: {},
		xhr: null,
		commentParams: {},

		initialize: function() {
			this.registerEventHandler(this.element, 'click', this.handleClick.bind(this));

			// setup XHR object
			this.xhr = new XHR({
				klass: 'commentadmin',
				beforeSend: this.handleAjaxRequest.bind(this),
				error: this.handleAjaxFail.bind(this),
				success: this.handleAjaxSuccess.bind(this)
			});
			
			this.subscribeForEvent('comment.commentpromoted', this.markThreadAsPromoted.bind(this));
			this.subscribeForEvent('comment.userapproved', this.userApproved.bind(this));
			
			this.fireEvent( 'onInit', {'widget': this} );
		},
		
		handleAuth: function(ev) {
			switch( ev.name ) {
				case 'user.auth.success':
					if( this.auth.hasLevel('commentadmins') ) {
						this.showWidget();
					} else {
						this.hideWidget();
					}
					this.showBuddyIcons(); // show buddy heart icons for authenticated users
					break;
				case 'user.auth.failure':
					this.hideWidget();
					break;
			}
		},

		handleClick: function(e) {
			this.fireEvent( 'onClick', {'e': e, 'widget': this} );
		},

		handleMouseOver: function(e) {
			this.fireEvent( 'onMouseOver', {'e': e, 'widget': this} );
		},

		handleChange: function(e) {
			this.fireEvent( 'onChange', {'e': e, 'widget': this} );
		},

		showWidget: function() {
			this.setControls();
			if(this.auth.authenticated) {
				if (this.auth.hasLevel('commentadmins')) {
					jQuery('.s_t').show(); // show starcommenter icons
					if(this.controls.a) this.controls.a.show(); // show adminlinks toggle icon
				}				
			}
		},

		hideWidget: function() {
			jQuery('.s_t').hide(); // starcommenter icon
			if(this.controls.a) this.controls.a.hide(); // adminlinks toggle icon
			if(this.controls.buddy) this.controls.buddy.hide(); // buddy toggle icon
		},

		refreshWidget: function() {
			this.setControls();
			this.showWidget();
			this.showBuddyIcons(); // show buddy heart icons for authenticated users
		},

		handleAjaxRequest: function() {},

		handleAjaxSuccess: function(data) {
			this.fireEvent( 'onAjaxSuccess', {
				'data': data,
				'widget': this
			});
		},

		handleAjaxFail: function(data) {
			this.fireEvent( 'onAjaxFailure', {
				'data': data,
				'widget': this
			});
		},
		
		showBuddyIcons: function() {
			if( this.auth.authenticated) {
				jQuery('.cn_buddy').not('.bid_'+this.auth.user.id).show();
				if( this.auth.user.buddies ) {
					for (var i = 0, l = this.auth.user.buddies.length; i < l; i++)
					{
						jQuery('.bid_'+ this.auth.user.buddies[i]).addClass('buddy_true');
					}
				}
			}
		},

		promoteComment: function() {
			if( window.confirm('Do you really want to promote this comment to frontpage?') )
			{
				// setting progress message
				jQuery('.control', this.commentParams.toolContainer).hide();
				Message.showMessage( 'Promoting comment', this.commentParams.messageContainer[0], {stable: true});

				this.xhr.send( '/index.php', {'op':'promotecomment',
					'comment_id':this.commentParams.commentId});
			}
		},
		
		markThreadAsPromoted: function(ev) {
			this.markCommentAsPromoted(ev.params.commentId, true);
		},
		
		markCommentAsPromoted: function(commentId, append_metatext) {
			var promotedComment = jQuery('.cid_'+commentId, this.element);
			if( promotedComment.length != 0 ) {
				promotedComment.removeClass('p_0').addClass('p_1');
				if( append_metatext == true ) {
					if( jQuery('.promotedBy', promotedComment).length == 0 ) {
						var promote_text = '<div class="promotedBy"><a href="/people/'+ this.auth.user.username +'">'+ this.auth.user.smartName +'</a> promoted this comment</div>';
						jQuery('.metatext', promotedComment).append( promote_text );
					} else {
						jQuery('.promotedBy', promotedComment).show();
					}
				}
				var promotedParentId = this.getParam('pid', promotedComment);
				if( promotedParentId ) {
					this.markCommentAsPromoted(promotedParentId);
				}
			}
		},
		
		markCommentAsDemoted: function(commentId) {
			var demotedComment = jQuery('.cid_'+commentId, this.element);
			demotedComment.removeClass('p_1').addClass('p_0');
			jQuery('.promotedBy', demotedComment).hide();
			jQuery('.pid_'+commentId).each( function(iterator, demoteComment) {
				var demoteChildId = this.getParam('cid', demoteComment);
				this.markCommentAsDemoted(demoteChildId);
			}.bind(this) );
		},
		
		hideCommentReplies: function(commentId) {
			jQuery('.pid_'+commentId).each( function(iterator, hidecomment) {
				jQuery(hidecomment).hide();
				var hide_child_id = this.getParam('cid', jQuery(hidecomment));
				this.hideCommentReplies(hide_child_id);
			}.bind(this) );
		},

		changeCommentStatus: function( publishStatus ) {
			if( !publishStatus || jQuery.inArray( publishStatus, ['DELETED', 'PUBLISHED', 'FRONTPAGE'] ) == -1 ) {
				return false;
			}
			switch( publishStatus ) {
				case 'DELETED':
					var msg = 'Comment removed';
					break;
				case 'PUBLISHED':
				case 'FRONTPAGE':
				default:
					var msg = 'Setting comment status';
					break;
			}
			this.fireEvent( 'onChangeCommentStatus', {
				'messageText': msg,
				'publishStatus': publishStatus,
				'widget': this
			});
		},
		
		changeCommentPriority: function( priority, star_user ) {
			var messageText = 'Promoting thread';
			if( priority != 1 ) {
				priority = 0;
				messageText = 'Demoting thread';
			}
			this.fireEvent( 'onChangeCommentPriority', {
				'messageText': messageText,
				'priority': priority,
				'star_user': star_user,
				'widget': this
			});
		},
		
		userApproved: function(ev) {
			jQuery('#comments .aid_'+ ev.params.commenterId )
				.removeClass('us_pending')
				.removeClass('cs_draft');
			if( ev.params.commentId ) {
				jQuery( '.cid_'+ ev.params.commentId +' .metatext', this.element ).append('<div class="approvedBy"><a href="/people/'+ this.auth.user.username +'">'+ this.auth.user.smartName +'</a> approved this comment</div>');
			}
		},
		
		changeUserStatus: function(status) {
			if( !status || jQuery.inArray( status, ['pending', 'maybe', 'approve', 'remove', 'disable', 'enable'] ) == -1 ) {
				return false;
			}
			var action = '';
			var messageText = '';
			switch( status ) {
				case 'pending':
					action		= 'pending';
					messageText	= 'Setting status to pending';
					break;
				case 'maybe':
					action		= 'maybe';
					messageText	= 'Setting status to maybe';
					break;
				case 'approve':
					action		= 'approve';
					messageText	= 'Approving user';
					break;
				case 'remove':
					action		= 'remove';
					messageText	= 'Banning user';
					break;
				case 'disable':
					action		= 'disable';
					messageText	= 'Disabling user';
					break;
				case 'enable':
					action		= 'enable';
					messageText	= 'Enabling user';
					break;
			}

			this.fireEvent( 'onChangeUserStatus', {
				'action': action,
				'messageText': messageText,
				'widget': this
			});
		},

		setStarCommenter: function(status) {
			if( !status || jQuery.inArray( status, ['t', 'f'] ) == -1 ) {
				return false;
			}
			if (this.auth.authenticated) {
				if (this.auth.hasLevel('commentadmins')) {
					var params = {
						'op':'setstarcommenter',
						'id':this.commentParams.commenterId,
						'cid':this.commentParams.commentId,
						'siteId':this.auth.site.siteId,
						'starcommenter': (status == 't') ? true : false
					};
					this.xhr.send( '/index.php', params );
					
					// start indicator
					if( this.commentParams.commentId ) {
						jQuery( '#comments .cid_'+ this.commentParams.commentId +' .cn_s' ).hide();
						jQuery( '#comments .cid_'+ this.commentParams.commentId +' .cn_s_ind' ).show();
					} else if( this.controls.s_ind ) {
						this.controls.s_ind.show();
						this.controls.s.hide();
					}
				}
			}
		},
		
		toggleBuddyStatus: function(buddy_id) {
			var params = {'op': 'saveusertag', 'objectType': 'USER', 'objectId': buddy_id};
			if( jQuery.inArray(buddy_id, this.auth.user.buddies) === -1 ) {
				params.tagName = 'buddy';
			}
			else
			{
				params.unTagName = 'buddy';
			}
			// turn on progress indicator
			// jQuery('.buddyid_'+ buddyId).addClass('user-friend-progress');
			this.xhr.send( '/index.php', params );
		},
		
		toggleAdminLinks: function(targetNode) {
			// moving the box around
			targetNode.parent().after(jQuery('.admin_links').show());
		},
		
		
		/* user warn dialog and form handling functions */
		toggleWarnDialog: function(targetNode) {
			// this.controls.uw_state_user.text( jQuery('#c'+ this.commentParams.commentId +'_author').text() );
			// this.controls.tuw.eq(0).toggleClass('cadm_sel');
			if( jQuery('.user_warn:visible').length > 0 ) {
				// put back the dialog after admin links in dom
				jQuery('.admin_links').after( jQuery('.user_warn').hide() );
			} else {
				// move the dialog to front
				targetNode.parent().parent().after( jQuery('.user_warn').show() );
			}
		},
		
		checkMovetoSelect: function() {
			if( this.controls.uw_moveto[0].value == 'other' ) {
				this.controls.uw_moveto_other.show();
			} else {
				this.controls.uw_moveto_other.hide();
			}
		},
		
		submitWarning: function( targetNode ) {
			var moveto_tag = this.controls.uw_moveto.val();
			if( moveto_tag == 'other' ) moveto_tag = this.controls.uw_moveto_other.val();
			if( moveto_tag.substring(0, 1) == '#' ) moveto_tag = moveto_tag.substring(1);
			var uw_state = this.controls.uw_state.val();
			if( moveto_tag || uw_state ) {
				var params = {'op': 'ajax_warncommenter', 'id': this.commentParams.commentId, 'tagname': moveto_tag, 'type': uw_state };
				this.controls.progress.show();
				this.xhr.send( '/index.php', params );
			} else {
				this.toggleWarnDialog();
			}
		},
		
		toggleStatus: function( userId ) {
			var status_container = jQuery( '#status_container_'+ userId );
			status_container.toggle();
			this.loadStatus( userId );
		},
		
		loadStatus: function( userId, force ) {
			var status_container = jQuery( '#status_container_'+ userId );
			if ( status_container[0].style.display != 'none' ) {
				var params = {
					'op': 'userlist_status',
					'userId': userId
				};

				jQuery( '#status_openable_indicator_'+ userId ).show();
				jQuery( '#status_'+ userId ).hide();

				jQuery( '#status_'+ userId ).load( this.options.action_url, params, function() {
					jQuery( '#status_openable_indicator_'+ userId ).hide();
					jQuery( '#status_'+ userId ).show();
				});
			}
		},
		
		loadUserComments: function( userId ) {
			params = {
				'op': 'userlist_comments',
				'id': userId,
				'withPosts': 'true',
				'maxReturned': 20,
				'refId': -1,
				'pubStatus[]': ['DELETED', 'PENDING_APPROVAL', 'PUBLISHED', 'SPAM']
			};
			//'pubStatus[]': this.controls.includeGroup[0].value == 'spammers' ? ['SPAM'] : ['DELETED', 'PENDING_APPROVAL', 'PUBLISHED']

			jQuery( '#commenticon_'+ userId )[0].src = '/assets/base/img/comments.gif';
			jQuery( '#comments_'+ userId ).load( this.options.action_url, params, function( userId ) {
				// show the blue bubble
				jQuery( '#commenticon_'+ userId )[0].src = '/assets/base/img/comments_loaded.gif';
				this.setControls();
			}.bind( this, userId ) );
		},
		
		paging: function( refId ) {
			this.controls.refId[0].value = refId;
			this.submitForm( 'filterForm' );
		},
		
		submitForm: function( form ) {
			var params = this.controls[form].serialize();
			window.location = '?'+ params;
		}
	});

	$.extend($.ui.CommentAdminWidget, {
		'version': '1.0',
		'defaults': {
			'action_url': '/index.php',
			'onHide': function(args){},
			'onShow': function(args){},
			'onReset': function(args){},
			'controlClass': 'ca'
		}
	});

})(jQuery);
