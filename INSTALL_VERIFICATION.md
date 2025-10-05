# Installation Verification Checklist

Use this checklist to verify that SPTween has been installed correctly.

## Extension Installation ✓

### Step 1: Load Extension
- [ ] Cloned repository
- [ ] Opened `chrome://extensions/`
- [ ] Enabled Developer mode
- [ ] Clicked "Load unpacked"
- [ ] Selected SuperTween folder
- [ ] Extension appears in list
- [ ] No errors shown in extension card

### Step 2: Extension Icon
- [ ] SPTween icon visible in Chrome toolbar
- [ ] Clicking icon shows "Abrir SPTween" tooltip
- [ ] Icon is purple/blue gradient with "S"

### Step 3: Side Panel
- [ ] Navigate to any webpage
- [ ] Press Alt+S
- [ ] Side panel opens on right side
- [ ] OR click extension icon
- [ ] Panel shows "SPTween" header
- [ ] 4 tabs visible: Gráficos, Chuletas, Dashboard, Comparador

### Step 4: UI Verification
- [ ] Dark theme applied
- [ ] Tabs switch correctly
- [ ] Buttons are clickable
- [ ] Text is readable
- [ ] No console errors (F12)

## Feature Testing ✓

### Gráficos Tab
- [ ] "Guardar Preset Actual" button visible
- [ ] "Importar JSON" button visible
- [ ] Empty state shows "No hay presets guardados"
- [ ] Clicking save button opens modal
- [ ] Modal has input field and buttons

### Chuletas Tab
- [ ] Preset selector visible
- [ ] Markdown textarea visible
- [ ] "Guardar" button visible
- [ ] "Preview" button visible

### Dashboard Tab
- [ ] "Activar Dashboard Personalizado" toggle visible
- [ ] Ticker input field visible
- [ ] "Añadir" button visible
- [ ] "Activar colores por métrica" toggle visible

### Comparador Tab
- [ ] Metric selector visible
- [ ] Ticker input field visible
- [ ] "Comparar" button visible

## Storage Testing ✓

### Create Preset
1. [ ] Click "Guardar Preset Actual"
2. [ ] Enter name: "Test Preset"
3. [ ] Click "Guardar"
4. [ ] Alert shows success
5. [ ] Preset appears in list
6. [ ] Preset has name, ticker, and buttons

### Test Persistence
1. [ ] Close side panel (Alt+S)
2. [ ] Reopen side panel (Alt+S)
3. [ ] Go to Gráficos tab
4. [ ] Preset still visible
5. [ ] Click on preset buttons
6. [ ] All buttons work

### Export/Import
1. [ ] Click "Exportar" on a preset
2. [ ] JSON file downloads
3. [ ] Click "Importar JSON"
4. [ ] Select downloaded file
5. [ ] Preset imports successfully

## Server Testing (Optional) ✓

### Installation
- [ ] Navigated to `server/` directory
- [ ] Ran `npm install`
- [ ] No errors during installation
- [ ] Created `.env` file from `.env.example`
- [ ] Added Stripe test keys

### Server Start
- [ ] Ran `npm start`
- [ ] Server starts on port 3000
- [ ] No errors in console
- [ ] Message shows "SPTween server running"

### Landing Page
- [ ] Opened `http://localhost:3000`
- [ ] Page loads successfully
- [ ] "SPTween" header visible
- [ ] Feature cards visible (6 cards)
- [ ] "Desbloquea SPTween PRO" section visible
- [ ] Price shows "€19.00"
- [ ] Email input field visible
- [ ] "Comprar Ahora" button visible

### Payment Flow (Test Mode)
- [ ] Entered test email: `test@example.com`
- [ ] Clicked "Comprar Ahora"
- [ ] Redirected to Stripe Checkout
- [ ] Entered card: `4242 4242 4242 4242`
- [ ] Entered expiry: `12/34`
- [ ] Entered CVC: `123`
- [ ] Completed payment
- [ ] Redirected to success page
- [ ] Success message visible

## Tweenvest Integration ✓

### On Tweenvest Site
- [ ] Visited `https://app.tweenvest.com/`
- [ ] Site loads normally
- [ ] Pressed Alt+S
- [ ] Side panel opens
- [ ] Extension icon shows in toolbar
- [ ] No console errors (F12)

### Chart Interaction (Requires Real Data)
- [ ] Navigate to a stock chart
- [ ] Try to save preset
- [ ] Verify chart state is captured
- [ ] Try to apply preset
- [ ] Verify chart updates

### Dashboard (Requires Home Page)
- [ ] Enable custom dashboard
- [ ] Add tickers: AAPL, MSFT, GOOGL
- [ ] Navigate to Tweenvest home
- [ ] Custom dashboard appears
- [ ] Tickers shown as cards

## Troubleshooting ✓

### Extension Not Loading
- Check: Developer mode enabled
- Check: Correct folder selected
- Check: manifest.json in root
- Solution: Reload extension page

### Side Panel Not Opening
- Check: On Tweenvest domain
- Check: Alt+S pressed correctly
- Solution: Try clicking icon instead

### Presets Not Saving
- Check: Console for errors (F12)
- Check: Storage permissions granted
- Solution: Disable/enable extension

### Server Won't Start
- Check: Node.js installed (`node --version`)
- Check: Port 3000 not in use
- Check: npm dependencies installed
- Solution: Run `npm install` again

## Success Criteria ✓

All of the following should be true:

- [x] Extension loads without errors
- [x] Side panel opens and displays correctly
- [x] All 4 tabs are accessible
- [x] Dark theme is applied
- [x] Buttons are clickable
- [x] Storage works (presets persist)
- [x] No console errors in normal operation
- [x] Server starts successfully (if testing)
- [x] Landing page loads (if testing)
- [x] Payment flow works in test mode (if testing)

## Final Verification

✅ **All checks passed**: Extension is ready to use!

⚠️ **Some checks failed**: Review troubleshooting section

---

## Quick Links

- [README](README.md) - Project overview
- [INSTALL Guide](docs/INSTALL.md) - Detailed installation
- [Stripe Guide](docs/stripe.md) - Payment setup
- [Contributing](CONTRIBUTING.md) - How to contribute

---

**Last Updated**: 2024-10-05

**Version**: 0.1.0
