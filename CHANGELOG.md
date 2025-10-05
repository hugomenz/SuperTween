# Changelog

All notable changes to SPTween will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-10-05

### Added - MVP Release 🎉

#### Extension Core
- Chrome Extension Manifest V3 implementation
- Service Worker (background.js) with side panel management
- Content script (content.js) for Tweenvest DOM interaction
- Side panel UI with 4 tabs (Gráficos, Chuletas, Dashboard, Comparador)
- Dark theme UI with CSS variables
- Keyboard shortcut (Alt+S) to toggle side panel
- Chrome storage implementation with sync/local fallback

#### Chart Presets
- Save chart configurations (timeframe, indicators, overlays)
- Apply presets to any ticker
- Duplicate existing presets
- Export presets as JSON files
- Import presets from JSON files
- Preset list with cards UI
- Empty states for new users
- Modal for preset naming

#### Notes & Cheatsheets
- Markdown editor for notes
- Live preview with HTML rendering
- Notes associated with presets
- Persistent storage of notes
- Support for headers, lists, bold, italic, code

#### Custom Dashboard
- User-selectable tickers
- Safe DOM injection
- Toggle on/off functionality
- Dynamic ticker cards with gradients
- Add/remove tickers with UI controls

#### Metric Colors
- Custom color mapping for metrics
- Color picker integration
- Global toggle for metric highlighting
- Support for multiple metrics
- Accessible color palette

#### Comparator
- Basic structure for metric comparison
- Metric selection dropdown
- Multi-ticker input
- UI ready for chart integration

#### Payment Integration (Stripe)
- Express server with Stripe SDK v16
- Checkout session creation endpoint
- Webhook handler for payment events
- License generation with SHA-256
- License validation API endpoint
- Landing page with payment form
- Success and cancel pages
- Test mode configuration

#### Documentation
- Comprehensive README with quick start
- Complete Stripe integration guide (docs/stripe.md)
- Detailed installation instructions (docs/INSTALL.md)
- Contributing guidelines (CONTRIBUTING.md)
- Project summary with stats (PROJECT_SUMMARY.md)
- MIT License
- .gitignore configuration

#### Assets
- Extension icons (16x16, 48x48, 128x128 PNG)
- SVG icon source
- Landing page styling

### Technical Details
- **Lines of Code**: ~1,274 (main files)
- **File Count**: 26 files
- **Dependencies**: 0 (frontend), 4 (backend)
- **Size**: ~30KB (extension, uncompressed)
- **Permissions**: storage, sidePanel, activeTab, scripting
- **Host Permissions**: *.tweenvest.com

### Security
- Minimal permissions model
- Host restrictions (Tweenvest only)
- No eval() or unsafe code
- HTML/Markdown sanitization
- Webhook signature verification
- Server-side license validation

### Known Limitations
- Requires manual testing on real Tweenvest site
- Database integration not included (licenses logged to console)
- Email service not implemented (for license delivery)
- Comparator charts not rendered (structure only)
- Drag & drop not implemented for dashboard reordering

## [Unreleased]

### Planned for v0.2
- Database integration for license storage (PostgreSQL/MongoDB)
- Email service for license delivery (SendGrid/Mailgun)
- License activation UI in extension
- Real chart rendering in comparator with Chart.js
- Drag & drop for dashboard ticker reordering
- Conditional color rules with thresholds
- Preset search and filter functionality
- Improved chart state detection

### Planned for v0.3
- Cloud backup and sync
- Strategy profiles
- Community preset templates
- Visual rule editor for color conditions
- Multi-language support (English, Spanish)
- Dark/light theme toggle
- Export all settings to JSON

### Planned for v1.0
- Cross-browser support (Firefox, Edge)
- AI-powered insights and recommendations
- Social features (share presets)
- Public API for third-party integration
- Mobile companion app
- Advanced analytics dashboard

---

## Version History

- **v0.1.0** (2024-10-05) - Initial MVP release
  - All core features implemented
  - Stripe payment integration
  - Complete documentation
  - Ready for testing

---

## Support

For bug reports and feature requests, please open an issue on GitHub:
https://github.com/hugomenz/SuperTween/issues

For questions and discussions, check the documentation or open a discussion.

---

*This changelog follows [Keep a Changelog](https://keepachangelog.com/) format.*
