const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');
const pngToIco = require('png-to-ico');

// สร้างโฟลเดอร์เก็บไอคอน
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('Created images directory');
}

// ฟังก์ชันสร้างไอคอน
function generateIcon(size, filename, color) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // พื้นหลังสี
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
    
    // วาดกล่อง (สัญลักษณ์สินค้า)
    ctx.fillStyle = 'white';
    const boxSize = size * 0.6;
    const boxX = (size - boxSize) / 2;
    const boxY = (size - boxSize) / 2;
    ctx.fillRect(boxX, boxY, boxSize, boxSize);
    
    // วาดเส้นตัด (สัญลักษณ์กล่อง)
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.04;
    ctx.beginPath();
    ctx.moveTo(boxX, boxY + boxSize / 2);
    ctx.lineTo(boxX + boxSize, boxY + boxSize / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(boxX + boxSize / 2, boxY);
    ctx.lineTo(boxX + boxSize / 2, boxY + boxSize);
    ctx.stroke();
    
    // บันทึกไฟล์
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(imagesDir, filename), buffer);
    
    console.log(`Generated ${filename} (${size}x${size})`);
}

// สร้างไอคอนหลายขนาด
// สีน้ำเงินสำหรับระบบหลัก ตรงกับธีมของแอพ
const mainColor = '#4e73df';

generateIcon(16, 'favicon-16x16.png', mainColor);
generateIcon(32, 'favicon-32x32.png', mainColor);
generateIcon(180, 'apple-touch-icon.png', mainColor);
generateIcon(192, 'android-chrome-192x192.png', mainColor);
generateIcon(512, 'android-chrome-512x512.png', mainColor);

// สร้าง favicon.png
fs.copyFileSync(
    path.join(imagesDir, 'favicon-32x32.png'),
    path.join(imagesDir, 'favicon.png')
);
console.log('Copied favicon.png');

// สร้างไฟล์ webmanifest
const webmanifest = {
    "name": "ระบบจัดการสินค้า",
    "short_name": "จัดการสินค้า",
    "icons": [
        {
            "src": "/images/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/images/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": mainColor,
    "background_color": "#ffffff",
    "display": "standalone"
};

fs.writeFileSync(
    path.join(__dirname, '..', 'public', 'site.webmanifest'),
    JSON.stringify(webmanifest, null, 2)
);
console.log('Created site.webmanifest');

// สร้าง favicon.ico
async function createFavicon() {
  try {
    const buffer = await pngToIco([path.join(imagesDir, 'favicon-32x32.png')]);
    fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), buffer);
    console.log('Created favicon.ico');
  } catch (err) {
    console.error('Error creating favicon.ico:', err);
  }
}

createFavicon();

console.log('All icons generated successfully!');
console.log('To create favicon.ico, you can convert favicon-32x32.png using an online converter');