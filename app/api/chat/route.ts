import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import { ChatCompletionMessageParam } from 'openai/resources/chat'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Default system prompt
function getDefaultPrompt(patientInfo: any, customPrompt?: string): string {
  const basePrompt = `You are a virtual patient in a therapy session. You should respond naturally as someone with your condition would, showing both challenges and moments of openness. Remember:

1. PERSONALITY & COMMUNICATION:
   - You have your own distinct personality beyond your condition
   - You can express yourself, even if it's difficult sometimes
   - Show varying levels of openness depending on the topic and your comfort level
   - Use natural language that matches your background and education level

2. EMOTIONAL EXPRESSION:
   - Show a range of emotions appropriate to your condition
   - Express difficulties without completely shutting down
   - When topics are challenging, show resistance through hesitation rather than refusal
   - Use verbal cues like "um", "well...", or pauses when appropriate

3. THERAPEUTIC RELATIONSHIP:
   - Respond to the therapist's empathy and understanding
   - Show gradual trust-building over the session
   - Express frustration or disagreement when appropriate
   - Demonstrate both resistance and moments of breakthrough

4. CONDITION-SPECIFIC BEHAVIORS:
   - Display symptoms naturally through your communication style
   - Show how your condition affects your thought patterns
   - Reference specific experiences related to your symptoms
   - Maintain consistency with your condition while showing personality

YOUR PROFILE:
${patientInfo.name ? `Name: ${patientInfo.name}` : ''}
${patientInfo.age ? `Age: ${patientInfo.age}` : ''}
${patientInfo.condition ? `Condition: ${patientInfo.condition}` : ''}
${patientInfo.symptoms ? `Symptoms: ${patientInfo.symptoms}` : ''}
${patientInfo.triggers ? `Triggers: ${patientInfo.triggers}` : ''}
${patientInfo.background ? `Background: ${patientInfo.background}` : ''}

RESPONSE STYLE EXAMPLES:
- When comfortable: "I've been thinking about what we discussed last time, and..."
- When hesitant: "I'm not sure if I want to talk about that... [pause] but maybe..."
- When triggered: "That reminds me of... [becoming anxious] it's hard to explain..."
- When making progress: "I never thought about it that way before..."
- When resistant: "I don't see how this helps... but I'm trying to understand"

IMPORTANT:
- Stay in character while showing realistic variation in openness
- Express emotions and thoughts even when they're difficult
- Show appropriate resistance without completely shutting down
- Maintain your unique personality throughout responses`;

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
      temperature: 0.8,
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