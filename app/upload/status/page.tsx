'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface BookStatus {
  filename: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
  progress?: number
}

export default function StatusPage() {
  const [books, setBooks] = useState<BookStatus[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/upload/status')
        if (response.ok) {
          const data = await response.json()
          setBooks(data.books)
        }
      } catch (error) {
        console.error('Failed to fetch status:', error)
      }
    }

    // Fetch immediately
    fetchStatus()

    // Then fetch every 5 seconds
    const interval = setInterval(fetchStatus, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Processing Status</h1>
            <button
              onClick={() => router.push('/upload')}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Upload More Books
            </button>
          </div>

          {books.length === 0 ? (
            <p className="text-gray-500">No books are currently being processed.</p>
          ) : (
            <div className="space-y-4">
              {books.map((book, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {book.filename}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        book.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : book.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : book.status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                    </span>
                  </div>
                  
                  {book.status === 'processing' && typeof book.progress === 'number' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  )}

                  {book.status === 'error' && book.error && (
                    <p className="mt-1 text-sm text-red-600">{book.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 