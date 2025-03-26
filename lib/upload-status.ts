// In-memory storage for processing status
// In a production environment, this should be replaced with a database
const processingStatus = new Map<string, {
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
  progress?: number
  timestamp: number
}>()

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

export function getProcessingStatus() {
  return processingStatus
} 