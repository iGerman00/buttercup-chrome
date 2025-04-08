// I apologize in advance to whoever is paying for the API calls. But it's public, and there's an API, so I'm using it. I hope I'm defrauding some massive corporation and not some poor soul.
// Can you tell this used to be a userscript?
console.info('[Buttercup] Injected');

if (window.trustedTypes && window.trustedTypes.createPolicy) {  
    // i hate this so much, who thought this was a good idea???
    window.trustedTypes.createPolicy('default', {  
        createHTML: (string, sink) => string  
    }); 
}

const BUTTON_CLASSNAME = 'ytp-subtitles-button ytp-button';

const CAPTION_TRACK = {
    baseUrl: 'https://www.youtube.com/?buttercup=true', // this won't work in the real youtube api but Buttercup will be just fine
    name: {
        simpleText: 'Buttercup (Whisper)',
    },
    vssId: 'a.en',
    languageCode: 'en',
    kind: 'asr',
    isTranslatable: false,
    trackName: '',
};

const CAPTIONS_OBJECT = {
    playerCaptionsTracklistRenderer: {
        captionTracks: [CAPTION_TRACK],
        audioTracks: [
            {
                captionTrackIndices: [0],
                defaultCaptionTrackIndex: 0,
                visibility: 'ON',
                hasDefaultTrack: true,
                captionsInitialState: 'CAPTIONS_INITIAL_STATE_OFF_REQUIRED',
            },
        ],
        defaultAudioTrackIndex: 0,
    },
};

// Thank you sam herbert https://github.com/SamHerbert/SVG-Loaders, modified to fit the button
const SVG_LOADER = `<svg height=100% viewBox="0 0 36 36"width=100% xmlns=http://www.w3.org/2000/svg><defs><linearGradient id=a x1=8.042% x2=65.682% y1=0% y2=23.865%><stop offset=0% stop-color=#fff stop-opacity=0 /><stop offset=63.146% stop-color=#fff stop-opacity=.631 /><stop offset=100% stop-color=#fff /></linearGradient></defs><g fill=none fill-rule=evenodd><g transform="translate(1 1)"><path d="M26 18c0-4.418-3.582-8-8-8"id=Oval-2 stroke=url(#a) stroke-width=4><animateTransform attributeName=transform dur=0.9s from="0 18 18"repeatCount=indefinite to="360 18 18"type=rotate /></path><circle cx=26 cy=18 fill=#fff r=1><animateTransform attributeName=transform dur=0.9s from="0 18 18"repeatCount=indefinite to="360 18 18"type=rotate /></circle></g></g></svg>`;
const SVG_BCAPTIONS = `<svg class="ytp-subtitles-button-icon" height="100%" version="1.1" viewBox="0 0 36 36" width="100%" fill-opacity="1"><use class="ytp-svg-shadow" xlink:href="#ytp-id-17"></use><path d="M 11 11 C 9.89 11 9 11.9 9 13 L 9 23 C 9 24.1 9.89 25 11 25 L 25 25 C 26.1 25 27 24.1 27 23 L 27 13 C 27 11.9 26.1 11 25 11 L 11 11 Z M 17 17 C 17 17 17 18 16 18 L 13.5 18 C 13.5 18 15.5 18 15.5 16.5 L 13.5 16.5 L 13.5 19.5 L 15.5 19.5 C 15.5 18 13.5 18 13.5 18 L 16 18 C 16 18 17 18 17 19 L 17 20 C 17 20.55 16.55 21 16 21 L 13 21 C 12.45 21 12 20.55 12 20 L 12 16 C 12 15.45 12.45 15 13 15 L 16 15 C 16.55 15 17 15.45 17 16 L 17 17 L 17 17 Z M 24 17 L 22.5 17 L 22.5 16.5 L 20.5 16.5 L 20.5 19.5 L 22.5 19.5 L 22.5 19 L 24 19 L 24 20 C 24 20.55 23.55 21 23 21 L 20 21 C 19.45 21 19 20.55 19 20 L 19 16 C 19 15.45 19.45 15 20 15 L 23 15 C 23.55 15 24 15.45 24 16 L 24 17 L 24 17 Z" fill="#fff" id="ytp-id-17"></path></svg>`; // modified to say bc lol
const SVG_CAPTIONS = `<svg class="ytp-subtitles-button-icon" height="100%" version="1.1" viewBox="0 0 36 36" width="100%" fill-opacity="1"><use class="ytp-svg-shadow" xlink:href="#ytp-id-17"></use><path d="M11,11 C9.89,11 9,11.9 9,13 L9,23 C9,24.1 9.89,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 Z M17,17 L15.5,17 L15.5,16.5 L13.5,16.5 L13.5,19.5 L15.5,19.5 L15.5,19 L17,19 L17,20 C17,20.55 16.55,21 16,21 L13,21 C12.45,21 12,20.55 12,20 L12,16 C12,15.45 12.45,15 13,15 L16,15 C16.55,15 17,15.45 17,16 L17,17 L17,17 Z M24,17 L22.5,17 L22.5,16.5 L20.5,16.5 L20.5,19.5 L22.5,19.5 L22.5,19 L24,19 L24,20 C24,20.55 23.55,21 23,21 L20,21 C19.45,21 19,20.55 19,20 L19,16 C19,15.45 19.45 15 20,15 L23,15 C23.55,15 24,15.45 24,16 L24,17 L24,17 Z" fill="#fff" id="ytp-id-17"></path></svg>`;
const SVG_TRANSLATE = `<?xml version="1.0" encoding="utf-8"?><svg fill="#fff" width="800px" height="800px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><path d="M235.57178,214.21094l-56-112a4.00006,4.00006,0,0,0-7.15528,0l-22.854,45.708a92.04522,92.04522,0,0,1-55.57275-20.5752A99.707,99.707,0,0,0,123.90723,60h28.08691a4,4,0,0,0,0-8h-60V32a4,4,0,0,0-8,0V52h-60a4,4,0,0,0,0,8h91.90772a91.74207,91.74207,0,0,1-27.91895,62.03357A91.67371,91.67371,0,0,1,65.23389,86.667a4,4,0,0,0-7.542,2.668,99.63009,99.63009,0,0,0,24.30469,38.02075A91.5649,91.5649,0,0,1,23.99414,148a4,4,0,0,0,0,8,99.54451,99.54451,0,0,0,63.99951-23.22461,100.10427,100.10427,0,0,0,57.65479,22.97192L116.4165,214.21094a4,4,0,1,0,7.15528,3.57812L138.46631,188H213.522l14.89453,29.78906a4,4,0,1,0,7.15528-3.57812ZM142.46631,180l33.52783-67.05566L209.522,180Z"/></svg>`;

