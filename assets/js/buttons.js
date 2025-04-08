// General settings elements
const enabled = document.getElementById('enabled');
const translate = document.getElementById('translate');
const translateContainer = document.getElementById('translate-container');
const cache = document.getElementById('cache');
const download = document.getElementById('download');

// API settings elements
const useCobaltApiKey = document.getElementById('use-cobalt-api-key');
const cobaltApiKeyContainer = document.getElementById('cobalt-api-key-container');
const cobaltApiKey = document.getElementById('cobalt-api-key');
const cobaltApiBase = document.getElementById('cobalt-api-base');
const groqApiKey = document.getElementById('groq-api-key');
const groqModel = document.getElementById('groq-model');
const modelTranslationNote = document.getElementById('model-translation-note');
const saveApiSettings = document.getElementById('save-api-settings');

// Advanced settings elements
const useWordTimestamps = document.getElementById('use-word-timestamps');
const wordTimestampSettings = document.getElementById('word-timestamp-settings');
const wordsPerLine = document.getElementById('words-per-line');
const maxLineLength = document.getElementById('max-line-length');
const modelPrompt = document.getElementById('model-prompt');
const saveAdvancedSettings = document.getElementById('save-advanced-settings');

// Tab navigation elements
const tabGeneral = document.getElementById('tab-general');
const tabApi = document.getElementById('tab-api');
const tabAdvanced = document.getElementById('tab-advanced');
const generalTabContent = document.getElementById('general-tab');
const apiTabContent = document.getElementById('api-tab');
const advancedTabContent = document.getElementById('advanced-tab');

// Tab navigation
tabGeneral.addEventListener('click', () => {
    tabGeneral.classList.add('tab-active');
    tabApi.classList.remove('tab-active');
    tabAdvanced.classList.remove('tab-active');
    generalTabContent.classList.remove('hidden');
    apiTabContent.classList.add('hidden');
    advancedTabContent.classList.add('hidden');
});

tabApi.addEventListener('click', () => {
    tabApi.classList.add('tab-active');
    tabGeneral.classList.remove('tab-active');
    tabAdvanced.classList.remove('tab-active');
    apiTabContent.classList.remove('hidden');
    generalTabContent.classList.add('hidden');
    advancedTabContent.classList.add('hidden');
});

tabAdvanced.addEventListener('click', () => {
    tabAdvanced.classList.add('tab-active');
    tabGeneral.classList.remove('tab-active');
    tabApi.classList.remove('tab-active');
    advancedTabContent.classList.remove('hidden');
    generalTabContent.classList.add('hidden');
    apiTabContent.classList.add('hidden');
});

// Function to update translation availability based on selected model
function updateTranslationAvailability() {
    const selectedModel = groqModel.value;
    const supportsTranslation = selectedModel === 'whisper-large-v3';
    
    // Update the translation note
    if (supportsTranslation) {
        modelTranslationNote.textContent = 'Note: Only whisper-large-v3 supports translation';
        modelTranslationNote.classList.remove('text-error');
        modelTranslationNote.classList.add('text-gray-500');
    } else {
        modelTranslationNote.textContent = 'Note: This model does not support translation. Translation option will be disabled.';
        modelTranslationNote.classList.remove('text-gray-500');
        modelTranslationNote.classList.add('text-error');
    }
    
    // If the selected model doesn't support translation, disable the translation option
    if (!supportsTranslation && translate.checked) {
        translate.checked = false;
        chrome.storage.sync.set({ buttercup_translate: false });
        
        // Notify any open YouTube tabs about the settings change
        chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
            tabs.forEach(tab => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        document.dispatchEvent(new CustomEvent('buttercupSettingsChanged'));
                    }
                }).catch(err => console.error('Error executing script:', err));
            });
        });
    }
    
    // Update the translation option visibility
    if (!supportsTranslation) {
        translateContainer.classList.add('opacity-50');
        translate.disabled = true;
    } else {
        translateContainer.classList.remove('opacity-50');
        translate.disabled = false;
    }
}

