import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { KnowledgeBase } from '@/lib/knowledge-base'
import { BookEntry } from '@/lib/knowledge-base'

const knowledgeBase = new KnowledgeBase()

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files.length) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const booksDir = join(process.cwd(), 'books')
    const entries: BookEntry[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Save file to books directory
      const filePath = join(booksDir, file.name)
      await writeFile(filePath, buffer)

      // Process the file based on its type
      if (file.name.endsWith('.pdf')) {
        // TODO: Implement PDF processing
        // For now, we'll just add a placeholder entry
        entries.push({
          text: `Content from ${file.name}`,
          source: file.name,
          page: 1,
          chapter: 'Introduction',
          condition: 'General',
          tags: ['pdf']
        })
      } else if (file.name.endsWith('.epub')) {
        // TODO: Implement EPUB processing
        // For now, we'll just add a placeholder entry
        entries.push({
          text: `Content from ${file.name}`,
          source: file.name,
          page: 1,
          chapter: 'Introduction',
          condition: 'General',
          tags: ['epub']
        })
      }
    }

    // Add entries to knowledge base
    await knowledgeBase.addBulkEntries(entries)

    return NextResponse.json({
      message: `Successfully processed ${files.length} file(s)`,
      entriesAdded: entries.length
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process files' },
      { status: 500 }
    )
  }
} 