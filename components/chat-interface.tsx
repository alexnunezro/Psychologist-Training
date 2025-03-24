"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { Patient } from "@/types/patient"
import { Send, Trash2, ChevronLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { translations } from "@/lib/translations"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender: "user" | "patient"
  text: string
  timestamp: Date
  sentiment?: "negative" | "neutral" | "positive"
  isPatientLeaving?: boolean
  triggerType?: "unprofessional" | "pitfall" | "condition-specific"
}

interface ChatInterfaceProps {
  patient: Patient
  language: "en" | "es"
  messages: Message[]
  updateMessages: (messages: Message[]) => void
  onBack?: () => void
  isMobile?: boolean
  customPrompt?: string
}

// Define condition-specific sensitivity levels and triggers
const conditionSensitivity = {
  "Anxiety Disorder": {
    sensitivityLevel: 0.8, // Higher sensitivity
    triggers: [
      /\b(just calm down|relax|stop worrying|it's all in your head)\b/i,
      /\b(no big deal|get over it|everyone gets anxious)\b/i,
    ]
  },
  "Depression": {
    sensitivityLevel: 0.7,
    triggers: [
      /\b(cheer up|just be happy|snap out of it|try harder)\b/i,
      /\b(others have it worse|you're being dramatic)\b/i,
    ]
  },
  "Social Anxiety": {
    sensitivityLevel: 0.9, // Very high sensitivity
    triggers: [
      /\b(just talk to people|put yourself out there|it's easy)\b/i,
      /\b(everyone feels that way|you're overthinking)\b/i,
    ]
  },
  "PTSD": {
    sensitivityLevel: 0.95, // Extremely high sensitivity
    triggers: [
      /\b(get past it|move on|forget about it|let it go)\b/i,
      /\b(happened long ago|dwelling on the past)\b/i,
    ]
  }
}

const detectNegativeTherapistBehavior = (text: string, patient: Patient): { isNegative: boolean, triggerType?: "unprofessional" | "pitfall" | "condition-specific", severity: number } => {
  // Unprofessional language patterns (base triggers)
  const unprofessionalPatterns = [
    // Unprofessional language
    /\b(stupid|idiot|useless|dumb|shut up|incompetent)\b/i,
    // Hostile behavior
    /\b(hate|angry|upset|fuck|shit|damn|hell)\b/i,
    // Dismissive behavior
    /\b(whatever|don't care|pointless|waste of time)\b/i,
    // Spanish equivalents
    /\b(estúpido|idiota|inútil|tonto|cállate|incompetente)\b/i,
    /\b(odio|enojado|molesto|mierda|carajo|infierno)\b/i,
    /\b(lo que sea|no me importa|sin sentido|pérdida de tiempo)\b/i,
    // Aggressive punctuation
    /[!]{2,}/,
    // All caps (shouting)
    /^[A-Z\s!?.]{4,}$/
  ]

  // Check for unprofessional behavior first (highest severity)
  if (unprofessionalPatterns.some(pattern => pattern.test(text))) {
    return { isNegative: true, triggerType: "unprofessional", severity: 1.0 }
  }

  // Get condition-specific sensitivity and triggers
  const conditionConfig = conditionSensitivity[patient.condition as keyof typeof conditionSensitivity]
  if (conditionConfig) {
    if (conditionConfig.triggers.some(pattern => pattern.test(text))) {
      return { 
        isNegative: true, 
        triggerType: "condition-specific", 
        severity: conditionConfig.sensitivityLevel 
      }
    }
  }

  // Check against patient's specific pitfalls
  const pitfallTriggers = patient.pitfalls.map(pitfall => 
    new RegExp(`\\b(${pitfall.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i')
  )
  if (pitfallTriggers.some(pattern => pattern.test(text))) {
    return { 
      isNegative: true, 
      triggerType: "pitfall", 
      severity: conditionConfig?.sensitivityLevel || 0.6 
    }
  }

  return { isNegative: false, severity: 0 }
}

const getPatientResponse = (language: "en" | "es", patient: Patient, triggerType: "unprofessional" | "pitfall" | "condition-specific", severity: number): string => {
  const responses = {
    unprofessional: {
      en: [
        "I don't feel comfortable continuing this session. I think I should leave.",
        "Your behavior is making me very uncomfortable. I need to end this session.",
        "I don't think this is a productive therapeutic environment. I'll have to leave.",
        `As your patient, I feel disrespected. I'll have to find another therapist.`,
        "This isn't helpful for my mental health. I'm leaving now."
      ],
      es: [
        "No me siento cómodo/a continuando esta sesión. Creo que debo irme.",
        "Tu comportamiento me está haciendo sentir muy incómodo/a. Necesito terminar esta sesión.",
        "No creo que este sea un ambiente terapéutico productivo. Tendré que irme.",
        `Como tu paciente, me siento irrespetado/a. Tendré que buscar otro terapeuta.`,
        "Esto no está ayudando a mi salud mental. Me voy ahora."
      ]
    },
    "condition-specific": {
      en: [
        "That kind of response isn't helpful for someone with my condition.",
        "I feel like you don't understand what it's like to deal with this.",
        "Those words are actually very triggering for me.",
        "I need someone who better understands my specific struggles."
      ],
      es: [
        "Ese tipo de respuesta no es útil para alguien con mi condición.",
        "Siento que no entiendes lo que es lidiar con esto.",
        "Esas palabras son realmente desencadenantes para mí.",
        "Necesito alguien que entienda mejor mis luchas específicas."
      ]
    },
    pitfall: {
      en: [
        "I notice you're falling into some common pitfalls in treating my condition.",
        "This approach might work for others, but it's not appropriate for my situation.",
        "I need to point out that this is one of the therapeutic approaches to avoid in my case.",
        "I'm not feeling heard or understood when you take this approach."
      ],
      es: [
        "Noto que estás cayendo en algunos errores comunes al tratar mi condición.",
        "Este enfoque podría funcionar para otros, pero no es apropiado para mi situación.",
        "Debo señalar que este es uno de los enfoques terapéuticos a evitar en mi caso.",
        "No me siento escuchado/a ni comprendido/a cuando tomas este enfoque."
      ]
    }
  }

  const responseSet = responses[triggerType][language]
  const randomIndex = Math.floor(Math.random() * responseSet.length)
  
  // If severity is high enough, add a leaving statement
  if (severity > 0.8) {
    const leavingStatement = language === "en" 
      ? " I think I need to find a therapist who better understands my condition."
      : " Creo que necesito encontrar un terapeuta que entienda mejor mi condición."
    return responseSet[randomIndex] + leavingStatement
  }
  
  return responseSet[randomIndex]
}

export default function ChatInterface({
  patient,
  language,
  messages,
  updateMessages,
  onBack,
  isMobile,
  customPrompt,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasPatientLeft, setHasPatientLeft] = useState(false)
  const [discomfortLevel, setDiscomfortLevel] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const t = translations[language]

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    setInputValue("") // Clear input immediately

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, newMessage]
    updateMessages(updatedMessages)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text
          })),
          patientInfo: {
            name: patient.name,
            age: patient.age,
            condition: patient.condition,
            symptoms: patient.symptoms,
            triggers: patient.triggers
          },
          customPrompt
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const patientResponse: Message = {
        id: Date.now().toString(),
        sender: "patient",
        text: data.content,
        timestamp: new Date(),
      }

      updateMessages([...updatedMessages, patientResponse])
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: "patient",
        text: language === "en" ? "I'm sorry, I'm having trouble responding right now." : "Lo siento, tengo problemas para responder en este momento.",
        timestamp: new Date(),
      }
      updateMessages([...updatedMessages, errorMessage])
    }
  }

  const deleteMessage = (messageId: string) => {
    const newMessages = messages.filter((message) => message.id !== messageId)
    updateMessages(newMessages)
    // Reset patient leaving state if we delete the leaving message
    if (hasPatientLeft && messages.find(m => m.isPatientLeaving)?.id === messageId) {
      setHasPatientLeft(false)
      setDiscomfortLevel(0) // Reset discomfort level when resetting the conversation
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || hasPatientLeft) return

    const messageText = inputValue // Store the input value
    setInputValue("") // Clear input immediately

    const { isNegative, triggerType, severity } = detectNegativeTherapistBehavior(messageText, patient)

    if (isNegative && triggerType) {
      // Update discomfort level
      const newDiscomfortLevel = discomfortLevel + severity
      setDiscomfortLevel(newDiscomfortLevel)

      // If accumulated discomfort is high enough or severity is high, patient leaves
      const shouldLeave = newDiscomfortLevel > 1.5 || severity > 0.8

      // Patient response based on trigger type and severity
      const patientMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "patient",
        text: getPatientResponse(language, patient, triggerType, severity),
        timestamp: new Date(),
        sentiment: "negative",
        triggerType,
        isPatientLeaving: shouldLeave
      }

      if (shouldLeave) {
        setHasPatientLeft(true)
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        sender: "user",
        text: messageText,
        timestamp: new Date(),
        sentiment: "negative"
      }

      const newMessages = [...messages, userMessage, patientMessage]
      updateMessages(newMessages)
      return
    }

    // For non-negative interactions, use the new sendMessage function
    await sendMessage(messageText)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Patient header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack} 
              className="mr-1"
              type="button"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="relative h-10 w-10">
            <Image
              src={patient.avatar || "/placeholder.svg"}
              alt={patient.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-medium">{patient.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === "en" ? patient.condition : patient.conditionEs}
            </p>
          </div>
        </div>

        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // Open patient info modal on mobile
              const modal = document.createElement("div")
              modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              modal.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 class="text-lg font-semibold">${patient.name}</h2>
                    <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                  <div id="patient-info-container" class="p-4"></div>
                </div>
              `

              document.body.appendChild(modal)

              // Clone the patient info and append it to the modal
              const patientInfoContainer = document.getElementById("patient-info-container")
              const patientInfoClone = document.createElement("div")
              patientInfoClone.innerHTML = `
                <div class="space-y-6">
                  <div class="space-y-2">
                    <p><span class="font-medium">${t.name}:</span> ${patient.name}</p>
                    <p><span class="font-medium">${t.age}:</span> ${patient.age}</p>
                    <p><span class="font-medium">${t.condition}:</span> ${language === "en" ? patient.condition : patient.conditionEs}</p>
                  </div>
                  
                  <div>
                    <h3 class="font-medium text-base mb-2">${t.commonSymptoms}</h3>
                    <ul class="space-y-1">
                      ${(language === "en" ? patient.symptoms : patient.symptomsEs)
                        .map(
                          (symptom) =>
                            `<li class="flex items-start">
                          <span class="text-gray-500 dark:text-gray-400 mr-2">•</span>
                          <span>${symptom}</span>
                        </li>`,
                        )
                        .join("")}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 class="font-medium text-base mb-2">${t.commonTriggers}</h3>
                    <ul class="space-y-1">
                      ${(language === "en" ? patient.triggers : patient.triggersEs)
                        .map(
                          (trigger) =>
                            `<li class="flex items-start">
                          <span class="text-gray-500 dark:text-gray-400 mr-2">•</span>
                          <span>${trigger}</span>
                        </li>`,
                        )
                        .join("")}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 class="font-medium text-base mb-2">${t.therapeuticApproaches}</h3>
                    <ul class="space-y-1">
                      ${(language === "en" ? patient.therapeuticApproaches : patient.therapeuticApproachesEs)
                        .map(
                          (approach) =>
                            `<li class="flex items-start">
                          <span class="text-gray-500 dark:text-gray-400 mr-2">•</span>
                          <span>${approach}</span>
                        </li>`,
                        )
                        .join("")}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 class="font-medium text-base mb-2">${t.commonPitfalls}</h3>
                    <ul class="space-y-1">
                      ${(language === "en" ? patient.pitfalls : patient.pitfallsEs)
                        .map(
                          (pitfall) =>
                            `<li class="flex items-start">
                          <span class="text-gray-500 dark:text-gray-400 mr-2">•</span>
                          <span>${pitfall}</span>
                        </li>`,
                        )
                        .join("")}
                    </ul>
                  </div>
                </div>
              `

              patientInfoContainer?.appendChild(patientInfoClone)

              // Add close functionality
              const closeButton = modal.querySelector("button")
              if (closeButton) {
                closeButton.addEventListener("click", () => {
                  document.body.removeChild(modal)
                })
              }

              // Close when clicking outside
              modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                  document.body.removeChild(modal)
                }
              })
            }}
            type="button"
          >
            <Info className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 items-start group",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.sender === "patient" && (
              <div className="relative h-8 w-8 flex-shrink-0">
                <Image
                  src={patient.avatar || "/placeholder.svg"}
                  alt={patient.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[80%] break-words relative group",
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800",
                message.sentiment === "negative" && "animate-shake",
                message.isPatientLeaving && "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium"
              )}
            >
              <p>{message.text}</p>
              <button
                onClick={() => deleteMessage(message.id)}
                className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
              </button>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 items-start">
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image
                src={patient.avatar || "/placeholder.svg"}
                alt={patient.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-100">•</span>
                <span className="animate-bounce delay-200">•</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={hasPatientLeft ? (language === "en" ? "Patient has left the session" : "El paciente ha abandonado la sesión") : t.typeMessage}
            disabled={hasPatientLeft}
            className={cn(
              "flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
              hasPatientLeft && "opacity-50 cursor-not-allowed"
            )}
          />
          <Button type="submit" size="icon" disabled={hasPatientLeft}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

