import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

// In-memory storage for processing status
// In a production environment, this should be replaced with a database
const processingStatus = new Map<string, {
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
  progress?: number
  timestamp: number
}>()

export async function GET() {
  try {
    const booksDir = join(process.cwd(), 'books')
    const files = await readdir(booksDir)
    
    // Filter for PDF and EPUB files
    const bookFiles = files.filter(file => 
      file.endsWith('.pdf') || file.endsWith('.epub')
    )

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

// Helper function to update status (can be called from other parts of the application)
export function updateStatus(
  filename: string,
  status: 'pending' | 'processing' | 'completed' | 'error',
  details?: { error?: string; progress?: number }
) {
  processingStatus.set(filename, {
    status,
    error: details?.error,
    progress: details?.progress,
    timestamp: Date.now()
  })
} 