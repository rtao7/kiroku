# Kiroku - Save Links for Later

A complete link-saving solution with a Chrome extension and web application. Save links you can't read now for later and keep your tabs clean.

## Project Structure

This repository contains two main components:
- **Chrome Extension** - Browser extension for quick link saving
- **Web Application** (`kiroku-web/`) - Next.js web app with cloud sync and cross-device access

## Features

### Chrome Extension
- Save URLs manually by entering them
- Save the current page with one click
- View all saved links in a clean interface
- Delete individual links or clear all
- Local storage with Chrome sync
- Optional cloud sync with web app (via API key)
- Click saved links to open them in new tabs

### Web Application
- Google OAuth authentication
- Cloud storage with MongoDB
- Cross-device synchronization
- Search and filter saved links
- Mark links as favorites
- Automatic metadata extraction (title, description)
- RESTful API for extension integration
- Responsive design with dark mode support

## Quick Start

### Chrome Extension (Standalone)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this folder
4. The extension will appear in your Chrome toolbar

### Web Application Setup

See [kiroku-web/README.md](kiroku-web/README.md) for detailed setup instructions.

Quick setup:
```bash
cd kiroku-web
npm install
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and Google OAuth credentials
npm run dev
```

## Usage

### Basic Usage (Extension Only)

1. Click the extension icon in your Chrome toolbar
2. To save a link:
   - Enter a URL manually and click "Save Link"
   - Or click "Save Current Page" to save the page you're currently viewing
3. View all your saved links in the popup
4. Click any saved link to open it in a new tab
5. Use the "Delete" button to remove individual links
6. Use "Clear All" to remove all saved links

### Cloud Sync Setup

1. Set up and run the web application (see Web Application Setup above)
2. Sign in to the web app at `http://localhost:3000`
3. Go to Settings and generate an API key
4. In the Chrome extension, click the settings icon (⚙️)
5. Paste your API key and click "Save API Key"
6. Click "Sync Now" to synchronize your links
7. Your links will now sync automatically between the extension and web app

## File Structure

- `manifest.json` - Extension configuration
- `index.html` - Popup interface
- `index.js` - Extension functionality
- `index.css` - Styling
- `icons/` - Extension icons (you'll need to create PNG versions)

## Creating Icons

The extension needs PNG icons in these sizes:
- 16x16 pixels (icon16.png)
- 48x48 pixels (icon48.png) 
- 128x128 pixels (icon128.png)

You can use the provided `icon.svg` as a template and convert it to PNG format using any image editor or online converter.

## Permissions

- `storage` - To save links persistently
- `activeTab` - To get the current page URL