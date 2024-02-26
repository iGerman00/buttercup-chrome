const enabled = document.getElementById('enabled');
const translate = document.getElementById('translate');
const cache = document.getElementById('cache');

enabled.addEventListener('change', () => {
    chrome.storage.sync.set({ buttercup_enabled: enabled.checked });
});
translate.addEventListener('change', () => {
    chrome.storage.sync.set({ buttercup_translate: translate.checked });
});
cache.addEventListener('change', () => {
    chrome.storage.sync.set({ buttercup_cache: cache.checked });
});
chrome.storage.sync.get(['buttercup_enabled', 'buttercup_translate', 'buttercup_cache'], (result) => {
    enabled.checked = result.buttercup_enabled;
    translate.checked = result.buttercup_translate;
    cache.checked = result.buttercup_cache;
});
