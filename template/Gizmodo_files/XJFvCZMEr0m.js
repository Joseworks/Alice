/*1297786074,169775556*/

if (window.CavalryLogger) { CavalryLogger.start_js(["tepnk"]); }

function AsyncSignal(b,a){this.data=a||{};if(window.Env&&Env.tracking_domain&&b.charAt(0)=='/')b=Env.tracking_domain+b;this.uri=b;this.handler=null;}AsyncSignal.prototype.setHandler=function(a){this.handler=a;return this;};AsyncSignal.prototype.send=function(){var c=this.handler,b=this.data,g=this.uri,f=[],d=new Image(),a=document.getElementById('post_form_id');b.asyncSignal=Math.floor(Math.random()*10000)+1;if(a)b.post_form_id=a.value;for(var e in b)f.push(encodeURIComponent(e)+'='+encodeURIComponent(b[e]));if(g.indexOf('?')==-1)g+='?';g+=f.join('&');if(c)d.onload=d.onerror=(function(i,h){return function(){h((i.height==1));};})(d,c);d.src=g;return this;};
function setCookie(a,b,d,e){if(d){var f=new Date();var c=new Date();c.setTime(f.getTime()+d);}document.cookie=a+"="+encodeURIComponent(b)+"; "+(d?"expires="+c.toGMTString()+"; ":"")+"path="+(e||'/')+"; domain="+window.location.hostname.replace(/^.*(\.facebook\..*)$/i,'$1');}function clearCookie(a){document.cookie=a+"=; expires=Sat, 01 Jan 2000 00:00:00 GMT; "+"path=/; domain="+window.location.hostname.replace(/^.*(\.facebook\..*)$/i,'$1');}function getCookie(d){var e=d+"=";var b=document.cookie.split(';');for(var c=0;c<b.length;c++){var a=b[c];while(a.charAt(0)==' ')a=a.substring(1,a.length);if(a.indexOf(e)==0)return decodeURIComponent(a.substring(e.length,a.length));}return null;}
function URI(a){if(a===window)return;if(this===window)return new URI(a||window.location.href);this.parse(a||'');}copy_properties(URI,{getRequestURI:function(a,b){a=a===undefined||a;if(a&&window.PageTransitions&&PageTransitions.isInitialized()){return PageTransitions.getCurrentURI(!!b).getQualifiedURI();}else return new URI(window.location.href);},getMostRecentURI:function(){if(window.PageTransitions&&PageTransitions.isInitialized()){return PageTransitions.getMostRecentURI().getQualifiedURI();}else return new URI(window.location.href);},expression:/(((\w+):\/\/)([^\/:]*)(:(\d+))?)?([^#?]*)(\?([^#]*))?(#(.*))?/,arrayQueryExpression:/^(\w+)((?:\[\w*\])+)=?(.*)/,explodeQuery:function(g){if(!g)return {};var h={};g=g.replace(/%5B/ig,'[').replace(/%5D/ig,']');g=g.split('&');for(var b=0,d=g.length;b<d;b++){var e=g[b].match(URI.arrayQueryExpression);if(!e){var j=g[b].split('=');h[URI.decodeComponent(j[0])]=j[1]===undefined?null:URI.decodeComponent(j[1]);}else{var c=e[2].split(/\]\[|\[|\]/).slice(0,-1);var f=e[1];var k=URI.decodeComponent(e[3]||'');c[0]=f;var i=h;for(var a=0;a<c.length-1;a++)if(c[a]){if(i[c[a]]===undefined)if(c[a+1]&&!c[a+1].match(/\d+$/)){i[c[a]]={};}else i[c[a]]=[];i=i[c[a]];}else{if(c[a+1]&&!c[a+1].match(/\d+$/)){i.push({});}else i.push([]);i=i[i.length-1];}if(i instanceof Array&&c[c.length-1]==''){i.push(k);}else i[c[c.length-1]]=k;}}return h;},implodeQuery:function(f,e,a){e=e||'';if(a===undefined)a=true;var g=[];if(f===null||f===undefined){g.push(a?URI.encodeComponent(e):e);}else if(f instanceof Array){for(var c=0;c<f.length;++c)try{if(f[c]!==undefined)g.push(URI.implodeQuery(f[c],e?(e+'['+c+']'):c));}catch(b){}}else if(typeof(f)=='object'){if(DOM.isNode(f)){g.push('{node}');}else for(var d in f)try{if(f[d]!==undefined)g.push(URI.implodeQuery(f[d],e?(e+'['+d+']'):d));}catch(b){}}else if(a){g.push(URI.encodeComponent(e)+'='+URI.encodeComponent(f));}else g.push(e+'='+f);return g.join('&');},encodeComponent:function(d){var c=String(d).split(/([\[\]])/);for(var a=0,b=c.length;a<b;a+=2)c[a]=window.encodeURIComponent(c[a]);return c.join('');},decodeComponent:function(a){return window.decodeURIComponent(a.replace(/\+/g,' '));}});copy_properties(URI.prototype,{parse:function(b){var a=b.toString().match(URI.expression);copy_properties(this,{protocol:a[3]||'',domain:a[4]||'',port:a[6]||'',path:a[7]||'',query_s:a[9]||'',fragment:a[11]||''});return this;},setProtocol:function(a){this.protocol=a;return this;},getProtocol:function(){return this.protocol;},setQueryData:function(a){this.query_s=URI.implodeQuery(a);return this;},addQueryData:function(a){return this.setQueryData(copy_properties(this.getQueryData(),a));},removeQueryData:function(b){if(!(b instanceof Array))b=[b];var d=this.getQueryData();for(var a=0,c=b.length;a<c;++a)delete d[b[a]];return this.setQueryData(d);},getQueryData:function(){return URI.explodeQuery(this.query_s);},setFragment:function(a){this.fragment=a;return this;},getFragment:function(){return this.fragment;},setDomain:function(a){this.domain=a;return this;},getDomain:function(){return this.domain;},setPort:function(a){this.port=a;return this;},getPort:function(){return this.port;},setPath:function(a){this.path=a;return this;},getPath:function(){return this.path.replace(/^\/+/,'/');},toString:function(){var a='';this.protocol&&(a+=this.protocol+'://');this.domain&&(a+=this.domain);this.port&&(a+=':'+this.port);if(this.domain&&!this.path)a+='/';this.path&&(a+=this.path);this.query_s&&(a+='?'+this.query_s);this.fragment&&(a+='#'+this.fragment);return a;},valueOf:function(){return this.toString();},isFacebookURI:function(){if(!URI._facebookURIRegex)URI._facebookURIRegex=new RegExp('(^|\.)facebook\.('+env_get('tlds').join('|')+')([^.]*)$','i');return (!this.domain||URI._facebookURIRegex.test(this.domain));},isQuicklingEnabled:function(){return window.Quickling&&Quickling.isActive()&&Quickling.isPageActive(this);},getRegisteredDomain:function(){if(!this.domain)return '';if(!this.isFacebookURI())return null;var b=this.domain.split('.');var a=b.indexOf('facebook');return b.slice(a).join('.');},getTld:function(f){if(!this.domain)return '';var d=this.domain.split('.');var e=d[d.length-1];if(f)return e;var c=env_get('tlds');if(c.indexOf(e)==-1)for(var a=0;a<c.length;++a){var b=c[a];if(new RegExp(b+'$').test(this.domain)){e=b;break;}}return e;},getUnqualifiedURI:function(){return new URI(this).setProtocol(null).setDomain(null).setPort(null);},getQualifiedURI:function(){var b=new URI(this);if(!b.getDomain()){var a=URI();b.setProtocol(a.getProtocol()).setDomain(a.getDomain()).setPort(a.getPort());}return b;},isSameOrigin:function(a){var b=a||window.location.href;if(!(b instanceof URI))b=new URI(b.toString());if(this.getProtocol()&&this.getProtocol()!=b.getProtocol())return false;if(this.getDomain()&&this.getDomain()!=b.getDomain())return false;return true;},go:function(a){goURI(this,a);},setSubdomain:function(b){var c=new URI(this).getQualifiedURI();var a=c.getDomain().split('.');if(a.length<=2){a.unshift(b);}else a[0]=b;return c.setDomain(a.join('.'));},getSubdomain:function(){if(!this.getDomain())return '';var a=this.getDomain().split('.');if(a.length<=2){return '';}else return a[0];},setSecure:function(a){return this.setProtocol(a?'https':'http');},isSecure:function(){return this.getProtocol()=='https';}});
function detect_broken_proxy_cache(d,a){var b=getCookie(a);if((b!=d)&&(b!=null)&&(d!='0')){var c={c:'si_detect_broken_proxy_cache',m:a+' '+d+' '+b};var e=new URI('/common/scribe_endpoint.php').getQualifiedURI().toString();new AsyncSignal(e,c).send();}}

if (window.Bootloader) { Bootloader.done(["tepnk"]); }