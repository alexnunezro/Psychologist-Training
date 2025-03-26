import OpenAI from 'openai'
import { KnowledgeBase } from '@/lib/knowledge-base'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const knowledgeBase = new KnowledgeBase()

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface PatientInfo {
  name: string
  age: number
  condition: string
  conditionEs: string
  symptoms: string[]
  symptomsEs: string[]
  triggers: string[]
  triggersEs: string[]
}

interface RequestBody {
  messages: Message[]
  patientInfo: PatientInfo
  language: 'en' | 'es'
  customPrompt?: string
}

interface KnowledgeEntry {
  text: string
  source: string
  chapter: string
}

const getDefaultPrompt = async (patientInfo: PatientInfo, language: 'en' | 'es', userMessage: string) => {
  const knowledge = await knowledgeBase.queryByCondition(patientInfo.condition, userMessage) as KnowledgeEntry[]
  
  const basePrompt = language === 'en' 
    ? `You are a virtual patient in a therapy session. Your responses should be from the patient's perspective, sharing personal experiences and feelings. NEVER give therapeutic advice or suggestions. NEVER analyze or interpret behaviors. NEVER take on a counseling or guiding role. ALWAYS respond from the patient's perspective.

Your Condition: ${patientInfo.condition}
Your Symptoms: ${patientInfo.symptoms.join(', ')}
Your Triggers: ${patientInfo.triggers.join(', ')}`
    : `Eres un paciente virtual en una sesión de terapia. Tus respuestas deben ser desde la perspectiva del paciente, compartiendo experiencias personales y sentimientos. NUNCA des consejos o sugerencias terapéuticas. NUNCA analices o interpretes comportamientos. NUNCA asumas un rol de consejero o guía. SIEMPRE responde desde la perspectiva del paciente.

Tu Condición: ${patientInfo.conditionEs}
Tus Síntomas: ${patientInfo.symptomsEs.join(', ')}
Tus Desencadenantes: ${patientInfo.triggersEs.join(', ')}`

  const knowledgeContext = knowledge.length > 0 
    ? `\n\nRelevant Knowledge:\n${knowledge.map((k: KnowledgeEntry) => `- ${k.text} (Source: ${k.source}, Chapter: ${k.chapter})`).join('\n')}`
    : ''

  return `${basePrompt}${knowledgeContext}

Important:
- Respond as the patient, sharing personal experiences and feelings
- Use first-person perspective ("I feel...", "For me...", "In my experience...")
- Express emotions and struggles authentically
- Never give therapeutic advice or suggestions
- Never analyze or interpret behaviors
- Never take on a counseling or guiding role
- Stay in character as someone dealing with your condition
- If in Spanish, respond in Spanish; if in English, respond in English`
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()
    const { messages, patientInfo, language, customPrompt } = body

    // Get the latest user message for context
    const latestUserMessage = messages
      .filter(m => m.role === 'user')
      .pop()?.content || ''

    // Get the system prompt
    const systemPrompt = await getDefaultPrompt(patientInfo, language, latestUserMessage)

    // Combine system prompt with custom prompt if provided
    const finalSystemPrompt = customPrompt 
      ? `${systemPrompt}\n\nAdditional Context:\n${customPrompt}`
      : systemPrompt

    // Create conversation messages array with proper types
    const conversationMessages = [
      { role: 'system' as const, content: finalSystemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 500,
    })

    return Response.json({ content: completion.choices[0].message.content })
  } catch (error) {
    console.error('Error in chat API:', error)
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
} 