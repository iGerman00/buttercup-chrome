/**
 * API Configuration handler for Buttercup
 * Manages API keys and configuration for Cobalt and Groq APIs
 */

class APIConfig {
    constructor() {
        this.cobaltApiKey = null;
        this.cobaltApiBase = 'https://api.cobalt.tools';
        this.useCobaltApiKey = true;
        this.groqApiKey = null;
        this.groqModel = 'whisper-large-v3';
        this.useWordTimestamps = true;
        this.wordsPerLine = 12;
        this.maxLineLength = 64;
        this.prompt = "Today, we're diving deep—yes, really deep—into Apple's latest marvel: the iPhone 15 Pro Max! Is it worth the hype (and the hefty price)? Let's find out. First impressions: sleek, powerful, and surprisingly lightweight. But wait… what's this? USB-C instead of Lightning? Finally! Cameras: 48MP main, 5x optical zoom—insane quality, folks. Battery life? Mind-blowing; lasted 14+ hours of heavy use. Verdict: it's fantastic—but do you need one? Well, that's entirely up to you. Like, subscribe, comment below";
        
        // Initialize API instances
        this.cobaltAPI = new CobaltAPI(this.cobaltApiBase);
        this.groqAPI = new GroqAPI();
    }

    /**
     * Initialize the configuration from settings received via custom event
     * @param {Object} settings - The settings object
     */
    initFromSettings(settings) {
        // Set whether to use Cobalt API key
        if (settings.useCobaltApiKey !== undefined) {
            this.useCobaltApiKey = settings.useCobaltApiKey;
            this.cobaltAPI.setRequireApiKey(this.useCobaltApiKey);
        }
        
        // Set Cobalt API key if using it
        if (this.useCobaltApiKey && settings.cobaltApiKey) {
            this.cobaltApiKey = settings.cobaltApiKey;
            this.cobaltAPI.setApiKey(this.cobaltApiKey);
        }
        
        if (settings.cobaltApiBase) {
            this.cobaltApiBase = settings.cobaltApiBase;
            this.cobaltAPI.setApiBase(this.cobaltApiBase);
        }
        
        if (settings.groqApiKey) {
            this.groqApiKey = settings.groqApiKey;
            this.groqAPI.setApiKey(this.groqApiKey);
        }
        
        if (settings.groqModel) {
            this.groqModel = settings.groqModel;
            this.groqAPI.setModel(this.groqModel);
        }
        
        // Set word timestamp settings
        if (settings.useWordTimestamps !== undefined) {
            this.useWordTimestamps = settings.useWordTimestamps;
        }
        
        if (settings.wordsPerLine !== undefined) {
            this.wordsPerLine = settings.wordsPerLine;
        }
        
        if (settings.maxLineLength !== undefined) {
            this.maxLineLength = settings.maxLineLength;
        }
        
        // Set prompt
        if (settings.prompt !== undefined) {
            this.prompt = settings.prompt;
        }
    }

    /**
     * Set whether to use Cobalt API key
     * @param {boolean} use - Whether to use Cobalt API key
     */
    setUseCobaltApiKey(use) {
        this.useCobaltApiKey = use;
        this.cobaltAPI.setRequireApiKey(use);
        // Use custom event to notify content script to save the setting
        document.dispatchEvent(new CustomEvent('buttercupSaveSetting', { 
            detail: { key: 'buttercup_use_cobalt_api_key', value: use }
        }));
    }

    /**
     * Set the Cobalt API key
     * @param {string} apiKey - The API key for Cobalt
     */
    setCobaltApiKey(apiKey) {
        this.cobaltApiKey = apiKey;
        this.cobaltAPI.setApiKey(apiKey);
        // Use custom event to notify content script to save the setting
        document.dispatchEvent(new CustomEvent('buttercupSaveSetting', { 
            detail: { key: 'buttercup_cobalt_api_key', value: apiKey }
        }));
    }

    /**
     * Set the Cobalt API base URL
     * @param {string} apiBase - The base URL for the Cobalt API
     */
    setCobaltApiBase(apiBase) {
        this.cobaltApiBase = apiBase;
        this.cobaltAPI.setApiBase(apiBase);
        // Use custom event to notify content script to save the setting
        document.dispatchEvent(new CustomEvent('buttercupSaveSetting', { 
            detail: { key: 'buttercup_cobalt_api_base', value: apiBase }
        }));
    }

    /**
     * Set the Groq API key
     * @param {string} apiKey - The API key for Groq
     */
    setGroqApiKey(apiKey) {
        this.groqApiKey = apiKey;
        this.groqAPI.setApiKey(apiKey);
        // Use custom event to notify content script to save the setting
        document.dispatchEvent(new CustomEvent('buttercupSaveSetting', { 
            detail: { key: 'buttercup_groq_api_key', value: apiKey }
        }));
    }

