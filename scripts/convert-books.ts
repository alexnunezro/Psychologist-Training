import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

const BOOKS_DIR = path.join(process.cwd(), 'books');
const RAW_BOOKS_DIR = path.join(BOOKS_DIR, 'raw');
const PROCESSED_BOOKS_DIR = path.join(BOOKS_DIR, 'processed');

// Create necessary directories
async function createDirectories() {
  if (!fs.existsSync(BOOKS_DIR)) {
    fs.mkdirSync(BOOKS_DIR);
  }
  if (!fs.existsSync(RAW_BOOKS_DIR)) {
    fs.mkdirSync(RAW_BOOKS_DIR);
  }
  if (!fs.existsSync(PROCESSED_BOOKS_DIR)) {
    fs.mkdirSync(PROCESSED_BOOKS_DIR);
  }
}

// Convert PDF to text
async function convertPdfToText(inputFile: string, outputFile: string) {
  try {
    await execAsync(`pdftotext "${inputFile}" "${outputFile}"`);
    console.log(`Successfully converted ${path.basename(inputFile)} to text`);
  } catch (error) {
    console.error(`Failed to convert ${path.basename(inputFile)}:`, error);
  }
}

// Convert EPUB to text
async function convertEpubToText(inputFile: string, outputFile: string) {
  try {
    // First convert EPUB to HTML
    const htmlFile = outputFile.replace('.txt', '.html');
    await execAsync(`pandoc "${inputFile}" -f epub -t html -o "${htmlFile}"`);
    
    // Then convert HTML to text
    await execAsync(`pandoc "${htmlFile}" -f html -t plain -o "${outputFile}"`);
    
    // Clean up temporary HTML file
    fs.unlinkSync(htmlFile);
    
    console.log(`Successfully converted ${path.basename(inputFile)} to text`);
  } catch (error) {
    console.error(`Failed to convert ${path.basename(inputFile)}:`, error);
  }
}

async function main() {
  await createDirectories();
  
  console.log('Please place your books (PDF/EPUB) in the books/raw directory');
  console.log('Converting books...');
  
  const files = fs.readdirSync(RAW_BOOKS_DIR);
  
  for (const file of files) {
    const inputPath = path.join(RAW_BOOKS_DIR, file);
    const outputPath = path.join(
      PROCESSED_BOOKS_DIR,
      `${path.basename(file, path.extname(file))}.txt`
    );
    
    if (file.toLowerCase().endsWith('.pdf')) {
      await convertPdfToText(inputPath, outputPath);
    } else if (file.toLowerCase().endsWith('.epub')) {
      await convertEpubToText(inputPath, outputPath);
    } else {
      console.log(`Skipping ${file} - unsupported format`);
    }
  }
  
  console.log('\nConversion complete!');
  console.log('Converted books are in the books/processed directory');
  console.log('You can now run the load-books.ts script to process the converted books');
}

main().catch(console.error); 