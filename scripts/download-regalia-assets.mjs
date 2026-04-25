import { mkdir, access, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rooms } from '../src/data/rooms.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const publicRoot = path.join(projectRoot, 'public')

const REMOTE_BASE = 'https://duan.vrtour360.vn/RegaliaGold'
const PREFIX = '/regalia-assets/'

const requiredAssets = new Set(['/regalia-assets/Tour360data/pano/Images/Logo.png'])

for (const room of rooms) {
  const image = room?.image
  if (image && typeof image === 'object' && image.type === 'cubefaces' && Array.isArray(image.faces)) {
    for (const url of image.faces) {
      if (typeof url === 'string' && url.startsWith(PREFIX)) requiredAssets.add(url)
    }
  } else if (typeof image === 'string' && image.startsWith(PREFIX)) {
    requiredAssets.add(image)
  }
}

const assets = [...requiredAssets].sort()
console.log(`Found ${assets.length} assets to ensure locally.`)

let downloaded = 0
let skipped = 0
let failed = 0

for (const localUrl of assets) {
  const relativePath = localUrl.slice(1) // remove leading slash
  const localFilePath = path.join(publicRoot, relativePath)
  const remotePath = localUrl.replace(PREFIX, '/')
  const remoteUrl = `${REMOTE_BASE}${remotePath}`

  try {
    await access(localFilePath, constants.F_OK)
    skipped += 1
    continue
  } catch {
    // File missing -> download below
  }

  try {
    const response = await fetch(remoteUrl)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await mkdir(path.dirname(localFilePath), { recursive: true })
    await writeFile(localFilePath, buffer)
    downloaded += 1
    if (downloaded % 25 === 0) {
      console.log(`Downloaded ${downloaded}/${assets.length}...`)
    }
  } catch (error) {
    failed += 1
    console.error(`Failed: ${remoteUrl} -> ${error.message}`)
  }
}

console.log(`Done. Downloaded: ${downloaded}, skipped existing: ${skipped}, failed: ${failed}`)
