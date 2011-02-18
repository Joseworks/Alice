function playMBX(videoToPlay) {
	document.writeln('<object   classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"    codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"    width="500"    height="281"    id="mbox_player_4c96d2b61f1be3c5c3">');
	document.writeln('<param name="movie" value="http://player.motionbox.com/VideoPlayer.swf?" />   <param name="allowScriptAccess" value="always" />   <param name="allowFullscreen" value="true" />   <param value="'+ videoToPlay+'" name="flashvars" />');
	document.writeln('<!--[if !IE]>-->     <object        width="500"        height="281"        name="progressive_player"        allowscriptaccess="always"        allowfullscreen="true"        data="http://player.motionbox.com/VideoPlayer.swf?"        type="application/x-shockwave-flash"       flashvars="'+ videoToPlay +'"     >   <!--<![endif]-->');
	document.writeln('<h2>To watch the video, you\'ll first need to  <a href="http://www.adobe.com/go/getflashplayer">install the flash player</a>.</h2>   <!--[if !IE]>-->     </object>\'   <!--<![endif]--> </object>');
	}
