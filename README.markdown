Copyright (c) 2009 Chad Auld ([opensourcepenguin.net](http://opensourcepenguin.net))
Licensed under the MIT license
 
# Mockingbird-Jetpack README #

Mockingbird-Jetpack is an open source/experimental [Mozilla Jetpack](https://jetpack.mozillalabs.com/) extension that displays tweets 
(Twitter messages) related to the the content of the Firefox tab/document a user currently on.  This started as a 
port of [Mockingbird](http://github.com/cauld/mockingbird/tree/master).  The installation page 
is located [here](http://opensourcepenguin.net/experiments/mockingbird-jetpack/).

The idea is simple really, open any page on the Internet and if you are interested in seeing 
what others are saying about related topics then just fire up Mockingbird and let it do the 
work for you.  It should prove useful for finding opinions, links, images, etc.

## INSTALLATION ##
1.  Install Mozilla Jetpack
2.  Navigate to the main [Mockingbird-Jetpack page](http://opensourcepenguin.net/experiments/mockingbird-jetpack/) and install the jetpack.
3.  To use, simply click on the new blue bird icon located on the bottom right hand corner of Firefox.

## HOW IT WORKS ##
1.  Mockingbird-Jetpack uses the [Yahoo! Query Language (YQL)](http://developer.yahoo.com/yql/) to get the 
    contents of the web page that it was activated on
2.  The page content is them passed to the [Yahoo! Term Extraction Web 
    Service](http://developer.yahoo.com/search/content/V1/termExtraction.html) which helps identify and rank keywords
3.  The top 3 page keyword terms are then used to to construct a [search 
    against Twitter](http://apiwiki.twitter.com/Twitter-API-Documentation) and display the latest results
4.  That same search will continue to refresh once per minute until you have closed Mockingbird
    
NOTE: Being that Mockingbird makes use of these 3rd party services please make sure you 
have read and understood their TOS agreements.
    
## TODO ##
1.  Move from a backend PHP proxy script to a Yahoo! pipe.  Currently in progress, pipe 
    located at [http://pipes.yahoo.com/chadauld/related_tweets_since](http://pipes.yahoo.com/chadauld/related_tweets_since).
2.  Rethink the Mockingbird div fixed position approach.  It would be best if the 
    Mockingbird code was in an independent overlay per tab which could always be 
    positioned over the tab document.  The jetpack sidebar could be an option, but 
    would need a way to adjust the sidebar per tab.  More research required.  Flash 
    and/or other positioned elements on a page currently present an overlap issue when 
    sharing the same screen space as Mockingbird-Jetpack.
3.  Get a real logo.  As you can tell my graphics skills are limited :)
