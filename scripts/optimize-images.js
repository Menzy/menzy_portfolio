import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../public/assets/appdemo');
const destDir = path.join(__dirname, '../public/assets/appdemo/optimized');

// Ensure the output directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Get all jpg and png files in the source directory
const imageFiles = fs.readdirSync(sourceDir)
  .filter(file => /\.(jpg|jpeg|png)$/i.test(file) && !file.includes('optimized'));

// Process each image
(async () => {
  for (const file of imageFiles) {
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(destDir, file);
    
    console.log(`Optimizing ${file}...`);
    
    try {
      // For jpg/jpeg files
      if (/\.(jpg|jpeg)$/i.test(file)) {
        await sharp(inputPath)
          .resize({ width: 800 }) // Resize to reasonable width for mobile
          .jpeg({ quality: 80, progressive: true }) // Good quality but reduced file size
          .toFile(outputPath);
      } 
      // For png files
      else if (/\.png$/i.test(file)) {
        await sharp(inputPath)
          .resize({ width: 800 }) // Resize to reasonable width
          .png({ quality: 80, compressionLevel: 9 }) // High compression
          .toFile(outputPath);
      }
      
      console.log(`Successfully optimized: ${file}`);
    } catch (error) {
      console.error(`Error optimizing ${file}:`, error);
    }
  }
  console.log('Image optimization complete!');
})(); 