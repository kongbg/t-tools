console.log('This is background page');
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ color: '#e84f20' }, function () {
        console.log("虾皮的橙色");
    });
     chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'www.baidu.com' },
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});
