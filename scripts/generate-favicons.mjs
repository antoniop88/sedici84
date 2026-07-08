import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const svg = await readFile(join(publicDir, 'icon.svg'))

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
]

const pngBuffers = []

for (const { name, size } of sizes) {
  const buffer = await sharp(svg).resize(size, size).png().toBuffer()
  await writeFile(join(publicDir, name), buffer)
  if (size === 16 || size === 32) {
    pngBuffers.push(buffer)
  }
}

const favicon = await pngToIco([pngBuffers[0], pngBuffers[1]])
await writeFile(join(publicDir, 'favicon.ico'), favicon)

await mkdir(join(root, 'scripts'), { recursive: true })
console.log('Generated favicon set in public/')
