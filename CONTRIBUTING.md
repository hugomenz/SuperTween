# Contributing to SPTween

Thank you for your interest in contributing to SPTween! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to make SPTween better.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/hugomenz/SuperTween/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Chrome version and OS
   - Screenshots if applicable

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its use case
3. Explain why it would be valuable
4. Consider implementation complexity

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

### Prerequisites

- Chrome/Chromium browser
- Node.js 18+ (for payment server)
- Git
- Code editor (VS Code recommended)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/SuperTween.git
cd SuperTween

# Load extension in Chrome
# Go to chrome://extensions → Enable Developer mode → Load unpacked

# For payment server (optional)
cd server
npm install
cp .env.example .env
# Edit .env with your Stripe test keys
npm start
```

### Project Structure

```
SuperTween/
├── manifest.json          # Extension manifest (MV3)
├── background.js          # Service worker
├── content.js             # Content script (DOM interaction)
├── content.css            # Injected styles
├── sidepanel/             # Side panel UI
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── icons/                 # Extension icons
├── server/                # Stripe payment server
│   ├── server.js
│   ├── package.json
│   └── public/
└── docs/                  # Documentation
```

## Coding Guidelines

### JavaScript Style

- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code style

**Example:**
```javascript
// Good
const presetName = document.getElementById('preset-name-input').value;
if (!presetName.trim()) {
  alert('Please enter a preset name');
  return;
}

// Avoid
var n = document.getElementById('preset-name-input').value;
if (!n.trim()) alert('Please enter a preset name');
```

### HTML/CSS Style

- Use semantic HTML5 elements
- Keep CSS organized and modular
- Use CSS variables for theming
- Maintain mobile responsiveness
- Follow BEM naming where appropriate

### Commit Messages

Use clear, descriptive commit messages:

```
Good:
✅ Add export functionality for presets
✅ Fix dashboard ticker removal bug
✅ Update README with installation steps

Avoid:
❌ fix bug
❌ update
❌ changes
```

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Extension loads without errors
- [ ] Side panel opens (Alt+S and icon click)
- [ ] Preset save/load/apply works
- [ ] Dashboard customization works
- [ ] Notes save and display correctly
- [ ] Metric colors apply correctly
- [ ] No console errors
- [ ] Works on Tweenvest site

### Test on Multiple Scenarios

- Fresh installation
- Extension reload
- Page navigation
- Multiple tabs

## Areas for Contribution

### High Priority

- [ ] Improve chart state detection for Tweenvest
- [ ] Add drag-and-drop for dashboard reordering
- [ ] Implement license activation UI
- [ ] Add database for license storage
- [ ] Improve error handling and user feedback

### Medium Priority

- [ ] Add more chart rendering to comparator
- [ ] Implement conditional metric colors (thresholds)
- [ ] Add preset search/filter
- [ ] Support multiple layouts
- [ ] Add undo/redo functionality

### Low Priority

- [ ] Multi-language support
- [ ] Import/export all settings
- [ ] Dark/light theme toggle
- [ ] Preset templates library
- [ ] Analytics dashboard

### Documentation

- Improve inline code comments
- Add more examples to docs
- Create video tutorials
- Translate documentation
- Add API documentation

## Feature Development Workflow

1. **Discuss First**: Open an issue to discuss major changes
2. **Branch**: Create a feature branch from `main`
3. **Develop**: Make changes, commit frequently
4. **Test**: Thoroughly test your changes
5. **Document**: Update relevant documentation
6. **PR**: Open a pull request with description
7. **Review**: Address feedback from maintainers
8. **Merge**: Once approved, your PR will be merged!

## Chrome Extension Best Practices

### Manifest V3

- Use service workers, not background pages
- Minimize permissions
- Use declarativeNetRequest for blocking
- Handle service worker lifecycle

### Performance

- Lazy load when possible
- Minimize DOM operations
- Use efficient selectors
- Debounce/throttle events
- Clean up event listeners

### Security

- Sanitize all user input
- Use `textContent`, avoid `innerHTML` with user data
- Don't use `eval()`
- Validate all data from external sources
- Follow CSP (Content Security Policy)

### Privacy

- Don't collect unnecessary data
- Store data locally when possible
- Be transparent about data usage
- Provide opt-in for telemetry

## Release Process

### Versioning

We use Semantic Versioning (SemVer):
- MAJOR: Breaking changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes

Example: `0.1.0` → `0.2.0` (new features) → `0.2.1` (bug fix)

### Changelog

Update CHANGELOG.md with:
- New features
- Bug fixes
- Breaking changes
- Deprecations

## Getting Help

- Open an issue for questions
- Check existing issues and PRs
- Read the documentation thoroughly
- Ask in discussions (coming soon)

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Mentioned in README (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making SPTween better! 🚀
