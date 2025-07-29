---
layout: Page
title: Guestbook
permalink: "/guestbook/"
emoji: "\U0001F48C"
searchable: true
tags:
- index
- personal-blog
serial_number: 2024.PAE.020
---
At our home, we have a guestbook in the guest room. It’s a fun way to see who has visited and when.

In the same way, it’s so fun to leave a mark on another person’s website, a subtle reminder that you were there, with friends.

And so, if you want to leave your mark on my online home, please do so below.

<div id="cusdis_thread" data-theme="auto" data-host="https://cusdis.com" data-app-id="0bbb76b5-e971-4d9c-8fa7-a4c9e1ff0984" data-page-id="{{ page.url }}" data-page-url="{{ site.url }}{{ page.url }}" data-page-title="{{ page.title }}"></div>
<script>
function adjustIframeHeight(iframe) {
    var heights = [];
    function load() {
        if (!iframe.contentWindow.document.body) {
            return setTimeout(load, 500);
        }
        var height = iframe.contentWindow.document.body.scrollHeight;
        // Set the iframe height
        iframe.style.height = height + 'px';
        heights.push(height);
        // if the height has been the same for 1.5 seconds, stop polling
        if (heights.length > 3 && heights[heights.length - 1] === heights[heights.length - 2] && heights[heights.length - 2] === heights[heights.length - 3]) {
            return;
        }
        setTimeout(load, 500);
    };
    load();
}

// poll to get the iframe
(function waitForIframe() {
    var myIframe = document.querySelector('#cusdis_thread iframe');
    if (myIframe) {
        adjustIframeHeight(myIframe);
    } else {
        setTimeout(waitForIframe, 100);
    }
})();
</script>
