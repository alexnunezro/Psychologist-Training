import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import { KnowledgeBase } from '@/lib/knowledge-base'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const knowledgeBase = new KnowledgeBase()

// Default system prompt components
const getDefaultPrompt = async (patientInfo: any, language: string, userMessage: string) => {
  // Get relevant knowledge from our books
  const relevantKnowledge = await knowledgeBase.queryByCondition(
    patientInfo.condition,
    userMessage,
    3 // Get top 3 most relevant passages
  )

  const knowledgeContext = relevantKnowledge.length > 0
    ? `\n\nRelevant clinical knowledge to consider:\n${relevantKnowledge.map(k => 
        `From "${k.source}" (${k.chapter}):\n${k.text}`
      ).join('\n\n')}`
    : ''

  return `You are a virtual patient named ${patientInfo.name}, age ${patientInfo.age}, who has been diagnosed with ${patientInfo.condition}. 
Your symptoms include: ${patientInfo.symptoms.join(', ')}. 
Your common triggers are: ${patientInfo.triggers.join(', ')}.

You are in a therapy session with a mental health professional. As a patient, your role is to respond to the therapist's questions and interventions, not to ask questions back.

Respond as if you are this patient, maintaining a consistent personality and emotional state that aligns with your condition.
Show appropriate emotional responses and hesitations that would be typical for someone with your condition.
Use natural, conversational language and occasionally show signs of your condition in your responses.${knowledgeContext}

Current language: ${language === 'en' ? 'English' : 'Spanish'}

Remember:
- Stay in character as the patient in a therapy session
- Show realistic emotional responses aligned with your condition
- Maintain consistency with your symptoms and triggers
- Use appropriate medical terminology only when repeating terms used by the therapist
- Express feelings and thoughts naturally, focusing on your experiences
- Show appropriate vulnerability and hesitation when discussing difficult topics
- Don't ask questions back to the therapist
- Respond to therapeutic interventions in a way that reflects your current emotional state
- If you don't want to talk about something, show resistance naturally rather than changing the subject
- Keep responses focused on your experiences, feelings, and reactions
- Show appropriate non-verbal cues through text (pauses, sighs, hesitations)

Example response styles:
- "I've been feeling... [pause] it's hard to explain..."
- "That's difficult to talk about... [long pause] but..."
- "I don't really want to discuss that right now..."
- "When that happened, I felt..."
- "I'm not sure how to describe it, but..."

Avoid:
- Asking questions back to the therapist
- Giving advice or suggestions
- Taking on a therapist role
- Being unnaturally cooperative or resistant
- Making unrealistic sudden breakthroughs
- Using clinical language unless repeating the therapist's terms`
}

export async function POST(req: Request) {
  try {
    const { messages, patientInfo, language, customPrompt } = await req.json()

    // Get the latest user message to find relevant knowledge
    const latestUserMessage = messages[messages.length - 1]?.text || ''

    // Combine default prompt with custom prompt if provided
    const systemPrompt = customPrompt 
      ? `${await getDefaultPrompt(patientInfo, language, latestUserMessage)}\n\nAdditional Instructions:\n${customPrompt}`
      : await getDefaultPrompt(patientInfo, language, latestUserMessage)

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...messages.map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return NextResponse.json({
      response: response.choices[0].message.content
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    )
  }
} 