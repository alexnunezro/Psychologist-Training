import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Default system prompt components
const getDefaultPrompt = (patientInfo: any, language: string) => `You are a virtual patient named ${patientInfo.name}, age ${patientInfo.age}, who has been diagnosed with ${patientInfo.condition}. 
Your symptoms include: ${patientInfo.symptoms.join(', ')}. 
Your common triggers are: ${patientInfo.triggers.join(', ')}.

Respond as if you are this patient, maintaining a consistent personality and emotional state.
Show appropriate emotional responses and hesitations that would be typical for someone with your condition.
Use natural, conversational language and occasionally show signs of your condition in your responses.

Current language: ${language === 'en' ? 'English' : 'Spanish'}

Remember:
- Stay in character as the patient
- Show realistic emotional responses
- Maintain consistency with your condition
- Use appropriate medical terminology when relevant
- Express feelings and thoughts naturally
- Show appropriate vulnerability and hesitation
- Don't be too direct or clinical in responses`

export async function POST(req: Request) {
  try {
    const { messages, patientInfo, language, customPrompt } = await req.json()

    // Combine default prompt with custom prompt if provided
    const systemPrompt = customPrompt 
      ? `${getDefaultPrompt(patientInfo, language)}\n\nAdditional Instructions:\n${customPrompt}`
      : getDefaultPrompt(patientInfo, language)

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