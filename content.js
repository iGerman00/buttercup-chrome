// Create and inject API scripts
const apiScripts = [
    'api/cobalt.js',
    'api/groq.js',
    'api/config.js',
    'api/transcription.js'
];

// Inject API scripts first
apiScripts.forEach(scriptPath => {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(scriptPath);
    document.documentElement.prepend(script);
});

// Then inject the main script
const mainScript = document.createElement('script');
mainScript.src = chrome.runtime.getURL('buttercup.js');
document.documentElement.prepend(mainScript);

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

// Set default API settings if not set
chrome.storage.sync.get(['buttercup_use_cobalt_api_key'], function (result) {
    if (result.buttercup_use_cobalt_api_key === undefined) {
        chrome.storage.sync.set({ buttercup_use_cobalt_api_key: true });
    }
});

chrome.storage.sync.get(['buttercup_cobalt_api_base'], function (result) {
    if (result.buttercup_cobalt_api_base === undefined) {
        chrome.storage.sync.set({ buttercup_cobalt_api_base: 'https://api.cobalt.tools' });
    }
});

chrome.storage.sync.get(['buttercup_groq_model'], function (result) {
    if (result.buttercup_groq_model === undefined) {
        chrome.storage.sync.set({ buttercup_groq_model: 'whisper-large-v3' });
    }
});

// Listen for the custom event to save settings
document.addEventListener('buttercupSaveSetting', function (e) {
    if (e.detail && e.detail.key && e.detail.value !== undefined) {
        const settingObj = {};
        settingObj[e.detail.key] = e.detail.value;
        chrome.storage.sync.set(settingObj);
        console.info(`[Buttercup] Saved setting: ${e.detail.key}`);
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

// Listen for API settings requests
document.addEventListener('requestButtercupApiSettings', function () {
    chrome.storage.sync.get([
        'buttercup_use_cobalt_api_key',
        'buttercup_cobalt_api_key',
        'buttercup_cobalt_api_base',
        'buttercup_groq_api_key',
        'buttercup_groq_model'
    ], function (result) {
        // Send the values back to the page
        document.dispatchEvent(new CustomEvent('responseButtercupApiSettings', { 
            detail: {
                useCobaltApiKey: result.buttercup_use_cobalt_api_key !== false,
                cobaltApiKey: result.buttercup_cobalt_api_key || '',
                cobaltApiBase: result.buttercup_cobalt_api_base || 'https://api.cobalt.tools',
                groqApiKey: result.buttercup_groq_api_key || '',
                groqModel: result.buttercup_groq_model || 'whisper-large-v3'
            }
        }));
    });
});

// Listen for error notification requests
document.addEventListener('buttercupShowError', function (e) {
    if (e.detail && e.detail.message) {
        // Inject error notification into the page
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (message) => {
                    // Create snackbar element
                    const snackbar = document.createElement('div');
                    snackbar.style.position = 'fixed';
                    snackbar.style.bottom = '20px';
                    snackbar.style.left = '50%';
                    snackbar.style.transform = 'translateX(-50%)';
                    snackbar.style.backgroundColor = '#f44336';
                    snackbar.style.color = 'white';
                    snackbar.style.padding = '16px';
                    snackbar.style.borderRadius = '4px';
                    snackbar.style.zIndex = '9999';
                    snackbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
                    snackbar.style.minWidth = '250px';
                    snackbar.style.textAlign = 'center';
                    snackbar.textContent = `Buttercup Error: ${message}`;
                    
                    // Add to page
                    document.body.appendChild(snackbar);
                    
                    // Remove after 5 seconds
                    setTimeout(() => {
                        if (document.body.contains(snackbar)) {
                            document.body.removeChild(snackbar);
                        }
                    }, 5000);
                },
                args: [e.detail.message]
            });
        });
    }
});

document.dispatchEvent(new CustomEvent('buttercupSettingsChanged'));
