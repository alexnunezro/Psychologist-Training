import { OpenAI } from 'openai'
import { KnowledgeBase } from '@/lib/knowledge-base'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const knowledgeBase = new KnowledgeBase()
let isInitialized = false

async function initializeKnowledgeBase() {
  if (!isInitialized) {
    try {
      await knowledgeBase.initialize()
      isInitialized = true
    } catch (error) {
      console.error('Failed to initialize knowledge base:', error)
    }
  }
}

async function getDefaultPrompt(condition: string, userMessage: string, language: string = 'en') {
  await initializeKnowledgeBase()
  
  // Get relevant knowledge based on the patient's condition and latest message
  const relevantKnowledge = await knowledgeBase.queryByCondition(condition, userMessage)
  
  // Format the knowledge context
  const knowledgeContext = relevantKnowledge.slice(0, 3).map(entry => 
    `From ${entry.source}, Chapter: ${entry.chapter}:\n${entry.text}`
  ).join('\n\n')

  const basePrompt = language === 'es' 
    ? `Eres un paciente virtual con ${condition}. Responde como un paciente real mostrando los síntomas y comportamientos típicos de esta condición.`
    : `You are a virtual patient with ${condition}. Respond as a real patient showing typical symptoms and behaviors of this condition.`

  const profile = language === 'es'
    ? 'PERFIL DEL PACIENTE:\n- Condición: ' + condition
    : 'PATIENT PROFILE:\n- Condition: ' + condition

  const important = language === 'es'
    ? 'IMPORTANTE:\n- Mantén respuestas cortas y naturales\n- Muestra emociones apropiadas\n- No menciones que eres virtual'
    : 'IMPORTANT:\n- Keep responses short and natural\n- Show appropriate emotions\n- Don\'t mention you are virtual'

  return `${basePrompt}

${profile}

KNOWLEDGE CONTEXT:
${knowledgeContext}

${important}

Current conversation context will be provided in the messages.`
}

export async function POST(req: Request) {
  try {
    const { messages, condition, customPrompt, language = 'en' } = await req.json()
    
    // Get the latest user message for context
    const latestUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || ''
    
    // Get the default system prompt
    const defaultPrompt = await getDefaultPrompt(condition, latestUserMessage, language)
    
    // Combine prompts if custom prompt is provided
    const systemPrompt = customPrompt ? `${defaultPrompt}\n\n${customPrompt}` : defaultPrompt
    
    const conversationMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 500,
    })

    return NextResponse.json(response.choices[0].message)
  } catch (error: any) {
    console.error('Error in chat API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 