let TRANSLATE = null;
let ENABLED = null;
let CACHE = null;
let DOWNLOAD_SRT = null;

// Initialize API configuration
let apiConfig = null;
let transcriptionHandler = null;

// Wrap the event listener in a Promise
const getButtercupTranslate = new Promise((resolve) => {
    document.addEventListener('responseButtercupTranslate', function (e) {
        TRANSLATE = e.detail;
        console.info('[Buttercup] Translate: ', TRANSLATE);
        resolve();
    });
    // Request the value of buttercup_translate from the content script
    document.dispatchEvent(new CustomEvent('requestButtercupTranslate', {}));
});

const getButtercupEnabled = new Promise((resolve) => {
    document.addEventListener('responseButtercupEnabled', function (e) {
        ENABLED = e.detail;
        console.info('[Buttercup] Enabled: ', ENABLED);
        resolve();
    });
    // Request the value of buttercup_enabled from the content script
    document.dispatchEvent(new CustomEvent('requestButtercupEnabled', {}));
});

const getButtercupCache = new Promise((resolve) => {
    document.addEventListener('responseButtercupCache', function (e) {
        CACHE = e.detail;
        console.info('[Buttercup] Cache: ', CACHE);
        resolve();
    });
    // Request the value of buttercup_cache from the content script
    document.dispatchEvent(new CustomEvent('requestButtercupCache', {}));
});

const getButtercupDownloadSrt = new Promise((resolve) => {
    document.addEventListener('responseButtercupDownloadSrt', function (e) {
        DOWNLOAD_SRT = e.detail;
        console.info('[Buttercup] Download SRT: ', DOWNLOAD_SRT);
        resolve();
    });
    // Request the value of download_srt from the content script
    document.dispatchEvent(new CustomEvent('requestButtercupDownloadSrt', {}));
});

// Function to show error message snackbar
function showErrorSnackbar(message) {
    console.error('[Buttercup] Error:', message);
    document.dispatchEvent(new CustomEvent('buttercupShowError', {
        detail: { message: message }
    }));
}

