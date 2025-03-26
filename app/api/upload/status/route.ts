import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { getProcessingStatus } from '@/lib/upload-status'

export async function GET() {
  try {
    const booksDir = join(process.cwd(), 'books')
    const files = await readdir(booksDir)
    
    // Filter for PDF and EPUB files
    const bookFiles = files.filter(file => 
      file.endsWith('.pdf') || file.endsWith('.epub')
    )

    const processingStatus = getProcessingStatus()

    // Create status entries for new files
    bookFiles.forEach(filename => {
      if (!processingStatus.has(filename)) {
        processingStatus.set(filename, {
          status: 'pending',
          timestamp: Date.now()
        })
      }
    })

    // Clean up old entries
    const oneHourAgo = Date.now() - 3600000 // 1 hour in milliseconds
    for (const [filename, status] of processingStatus.entries()) {
      if (status.timestamp < oneHourAgo || !bookFiles.includes(filename)) {
        processingStatus.delete(filename)
      }
    }

    // Format response
    const books = Array.from(processingStatus.entries()).map(([filename, status]) => ({
      filename,
      status: status.status,
      error: status.error,
      progress: status.progress
    }))

    return NextResponse.json({ books })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
} 