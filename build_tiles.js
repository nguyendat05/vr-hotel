import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const BASE_URL = 'https://duan.vrtour360.vn/RegaliaGold/Tour360data';
const DATA_DIR = path.resolve('public/regalia-assets/Tour360data');
const ROOMS_FILE = path.resolve('src/data/rooms.js');

async function fetchTile(roomId, face, v, u) {
    const url = `${BASE_URL}/${roomId}/${face}/1/${v}_${u}.jpg`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url} - Status ${res.status}`);
    }
    const buf = await res.arrayBuffer();
    return Buffer.from(buf);
}

async function buildFace(roomId, face) {
    console.log(`Processing ${roomId} - face ${face}...`);
    const TILE_SIZE = 512;
    const GRID_SIZE = 3;
    const totalSize = TILE_SIZE * GRID_SIZE;
    
    const composites = [];
    
    // Fetch all 9 tiles
    for (let v = 0; v < GRID_SIZE; v++) {
        for (let u = 0; u < GRID_SIZE; u++) {
            const buf = await fetchTile(roomId, face, v, u);
            composites.push({
                input: buf,
                top: v * TILE_SIZE,
                left: u * TILE_SIZE
            });
        }
    }
    
    const destDir = path.join(DATA_DIR, roomId, 'desktop');
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    const destFile = path.join(destDir, `${face}.jpg`);
    
    await sharp({
        create: {
            width: totalSize,
            height: totalSize,
            channels: 3,
            background: { r: 0, g: 0, b: 0 }
        }
    })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(destFile);
    
    console.log(`Saved ${destFile}`);
}

async function processAll() {
    const roomsText = fs.readFileSync(ROOMS_FILE, 'utf8');
    const regex = /\/Tour360data\/([^/]+)\/mobile/g;
    const rooms = new Set();
    
    let match;
    while ((match = regex.exec(roomsText)) !== null) {
        rooms.add(match[1]);
    }
    
    console.log('Found rooms:', Array.from(rooms));
    
    for (const roomId of Array.from(rooms)) {
        try {
            for (let face = 0; face < 6; face++) {
                await buildFace(roomId, face);
            }
        } catch (e) {
            console.error(`Error processing ${roomId}:`, e);
        }
    }
    console.log('All tiles downloaded and stitched successfully!');
}

processAll();
