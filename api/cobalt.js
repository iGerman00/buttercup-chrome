/**
 * Cobalt API handler for Buttercup
 * Handles downloading audio from YouTube videos using Cobalt API
 */

class CobaltAPI {
    constructor(apiBase = 'https://api.cobalt.tools') {
        this.apiBase = apiBase;
        this.apiKey = null;
        this.requireApiKey = true;
    }

    /**
     * Set the API key
     * @param {string} apiKey - The API key for Cobalt
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Set the API base URL
     * @param {string} apiBase - The base URL for the Cobalt API
     */
    setApiBase(apiBase) {
        this.apiBase = apiBase;
    }

    /**
     * Set whether the API key is required
     * @param {boolean} required - Whether the API key is required
     */
    setRequireApiKey(required) {
        this.requireApiKey = required;
    }

    /**
     * Get the API key
     * @returns {string} The API key
     */
    getApiKey() {
        return this.apiKey;
    }

    /**
     * Get the API base URL
     * @returns {string} The API base URL
     */
    getApiBase() {
        return this.apiBase;
    }

    /**
     * Check if the API key is set
     * @returns {boolean} True if the API key is set, false otherwise
     */
    hasApiKey() {
        return this.apiKey !== null && this.apiKey !== '';
    }

    /**
     * Check if the API key is required and not set
     * @returns {boolean} True if the API key is required but not set
     */
    isApiKeyRequiredButNotSet() {
        return this.requireApiKey && !this.hasApiKey();
    }

    /**
     * Get audio formats from YouTube video
     * @param {string} videoId - The YouTube video ID
     * @returns {Promise<Array>} - Array of audio formats
     */
    async getAudioFormats(videoId) {
        try {
            // Try to get audio formats from the YouTube player response
            if (window.ytInitialPlayerResponse && 
                window.ytInitialPlayerResponse.streamingData && 
                window.ytInitialPlayerResponse.streamingData.adaptiveFormats) {
                
                return window.ytInitialPlayerResponse.streamingData.adaptiveFormats.filter(format => 
                    format.mimeType.includes('audio')
                );
            }
            
            return [];
        } catch (error) {
            console.error('[Buttercup] Error getting audio formats:', error);
            return [];
        }
    }

    /**
     * Find the best audio format under the size limit
     * @param {Array} formats - Array of audio formats
     * @param {number} maxSizeBytes - Maximum size in bytes (default 40MB for free tier)
     * @returns {Object|null} - The best audio format or null if none found
     */
    findBestAudioFormat(formats, maxSizeBytes = 40 * 1024 * 1024) {
        if (!formats || formats.length === 0) return null;
        
        // Sort by quality (higher bitrate first)
        const sortedFormats = [...formats].sort((a, b) => {
            return (b.bitrate || 0) - (a.bitrate || 0);
        });
        
        // Find the highest quality format under the size limit
        for (const format of sortedFormats) {
            if (format.contentLength && parseInt(format.contentLength) < maxSizeBytes) {
                return format;
            }
        }
        
        // If no format is under the limit, return the smallest one
        return sortedFormats.sort((a, b) => {
            return (parseInt(a.contentLength) || Infinity) - (parseInt(b.contentLength) || Infinity);
        })[0];
    }

    /**
     * Download audio from YouTube video
     * @param {string} videoUrl - The YouTube video URL
     * @returns {Promise<Object>} - Object containing the audio URL and filename
     * @throws {Error} - If the download fails
     */
    async downloadAudio(videoUrl) {
        // Check if API key is required but not set
        if (this.isApiKeyRequiredButNotSet()) {
            throw new Error('Cobalt API key is required but not set');
        }

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        // Add authorization header if API key is set
        if (this.hasApiKey()) {
            headers['Authorization'] = `Api-Key ${this.apiKey}`;
        }

        try {
            // Get audio formats to check size before downloading
            const videoId = this.extractVideoId(videoUrl);
            const audioFormats = await this.getAudioFormats(videoId);
            const bestFormat = this.findBestAudioFormat(audioFormats);
            
            if (bestFormat && parseInt(bestFormat.contentLength) > 40 * 1024 * 1024) {
                console.warn('[Buttercup] Audio file is larger than 40MB, may fail for free users');
            }

            const response = await fetch(`${this.apiBase}/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    url: videoUrl,
                    downloadMode: 'audio',
                    audioFormat: 'mp3',
                    audioBitrate: '128',
                    filenameStyle: 'basic',
                    alwaysProxy: true,
                    disableMetadata: true
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Cobalt API error: ${errorData.error?.code || response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'error') {
                throw new Error(`Cobalt API error: ${data.error?.code || 'Unknown error'}`);
            }
            
            if (data.status === 'tunnel' || data.status === 'redirect') {
                return {
                    url: data.url,
                    filename: data.filename
                };
            }
            
            throw new Error('Unexpected response from Cobalt API');
        } catch (error) {
            console.error('[Buttercup] Cobalt API error:', error);
            throw error;
        }
    }

    /**
     * Extract video ID from YouTube URL
     * @param {string} url - The YouTube URL
     * @returns {string} - The video ID
     */
    extractVideoId(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            
            if (pathname.startsWith('/clip')) {
                return document.querySelector("meta[itemprop='videoId']")?.content;
            } else if (pathname.startsWith('/shorts')) {
                return pathname.slice(8);
            } else {
                return urlObj.searchParams.get('v');
            }
        } catch (error) {
            console.error('[Buttercup] Error extracting video ID:', error);
            return null;
        }
    }
}

// Export the class
window.CobaltAPI = CobaltAPI;