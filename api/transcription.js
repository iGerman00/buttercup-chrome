/**
 * Transcription handler for Buttercup
 * Manages the process of downloading audio and transcribing it
 */

class TranscriptionHandler {
    constructor(apiConfig) {
        this.apiConfig = apiConfig;
        this.cobaltAPI = apiConfig.getCobaltAPI();
        this.groqAPI = apiConfig.getGroqAPI();
        this.isProcessing = false;
        this.lastVideoId = null;
        this.lastTranslate = false;
    }

    /**
     * Check if the handler is currently processing a transcription
     * @returns {boolean} True if processing, false otherwise
     */
    isCurrentlyProcessing() {
        return this.isProcessing;
    }

    /**
     * Check if the handler has all required API keys
     * @returns {boolean} True if all required API keys are set, false otherwise
     */
    hasRequiredApiKeys() {
        return this.apiConfig.hasAllApiKeys();
    }

    /**
     * Check if the current request is a duplicate of the last one
     * @param {string} videoId - The YouTube video ID
     * @param {boolean} translate - Whether to translate the subtitles
     * @returns {boolean} True if duplicate, false otherwise
     */
    isDuplicateRequest(videoId, translate) {
        return this.lastVideoId === videoId && this.lastTranslate === translate;
    }

    /**
     * Set the last request details
     * @param {string} videoId - The YouTube video ID
     * @param {boolean} translate - Whether to translate the subtitles
     */
    setLastRequest(videoId, translate) {
        this.lastVideoId = videoId;
        this.lastTranslate = translate;
    }

    /**
     * Download a file from a URL and return as a Blob
     * @param {string} url - The URL to download
     * @returns {Promise<Blob>} - The downloaded file as a Blob
     */
    async downloadFile(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
            }
            return await response.blob();
        } catch (error) {
            console.error('[Buttercup] Error downloading file:', error);
            throw error;
        }
    }

    /**
     * Process a video for transcription
     * @param {string} videoId - The YouTube video ID
     * @param {boolean} translate - Whether to translate the subtitles
     * @param {function} onProgress - Callback for progress updates
     * @param {function} onSuccess - Callback for successful transcription
     * @param {function} onError - Callback for errors
     */
    async processVideo(videoId, translate, onProgress, onSuccess, onError) {
        if (this.isProcessing) {
            onError(new Error('Already processing a video'));
            return;
        }

        if (!this.hasRequiredApiKeys()) {
            const errorMsg = this.apiConfig.getUseCobaltApiKey()
                ? 'API keys not set. Please set up Cobalt and Groq API keys in the extension settings.'
                : 'Groq API key not set. Please set up the Groq API key in the extension settings.';
            onError(new Error(errorMsg));
            return;
        }

        if (this.isDuplicateRequest(videoId, translate)) {
            onError(new Error('This video has already been processed with the same settings.'));
            return;
        }

        // Check if translation is requested but not supported by the model
        if (translate && !this.apiConfig.supportsTranslation()) {
            onError(new Error(`The selected model (${this.apiConfig.getGroqModel()}) does not support translation. Please select whisper-large-v3 for translation.`));
            return;
        }

        this.isProcessing = true;
        this.setLastRequest(videoId, translate);

        try {
            // Step 1: Notify progress - Starting download
            onProgress('Downloading audio...');

            // Step 2: Download audio using Cobalt API
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const audioResult = await this.cobaltAPI.downloadAudio(videoUrl);
            
            if (!audioResult || !audioResult.url) {
                throw new Error('Failed to download audio');
            }

            // Step 3: Download the audio file from the Cobalt URL
            onProgress('Processing audio file...');
            const audioBlob = await this.downloadFile(audioResult.url);
            
            // Step 4: Notify progress - Starting transcription
            onProgress(translate ? 'Translating audio...' : 'Transcribing audio...');

            // Step 5: Transcribe or translate using Groq API with the downloaded file
            let transcriptionResult;
            if (translate) {
                transcriptionResult = await this.groqAPI.translate(audioBlob);
            } else {
                transcriptionResult = await this.groqAPI.transcribe(audioBlob);
            }

            // Step 6: Convert to YouTube format
            const youtubeFormat = this.groqAPI.convertToYouTubeFormat(transcriptionResult);
            
            // Step 7: Notify success
            onSuccess(youtubeFormat);
        } catch (error) {
            console.error('[Buttercup] Transcription error:', error);
            onError(error);
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Generate SRT file from YouTube format subtitles
     * @param {Object} youtubeFormat - YouTube format subtitles
     * @param {string} filename - Filename for the SRT file
     */
    generateSRT(youtubeFormat, filename) {
        try {
            const srtContent = this.groqAPI.convertToSRT(youtubeFormat);
            
            const blob = new Blob([srtContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('[Buttercup] Error generating SRT:', error);
            return false;
        }
    }
}

// Export the class
window.TranscriptionHandler = TranscriptionHandler;