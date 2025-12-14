const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets', 'icons');
const publicDir = path.join(__dirname, 'public', 'images');

// Ensure public/images exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Convert SVG files to PNG
async function convertSvgToPng(svgFileName) {
  const svgPath = path.join(assetsDir, svgFileName);
  const pngFileName = svgFileName.replace('.svg', '.png');
  const pngPath = path.join(publicDir, pngFileName);
  
  console.log(`Converting ${svgFileName} to ${pngFileName}...`);
  
  await sharp(svgPath)
    .resize(512, 512)
    .png()
    .toFile(pngPath);
  
  console.log(`✓ Created ${pngFileName}`);
}

async function main() {
  try {
    await convertSvgToPng('n2.svg');
    await convertSvgToPng('m2.svg');
    console.log('\n✅ All icons converted successfully!');
  } catch (error) {
    console.error('Error converting icons:', error);
    process.exit(1);
  }
}

main();
