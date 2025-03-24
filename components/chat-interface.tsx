"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { Patient } from "@/types/patient"
import { Send, Trash2, ChevronLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPatientResponse } from "@/lib/chat-logic"
import { translations } from "@/lib/translations"

interface Message {
  id: string
  sender: "user" | "patient"
  text: string
  timestamp: Date
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const t = translations[language]

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    updateMessages(newMessages)
    setInputValue("")

    try {
      // Get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          patientInfo: {
            name: patient.name,
            age: patient.age,
            condition: patient.condition,
            symptoms: patient.symptoms,
            triggers: patient.triggers,
          },
          language,
          customPrompt,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      // Add AI response
      const patientMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "patient",
        text: data.response,
        timestamp: new Date(),
      }

      updateMessages([...newMessages, patientMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "patient",
        text: language === "en" 
          ? "I'm sorry, I'm not feeling well right now. Can we talk later?" 
          : "Lo siento, no me siento bien ahora. ¿Podemos hablar más tarde?",
        timestamp: new Date(),
      }
      updateMessages([...newMessages, errorMessage])
    }
  }

  const deleteMessage = (messageId: string) => {
    const newMessages = messages.filter((message) => message.id !== messageId)
    updateMessages(newMessages)
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 relative group ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              <p>{message.text}</p>

              {/* Delete button */}
              <button
                className="absolute -right-2 -top-2 bg-white dark:bg-gray-700 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteMessage(message.id)}
                type="button"
              >
                <Trash2 className="h-3 w-3 text-red-500" />
              </button>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder={t.typeYourResponse}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <Button onClick={handleSendMessage} size="icon" type="button">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