    /**
     * Set the Groq model
     * @param {string} model - The model to use for Groq API
     */
    setGroqModel(model) {
        this.groqModel = model;
        this.groqAPI.setModel(model);
        // Use custom event to notify content script to save the setting
        document.dispatchEvent(new CustomEvent('buttercupSaveSetting', { 
            detail: { key: 'buttercup_groq_model', value: model }
        }));
    }

    /**
     * Get whether to use Cobalt API key
     * @returns {boolean} Whether to use Cobalt API key
     */
    getUseCobaltApiKey() {
        return this.useCobaltApiKey;
    }

    /**
     * Get the Cobalt API key
     * @returns {string} The Cobalt API key
     */
    getCobaltApiKey() {
        return this.cobaltApiKey;
    }

    /**
     * Get the Cobalt API base URL
     * @returns {string} The Cobalt API base URL
     */
    getCobaltApiBase() {
        return this.cobaltApiBase;
    }

    /**
     * Get the Groq API key
     * @returns {string} The Groq API key
     */
    getGroqApiKey() {
        return this.groqApiKey;
    }

    /**
     * Get the Groq model
     * @returns {string} The Groq model
     */
    getGroqModel() {
        return this.groqModel;
    }

    /**
     * Check if the Cobalt API key is set
     * @returns {boolean} True if the Cobalt API key is set, false otherwise
     */
    hasCobaltApiKey() {
        return this.cobaltApiKey !== null && this.cobaltApiKey !== '';
    }

    /**
     * Check if the Groq API key is set
     * @returns {boolean} True if the Groq API key is set, false otherwise
     */
    hasGroqApiKey() {
        return this.groqApiKey !== null && this.groqApiKey !== '';
    }

    /**
     * Check if all required API keys are set
     * @returns {boolean} True if all required API keys are set, false otherwise
     */
    hasAllApiKeys() {
        // If Cobalt API key is not required, only check Groq API key
        if (!this.useCobaltApiKey) {
            return this.hasGroqApiKey();
        }
        // Otherwise, check both
        return this.hasCobaltApiKey() && this.hasGroqApiKey();
    }

    /**
     * Check if the current model supports translation
     * @returns {boolean} True if the current model supports translation
     */
    supportsTranslation() {
        return this.groqModel === 'whisper-large-v3';
    }

    /**
     * Get the Cobalt API instance
     * @returns {CobaltAPI} The Cobalt API instance
     */
    getCobaltAPI() {
        return this.cobaltAPI;
    }

    /**
     * Get the Groq API instance
     * @returns {GroqAPI} The Groq API instance
     */
    getGroqAPI() {
        return this.groqAPI;
    }
    
    /**
     * Set whether to use word-level timestamps
     * @param {boolean} use - Whether to use word-level timestamps
     */
    setUseWordTimestamps(use) {
        this.useWordTimestamps = use;
        // Use custom event to notify content script to save the setting
        document.dispatchEvent(new CustomEvent('buttercupSaveSetting', {
            detail: { key: 'buttercup_use_word_timestamps', value: use }
        }));
    }
    
    /**
     * Set the number of words per line
     * @param {number} count - The number of words per line
     */
    setWordsPerLine(count) {
        this.wordsPerLine = count;
        // Use custom event to notify content script to save the setting
        document.dispatchEvent(new CustomEvent('buttercupSaveSetting', {
            detail: { key: 'buttercup_words_per_line', value: count }
        }));
    }
    
    /**
     * Set the maximum line length
     * @param {number} length - The maximum line length in characters
     */
    setMaxLineLength(length) {
        this.maxLineLength = length;
        // Use custom event to notify content script to save the setting
        document.dispatchEvent(new CustomEvent('buttercupSaveSetting', {
            detail: { key: 'buttercup_max_line_length', value: length }
        }));
    }
    
    /**
     * Set the prompt for the model
     * @param {string} prompt - The prompt to guide the model
     */
    setPrompt(prompt) {
        this.prompt = prompt;
        // Use custom event to notify content script to save the setting
        document.dispatchEvent(new CustomEvent('buttercupSaveSetting', {
            detail: { key: 'buttercup_prompt', value: prompt }
        }));
    }
    
    /**
     * Get whether to use word-level timestamps
     * @returns {boolean} Whether to use word-level timestamps
     */
    getUseWordTimestamps() {
        return this.useWordTimestamps;
    }
    
    /**
     * Get the number of words per line
     * @returns {number} The number of words per line
     */
    getWordsPerLine() {
        return this.wordsPerLine;
    }
    
    /**
     * Get the maximum line length
     * @returns {number} The maximum line length in characters
     */
    getMaxLineLength() {
        return this.maxLineLength;
    }
    
    /**
     * Get the prompt for the model
     * @returns {string} The prompt to guide the model
     */
    getPrompt() {
        return this.prompt;
    }
}

// Export the class
window.APIConfig = APIConfig;