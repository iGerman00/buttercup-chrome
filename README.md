# [<img src="icons/icon48.png" alt='Buttercup' height="22">](//buttercup.igerman.cc) Buttercup  - Better YouTube Captions

<img src="icons/icon128.png" alt="Buttercup" height="128" align="right"/>

> A Chromium extension to enhance your YouTube caption experience.  
> Say goodbye to those horrible auto-generated captions.  
> Powered by [Groq API](https://groq.com/) for transcription  
> Powered by [Cobalt API](https://github.com/imputnet/cobalt) for audio extraction.

<br>
<p align="center">
  <img src="https://github.com/user-attachments/assets/c27529cb-5f45-40ef-8ad3-8a1b8aca6e33" alt="screenshot of extension UI"/>
  <div align="center">	
  
[![Badge indicating count of captions cached](https://img.shields.io/badge/dynamic/json?url=https://buttercup.igerman.cc/api/status&query=%24.count&style=for-the-badge&label=Captions%20cached&color=%23ff5d5b)](https://buttercup.igerman.cc)
    
  </div>
  <div align="center">	
  
[<img src="https://cdn.prod.website-files.com/5c14e387dab576fe667689cf/670f5a0171bfb928b21a7e00_support_me_on_kofi_beige-p-500.png" alt='Donate on Ko-Fi' height="48">](//ko-fi.com/vizzy)
    
  </div>
</p>
<!-- ![image](https://github.com/user-attachments/assets/c27529cb-5f45-40ef-8ad3-8a1b8aca6e33) -->

## Features

- **Whisper-Generated Captions:** Leverages OpenAI's Whisper AI tech through Groq API for high-quality captions.
- **Automatic Replacement:** Replaces YouTube's default auto-captions with Buttercup, not affecting videos with existing real captions. Real captions always take priority over automatically generated ones.
- **Caching System:** Utilizes an optional [caching database](https://buttercup.igerman.cc) to store video IDs and generated captions for enhanced performance.
- **Translation:** Seamlessly translate all speech to English (only available with the whisper-large-v3 model).
- **Word-Level Timestamps:** Uses word-level timestamps with a configurable sliding window to create better-formatted subtitles with precise timing.
- **Download:** Quickly download the generated subtitles as an `.srt` file for further use.
- **Multiple Models:** Choose between different Whisper models for different speed/quality tradeoffs.
- **Flexible API Setup:** Configure your own API keys for Cobalt and Groq.
- **Model Prompting:** Guide the model's style or specify how to spell unfamiliar words with customizable prompts.

## Installation

1. **Enable Developer Mode** in Chrome Extensions.
2. **[Download](https://github.com/iGerman00/buttercup-chrome/archive/refs/heads/main.zip)** this repository and unpack the ZIP file to a safe location.
3. **Load the unpacked extension** in Chrome(ium) through the Extensions (`chrome://extensions`) menu.
4. **Set up API keys** by clicking on the extension icon and going to the API Setup tab.

## API Setup

Buttercup requires API keys to function:

1. **Groq API Key (Required):** Sign up at [Groq](https://console.groq.com/) to get your API key. It's free!
2. **Cobalt API Key (Optional):** Some Cobalt instances may require an API key. You can also use a different Cobalt API base URL if needed.

## Model Selection

Buttercup supports different Whisper models through the Groq API:

- **whisper-large-v3:** Best quality, supports multilingual transcription and translation to English.
- **whisper-large-v3-turbo:** Faster processing, supports multilingual transcription but no translation.
- **distil-whisper-large-v3-en:** Fastest processing, English-only transcription, no translation.

## Privacy and Data Usage

Buttercup has no need to spy on you, however:
- You can opt out of using the cache database in the extension settings.
- The **cache database source code** is available [here](https://gist.github.com/iGerman00/0e21d4b957f1a4917f5bbb817136b83a).
- Your API keys are stored locally in your browser and are only sent to the respective API services.

## Getting Started

After installation and API setup, simply navigate to any YouTube video and play it. 
Upon clicking the captions button, the icon of which will be replaced with `BC`, Buttercup will automatically replace YouTube's captions with the enhanced ones, unless real captions are available.

## Translation

When you enable translation after clicking the extension's icon, Buttercup will translate all speech to English. Note that translation is only available with the whisper-large-v3 model. If you select a different model, the translation option will be disabled.

## Advanced Features

### Word-Level Timestamps
Buttercup uses word-level timestamps to create better-formatted subtitles. This feature:
- Provides more precise timing for each word
- Uses a sliding window to combine words into readable lines
- Is fully configurable - adjust words per line and maximum line length
- Can be disabled to fall back to segment-level timestamps

### Model Prompting
You can guide the model's transcription style or help it with unfamiliar words:
- Enter a prompt (up to 896 characters) to influence how the model transcribes
- Useful for technical content, names, or specific terminology
- Helps maintain consistent style across transcriptions

## Support & Feedback

Encountered an issue? Have suggestions? Feel free to open an issue or a pull request on this GitHub repository. I'm always looking to improve Buttercup and appreciate your feedback.

## Credits

- [Groq](https://groq.com/) for providing the API for Whisper models
- [Cobalt](https://github.com/imputnet/cobalt) for the audio extraction API
- [DualSubs](https://github.com/DualSubs) project and [Virgil Clyne](https://github.com/VirgilClyne) specifically for some help on overriding the responses for YouTube's captions API
- [Cloudflare](https://cloudflare.com/) for providing the free and easy-to-use serverless architecture and KV database API for the cache database service
