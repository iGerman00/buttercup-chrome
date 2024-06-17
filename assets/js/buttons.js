const enabled = document.getElementById('enabled');
const translate = document.getElementById('translate');
const cache = document.getElementById('cache');
const download = document.getElementById('download');
enabled.addEventListener('change', () => {
    chrome.storage.sync.set({ buttercup_enabled: enabled.checked });
    // fire buttercupSettingsChanged event on activeTab, executeScript
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id }, 
            func: () => {
                window.location.reload();
            }
        });
    });
});
translate.addEventListener('change', () => {
    chrome.storage.sync.set({ buttercup_translate: translate.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id }, 
            func: () => {
                document.dispatchEvent(new CustomEvent('buttercupSettingsChanged'));
            }
        });
    });
});
cache.addEventListener('change', () => {
    chrome.storage.sync.set({ buttercup_cache: cache.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id }, 
            func: () => {
                document.dispatchEvent(new CustomEvent('buttercupSettingsChanged'));
            }
        });
    });
});
download.addEventListener('change', () => {
    chrome.storage.sync.set({ buttercup_download_srt: download.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id }, 
            func: () => {
                document.dispatchEvent(new CustomEvent('buttercupSettingsChanged'));
            }
        });
    });
});
chrome.storage.sync.get(['buttercup_enabled', 'buttercup_translate', 'buttercup_cache', 'buttercup_download_srt'], (result) => {
    enabled.checked = result.buttercup_enabled;
    translate.checked = result.buttercup_translate;
    cache.checked = result.buttercup_cache;
    download.checked = result.buttercup_download_srt;
});
