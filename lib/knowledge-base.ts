import { ChromaClient, IEmbeddingFunction } from 'chromadb'
import { pipeline } from '@xenova/transformers'

// Initialize the embedding model
let embedder: any = null

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embedder
}

export interface BookEntry {
  text: string
  source: string
  page: number
  chapter: string
  condition: string
  tags: string[]
}

export class KnowledgeBase {
  private collection: any
  private initialized: boolean = false
  private client: ChromaClient

  constructor() {
    this.client = new ChromaClient()
  }

  async initialize() {
    if (this.initialized) return

    try {
      // Initialize the embedder
      const embedder = await getEmbedder()

      // Create a custom embedding function
      const embeddingFunction: IEmbeddingFunction = {
        generate: async (texts: string[]): Promise<number[][]> => {
          const embeddings: number[][] = []
          for (const text of texts) {
            const output = await embedder(text, { pooling: 'mean', normalize: true })
            embeddings.push(Array.from(output.data) as number[])
          }
          return embeddings
        }
      }

      // Create or get the collection
      this.collection = await this.client.getOrCreateCollection({
        name: "psychological_knowledge",
        embeddingFunction,
        metadata: {
          description: "Psychological disorders knowledge base from professional literature"
        }
      })

      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize knowledge base:', error)
      throw error
    }
  }

  async addEntry(entry: BookEntry) {
    await this.initialize()

    try {
      await this.collection.add({
        ids: [Math.random().toString(36).substring(7)],
        documents: [entry.text],
        metadatas: [{
          source: entry.source,
          page: entry.page,
          chapter: entry.chapter,
          condition: entry.condition,
          tags: entry.tags
        }]
      })
    } catch (error) {
      console.error('Failed to add entry:', error)
      throw error
    }
  }

  async queryByCondition(condition: string, query: string, limit: number = 3): Promise<BookEntry[]> {
    await this.initialize()

    try {
      const results = await this.collection.query({
        queryTexts: [query],
        nResults: limit,
        where: {
          condition: { $eq: condition }
        }
      })

      if (!results.documents[0]) return []

      return results.documents[0].map((doc: string, index: number) => ({
        text: doc,
        ...results.metadatas[0][index]
      }))
    } catch (error) {
      console.error('Failed to query knowledge base:', error)
      return []
    }
  }

  async addBulkEntries(entries: BookEntry[]) {
    await this.initialize()

    try {
      const chunks = []
      for (let i = 0; i < entries.length; i += 100) {
        chunks.push(entries.slice(i, i + 100))
      }

      for (const chunk of chunks) {
        await this.collection.add({
          ids: chunk.map(() => Math.random().toString(36).substring(7)),
          documents: chunk.map(entry => entry.text),
          metadatas: chunk.map(entry => ({
            source: entry.source,
            page: entry.page,
            chapter: entry.chapter,
            condition: entry.condition,
            tags: entry.tags
          }))
        })
      }
    } catch (error) {
      console.error('Failed to add bulk entries:', error)
      throw error
    }
  }
} 