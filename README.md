# Buttercup - Better YouTube Captions

<p align="center">
  <img src="icons/icon128.png" alt="cute icon but ai generated very unfortunate"/>
</p>

A Chrome(ium) extension to enhance your YouTube caption experience. Say goodbye to those horrible auto-generated captions. 
Powered by [Groq API](https://groq.com/) for transcription and [Cobalt API](https://github.com/wukko/cobalt) for audio extraction.

## Features

- **Whisper-Generated Captions:** Leverages OpenAI's Whisper AI tech through Groq API for high-quality captions.
- **Automatic Replacement:** Replaces YouTube's default auto-captions with Buttercup, not affecting videos with existing real captions. Real captions always take priority over automatically generated ones.
- **Caching System:** Utilizes an optional [caching database](https://buttercup.igerman.cc) to store video IDs and generated captions for enhanced performance.
- **Translation:** Seamlessly translate all speech to English (only available with the whisper-large-v3 model).
- **Download:** Quickly download the generated subtitles as an `.srt` file for further use.
- **Multiple Models:** Choose between different Whisper models for different speed/quality tradeoffs.
- **Flexible API Setup:** Configure your own API keys for Cobalt and Groq.

## Installation

1. **Enable Developer Mode** in Chrome Extensions.
2. **[Download](https://github.com/iGerman00/buttercup-chrome/archive/refs/heads/main.zip)** this repository and unpack the ZIP file to a safe location.
3. **Load the unpacked extension** in Chrome(ium) through the Extensions (`chrome://extensions`) menu.
4. **Set up API keys** by clicking on the extension icon and going to the API Setup tab.

## API Setup

Buttercup requires API keys to function:

1. **Groq API Key (Required):** Sign up at [Groq](https://console.groq.com/) to get your API key.
2. **Cobalt API Key (Optional):** Some Cobalt instances may require an API key. You can also use a different Cobalt API base URL if needed.

## Model Selection

Buttercup supports different Whisper models through the Groq API:

- **whisper-large-v3:** Best quality, supports multilingual transcription and translation to English.
- **whisper-large-v3-turbo:** Faster processing, supports multilingual transcription but no translation.
- **distil-whisper-large-v3-en:** Fastest processing, English-only transcription, no translation.

## Privacy and Data Usage

Buttercup has no need to spy on you, however:
- You can opt out of using the cache database in the extension settings.
- **IP addresses** are stored briefly for rate limiting and are **not linked** to captions or video IDs.
- The **cache database source code** is available [here](https://gist.github.com/iGerman00/0e21d4b957f1a4917f5bbb817136b83a).
- Your API keys are stored locally in your browser and are only sent to the respective API services.

## Getting Started

After installation and API setup, simply navigate to any YouTube video and play it. 
Upon clicking the captions button, the icon of which will be replaced with `BC`, Buttercup will automatically replace YouTube's captions with the enhanced ones, unless real captions are available.

## Translation

When you enable translation after clicking the extension's icon, Buttercup will translate all speech to English. Note that translation is only available with the whisper-large-v3 model. If you select a different model, the translation option will be disabled.

## Support & Feedback

Encountered an issue? Have suggestions? Feel free to open an issue or a pull request on this GitHub repository. I'm always looking to improve Buttercup and appreciate your feedback.

## Credits

- [Groq](https://groq.com/) for providing the API for Whisper models
- [Cobalt](https://github.com/imputnet/cobalt) for the audio extraction API
- [DualSubs](https://github.com/DualSubs) project and [Virgil Clyne](https://github.com/VirgilClyne) specifically for some help on overriding the responses for YouTube's captions API
- [Cloudflare](https://cloudflare.com/) for providing the free and easy-to-use serverless architecture and KV database API for the cache database service