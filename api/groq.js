/**
 * Groq API handler for Buttercup
 * Handles transcription and translation of audio files using Groq API
 */

class GroqAPI {
    constructor(apiKey = null) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.groq.com/openai/v1/audio';
        this.model = 'whisper-large-v3'; // Default model
    }

    /**
     * Set the API key
     * @param {string} apiKey - The API key for Groq
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Get the API key
     * @returns {string} The API key
     */
    getApiKey() {
        return this.apiKey;
    }

    /**
     * Check if the API key is set
     * @returns {boolean} True if the API key is set, false otherwise
     */
    hasApiKey() {
        return this.apiKey !== null && this.apiKey !== '';
    }

    /**
     * Set the model to use for transcription/translation
     * @param {string} model - The model to use (whisper-large-v3, whisper-large-v3-turbo, distil-whisper-large-v3-en)
     */
    setModel(model) {
        const validModels = ['whisper-large-v3', 'whisper-large-v3-turbo', 'distil-whisper-large-v3-en'];
        if (validModels.includes(model)) {
            this.model = model;
        } else {
            console.warn(`[Buttercup] Invalid model: ${model}. Using default model: whisper-large-v3`);
        }
    }

    /**
     * Get the current model
     * @returns {string} The current model
     */
    getModel() {
        return this.model;
    }

    /**
     * Prepare a file for upload
     * @param {Blob|string} audioFile - The audio file as a Blob or URL
     * @returns {Promise<Blob>} - The prepared file
     */
    async prepareFile(audioFile) {
        // If it's already a Blob, return it
        if (audioFile instanceof Blob) {
            return audioFile;
        }
        
        // If it's a string (URL), download it
        if (typeof audioFile === 'string') {
            try {
                const response = await fetch(audioFile);
                if (!response.ok) {
                    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
                }
                return await response.blob();
            } catch (error) {
                console.error('[Buttercup] Error downloading file:', error);
                throw error;
            }
        }
        
        throw new Error('Invalid audio file format. Must be URL string or Blob');
    }

    /**
     * Transcribe audio file
     * @param {string|Blob} audioFile - URL or Blob of the audio file
     * @param {Object} options - Additional options
     * @param {string} options.language - Language code (optional)
     * @param {string} options.prompt - Prompt to guide the model (optional)
     * @returns {Promise<Object>} - Transcription result
     * @throws {Error} - If the transcription fails
     */
    async transcribe(audioFile, options = {}) {
        if (!this.hasApiKey()) {
            throw new Error('Groq API key not set');
        }

        try {
            const formData = new FormData();
            
            // Handle file input (URL or Blob)
            const preparedFile = await this.prepareFile(audioFile);
            
            // Add file with a proper filename to ensure correct MIME type detection
            const filename = 'audio.mp3'; // Default filename
            formData.append('file', preparedFile, filename);
            
            // Add required parameters
            formData.append('model', this.model);
            formData.append('response_format', 'verbose_json');
            formData.append('temperature', '0');
            
            // Add optional parameters
            if (options.language) {
                formData.append('language', options.language);
            }
            
            if (options.prompt) {
                formData.append('prompt', options.prompt);
            }
            
            // Add timestamp granularities if needed
            formData.append('timestamp_granularities[]', 'segment');
            
            const response = await fetch(`${this.baseUrl}/transcriptions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Groq API error: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('[Buttercup] Groq API transcription error:', error);
            throw error;
        }
    }

    /**
     * Translate audio file to English
     * @param {string|Blob} audioFile - URL or Blob of the audio file
     * @param {Object} options - Additional options
     * @param {string} options.prompt - Prompt to guide the model (optional)
     * @returns {Promise<Object>} - Translation result
     * @throws {Error} - If the translation fails
     */
    async translate(audioFile, options = {}) {
        if (!this.hasApiKey()) {
            throw new Error('Groq API key not set');
        }

        // Only whisper-large-v3 supports translation
        if (this.model !== 'whisper-large-v3') {
            console.warn('[Buttercup] Translation is only supported with whisper-large-v3 model. Switching to whisper-large-v3.');
            this.model = 'whisper-large-v3';
        }

        try {
            const formData = new FormData();
            
            // Handle file input (URL or Blob)
            const preparedFile = await this.prepareFile(audioFile);
            
            // Add file with a proper filename to ensure correct MIME type detection
            const filename = 'audio.mp3'; // Default filename
            formData.append('file', preparedFile, filename);
            
            // Add required parameters
            formData.append('model', 'whisper-large-v3'); // Only this model supports translation
            formData.append('response_format', 'verbose_json');
            formData.append('temperature', '0');
            
            // Add optional parameters
            if (options.prompt) {
                formData.append('prompt', options.prompt);
            }
            
            // Add timestamp granularities if needed
            formData.append('timestamp_granularities[]', 'segment');
            
            const response = await fetch(`${this.baseUrl}/translations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Groq API error: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('[Buttercup] Groq API translation error:', error);
            throw error;
        }
    }

    /**
     * Convert Groq API response to YouTube caption format
     * @param {Object} response - The Groq API response
     * @returns {Object} - YouTube caption format object
     */
    convertToYouTubeFormat(response) {
        try {
            const jsonSubtitles = { events: [] };
            
            // Insert newlines into text at the nearest space if it's longer than 64 characters
            function insertNewlines(text) {
                let newText = '';
                let lineLength = 0;
                
                text.split(' ').forEach((word) => {
                    if (lineLength + word.length <= 64) {
                        newText += (lineLength > 0 ? ' ' : '') + word;
                        lineLength += word.length + (lineLength > 0 ? 1 : 0); // +1 for the space
                    } else {
                        newText += '\n' + word;
                        lineLength = word.length;
                    }
                });
                
                return newText.trim();
            }
            
            // Process segments from the response
            if (response.segments && response.segments.length > 0) {
                response.segments.forEach(segment => {
                    const startTimeMs = segment.start * 1000;
                    const durationMs = (segment.end - segment.start) * 1000;
                    const text = insertNewlines(segment.text.trim());
                    
                    jsonSubtitles.events.push({
                        tStartMs: startTimeMs,
                        dDurationMs: durationMs,
                        segs: [{ utf8: text }]
                    });
                });
            }
            
            return jsonSubtitles;
        } catch (error) {
            console.error('[Buttercup] Error converting Groq response to YouTube format:', error);
            throw error;
        }
    }

    /**
     * Convert YouTube caption format to SRT format
     * @param {Object} jsonSubtitles - YouTube caption format object
     * @returns {string} - SRT format string
     */
    convertToSRT(jsonSubtitles) {
        try {
            function msToSRTTime(ms) {
                const hours = String(Math.floor(ms / 3600000)).padStart(2, '0');
                const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
                const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
                const milliseconds = String(ms % 1000).padStart(3, '0');
                return `${hours}:${minutes}:${seconds},${milliseconds}`;
            }
            
            let srtContent = '';
            jsonSubtitles.events.forEach((event, index) => {
                const startTime = msToSRTTime(event.tStartMs);
                const endTime = msToSRTTime(event.tStartMs + event.dDurationMs);
                const text = event.segs.map(seg => seg.utf8).join('\n');
                
                srtContent += `${index + 1}\n${startTime} --> ${endTime}\n${text}\n\n`;
            });
            
            return srtContent.trim();
        } catch (error) {
            console.error('[Buttercup] Error converting to SRT format:', error);
            throw error;
        }
    }
}

// Export the class
window.GroqAPI = GroqAPI;