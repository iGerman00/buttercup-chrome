const script = document.createElement('script');
script.src = chrome.runtime.getURL('buttercup.js');

document.documentElement.prepend(script);

// set default config if not set
chrome.storage.sync.get(['buttercup_translate'], function (result) {
    if (result.buttercup_translate === undefined) {
        chrome.storage.sync.set({ buttercup_translate: false });
    }
});

chrome.storage.sync.get(['buttercup_enabled'], function (result) {
    if (result.buttercup_enabled === undefined) {
        chrome.storage.sync.set({ buttercup_enabled: true });
    }
});

chrome.storage.sync.get(['buttercup_cache'], function (result) {
    if (result.buttercup_cache === undefined) {
        chrome.storage.sync.set({ buttercup_cache: true });
    }
});

chrome.storage.sync.get(['buttercup_download_srt'], function (result) {
    if (result.buttercup_download_srt === undefined) {
        chrome.storage.sync.set({ buttercup_download_srt: false });
    }
});

// Listen for the custom event
document.addEventListener('requestButtercupTranslate', function () {
    chrome.storage.sync.get(['buttercup_translate'], function (result) {
        const translate = result.buttercup_translate;
        // Send the value back to the page
        document.dispatchEvent(new CustomEvent('responseButtercupTranslate', { detail: translate }));
    });
});

document.addEventListener('requestButtercupEnabled', function () {
    chrome.storage.sync.get(['buttercup_enabled'], function (result) {
        const enabled = result.buttercup_enabled;
        // Send the value back to the page
        document.dispatchEvent(new CustomEvent('responseButtercupEnabled', { detail: enabled }));
    });
});

document.addEventListener('requestButtercupCache', function () {
    chrome.storage.sync.get(['buttercup_cache'], function (result) {
        const cache = result.buttercup_cache;
        // Send the value back to the page
        document.dispatchEvent(new CustomEvent('responseButtercupCache', { detail: cache }));
    });
});

document.addEventListener('requestButtercupDownloadSrt', function () {
    chrome.storage.sync.get(['buttercup_download_srt'], function (result) {
        const download = result.buttercup_download_srt;
        // Send the value back to the page
        document.dispatchEvent(new CustomEvent('responseButtercupDownloadSrt', { detail: download }));
    });
});

document.dispatchEvent(new CustomEvent('buttercupSettingsChanged'));
