/*
 * Mockingbird-Jetpack (http://github.com/cauld/mockingbird-jetpack/tree/master)
 * DESC: An experimental Mozilla Jetpack extension that displays tweets related to the the content 
 * of the tab/dcument a user currently on.  This started as a port of 
 * Mockingbird (http://github.com/cauld/mockingbird/tree/master).
 *
 * Copyright (c) 2009 Chad Auld (opensourcepenguin.net)
 * Licensed under the MIT license.
 */

jetpack.statusBar.append({
  html: "<img title=\"Mockingbird\" src=\"http://opensourcepenguin.net/experiments/mockingbird-jetpack/images/mockingbird.ico\">",
  width: 16,
  onReady: function(widget){
    var mockingBirdResourceUrl = "http://opensourcepenguin.net/experiments/mockingbird-jetpack/";
    
    /**
    * Displays the mockingbird widget on the active tab/document
    */
    function showMB() {
        var jpcd = $(jetpack.tabs.focused.contentDocument);
        
        //The first time through we need bring in the CSS and setup the main div
        if (jpcd.find("#mockingbird").length === 0) {
            //Bring in the custom Mockingbird CSS if not already in the DOM
              var mockingbirdDiv, 
                  dCSS   = jetpack.tabs.focused.contentDocument.createElement('link');

              dCSS.id    = 'mockingbird-css';
              dCSS.type  = 'text/css';
              dCSS.rel   = 'stylesheet';
              dCSS.href  = mockingBirdResourceUrl + 'css/mockingbird-min.css';
              dCSS.media = 'screen';
              jpcd.find("head").append(dCSS);
              
            mockingbirdDiv = '<div id="mockingbird" style="position: fixed; bottom: 0; right: 15px; display: none;">' +
        	                    '<h2 class="mockingbird-header"><a href="http://github.com/cauld/mockingbird-jetpack/tree/master">Mockingbird</a>: Contextual Tweets</h2>' +
        	                    '<a class="close-mockingbird" href="#">close</a>' +
                                '<div id="mockingbird-container">' +
                                    '<p id="loading-tweets">Loading Related Tweets... <img src="'+ mockingBirdResourceUrl + 'images/ajax-loader.gif"</p>' +
                                '</div>' +
        	                '</div>';

            jpcd.find("body").append(mockingbirdDiv);
            
            //Secondary close method
            jpcd.find('#mockingbird .close-mockingbird').click(function(e){
                e.preventDefault();
                var jpcd = jetpack.tabs.focused.contentDocument;
                jpcd.mockingbirdWidgetState = 'closed';
                hideMB();
            });
        }
        
        jpcd.find("#mockingbird").fadeIn("normal");
    }
    
    /**
    * Hides the mockingbird widget on the active tab/document
    */
    function hideMB() {
        $(jetpack.tabs.focused.contentDocument).find("#mockingbird").fadeOut("normal");
    }
    
    /**
    * Fetch tweets related to the content of an existing tab/document
    */
    function fetchRelatedTweets() {
        var i, jpcd, jpcdUrl, sinceNode, sinceId = '', mockingbirdDiv = '';
        
        //Loop over all the tabs and process any with an mockingbird in an open state
        for(i=0; i<jetpack.tabs.length; i++) {
            if (jetpack.tabs[i].contentDocument.mockingbirdWidgetState === 'open') {
                jpcd     = $(jetpack.tabs[i].contentDocument);
                jpcdUrl  = encodeURI(jetpack.tabs[i].contentWindow.location.href);
                mockingbirdDiv = '';
                
                //Pickup where we left off if this is not the first set of results
                sinceNode = jpcd.find("#mockingbird-container div:first").attr("id");
                if (sinceNode !== undefined) {
                    sinceId = sinceNode.split("-")[1];
                }
                
                (function() {
                    var localJpcd = jpcd,
                        requestURL,
                        favIcon = jetpack.tabs[i].favicon,
                        tDate, 
                        tPrettyDate, 
                        mText,
                        tweetList,
                        tweetResults = '';
                    
                    requestURL = mockingBirdResourceUrl + "mockingbird_proxy.php?page=" + jpcdUrl + "&since_id=" + sinceId;
                    
                    $.ajax({
                        url: requestURL,
                        cache: false,
                        timeout: 7000,
                        dataType: "json",
                        error: function(){
                            localJpcd.find("#mockingbird-container").html('<div class="mockingbird-body"><p class="error">Failed to fetch related tweets!  Please try again later.</p></div>');
                        },
                        success: function(data){
                            if (data.results !== undefined && data.results.length > 0) {
                                //Build a html block to insert based on the latest results
                                //NOTE: Occasionally Twitter ignores the since_id param and returns results we already have so we
                                //must verify it is not present in the DOM already.
                                var actualInsertCount = 0;
                                $.each(data.results, function(i,result){
                                    if (localJpcd.find("#tweet-" + result.id).length === 0) {
                                        actualInsertCount++;
                                        //Format date
                                        tDate = new Date(result.created_at);
                                        tPrettyDate = prettyDate(tDate);

                                        //Replace link-look-alikes
                                    	mText = result.text;
                                    	mText = mText.replace(/((\w+):\/\/[\S]+\b)/gim, '<a class="mockingbird-link" target="_blank" href="$1" target="_blank">$1</a>');
                                    	//Replace replies (i.e.) @someone
                                    	mText = mText.replace(/@(\w+)/gim, '<a class="mockingbird-link" target="_blank" href="http://twitter.com/$1" target="_blank">@$1</a>');

                                        tweetResults += '<div class="mockingbird-body" id="tweet-' + result.id + '">' +
                                                            '<div class="mockingbird-container-left">' +
                                                                '<img height="48" width="48" class="mockingbird-profile-image" src="' + result.profile_image_url + '" alt="' + result.from_user + '" />' +
                                                            '</div>' +
                                                            '<div class="mockingbird-container-right">' +
                                                            	'<p class="mockingbird-text">' +
                                                            	    '<a class="mockingbird-link" target="_blank" href="http://twitter.com/' + encodeURIComponent(result.from_user) + '">' + result.from_user + '</a>&nbsp;' + mText +
                                                            	    '<br><span class="mockingbird-date">' + tPrettyDate + '</span>' +
                                                            	'</p>' +
                                                            '</div>' +
                                                        '</div>';
                                    }
                                });
                                
                                if (actualInsertCount > 0) {
                                    //First good result set.  Replace any notices.
                                    if (localJpcd.find("#loading-tweets").length === 1 || localJpcd.find("#mockingbird-container div p.error").length === 1) {
                                        localJpcd.find("#mockingbird-container").html(tweetResults);
                                    } else {
                                        tweetList = localJpcd.find("#mockingbird-container").children().eq(0).before(tweetResults);
                                    }

                                    //Show growl-like notification
                                    if (data.results.length > 0 && localJpcd.attr("title") !== '') {
                                        jetpack.notifications.show({ title: 'Mockingbird',
                                                                    body: data.results.length + ' new related tweets for page titled, "' + localJpcd.attr("title") + '"',
                                                                    icon: favIcon }); 
                                    }
                                }
                            } else if (data.results !== undefined && data.results.length === 0 && localJpcd.find("#loading-tweets").length === 1) {
                                //If this is the first pass then turn off the loading indicator and show the notice.
                                //Otherwise, there just hasn't any been newer tweets found yet.
                                localJpcd.find("#mockingbird-container").html('<div class="mockingbird-body"><p class="error">No related tweets found!  Will try again soon.</p></div>');
                            }
                        }
                    });
                })();
            } //end if
        } //end for
    }
 
    //Define our event handlers
    $(widget).click(function(){
        var jpcd = jetpack.tabs.focused.contentDocument;
        
        //We need to keep track of each documents widget open/shut state and the tweet fetch handler
        if (jpcd.mockingbirdWidgetState === undefined) {
            jpcd.mockingbirdWidgetState  = 'closed';
        }
        
        if (jpcd.mockingbirdWidgetState === 'closed') {
            jpcd.mockingbirdWidgetState = 'open';
            showMB();
            
            //Call the tweet fetcher immediately and then schedule for future runs
            fetchRelatedTweets();
        } else {
            jpcd.mockingbirdWidgetState = 'closed';
            hideMB();
        }
    });
    
    //Check for open widgets once per minute and update as needed
    setInterval(function() {
                for(var i=0; i<jetpack.tabs.length; i++) {
                    if (jetpack.tabs[i].contentDocument.mockingbirdWidgetState === 'open') {
                        fetchRelatedTweets();
                    }
                }
            }, 60000);
    
    /**
    * Make dates nice and pretty (e.g.) 8 mins ago, 1 day ago, etc
    * @param dateObject a JavaScript date object
    *
    * Note: this is a modified very John Resig's prettyDate (under MIT)
    * (http://ejohn.org/files/pretty.js).  It mostly just removes the ISO
    * input format requirement and the jQuery plugin bit.
    */
    function prettyDate(dateObject) {
    	var date = dateObject,
    		diff = (((new Date()).getTime() - date.getTime()) / 1000),
    		day_diff = Math.floor(diff / 86400);

    	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 ) {
    	   return;
    	}

    	return day_diff === 0 && (
    		diff < 60 && "just now" ||
    		diff < 120 && "1 minute ago" ||
    		diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
    		diff < 7200 && "1 hour ago" ||
    		diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
    		day_diff === 1 && "Yesterday" ||
    		day_diff < 7 && day_diff + " days ago" ||
    		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
    }
  }
});