# Favicon Setup

This directory contains the favicon files for the blog, featuring a code/XML icon with a cyan gradient theme.

## Files

- `favicon.svg` - Modern SVG favicon (32x32)
- `favicon.ico` - Traditional ICO format for older browsers
- `apple-touch-icon.svg` - Apple touch icon (180x180)
- `android-chrome.svg` - Android Chrome icon (512x512)
- `safari-pinned-tab.svg` - Safari pinned tab icon (monochrome)
- `site.webmanifest` - Web app manifest file

## Design

The favicon design features:

- Cyan gradient background (`#06b6d4` to `#67e8f9`)
- White code/XML icon representing programming and development
- Rounded corners for modern appearance
- Clean, minimalist design that scales well

## Regenerating Favicons

To regenerate the favicon files, run:

```bash
node scripts/generate-favicon.mjs
```

This will create new SVG files based on the logo design.

## Browser Support

- **Modern browsers**: Use SVG favicon for crisp display at any size
- **Older browsers**: Fall back to ICO format
- **Mobile devices**: Use platform-specific icons (Apple, Android)
- **PWA**: Web manifest provides app-like experience

## Colors

- Primary: `#06b6d4` (cyan)
- Secondary: `#67e8f9` (light cyan)
- Theme color: `#06b6d4`

## Notes

- The SVG favicon provides the best quality across all devices
- The ICO file is included for maximum browser compatibility
- All theme colors have been updated to match the logo's cyan theme
