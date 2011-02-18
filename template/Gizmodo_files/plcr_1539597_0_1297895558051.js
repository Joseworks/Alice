 
              if(typeof(dartRichmediaCreatives) == "undefined") {
                dartRichmediaCreatives = new Array();
              }
              function PlacementCreative_1297895550185(creative) {
                for(var property in creative) {
                  this[property] = creative[property];
                }
                this.getAsset = function(type) {
                    return this.assets[type];
                }
                this.macrosInExits = new Object();
                  this.macrosInExits["%j"] = "j";
                  this.macrosInExits["%eenv!"] = "eenv";
                  this.macrosInExits["%g"] = "g";
                  this.macrosInExits["%s"] = "s";
                  this.macrosInExits["%eaid!"] = "eaid";
                  this.macrosInExits["%n"] = "n";
                  this.macrosInExits["%m"] = "m";
                  this.macrosInExits["%erid!"] = "erid";
                  this.macrosInExits["%ebuy!"] = "ebuy";
                  this.macrosInExits["%ecid!"] = "ecid";
                  this.macrosInExits["%erv!"] = "erv";
                  this.macrosInExits["%epid!"] = "epid";
                  this.macrosInExits["%eadv!"] = "eadv";
                  this.macrosInExits["%esid!"] = "esid";
                  this.macrosInExits["%ekid!"] = "ekid";
                this.replaceMacros = function(url, creative) {
                  for(var macro in this.macrosInExits) {
                    if(url.indexOf(macro) != -1) {
                      var value = creative["macro_" + this.macrosInExits[macro]];
                      url = url.replace(new RegExp(macro, "g"), value);
                    }
                  }
                  return url;
                }
                this.fullScreenEnabled = true;
                this.requiredPlayerVersion = 9;
                this.asVersion = 3;
                this.assets = new Object();
                this.exitEvents = new Object();
                this.timerEvents = new Object();
                this.counterEvents = new Object();
                this.standardEvents = new Object();
                this.standardEvents["EVENT_VIDEO_STOP"] = {
                  reportingId: "20"
                };
                this.standardEvents["DISPLAY_TIMER"] = {
                  reportingId: "2"
                };
                this.standardEvents["EVENT_VIDEO_PAUSE"] = {
                  reportingId: "15"
                };
                this.standardEvents["EVENT_MANUAL_CLOSE"] = {
                  reportingId: "8"
                };
                this.standardEvents["FULL_SCREEN_VIDEO_PLAYS"] = {
                  reportingId: "5"
                };
                this.standardEvents["EVENT_VIDEO_MUTE"] = {
                  reportingId: "16"
                };
                this.standardEvents["FULL_SCREEN_AVERAGE_VIEW_TIME"] = {
                  reportingId: "7"
                };
                this.standardEvents["EVENT_VIDEO_PLAY"] = {
                  reportingId: "11"
                };
                this.standardEvents["EVENT_VIDEO_INTERACTION"] = {
                  reportingId: "14"
                };
                this.standardEvents["EVENT_VIDEO_COMPLETE"] = {
                  reportingId: "13"
                };
                this.standardEvents["EVENT_VIDEO_MIDPOINT"] = {
                  reportingId: "18"
                };
                this.standardEvents["BACKUP_IMAGE_IMPRESSION"] = {
                  reportingId: "9"
                };
                this.standardEvents["EXPAND_TIMER"] = {
                  reportingId: "10"
                };
                this.standardEvents["FULL_SCREEN_VIDEO"] = {
                  reportingId: "19"
                };
                this.standardEvents["HTML5_CREATIVE_IMPRESSION"] = {
                  reportingId: "25"
                };
                this.standardEvents["FULL_SCREEN_VIDEO_COMPLETES"] = {
                  reportingId: "6"
                };
                this.standardEvents["EVENT_USER_INTERACTION"] = {
                  reportingId: "4"
                };
                this.standardEvents["DYNAMIC_CREATIVE_IMPRESSION"] = {
                  reportingId: "23"
                };
                this.standardEvents["INTERACTION_TIMER"] = {
                  reportingId: "3"
                };
                this.standardEvents["EVENT_VIDEO_UNMUTE"] = {
                  reportingId: "21"
                };
                this.standardEvents["EVENT_VIDEO_REPLAY"] = {
                  reportingId: "17"
                };
                this.standardEvents["EVENT_FULLSCREEN"] = {
                  reportingId: "22"
                };
                this.standardEvents["EVENT_VIDEO_VIEW_TIMER"] = {
                  reportingId: "12"
                };
                this.exitEvents["WBT049 : Visit Site Exit"] = {
                    reportingId: 494179,
                    url: this.replaceMacros("http://unknownmovie.warnerbros.com/", creative),
                    customizedWindow: false,
                    windowFeatures: "width=-1,height=-1,top=0,left=0,location=yes,menubar=yes,status=yes,toolbar=yes,scrollbars=yes",
                    targetWindow: "_blank"
                };
                this.exitEvents["WBT049 : Collapsed Exit"] = {
                    reportingId: 488669,
                    url: this.replaceMacros("http://unknownmovie.warnerbros.com/", creative),
                    customizedWindow: false,
                    windowFeatures: "width=-1,height=-1,top=0,left=0,location=yes,menubar=yes,status=yes,toolbar=yes,scrollbars=yes",
                    targetWindow: "_blank"
                };
                this.exitEvents["WBT049 : Expanded Exit"] = {
                    reportingId: 488654,
                    url: this.replaceMacros("http://unknownmovie.warnerbros.com/", creative),
                    customizedWindow: false,
                    windowFeatures: "width=-1,height=-1,top=0,left=0,location=yes,menubar=yes,status=yes,toolbar=yes,scrollbars=yes",
                    targetWindow: "_blank"
                };
                this.exitEvents["WBT034 : Expanded Exit"] = {
                    reportingId: 320236,
                    url: this.replaceMacros("http://unknownmovie.warnerbros.com/", creative),
                    customizedWindow: false,
                    windowFeatures: "width=-1,height=-1,top=0,left=0,location=yes,menubar=yes,status=yes,toolbar=yes,scrollbars=yes",
                    targetWindow: "_blank"
                };
                this.exitEvents["WBT034 : Collapsed Exit"] = {
                    reportingId: 320251,
                    url: this.replaceMacros("http://unknownmovie.warnerbros.com/", creative),
                    customizedWindow: false,
                    windowFeatures: "width=-1,height=-1,top=0,left=0,location=yes,menubar=yes,status=yes,toolbar=yes,scrollbars=yes",
                    targetWindow: "_blank"
                };
                this.exitEvents["WBT034 : Visit Site Exit"] = {
                    reportingId: 492103,
                    url: this.replaceMacros("http://unknownmovie.warnerbros.com/", creative),
                    customizedWindow: false,
                    windowFeatures: "width=-1,height=-1,top=0,left=0,location=yes,menubar=yes,status=yes,toolbar=yes,scrollbars=yes",
                    targetWindow: "_blank"
                };
                this.timerEvents["WBT049 : Engaged Video View Time"] = {
                    reportingId: 480384,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.timerEvents["WBT049 : Video 1 View Time"] = {
                    reportingId: 480416,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.timerEvents["WBT049 : Video 2 View Time"] = {
                    reportingId: 480381,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.timerEvents["WBT034 : Video 1 View Time"] = {
                    reportingId: 320265,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.timerEvents["WBT034 : Video 2 View Time"] = {
                    reportingId: 320263,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.timerEvents["fullscreen_video:ViewTime"] = {
                    reportingId: 480383,
                    sourceComponentName: "fullscreen_video",
                    sourceStandardEventId: "12"
                };
                this.timerEvents["WBT034 : Engaged Video View Time"] = {
                    reportingId: 320287,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.timerEvents["Video Expansion"] = {
                    reportingId: 325881,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.timerEvents["main_video:ViewTime"] = {
                    reportingId: 414138,
                    sourceComponentName: "main_video",
                    sourceStandardEventId: "12"
                };
                this.counterEvents["WBT049 : Video 1 MidPoint"] = {
                    reportingId: 480396,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 2 Pauses"] = {
                    reportingId: 480378,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 1 Pauses"] = {
                    reportingId: 480402,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 2 Mutes"] = {
                    reportingId: 480398,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : VIDEO FAILED"] = {
                    reportingId: 480390,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Engaged Video View"] = {
                    reportingId: 480377,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 2 Completed"] = {
                    reportingId: 480400,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Manual Close"] = {
                    reportingId: 488656,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 1 Mutes"] = {
                    reportingId: 480413,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 1 Completed"] = {
                    reportingId: 480379,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 1 Plays"] = {
                    reportingId: 480411,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 2 MidPoint"] = {
                    reportingId: 480404,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 1 Unmutes"] = {
                    reportingId: 480372,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 2 Plays"] = {
                    reportingId: 480407,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 1 Replays"] = {
                    reportingId: 480388,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Engaged Video Complete"] = {
                    reportingId: 480389,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 2 Replays"] = {
                    reportingId: 480380,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT049 : Video 2 Unmutes"] = {
                    reportingId: 480418,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT034 : Video 1 Unmutes"] = {
                    reportingId: 320239,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["main_video:MidPoint"] = {
                    reportingId: 414139,
                    sourceComponentName: "main_video",
                    sourceStandardEventId: "18"
                };
                this.counterEvents["WBT034 : Engaged Video Complete"] = {
                    reportingId: 320296,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["fullscreen_video:Pause"] = {
                    reportingId: 480386,
                    sourceComponentName: "fullscreen_video",
                    sourceStandardEventId: "15"
                };
                this.counterEvents["WBT034 : Video 2 Mutes"] = {
                    reportingId: 320260,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["main_video:Stop"] = {
                    reportingId: 414127,
                    sourceComponentName: "main_video",
                    sourceStandardEventId: "20"
                };
                this.counterEvents["main_video:Complete"] = {
                    reportingId: 414142,
                    sourceComponentName: "main_video",
                    sourceStandardEventId: "13"
                };
                this.counterEvents["WBT034 : Video 1 Pauses"] = {
                    reportingId: 320292,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT034 : Video 1 Plays"] = {
                    reportingId: 320284,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT034 : Video 2 Pauses"] = {
                    reportingId: 320278,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["fullscreen_video:Complete"] = {
                    reportingId: 480385,
                    sourceComponentName: "fullscreen_video",
                    sourceStandardEventId: "13"
                };
                this.counterEvents["main_video:Interaction"] = {
                    reportingId: 414135,
                    sourceComponentName: "main_video",
                    sourceStandardEventId: "14"
                };
                this.counterEvents["WBT034 : Video 1 MidPoint"] = {
                    reportingId: 320273,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT034 : Video 2 Completed"] = {
                    reportingId: 320253,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT034 : Video 2 Replays"] = {
                    reportingId: 320252,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["fullscreen_video:Replay"] = {
                    reportingId: 480417,
                    sourceComponentName: "fullscreen_video",
                    sourceStandardEventId: "17"
                };
                this.counterEvents["fullscreen_video:Stop"] = {
                    reportingId: 480387,
                    sourceComponentName: "fullscreen_video",
                    sourceStandardEventId: "20"
                };
                this.counterEvents["fullscreen_video:Mute"] = {
                    reportingId: 480376,
                    sourceComponentName: "fullscreen_video",
                    sourceStandardEventId: "16"
                };
                this.counterEvents["WBT034 : Video 2 MidPoint"] = {
                    reportingId: 320246,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["fullscreen_video:MidPoint"] = {
                    reportingId: 480382,
                    sourceComponentName: "fullscreen_video",
                    sourceStandardEventId: "18"
                };
                this.counterEvents["fullscreen_video:Interaction"] = {
                    reportingId: 480394,
                    sourceComponentName: "fullscreen_video",
                    sourceStandardEventId: "14"
                };
                this.counterEvents["WBT034 : Video 1 Replays"] = {
                    reportingId: 320219,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["fullscreen_video:Play"] = {
                    reportingId: 480374,
                    sourceComponentName: "fullscreen_video",
                    sourceStandardEventId: "11"
                };
                this.counterEvents["WBT034 : Video 2 Plays"] = {
                    reportingId: 320241,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["fullscreen_video:Unmute"] = {
                    reportingId: 480401,
                    sourceComponentName: "fullscreen_video",
                    sourceStandardEventId: "21"
                };
                this.counterEvents["WBT034 : Video 1 Mutes"] = {
                    reportingId: 320275,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT034 : Video 1 Completed"] = {
                    reportingId: 320271,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT034 : Manual Close"] = {
                    reportingId: 320277,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["WBT034 : VIDEO FAILED"] = {
                    reportingId: 492104,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["main_video:Mute"] = {
                    reportingId: 414130,
                    sourceComponentName: "main_video",
                    sourceStandardEventId: "16"
                };
                this.counterEvents["main_video:Pause"] = {
                    reportingId: 414126,
                    sourceComponentName: "main_video",
                    sourceStandardEventId: "15"
                };
                this.counterEvents["main_video:Replay"] = {
                    reportingId: 414143,
                    sourceComponentName: "main_video",
                    sourceStandardEventId: "17"
                };
                this.counterEvents["WBT034 : Engaged Video View"] = {
                    reportingId: 492105,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                this.counterEvents["main_video:Unmute"] = {
                    reportingId: 414133,
                    sourceComponentName: "main_video",
                    sourceStandardEventId: "21"
                };
                this.counterEvents["main_video:Play"] = {
                    reportingId: 414136,
                    sourceComponentName: "main_video",
                    sourceStandardEventId: "11"
                };
                this.counterEvents["WBT034 : Video 2 Unmutes"] = {
                    reportingId: 320227,
                    sourceComponentName: "",
                    sourceStandardEventId: "-1"
                };
                var exitKeyvalues = "";
                var delimiter = "{DELIM}";
                for(var exitName in this.exitEvents) {
                  if (!core.isPartOfArrayPrototype(exitName)) {
                    var exit = this.exitEvents[exitName];
                    var value = "name:" + escape(exitName) + "," + "url:" + escape(exit.url) + ","
                                + "target:" + (exit.customizedWindow ? "popup" : escape(exit.targetWindow));
                    
                    
                    exitKeyvalues += ((this.asVersion > 1) ? value : escape(value)) + delimiter;
                  }
                }
                exitKeyvalues = exitKeyvalues.substring(0, exitKeyvalues.length - delimiter.length);
                this.videoComponents = new Object();
                this.videoComponents["main_video"] = {
                  trackCustomEvents: false,
                  startMuted: false,
                  autoBuffer: false,
                  lowBWVideo: "",
                  midBWVideo: "",
                  highBWVideo: "",
                  lowBWFallbackVideo: "",
                  midBWFallbackVideo: "",
                  highBWFallbackVideo: "",
                  loopCount: 0,
                  isStreaming: false
                };
                this.isAbsoluteUrl = function(url) {
                  return (url.indexOf("http:") == 0 || url.indexOf("rtmp:") == 0);
                }
                this.childAssets = new Object();
                  this.childAssets["dcs_initial.swf"] = {
                    isHostedByCdn: false,
                    cdnName: "PID_1539597_dcs_initial.swf",
                    isVideo: false,
                    streamingUrl: "",
                    progressiveUrl: ""
                  }
                  this.childAssets["dcs_video.swf"] = {
                    isHostedByCdn: false,
                    cdnName: "PID_1539597_dcs_video.swf",
                    isVideo: false,
                    streamingUrl: "",
                    progressiveUrl: ""
                  }
                this.assetsKeyValues = "";
                for(var assetName in this.childAssets) {
                  if (!core.isPartOfArrayPrototype(assetName)) {
                    var asset = this.childAssets[assetName];
                    if(!asset.isHostedByCdn) {
                      var fileUrl = creative.mediaServer + "/772310/" + asset.cdnName;
                      this.assetsKeyValues += escape(assetName) + "=" + escape(fileUrl) + "&";
                    } else if(asset.isVideo) {
                      this.assetsKeyValues += escape("STR_" + assetName) + "=" + escape(asset.streamingUrl) + "&";
                      this.assetsKeyValues += escape("PRO_" + assetName) + "=" + escape(asset.progressiveUrl) + "&";
                    } else {
                      this.assetsKeyValues += escape(assetName) + "=" + escape(asset.progressiveUrl) + "&";
                    }
                  }
                }
                var videoKeyValues = "";
                this.processVideoUrl = function(videoUrl, downloadPrefix, urlType, videoComponentName) {
                  var urlKey;
                  if(this.isAbsoluteUrl(videoUrl)) {
                    urlKey = escape(urlType + "_" + videoComponentName);
                    this.assetsKeyValues += urlKey + "=" + escape(videoUrl) + "&";
                  } else {
                    urlKey = videoUrl.length > 0 ? escape(downloadPrefix + videoUrl) : "";
                  }
                  return urlKey;
                }
                var componentDelimiter = "{DELIM}";
                for(var name in this.videoComponents) {
                  if (!core.isPartOfArrayPrototype(name)) {
                    var vc = this.videoComponents[name];
                    var value = "name:" + escape(name) + componentDelimiter;
                    if (!vc.html5Video) {
                      var prefix = (vc.isStreaming) ? "STR_" : "PRO_";
                      var value = "name:" + escape(name) + ",startMuted:" + escape(vc.startMuted)
                          + ",autoBuffer:" + escape(vc.autoBuffer) + ",loopCount:" + escape(vc.loopCount)
                          + ",isStreaming:" + escape(vc.isStreaming);
                      var lowVideo = this.processVideoUrl(vc.lowBWVideo, prefix, "low_video", name);
                      var midVideo = this.processVideoUrl(vc.midBWVideo, prefix, "mid_video", name);
                      var highVideo = this.processVideoUrl(vc.highBWVideo, prefix, "high_video", name);
                      var fallbackLowVideo = this.processVideoUrl(vc.lowBWFallbackVideo, "PRO_", "low_fallback", name);
                      var fallbackMidVideo = this.processVideoUrl(vc.midBWFallbackVideo, "PRO_", "mid_fallback", name);
                      var fallbackHighVideo = this.processVideoUrl(vc.highBWFallbackVideo, "PRO_", "high_fallback", name);
                      value += ",vfp_low:" + lowVideo + ",vfp_mid:" + midVideo + ",vfp_high:" + highVideo
                          + ",pfp_low:" + fallbackLowVideo + ",pfp_mid:" + fallbackMidVideo
                          + ",pfp_high:" + fallbackHighVideo + componentDelimiter;
                    }
                    videoKeyValues += value;
                  }
                }
                videoKeyValues = videoKeyValues.substring(0, videoKeyValues.length - componentDelimiter.length);
                this.assetsKeyValues = this.assetsKeyValues.substring(0, this.assetsKeyValues.length - 1);
                var isGCNAd = (creative.asContext != "") ? "true" : "false";
                var adSiteUrl = core.getSitePageUrl(creative);
                this.queryStringBase = this.swfParams + '&click='+ escape(creative.clickThroughUrl)
                                      + '&clickN=' + creative.clickN + '&rid=' + creative.renderingId
                                      + "&assets=" + escape(this.assetsKeyValues)
                                      + "&vcData=" + escape(videoKeyValues)
                                      + "&exitEvents=" + escape(exitKeyvalues)
                                      + "&googleDiscoveryUrl=" + escape(creative.googleContextDiscoveryUrl)
                                      + "&adSiteUrl=" + escape(adSiteUrl)
                                      + "&isGCNAd=" + isGCNAd;
             }
          
              function Expanding_1297895550185(creative, type, coreCode) {
                this.getExpandingDivStyleSheet = function(cssKeyValues) {
                  if(cssKeyValues == "") {
                    return "";
                  }
                  var cssKeyValueArray = cssKeyValues.split(";");
                  var expandingDivCSS = "";
                  for (var i = 0; i < cssKeyValueArray.length; i++ ) {
                    if(cssKeyValueArray[i]!=null && cssKeyValueArray[i].replace(/^\s+|\s+$/g, "") != "") {
                      var cssKeyVal = cssKeyValueArray[i].split(":");
                      if(cssKeyVal[0] != "display") {
                        if(expandingDivCSS != "")
                          expandingDivCSS += ";";
                        expandingDivCSS += cssKeyVal[0] + ":" + cssKeyVal[1];
                      }
                    }
                  }
                  return expandingDivCSS;
                }
                this.variableName = "0_1_" + (new Date()).getTime();
                this.wmode = "transparent";
                this.zIndex = "1000000";
                this.width = "300";
                this.height = "250";
                this.expandedWidth = "500";
                this.expandedHeight = "500";
                this.offsetTop = "0";
                this.offsetLeft = "200";
                this.offsetRight = "500";
                this.offsetBottom = "250";
                this.salign = coreCode.getSalign(this.expandedWidth, this.expandedHeight, this.offsetTop, this.offsetLeft, this.offsetRight, this.offsetBottom);
                this.url = creative.mediaServer + "/772310/PID_1539597_dcs_controller.swf";
                this.duration = "none";
                this.startTime = "0";
                
                
                this.hideDropdowns = "false" == "true";
                this.hideIframes = "false" == "true";
                this.hideScrollbars = "false" == "true";
                this.hideObjects = (creative.pubHideObjects != "") ? (creative.pubHideObjects.toLowerCase() == "true") : "false" == "true";
                this.hideApplets = (creative.pubHideApplets != "") ? (creative.pubHideApplets.toLowerCase() == "true") : "false" == "true";
                this.assetType = type;
                this.isMainAsset = true;
                this.pushContents = "false" == "true";
                this.animationTime = isNaN("0") ? 0 : parseFloat("0");
                this.displayInline = creative.mtfInline;
                this.cssProperty = "";
                this.expandingDivStyleSheet = this.getExpandingDivStyleSheet(this.cssProperty);
                this.styleProperties = new Object();
                this.expEnvironment = coreCode.isInAdSenseIFrame() ? "adsense" : "basic";
                this.queryString = creative.queryStringBase + "&JS=0" + '&varName=' + this.variableName
                    + '&td=' + escape(self.location.hostname) + creative.asContext
                    + "&assetType=" + type + "&expEnv=" + this.expEnvironment;
              }
              function ExpandingHTML_1297895550185(creative, type, coreCode) {
                this.getExpandingDivStyleSheet = function(cssKeyValues) {
                  if(cssKeyValues == "") {
                    return "";
                  }
                  var cssKeyValueArray = cssKeyValues.split(";");
                  var expandingDivCSS = "";
                  for (var i = 0; i < cssKeyValueArray.length; i++ ) {
                    if(cssKeyValueArray[i]!=null && cssKeyValueArray[i].replace(/^\s+|\s+$/g, "") != "") {
                      var cssKeyVal = cssKeyValueArray[i].split(":");
                      if(cssKeyVal[0] != "display") {
                        if(expandingDivCSS != "")
                          expandingDivCSS += ";";
                        expandingDivCSS += cssKeyVal[0] + ":" + cssKeyVal[1];
                      }
                    }
                  }
                  return expandingDivCSS;
                }
                this.variableName = "0__" + (new Date()).getTime();
                this.zIndex = "";
                this.width = "";
                this.height = "";
                this.expandedWidth = "";
                this.expandedHeight = "";
                this.offsetTop = "";
                this.offsetLeft = "";
                this.offsetRight = "";
                this.offsetBottom = "";
                this.url = creative.mediaServer + "/772310/";
                this.duration = "";
                this.startTime = "";
                this.hideDropdowns = "" == "true";
                this.hideIframes = "" == "true";
                this.hideScrollbars = "" == "true";
                this.hideObjects = (creative.pubHideObjects != "") ? (creative.pubHideObjects.toLowerCase() == "true") : "" == "true";
                this.hideApplets = (creative.pubHideApplets != "") ? (creative.pubHideApplets.toLowerCase() == "true") : "" == "true";
                this.assetType = type;
                this.isMainAsset = true;
                this.pushContents = "" == "true";
                this.animationTime = isNaN("") ? 0 : parseFloat("");
                this.displayInline = creative.mtfInline;
                this.cssProperty = "";
                this.expandingDivStyleSheet = this.getExpandingDivStyleSheet(this.cssProperty);
                this.styleProperties = new Object();
                this.expEnvironment = coreCode.isInAdSenseIFrame() ? "adsense" : "basic";
                this.queryString = creative.queryStringBase + "&JS=0" + '&varName=' + this.variableName
                    + creative.asContext + "&assetType=" + type + "&expEnv=" + this.expEnvironment;
                this.allowtransparency = "true"; 
              }
              if(typeof(richMediaIFrameCreatives) != "undefined" && richMediaIFrameCreatives["1297895550185"]) {
                var core = new RichMediaCore_58_07();
                var breakoutCreative = self.richMediaIFrameCreatives["1297895550185"];
                var baseCreative = breakoutCreative.baseCreative;
                var creative = new PlacementCreative_1297895550185(baseCreative);
                var isFlashAssetExist = true;
                if(creative.shouldDisplayFlashAsset) {
                  creative.assets[core.ASSET_TYPE_EXPANDING] = new Expanding_1297895550185(creative, core.ASSET_TYPE_EXPANDING, core);
                  isFlashAssetExist = creative.assets[core.ASSET_TYPE_EXPANDING].url.toLowerCase().indexOf(".swf") != -1;
                }
                
                
                
                if(creative.forceHTML5Creative || creative.isHTML5PreviewMode || !creative.shouldDisplayFlashAsset || !isFlashAssetExist) {
                  creative.shouldDisplayHTML5Asset = true;
                  creative.assets[core.ASSET_TYPE_EXPANDING] = new ExpandingHTML_1297895550185(creative, core.ASSET_TYPE_EXPANDING, core);
                }
                self.richMediaIFrameCreatives["1297895550185"].creative = creative;
                var iframeRenderer = new IFrameCreativeRenderer_58_07();
                iframeRenderer.showCreative("1297895550185");
              } else {
                var core = new RichMediaCore_58_07();
                var baseCreative = new RichMediaCreative_1297895550185(core.CREATIVE_TYPE_EXPANDING);
                var creative = new PlacementCreative_1297895550185(baseCreative);
                var isFlashAssetExist = true;
                if(creative.shouldDisplayFlashAsset) {
                  creative.assets[core.ASSET_TYPE_EXPANDING] = new Expanding_1297895550185(creative, core.ASSET_TYPE_EXPANDING, core);
                  isFlashAssetExist = creative.assets[core.ASSET_TYPE_EXPANDING].url.toLowerCase().indexOf(".swf") != -1;
                }
                
                
                
                if(creative.forceHTML5Creative || creative.isHTML5PreviewMode || !creative.shouldDisplayFlashAsset || !isFlashAssetExist) {
                  creative.shouldDisplayHTML5Asset = true;
                  creative.assets[core.ASSET_TYPE_EXPANDING] = new ExpandingHTML_1297895550185(creative, core.ASSET_TYPE_EXPANDING, core);
                }
                dartRichmediaCreatives[dartRichmediaCreatives.length] = creative;
                RichMediaCore_58_07.prototype.trackCsiEvent("gb");  
                document.write('<scr' + 'ipt src="' + baseCreative.globalTemplateJs + '" language="JavaScript"></scr' + 'ipt>');
              }
              RichMediaCore_58_07.prototype.trackCsiEvent("pe") 
