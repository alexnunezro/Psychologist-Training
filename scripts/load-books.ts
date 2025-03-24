import fs from 'fs';
import path from 'path';
import { KnowledgeBase } from '../lib/knowledge-base';

const BOOKS_DIR = path.join(process.cwd(), 'books');

async function processBook(filePath: string): Promise<void> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, path.extname(filePath));
  
  // Split content into manageable chunks (e.g., by chapters or sections)
  const chunks = content.split(/\n(?=Chapter|\d+\.|Section)/);
  
  const knowledgeBase = new KnowledgeBase();
  await knowledgeBase.initialize();
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].trim();
    if (chunk.length < 50) continue; // Skip very short chunks
    
    // Extract metadata from the chunk
    const chapterMatch = chunk.match(/^(Chapter|\d+\.|Section)\s+(.+?)(?:\n|$)/);
    const chapter = chapterMatch ? chapterMatch[0].trim() : `Section ${i + 1}`;
    
    // Detect psychological conditions mentioned in the chunk
    const conditions = detectConditions(chunk);
    
    await knowledgeBase.addEntry({
      text: chunk,
      source: fileName,
      page: i + 1, // Approximate page number
      chapter,
      condition: conditions.join(', '),
      tags: [...conditions, 'psychology', 'disorder']
    });
  }
}

function detectConditions(text: string): string[] {
  // List of common psychological disorders to detect
  const disorders = [
    'Depression', 'Anxiety', 'PTSD', 'Bipolar Disorder',
    'Schizophrenia', 'OCD', 'ADHD', 'Eating Disorders',
    'Personality Disorders', 'Substance Use Disorders'
  ];
  
  return disorders.filter(disorder => 
    text.toLowerCase().includes(disorder.toLowerCase())
  );
}

async function main() {
  if (!fs.existsSync(BOOKS_DIR)) {
    console.log('Creating books directory...');
    fs.mkdirSync(BOOKS_DIR);
    console.log('Please place your psychology books (in text format) in the "books" directory');
    return;
  }
  
  const files = fs.readdirSync(BOOKS_DIR)
    .filter(file => file.endsWith('.txt'));
  
  if (files.length === 0) {
    console.log('No text files found in the books directory');
    console.log('Please add your psychology books in text format');
    return;
  }
  
  console.log(`Found ${files.length} books to process`);
  
  for (const file of files) {
    console.log(`Processing ${file}...`);
    await processBook(path.join(BOOKS_DIR, file));
  }
  
  console.log('Finished processing all books');
}

main().catch(console.error); 