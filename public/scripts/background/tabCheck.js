/* global chrome */

console.log("bs setup")

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      if (changeInfo.url) {
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTabID = tabs[0].id;
            chrome.tabs.sendMessage(activeTabID, {url: changeInfo.url});
        });

      }
    }
  );

//listen for internal site refresh