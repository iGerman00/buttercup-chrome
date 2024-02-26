const script = document.createElement('script')
script.src = chrome.runtime.getURL('buttercup.js')

document.documentElement.prepend(script)

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