import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

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
    const savedFiles = []

    for (const file of files) {
      if (!file.name.endsWith('.pdf') && !file.name.endsWith('.epub')) {
        return NextResponse.json(
          { error: 'Only PDF and EPUB files are supported' },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Save file to books directory
      const filePath = join(booksDir, file.name)
      await writeFile(filePath, buffer)
      savedFiles.push(file.name)
    }

    return NextResponse.json({
      message: `Successfully saved ${files.length} file(s)`,
      files: savedFiles
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to save files' },
      { status: 500 }
    )
  }
} 