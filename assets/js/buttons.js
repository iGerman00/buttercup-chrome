const enabled = document.getElementById('enabled');
const translate = document.getElementById('translate');
enabled.addEventListener('change', () => {
    chrome.storage.sync.set({ buttercup_enabled: enabled.checked });
});
translate.addEventListener('change', () => {
    chrome.storage.sync.set({ buttercup_translate: translate.checked });
});
chrome.storage.sync.get(
    ['buttercup_enabled', 'buttercup_translate'],
    (result) => {
        enabled.checked = result.buttercup_enabled;
        translate.checked = result.buttercup_translate;
    }
);
