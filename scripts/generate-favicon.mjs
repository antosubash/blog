import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create favicon directory if it doesn't exist
const faviconDir = path.join(__dirname, '../public/static/favicons')
if (!fs.existsSync(faviconDir)) {
  fs.mkdirSync(faviconDir, { recursive: true })
}

// Create favicon SVG based on the code/XML icon with cyan background
const faviconSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#67e8f9;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="4" fill="url(#gradient1)"/>
  <g transform="translate(4, 4)" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="m18 16 4-4-4-4"></path>
    <path d="m6 8-4 4 4 4"></path>
    <path d="m14.5 4-5 16"></path>
  </g>
</svg>`

// Create a larger version for apple-touch-icon
const appleTouchSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#67e8f9;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="20" fill="url(#gradient1)"/>
  <g transform="translate(22.5, 22.5)" stroke="white" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="m101.25 90 22.5-22.5-22.5-22.5"></path>
    <path d="m33.75 45-22.5 22.5 22.5 22.5"></path>
    <path d="m81.5625 22.5-28.125 112.5"></path>
  </g>
</svg>`

// Create Android Chrome icon
const androidChromeSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#67e8f9;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="60" fill="url(#gradient1)"/>
  <g transform="translate(64, 64)" stroke="white" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="m288 256 64-64-64-64"></path>
    <path d="m96 128-64 64 64 64"></path>
    <path d="m232 64-80 320"></path>
  </g>
</svg>`

// Create Safari pinned tab SVG (monochrome version)
const safariPinnedSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="m9 8 2-2-2-2"></path>
    <path d="m3 4-2 2 2 2"></path>
    <path d="m7.25 2-2.5 8"></path>
  </g>
</svg>`

// Write the SVG files
fs.writeFileSync(path.join(faviconDir, 'favicon.svg'), faviconSVG)
fs.writeFileSync(path.join(faviconDir, 'apple-touch-icon.svg'), appleTouchSVG)
fs.writeFileSync(path.join(faviconDir, 'android-chrome.svg'), androidChromeSVG)
fs.writeFileSync(path.join(faviconDir, 'safari-pinned-tab.svg'), safariPinnedSVG)

console.log('Favicon SVG files generated successfully with the new code/XML icon!')
console.log('The generated files are:')
console.log('- favicon.svg (32x32) - Code/XML icon with cyan gradient background')
console.log('- apple-touch-icon.svg (180x180) - Larger version for Apple devices')
console.log('- android-chrome.svg (512x512) - High-res version for Android')
console.log('- safari-pinned-tab.svg (16x16, monochrome) - For Safari pinned tabs')
