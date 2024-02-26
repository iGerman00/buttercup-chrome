# Buttercup - Better YouTube Captions

<p align="center">
  <img src="icons/icon128.png" alt="creepiest icon known to man"/>
</p>

A Chrome(ium) extension to enhance your YouTube caption experience. Say goodbye to those horrible auto-generated captions. 
Powered by [whisper-jax](https://github.com/sanchit-gandhi/whisper-jax), thanks to the API provided by [Sanchit Gandhi](https://github.com/sanchit-gandhi).

## Features

- **Whisper-Generated Captions:** Leverages Whisper AI tech for decent captions.
- **Automatic Replacement:** Replaces YouTube's default auto-captions with Buttercup, not affecting videos with existing real captions. Real captions always take priority over automatically generated ones.
- **Caching System:** Utilizes a [caching database](https://buttercup.igerman.cc) to store video IDs and generated captions for enhanced performance and to avoid hammering the Whisper API.
- **Translation:** Seamlessly translate all speech to English. An option and a separated database for English-translated captions are available. 

## Installation

1. **Enable Developer Mode** in Chrome Extensions.
2. **[Download](https://github.com/iGerman00/buttercup-chrome/archive/refs/heads/main.zip)** this repository and unpack the ZIP file to a safe location.
3. **Load the unpacked extension** in Chrome(ium) through the Extensions (`chrome://extensions`) menu.

## Privacy and Data Usage

Buttercup has no need to spy on you, however:
- The caching database **does not allow opting out** currently.
- **IP addresses** are stored briefly for rate limiting and are **not linked** to captions or video IDs.
- The **database source code** is not yet available.

## Getting Started

After installation, simply navigate to any YouTube video and play it. 
Upon clicking the captions button, the icon of which will be replaced with `BC`, Buttercup will automatically replace YouTube's captions with the enhanced ones, unless real captions are available. No additional steps or configurations are needed.

## Translation

When you enable translation after clicking the extension's icon, all requests will only interact with the English part of the database, so you will have a different set of cached captions, and your generated captions will be stored in the database with a flag.
The Whisper api will translate all speech to English as best it can.
Only English can be supported, no other translation languages will be supported.

## Support & Feedback

Encountered an issue? Have suggestions? Feel free to open an issue on this GitHub repository. I'm always looking to improve Buttercup and appreciate your feedback.
