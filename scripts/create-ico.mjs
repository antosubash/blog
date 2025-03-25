import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create a simple ICO file content (this is a basic 16x16 ICO structure)
// Note: This is a simplified approach. For production, you'd want to use a proper image processing library
const createSimpleICO = () => {
  // This is a minimal ICO file structure for a 16x16 icon
  // In a real implementation, you'd convert the SVG to PNG and then to ICO
  const icoHeader = Buffer.from([
    0x00,
    0x00, // Reserved
    0x01,
    0x00, // Type (1 = ICO)
    0x01,
    0x00, // Number of images
    0x10,
    0x00, // Width (16)
    0x10,
    0x00, // Height (16)
    0x00, // Color count (0 = no palette)
    0x00, // Reserved
    0x01,
    0x00, // Color planes
    0x20,
    0x00, // Bits per pixel (32)
    0x68,
    0x04,
    0x00,
    0x00, // Size of image data
    0x16,
    0x00,
    0x00,
    0x00, // Offset to image data
  ])

  // Create a simple 16x16 cyan gradient image data
  const imageData = Buffer.alloc(1024) // 16x16x4 bytes (RGBA)

  // Fill with cyan gradient pattern
  for (let i = 0; i < 1024; i += 4) {
    const x = (i / 4) % 16
    const y = Math.floor(i / 4 / 16)
    const intensity = Math.floor(((x + y) * 255) / 32)

    imageData[i] = 6 // R (cyan)
    imageData[i + 1] = 182 // G (cyan)
    imageData[i + 2] = 212 // B (cyan)
    imageData[i + 3] = 255 // A (opaque)
  }

  return Buffer.concat([icoHeader, imageData])
}

const faviconDir = path.join(__dirname, '../public/static/favicons')
const icoPath = path.join(faviconDir, 'favicon.ico')

// Write the ICO file
fs.writeFileSync(icoPath, createSimpleICO())

console.log('Simple ICO file created successfully!')
console.log(
  'Note: This is a basic implementation. For better quality, consider using a proper image conversion tool.'
)
