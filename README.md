# SPTween — Chrome Extension for Tweenvest

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**SPTween** is a Chrome extension (Manifest V3) that enhances your Tweenvest experience with powerful features:

- 📊 **Chart Presets**: Save and apply chart configurations with 1 click
- 📝 **Notes/Cheatsheets**: Markdown notes for each chart
- 🎯 **Custom Dashboard**: Choose which stocks appear on your dashboard
- 🎨 **Metric Colors**: Highlight important metrics with custom colors
- 📈 **Metric Comparator**: Compare metrics across multiple tickers
- ⌨️ **Keyboard Shortcuts**: Quick access with Alt+S

## Installation

### Manual Installation (Development)

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked** and select the repository folder
5. The SPTween icon should appear in your extensions toolbar

## Quick Start

1. Install the extension
2. Visit https://app.tweenvest.com/
3. Press **Alt+S** to open the side panel
4. Start saving presets and customizing your dashboard!

## Features

### 📊 Chart Presets
Save chart configurations and apply them to any stock with one click.

### 📝 Notes & Cheatsheets
Add Markdown-formatted notes to your presets.

### 🎯 Custom Dashboard
Replace the default stock grid with your own selection.

### 🎨 Metric Colors
Highlight specific metrics with custom colors.

### 📈 Comparator
Compare metrics across multiple stocks.

## Documentation

- Full documentation: [docs/README_FULL.md](docs/README_FULL.md)
- Stripe integration: [docs/stripe.md](docs/stripe.md)
- Architecture guide: See main documentation

## Development

```bash
# Load extension in Chrome
chrome://extensions → Developer mode → Load unpacked

# Start payment server (optional)
cd server
npm install
cp .env.example .env
npm start
```

## License

MIT