// Function to toggle Cobalt API key input visibility
function toggleCobaltApiKeyVisibility() {
    if (useCobaltApiKey.checked) {
        cobaltApiKeyContainer.classList.remove('hidden');
    } else {
        cobaltApiKeyContainer.classList.add('hidden');
    }
}

// Function to toggle word timestamp settings visibility
function toggleWordTimestampSettings() {
    if (useWordTimestamps.checked) {
        wordTimestampSettings.classList.remove('hidden');
    } else {
        wordTimestampSettings.classList.add('hidden');
    }
}

// Function to show an alert in the popup
function showAlert(message, type = 'success') {
    // Remove any existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create the alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} mt-4`;
    
    // Set the icon based on the alert type
    let iconPath = '';
    if (type === 'success') {
        iconPath = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
    } else if (type === 'warning') {
        iconPath = 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
    } else if (type === 'error') {
        iconPath = 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
    }
    
    alertElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}" />
        </svg>
        <span>${message}</span>
    `;
    
    // Add the alert to the current tab content
    let currentTabContent;
    if (tabGeneral.classList.contains('tab-active')) {
        currentTabContent = generalTabContent;
    } else if (tabApi.classList.contains('tab-active')) {
        currentTabContent = apiTabContent;
    } else {
        currentTabContent = advancedTabContent;
    }
    currentTabContent.appendChild(alertElement);
    
    // Remove the alert after 3 seconds
    setTimeout(() => {
        alertElement.remove();
    }, 3000);
}

// Event listeners for general settings
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

// Event listener for Cobalt API key toggle
useCobaltApiKey.addEventListener('change', () => {
    toggleCobaltApiKeyVisibility();
    chrome.storage.sync.set({ buttercup_use_cobalt_api_key: useCobaltApiKey.checked });
});

// Event listener for Groq model change
groqModel.addEventListener('change', () => {
    updateTranslationAvailability();
});

// Event listener for word timestamps toggle
useWordTimestamps.addEventListener('change', () => {
    toggleWordTimestampSettings();
});

// API settings event listeners
saveApiSettings.addEventListener('click', () => {
    // Validate required fields
    if (!useCobaltApiKey.checked && !groqApiKey.value) {
        showAlert('Groq API Key is required', 'error');
        return;
    }
    
    if (useCobaltApiKey.checked && !cobaltApiKey.value) {
        showAlert('Cobalt API Key is required when using Cobalt API', 'error');
        return;
    }
    
    // Save API settings to Chrome storage
    const settings = {
        buttercup_use_cobalt_api_key: useCobaltApiKey.checked,
        buttercup_cobalt_api_base: cobaltApiBase.value || 'https://api.cobalt.tools',
        buttercup_groq_api_key: groqApiKey.value,
        buttercup_groq_model: groqModel.value
    };
    
    // Only save Cobalt API key if it's being used
    if (useCobaltApiKey.checked) {
        settings.buttercup_cobalt_api_key = cobaltApiKey.value;
    }
    
    chrome.storage.sync.set(settings);
    
    // Show success message
    showAlert('API settings saved successfully!', 'success');
    
    // Notify any open YouTube tabs about the settings change
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
        tabs.forEach(tab => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    document.dispatchEvent(new CustomEvent('buttercupApiSettingsChanged'));
                }
            }).catch(err => console.error('Error executing script:', err));
        });
    });
});

// Advanced settings event listeners
saveAdvancedSettings.addEventListener('click', () => {
    // Validate inputs
    const wordsPerLineValue = parseInt(wordsPerLine.value);
    const promptLength = modelPrompt.value.length;
    const maxLineLengthValue = parseInt(maxLineLength.value);
    
    if (isNaN(wordsPerLineValue) || wordsPerLineValue < 1 || wordsPerLineValue > 20) {
        showAlert('Words per line must be between 1 and 20', 'error');
        return;
    }
    
    if (isNaN(maxLineLengthValue) || maxLineLengthValue < 20 || maxLineLengthValue > 120) {
        showAlert('Maximum line length must be between 20 and 120 characters', 'error');
        return;
    }
    
    if (promptLength > 896) {
        showAlert('Prompt must be 896 characters or less', 'error');
        return;
    }
    
    // Save advanced settings to Chrome storage
    const settings = {
        buttercup_use_word_timestamps: useWordTimestamps.checked,
        buttercup_words_per_line: wordsPerLineValue,
        buttercup_max_line_length: maxLineLengthValue,
        buttercup_prompt: modelPrompt.value
    };
    
    chrome.storage.sync.set(settings);
    
    // Show success message
    showAlert('Advanced settings saved successfully!', 'success');
    
    // Notify any open YouTube tabs about the settings change
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
        tabs.forEach(tab => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    document.dispatchEvent(new CustomEvent('buttercupApiSettingsChanged'));
                }
            }).catch(err => console.error('Error executing script:', err));
        });
    });
});

// Load settings from Chrome storage
chrome.storage.sync.get([
    'buttercup_enabled',
    'buttercup_translate',
    'buttercup_cache',
    'buttercup_download_srt',
    'buttercup_use_cobalt_api_key',
    'buttercup_cobalt_api_key',
    'buttercup_cobalt_api_base',
    'buttercup_groq_api_key',
    'buttercup_groq_model',
    'buttercup_use_word_timestamps',
    'buttercup_words_per_line',
    'buttercup_max_line_length',
    'buttercup_prompt'
], (result) => {
    // General settings
    enabled.checked = result.buttercup_enabled !== false;
    translate.checked = result.buttercup_translate === true;
    cache.checked = result.buttercup_cache !== false;
    download.checked = result.buttercup_download_srt === true;
    
    // API settings
    useCobaltApiKey.checked = result.buttercup_use_cobalt_api_key !== false;
    toggleCobaltApiKeyVisibility();
    
    if (result.buttercup_cobalt_api_key) {
        cobaltApiKey.value = result.buttercup_cobalt_api_key;
    }
    
    if (result.buttercup_cobalt_api_base) {
        cobaltApiBase.value = result.buttercup_cobalt_api_base;
    } else {
        cobaltApiBase.value = 'https://api.cobalt.tools';
    }
    
    if (result.buttercup_groq_api_key) {
        groqApiKey.value = result.buttercup_groq_api_key;
    }
    
    if (result.buttercup_groq_model) {
        groqModel.value = result.buttercup_groq_model;
    }
    // Update translation availability based on the selected model
    updateTranslationAvailability();
    
    // Advanced settings
    useWordTimestamps.checked = result.buttercup_use_word_timestamps !== false;
    toggleWordTimestampSettings();
    
    if (result.buttercup_words_per_line) {
        wordsPerLine.value = result.buttercup_words_per_line;
    }
    
    if (result.buttercup_max_line_length) {
        maxLineLength.value = result.buttercup_max_line_length;
    }
    
    if (result.buttercup_prompt) {
        modelPrompt.value = result.buttercup_prompt;
    }
});

// Check if API keys are set and show a warning if not
chrome.storage.sync.get(['buttercup_use_cobalt_api_key', 'buttercup_cobalt_api_key', 'buttercup_groq_api_key'], (result) => {
    const needsCobaltKey = result.buttercup_use_cobalt_api_key !== false && !result.buttercup_cobalt_api_key;
    const needsGroqKey = !result.buttercup_groq_api_key;
    
    if (needsCobaltKey || needsGroqKey) {
        // Switch to API tab if keys are not set
        tabApi.click();
        
        // Show warning
        let warningMessage = 'Please set up your API keys to use Buttercup:';
        if (needsGroqKey) {
            warningMessage += ' Groq API Key is required.';
        }
        if (needsCobaltKey) {
            warningMessage += ' Cobalt API Key is required when using Cobalt API.';
        }
        
        showAlert(warningMessage, 'warning');
    }
});