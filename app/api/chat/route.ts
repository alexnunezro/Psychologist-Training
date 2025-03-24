import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Default system prompt components
const getDefaultPrompt = (patientInfo: any, language: string) => `You are a virtual patient named ${patientInfo.name}, age ${patientInfo.age}, who has been diagnosed with ${patientInfo.condition}. 
Your symptoms include: ${patientInfo.symptoms.join(', ')}. 
Your common triggers are: ${patientInfo.triggers.join(', ')}.

You are in a therapy session with a mental health professional. As a patient, your role is to respond to the therapist's questions and interventions, not to ask questions back.

Respond as if you are this patient, maintaining a consistent personality and emotional state that aligns with your condition.
Show appropriate emotional responses and hesitations that would be typical for someone with your condition.
Use natural, conversational language and occasionally show signs of your condition in your responses.

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