// Get API settings
const getButtercupApiSettings = new Promise((resolve) => {
    document.addEventListener('responseButtercupApiSettings', function (e) {
        console.info('[Buttercup] API Settings received');
        
        // Initialize API configuration
        apiConfig = new APIConfig();
        
        // Initialize with settings from the response
        apiConfig.initFromSettings({
            useCobaltApiKey: e.detail.useCobaltApiKey,
            cobaltApiKey: e.detail.cobaltApiKey,
            cobaltApiBase: e.detail.cobaltApiBase,
            groqApiKey: e.detail.groqApiKey,
            groqModel: e.detail.groqModel,
            useWordTimestamps: e.detail.useWordTimestamps,
            wordsPerLine: e.detail.wordsPerLine,
            maxLineLength: e.detail.maxLineLength,
            prompt: e.detail.prompt
        });
        
        // Initialize transcription handler
        transcriptionHandler = new TranscriptionHandler(apiConfig);
        
        resolve();
    });
    // Request API settings from the content script
    document.dispatchEvent(new CustomEvent('requestButtercupApiSettings', {}));
});

async function init() {
    console.info('[Buttercup] Initializing');
    await Promise.all([
        getButtercupTranslate, 
        getButtercupEnabled, 
        getButtercupCache, 
        getButtercupDownloadSrt,
        getButtercupApiSettings
    ]);
}

document.addEventListener('buttercupSettingsChanged', async function () {
    console.info('[Buttercup] Settings changed, re-initializing settings');

    document.dispatchEvent(new CustomEvent('requestButtercupTranslate', {}));
    document.dispatchEvent(new CustomEvent('requestButtercupEnabled', {}));
    document.dispatchEvent(new CustomEvent('requestButtercupCache', {}));
    document.dispatchEvent(new CustomEvent('requestButtercupDownloadSrt', {}));
    await Promise.all([getButtercupTranslate, getButtercupEnabled, getButtercupCache, getButtercupDownloadSrt]);
});

document.addEventListener('buttercupApiSettingsChanged', async function () {
    console.info('[Buttercup] API Settings changed, re-initializing API settings');
    document.dispatchEvent(new CustomEvent('requestButtercupApiSettings', {}));
    await getButtercupApiSettings;
});

const escapeHTMLPolicy = trustedTypes.createPolicy('forceInner', {
    createHTML: (to_escape) => to_escape,
});

