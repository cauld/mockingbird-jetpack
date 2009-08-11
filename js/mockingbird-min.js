/*
 * Mockingbird-Jetpack (http://github.com/cauld/mockingbird-jetpack/tree/master)
 * DESC: An experimental Mozilla Jetpack extension that displays tweets related to the the content 
 * of the tab/dcument a user currently on.  This started as a port of 
 * Mockingbird (http://github.com/cauld/mockingbird/tree/master).
 *
 * Copyright (c) 2009 Chad Auld (opensourcepenguin.net)
 * Licensed under the MIT license.
 */
jetpack.statusBar.append({html:'<img title="Mockingbird" src="http://opensourcepenguin.net/experiments/mockingbird-jetpack/images/mockingbird.ico">',width:16,onReady:function(c){var e="http://opensourcepenguin.net/experiments/mockingbird-jetpack/";function f(){$(jetpack.tabs.focused.contentDocument).find("#mockingbird").fadeOut("normal")}function d(){var g=$(jetpack.tabs.focused.contentDocument);if(g.find("#mockingbird").length===0){var h,i=jetpack.tabs.focused.contentDocument.createElement("link");i.id="mockingbird-css";i.type="text/css";i.rel="stylesheet";i.href=e+"css/mockingbird-min.css";i.media="screen";g.find("head").append(i);h='<div id="mockingbird" style="position: fixed; bottom: 0; right: 15px; display: none;"><h2 class="mockingbird-header"><a href="http://github.com/cauld/mockingbird-jetpack/tree/master">Mockingbird</a>: Contextual Tweets</h2><a class="close-mockingbird" href="#">close</a><div id="mockingbird-container"><p id="loading-tweets">Loading Related Tweets... <img src="'+e+'images/ajax-loader.gif"</p></div></div>';g.find("body").append(h);g.find("#mockingbird .close-mockingbird").click(function(k){k.preventDefault();var j=jetpack.tabs.focused.contentDocument;j.mockingbirdWidgetState="closed";f()})}g.find("#mockingbird").fadeIn("normal")}function a(){var k,h,m,g,l="",j="";for(k=0;k<jetpack.tabs.length;k++){if(jetpack.tabs[k].contentDocument.mockingbirdWidgetState==="open"){h=$(jetpack.tabs[k].contentDocument);m=encodeURI(jetpack.tabs[k].contentWindow.location.href);j="";g=h.find("#mockingbird-container div:first").attr("id");if(g!==undefined){l=g.split("-")[1]}(function(){var n=h,o,i=jetpack.tabs[k].favicon;o=e+"mockingbird_proxy.php?page="+m+"&since_id="+l;$.ajax({url:o,cache:false,timeout:7000,dataType:"json",error:function(){if(n.find("#loading-tweets").length===1){n.find("#mockingbird-container").html('<div class="mockingbird-body"><p class="error">Failed to fetch related tweets!  Please try again later.</p></div>')}},success:function(p){if(p.results!==undefined&&p.results.length>0){var r=0,q="";$.each(p.results,function(w,u){var v,t,s;if(n.find("#tweet-"+u.id).length===0){r++;v=new Date(u.created_at);t=b(v);s=u.text;s=s.replace(/((\w+):\/\/[\S]+\b)/gim,'<a class="mockingbird-link" target="_blank" href="$1" target="_blank">$1</a>');s=s.replace(/@(\w+)/gim,'<a class="mockingbird-link" target="_blank" href="http://twitter.com/$1" target="_blank">@$1</a>');q+='<div class="mockingbird-body" id="tweet-'+u.id+'"><div class="mockingbird-container-left"><img height="48" width="48" class="mockingbird-profile-image" src="'+u.profile_image_url+'" alt="'+u.from_user+'" /></div><div class="mockingbird-container-right"><p class="mockingbird-text"><a class="mockingbird-link" target="_blank" href="http://twitter.com/'+encodeURIComponent(u.from_user)+'">'+u.from_user+"</a>&nbsp;"+s+'<br><span class="mockingbird-date">'+t+"</span></p></div></div>"}});if(r>0){if(n.find("#loading-tweets").length===1||n.find("#mockingbird-container div p.error").length===1){n.find("#mockingbird-container").html(q)}else{n.find("#mockingbird-container").children().eq(0).before(q)}if(p.results.length>0&&n.attr("title")!==""){jetpack.notifications.show({title:"Mockingbird",body:p.results.length+' new related tweets for page titled, "'+n.attr("title")+'"',icon:i})}}}else{if(p.results!==undefined&&p.results.length===0&&n.find("#loading-tweets").length===1){n.find("#mockingbird-container").html('<div class="mockingbird-body"><p class="error">No related tweets found!  Will try again soon.</p></div>')}}}})})()}}}$(c).click(function(){var g=jetpack.tabs.focused.contentDocument;if(g.mockingbirdWidgetState===undefined){g.mockingbirdWidgetState="closed"}if(g.mockingbirdWidgetState==="closed"){g.mockingbirdWidgetState="open";d();a()}else{g.mockingbirdWidgetState="closed";f()}});setInterval(function(){for(var g=0;g<jetpack.tabs.length;g++){if(jetpack.tabs[g].contentDocument.mockingbirdWidgetState==="open"){a()}}},60000);function b(i){var h=i,j=(((new Date()).getTime()-h.getTime())/1000),g=Math.floor(j/86400);if(isNaN(g)||g<0||g>=31){return}return g===0&&(j<60&&"just now"||j<120&&"1 minute ago"||j<3600&&Math.floor(j/60)+" minutes ago"||j<7200&&"1 hour ago"||j<86400&&Math.floor(j/3600)+" hours ago")||g===1&&"Yesterday"||g<7&&g+" days ago"||g<31&&Math.ceil(g/7)+" weeks ago"}}});