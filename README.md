# Kiroku Chrome Extension

A Chrome extension that saves URLs for later reading. Keep your tabs clean by saving links you want to read later.

## Features

- Save URLs manually by entering them
- Save the current page with one click
- View all saved links in a clean interface
- Delete individual links or clear all
- Links are synced across Chrome browsers
- Click saved links to open them in new tabs

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this folder
4. The extension will appear in your Chrome toolbar

## Usage

1. Click the extension icon in your Chrome toolbar
2. To save a link:
   - Enter a URL manually and click "Save Link"
   - Or click "Save Current Page" to save the page you're currently viewing
3. View all your saved links in the popup
4. Click any saved link to open it in a new tab
5. Use the "Delete" button to remove individual links
6. Use "Clear All" to remove all saved links

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