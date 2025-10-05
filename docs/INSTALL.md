# Installation Guide — SPTween

## Chrome Extension Installation

### Method 1: Load Unpacked (Development)

1. **Download/Clone the repository**
   ```bash
   git clone https://github.com/hugomenz/SuperTween.git
   cd SuperTween
   ```

2. **Open Chrome Extensions page**
   - Open Chrome browser
   - Navigate to `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the **Developer mode** switch in the top-right corner

4. **Load the extension**
   - Click **Load unpacked** button
   - Select the `SuperTween` folder (where `manifest.json` is located)

5. **Verify installation**
   - You should see "SPTween — Tweenvest Tools" in your extensions list
   - The SPTween icon will appear in your Chrome toolbar

6. **Pin the extension (optional)**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "SPTween" and click the pin icon
   - Now the SPTween icon will always be visible

### Method 2: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store in the future.

## Using the Extension

### First Use

1. **Visit Tweenvest**
   - Go to https://app.tweenvest.com/
   - Navigate to any stock chart

2. **Open Side Panel**
   - Click the SPTween icon in toolbar, OR
   - Press **Alt+S** keyboard shortcut

3. **Explore the tabs**
   - **Gráficos**: Save and apply chart presets
   - **Chuletas**: Add notes to your charts
   - **Dashboard**: Customize your stock dashboard
   - **Comparador**: Compare metrics across stocks

### Saving Your First Preset

1. Configure a chart on Tweenvest with your preferred settings
2. Open SPTween side panel (Alt+S)
3. Go to "Gráficos" tab
4. Click "💾 Guardar Preset Actual"
5. Enter a name for your preset
6. Click "Guardar"

### Applying a Preset

1. Navigate to any stock on Tweenvest
2. Open SPTween side panel
3. Go to "Gráficos" tab
4. Find your preset in the list
5. Click "✓ Aplicar"

### Custom Dashboard

1. Open side panel → "Dashboard" tab
2. Check "Activar Dashboard Personalizado"
3. Add tickers (e.g., AAPL, MSFT, GOOGL)
4. Visit Tweenvest home page to see your custom dashboard

## Payment Server Installation (Optional)

Only needed if you want to test the PRO payment functionality.

### Prerequisites

- Node.js 18 or higher
- Stripe account (test mode)

### Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file**
   - Add your Stripe test keys
   - Get keys from: https://dashboard.stripe.com/test/apikeys
   ```env
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open landing page**
   - Visit http://localhost:3000
   - Test payment with card: `4242 4242 4242 4242`

## Troubleshooting

### Extension doesn't appear

- Make sure Developer mode is enabled
- Refresh the extensions page
- Check for errors in the extension card

### Side panel doesn't open

- Make sure you're on a Tweenvest page (`app.tweenvest.com`)
- Try clicking the extension icon instead of Alt+S
- Check Chrome console for errors (F12)

### Presets not saving

- Check browser console for errors
- Try disabling then re-enabling the extension
- Clear chrome.storage: Go to extensions → SPTween → Details → Site permissions

### Payment server issues

- Make sure Node.js is installed: `node --version`
- Check that port 3000 is not in use
- Verify .env file has correct Stripe keys
- Check server console for error messages

## Permissions Explained

SPTween requests these permissions:

- **storage**: To save your presets and settings
- **sidePanel**: To display the side panel interface
- **activeTab**: To read/modify Tweenvest pages
- **scripting**: To inject custom functionality

Host permissions:
- **app.tweenvest.com**: To interact with Tweenvest

The extension does NOT:
- Access other websites
- Send data to third parties
- Track your browsing

## Updating

### Manual Update

1. Pull latest changes:
   ```bash
   cd SuperTween
   git pull
   ```

2. Reload extension:
   - Go to `chrome://extensions/`
   - Find SPTween
   - Click the refresh icon

## Uninstalling

### Remove Extension

1. Go to `chrome://extensions/`
2. Find SPTween
3. Click **Remove**
4. Confirm removal

Your saved presets and settings will be deleted from Chrome storage.

### Remove Payment Server

```bash
cd server
rm -rf node_modules
cd ..
rm -rf server
```

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Open an issue on GitHub: https://github.com/hugomenz/SuperTween/issues
3. Include:
   - Chrome version
   - Extension version
   - Error messages (if any)
   - Steps to reproduce

## Next Steps

- Read the [README](../README.md) for feature overview
- Check [docs/stripe.md](stripe.md) for payment integration
- Explore the code to customize the extension
- Share feedback and feature requests!
