import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const BASE_URL = 'https://duan.vrtour360.vn/RegaliaGold/Tour360data';
const DATA_DIR = path.resolve('public/regalia-assets/Tour360data');
const ROOMS_FILE = path.resolve('src/data/rooms.js');

async function fetchTile(roomId, face, level, v, u) {
    const url = `${BASE_URL}/${roomId}/${face}/${level}/${v}_${u}.jpg`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url} - Status ${res.status}`);
    }
    const buf = await res.arrayBuffer();
    return Buffer.from(buf);
}

async function buildFaceLevel2(roomId, face) {
    console.log(`Processing High-Res Level 2 ${roomId} - face ${face}...`);
    const TILE_SIZE = 512;
    const GRID_SIZE = 6; // Level 2 is 6x6 grid
    const totalSize = TILE_SIZE * GRID_SIZE;
    
    const composites = [];
    
    for (let v = 0; v < GRID_SIZE; v++) {
        for (let u = 0; u < GRID_SIZE; u++) {
            const buf = await fetchTile(roomId, face, 2, v, u);
            composites.push({
                input: buf,
                top: v * TILE_SIZE,
                left: u * TILE_SIZE
            });
        }
    }
    
    const destDir = path.join(DATA_DIR, roomId, 'desktop-hd');
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
    
    console.log(`Saved HIGH RES ${destFile}`);
}

async function run() {
    const roomId = 'overview_15';
    for(let face=0; face<6; face++) {
        await buildFaceLevel2(roomId, face);
    }
    
    // Update rooms.js to point overview_15 to desktop-hd
    let roomsText = fs.readFileSync(ROOMS_FILE, 'utf8');
    roomsText = roomsText.replace(/\/overview_15\/desktop\//g, '/overview_15/desktop-hd/');
    fs.writeFileSync(ROOMS_FILE, roomsText);
    console.log("Updated rooms.js for overview_15 to use desktop-hd!");
}

run();
