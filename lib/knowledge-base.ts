// This file is server-only
'use server'

import { ChromaClient } from 'chromadb'
import { OpenAIEmbeddingFunction } from 'chromadb'

export interface BookEntry {
  text: string
  source: string
  page: number
  chapter: string
  condition: string
  tags: string[]
}

// Initialize ChromaDB client and embedding function
const chromaClient = new ChromaClient()
const embeddingFunction = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY!,
})

let collection: any = null

async function initializeCollection() {
  if (!collection) {
    try {
      collection = await chromaClient.getOrCreateCollection({
        name: "psychology_books",
        embeddingFunction: embeddingFunction,
      })
    } catch (error) {
      console.error('Error initializing ChromaDB collection:', error)
      throw error
    }
  }
  return collection
}

export async function addEntry(entry: BookEntry) {
  const col = await initializeCollection()

  try {
    await col.add({
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

export async function queryByCondition(condition: string, query: string, limit: number = 3): Promise<BookEntry[]> {
  const col = await initializeCollection()

  try {
    const results = await col.query({
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

export async function addBulkEntries(entries: BookEntry[]) {
  const col = await initializeCollection()

  try {
    const chunks = []
    for (let i = 0; i < entries.length; i += 100) {
      chunks.push(entries.slice(i, i + 100))
    }

    for (const chunk of chunks) {
      await col.add({
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