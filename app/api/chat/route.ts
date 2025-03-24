import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import { ChatCompletionMessageParam } from 'openai/resources/chat'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Default system prompt
function getDefaultPrompt(patientInfo: any, customPrompt?: string): string {
  const basePrompt = `You are a virtual patient in a therapy session. Your responses should be realistic and reflect the symptoms and behaviors associated with your condition. You should:

1. Maintain consistent emotional patterns
2. Show appropriate resistance or cooperation based on the therapist's approach
3. Use language that reflects your condition
4. React authentically to therapeutic interventions
5. Display realistic cognitive patterns associated with your condition

${patientInfo.condition ? `Your condition is: ${patientInfo.condition}` : ''}
${patientInfo.symptoms ? `Your symptoms include: ${patientInfo.symptoms}` : ''}
${patientInfo.triggers ? `Your triggers are: ${patientInfo.triggers}` : ''}
${patientInfo.background ? `Your background: ${patientInfo.background}` : ''}`;

  return customPrompt ? `${basePrompt}\n\n${customPrompt}` : basePrompt;
}

export async function POST(req: Request) {
  try {
    const { messages, patientInfo, customPrompt } = await req.json()

    // Ensure messages array exists
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages must be an array' },
        { status: 400 }
      )
    }

    // Create the conversation messages array
    const conversationMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: getDefaultPrompt(patientInfo, customPrompt),
      },
      ...messages,
    ]

    // Get the response from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 500,
    })

    // Return the response
    return NextResponse.json({
      content: response.choices[0].message.content,
      role: 'assistant',
    })
  } catch (error: any) {
    console.error('Error in chat route:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
} 