(async function () {
    await init();

    if (!ENABLED) {
        console.info('[Buttercup] Disabled, skipping everything');
        return;
    } else {
        // update the button all the time
        const observer = new MutationObserver(function (mutationsList, observer) {
            const button = document.getElementsByClassName(BUTTON_CLASSNAME)[0];
            if (button) {
                console.info('[Buttercup] Replacing icon');
                observer.disconnect();
                button.innerHTML = window.trustedTypes.defaultPolicy.createHTML(SVG_BCAPTIONS);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    // as soon as window['ytInitialPlayerResponse']; is available, inject captions object into it
    // check every ms
    const interval = setInterval(() => {
        if (window['ytInitialPlayerResponse']) {
            if (window['ytInitialPlayerResponse'].captions) {
                // go over every caption, if we have an asr caption (kind: asr), replace it with CAPTION_TRACK
                let captionTracks = window['ytInitialPlayerResponse'].captions.playerCaptionsTracklistRenderer.captionTracks;
                for (let i = 0; i < captionTracks.length; i++) {
                    if (captionTracks[i].kind === 'asr') {
                        console.info('[Buttercup] Found ASR caption, replacing');
                        captionTracks[i] = CAPTION_TRACK;
                    }
                }
                window['ytInitialPlayerResponse'].captions.playerCaptionsTracklistRenderer.captionTracks = captionTracks;
                console.info('[Buttercup] Initial response has captions, skipping injection');
                clearInterval(interval);
                return;
            }
            console.info('[Buttercup] No captions found, injecting');
            window['ytInitialPlayerResponse'].captions = CAPTIONS_OBJECT;
            clearInterval(interval);
        }
    }, 1);

    function overrideFetchResponsesForPlayer() {
        const originalFetch = window.fetch;
        window.fetch.magic = 'buttercup';
        window.fetch = async (input, init) => {
            const url = typeof input === 'string' ? input : input.url;
            // drop it just in case so it falls back to /v1/player
            if (url.includes('googlevideo.com/initplayback')) {
                console.info('[Buttercup] Dropping initplayback request');
                return new Response(null, { status: 204 });
            }

            if (url.includes('/youtubei/v1/player')) {
                const response = await originalFetch(input, init);
                const json = await response.json();
                // only the right response has streamingData
                if (json.streamingData === undefined) {
                    return response;
                }
                if (json.captions === undefined) {
                    json.captions = CAPTIONS_OBJECT;
                } else {
                    let captionTracks = json.captions.playerCaptionsTracklistRenderer.captionTracks;
                    for (let i = 0; i < captionTracks.length; i++) {
                        if (captionTracks[i].kind === 'asr') {
                            console.info('[Buttercup] Found ASR caption, replacing');
                            captionTracks[i] = CAPTION_TRACK;
                        }
                    }
                }
                console.info('[Buttercup] Overriding /youtubei/v1/player fetch');
                return new Response(JSON.stringify(json), ...arguments);
                // return response;
            }
            return originalFetch(input, init);
        };
    }

    overrideFetchResponsesForPlayer();
    (function (originalFetch) {
        Object.defineProperty(window, 'fetch', {
            configurable: false, // Prevent further modifications
            enumerable: true,
            get: function () {
                return originalFetch;
            },
        });
    })(window.fetch);

    // injectConfig();

    let customSubtitle = null;
    // MutationObserver to detect moving between videos
    const observer = new MutationObserver(function () {
        if (location.href !== currentURL) {
            console.info('[Buttercup] URL changed, resetting custom subtitles');
            customSubtitle = null;
            setLoading(false);
            currentURL = location.href;
        }
    });

    document.addEventListener('buttercupSettingsChanged', function () {
        console.info('[Buttercup] Settings changed, resetting custom subtitles');
        customSubtitle = null;
        setLoading(false);
    });

    document.addEventListener('buttercupApiSettingsChanged', function () {
        console.info('[Buttercup] API Settings changed, resetting custom subtitles');
        customSubtitle = null;
        setLoading(false);
    });

    let currentURL = location.href;
    observer.observe(document, { childList: true, subtree: true });

    const OriginalXMLHttpRequest = window.XMLHttpRequest;

    function CustomXMLHttpRequest() {
        const xhr = new OriginalXMLHttpRequest();
        // time to do a live brain operation on the expected response. we will later need to click the subtitle button to re-fetch the subtitles
        Object.defineProperty(xhr, 'responseText', {
            get: function () {
                if (!ENABLED) {
                    return this.response;
                }
                const isButtercup = new URL(this.responseURL).searchParams.get('buttercup') === 'true';
                // timedtext is the endpoint for all subtitles
                if ((this.responseURL.includes('/api/timedtext') || isButtercup) && isPlayer()) {
                    // therefore if url param "kind" is not equal to "asr" (automatic subtitles) return as it's probably proper subtitles
                    const urlParams = new URLSearchParams(this.responseURL);
                    if (urlParams.get('kind') !== 'asr' && !isButtercup) {
                        console.info('[Buttercup] Not automatic subtitles, passing through');
                        return this.response;
                    }
                    if (customSubtitle === null) {
                        console.info('[Buttercup] Getting custom subtitles');
                        clickSubtitleButton();
                        setLoading(true);

                        // Check if API keys are set
                        if (!apiConfig.hasAllApiKeys()) {
                            const errorMsg = apiConfig.getUseCobaltApiKey()
                                ? 'API keys not set. Please set up Cobalt and Groq API keys in the extension settings.'
                                : 'Groq API key not set. Please set up the Groq API key in the extension settings.';
                            showErrorSnackbar(errorMsg);
                            setLoading(false, true);
                            return this.response;
                        }

                        // Use cache if enabled
                        let headers = {
                            'BC-VideoID': getVideoId(),
                        };

                        if (TRANSLATE) {
                            headers['BC-Translate'] = 'true';
                            console.info('[Buttercup] Requesting translated subtitles');
                        }

                        function handleResponse(response) {
                            if (response.status === 200) {
                                console.info('[Buttercup] Using cached subtitles');
                                return response.json().then(data => {
                                    if (DOWNLOAD_SRT && data !== undefined && data.c !== undefined) {
                                        downloadJsonToSRT(JSON.parse(data.c));
                                    }
                                    customSubtitle = data.c;
                                    setLoading(false);
                                    clickSubtitleButton();
                                });
                            } else {
                                console.info('[Buttercup] Getting subtitles from API');
                                processVideoWithAPI();
                                return Promise.reject('Cache miss');
                            }
                        }

                        function handleError(error) {
                            console.error('[Buttercup] Error fetching subtitles: ', error);
                            showErrorSnackbar(`Error fetching subtitles: ${error.message || error || 'Unknown error'}`);
                            setLoading(false, true);
                            // Make sure to click the button again to reset the UI
                            setTimeout(() => {
                                clickSubtitleButton();
                            }, 100);
                        }

                        // Process video with Cobalt and Groq APIs
                        function processVideoWithAPI() {
                            const videoId = getVideoId();
                            
                            transcriptionHandler.processVideo(
                                videoId,
                                TRANSLATE,
                                // Progress callback
                                (message) => {
                                    console.info(`[Buttercup] ${message}`);
                                },
                                // Success callback
                                (youtubeFormat) => {
                                    console.info('[Buttercup] Transcription successful');
                                    customSubtitle = JSON.stringify(youtubeFormat);
                                    
                                    // Cache subtitles if enabled
                                    if (CACHE) {
                                        fetch('https://buttercup.igerman.cc/', {
                                            method: 'POST',
                                            headers: headers,
                                            body: JSON.stringify({
                                                id: videoId,
                                                captions: customSubtitle,
                                            }),
                                        })
                                        .then(response => {
                                            if (response.status === 200) {
                                                console.info('[Buttercup] Subtitles cached');
                                            } else {
                                                console.error('[Buttercup] Error caching subtitles: ', response.status);
                                            }
                                        })
                                        .catch(error => {
                                            console.error('[Buttercup] Error caching subtitles: ', error);
                                        });
                                    }
                                    
                                    // Generate SRT if needed
                                    if (DOWNLOAD_SRT) {
                                        transcriptionHandler.generateSRT(
                                            youtubeFormat,
                                            document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.srt'
                                        );
                                    }
                                    
                                    setLoading(false);
                                    clickSubtitleButton();
                                },
                                // Error callback
                                (error) => {
                                    console.error('[Buttercup] Transcription error: ', error);
                                    showErrorSnackbar(`Transcription error: ${error.message || 'Unknown error'}`);
                                    setLoading(false, true);
                                    // Make sure to click the button again to reset the UI
                                    setTimeout(() => {
                                        clickSubtitleButton();
                                    }, 100);
                                }
                            );
                        }

                        // Fetch subtitles from cache if available
                        if (CACHE) {
                            fetch('https://buttercup.igerman.cc/', {
                                headers: headers,
                            })
                                .then(handleResponse)
                                .catch(error => {
                                    // Only show error if it's not a cache miss
                                    if (error !== 'Cache miss') {
                                        handleError(error);
                                    }
                                });
                        } else {
                            // If user opted out of cache, proceed directly to API
                            console.info('[Buttercup] Opted out of cache, not fetching subtitles from cache');
                            processVideoWithAPI();
                        }
                    }
                    return customSubtitle;
                }
                return this.response;
            },
        });

        return xhr;
    }
    // lobotomize and plant gay thoughts to xmlhttprequest
    window.XMLHttpRequest = CustomXMLHttpRequest;

    function downloadJsonToSRT(jsonSubtitles) {
        console.info('[Buttercup] Downloading SRT');
        if (jsonSubtitles.c !== undefined) {
            jsonSubtitles = jsonSubtitles.c;
        }
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

        srtContent = srtContent.trim();

        const blob = new Blob([srtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.srt';
        a.click();
        URL.revokeObjectURL(url);
    
        return srtContent;
    }

    function clickSubtitleButton() {
        const button = document.getElementsByClassName(BUTTON_CLASSNAME)[0];
        if (button) {
            console.info('[Buttercup] Clicking subtitle button');
            button.click();
        } else {
            console.error('[Buttercup] Could not find caption button element');
        }
    }

    function setLoading(isLoading, error) {
        const element = document.getElementsByClassName(BUTTON_CLASSNAME)[0];
        if (!element) {
            console.error('[Buttercup] Could not find caption button element');
            return;
        }
        
        if (error) {
            element.disabled = false;
            element.innerHTML = window.trustedTypes.defaultPolicy.createHTML(SVG_BCAPTIONS);
        } else {
            element.disabled = isLoading;
            element.innerHTML = window.trustedTypes.defaultPolicy.createHTML(isLoading ? SVG_LOADER : SVG_BCAPTIONS);
        }
        
        console.info(`[Buttercup] Set loading state: ${isLoading}, error: ${!!error}`);
    }

    function getVideoId() {
        const urlObject = new URL(window.location.href);
        const pathname = urlObject.pathname;
        if (pathname.startsWith('/clip')) {
            return document.querySelector("meta[itemprop='videoId']").content;
        } else {
            if (pathname.startsWith('/shorts')) {
                return pathname.slice(8);
            }
            return urlObject.searchParams.get('v');
        }
    }

    // need to tell if we're in the player or not
    function isPlayer() {
        return document.location.pathname === '/watch'; //todo: better way to do this, otherwise the stupid miniplayer requests subtitles
    }
})();
