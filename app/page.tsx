"use client"

import { useState } from "react"
import PatientList from "@/components/patient-list"
import ChatInterface from "@/components/chat-interface"
import PatientInfo from "@/components/patient-info"
import { patients as patientsData } from "@/data/patients"
import LanguageToggle from "@/components/language-toggle"
import type { Patient } from "@/types/patient"
import PatientEditor from "@/components/patient-editor"
import { useMobileDetect } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { PanelRightClose, PanelRightOpen } from "lucide-react"

export default function Home() {
  const [selectedPatient, setSelectedPatient] = useState(patientsData[0])
  const [language, setLanguage] = useState<"en" | "es">("en")
  const [conversations, setConversations] = useState<Record<string, any>>({
    [patientsData[0].id]: {
      messages: [],
    },
  })
  const [isPatientEditorOpen, setIsPatientEditorOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [patients, setPatients] = useState<Patient[]>(patientsData)
  const isMobileScreen = useMobileDetect()
  const [showChat, setShowChat] = useState(false)
  const [showPatientInfo, setShowPatientInfo] = useState(true)
  const [showPatientList, setShowPatientList] = useState(true)

  const deleteConversation = (patientId: string) => {
    // Remove the patient from the patients list
    setPatients((prev) => prev.filter(p => p.id !== patientId))
    
    // Remove their conversation
    setConversations((prev) => {
      const newConversations = { ...prev }
      delete newConversations[patientId]
      return newConversations
    })
    
    // If we deleted the currently selected patient, select the first available patient
    if (selectedPatient?.id === patientId) {
      const remainingPatients = patients.filter(p => p.id !== patientId)
      if (remainingPatients.length > 0) {
        setSelectedPatient(remainingPatients[0])
      }
    }
  }

  const addNewConversation = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    if (!patient) return

    setConversations((prev) => ({
      ...prev,
      [patientId]: {
        messages: [],
      },
    }))
  }

  const updateConversation = (patientId: string, messages: any[]) => {
    setConversations((prev) => ({
      ...prev,
      [patientId]: {
        ...prev[patientId],
        messages,
      },
    }))
  }

  return (
    <main className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      {/* Patient list sidebar - full width on mobile, fixed width on desktop */}
      <div
        className={`${showChat && isMobileScreen ? "hidden" : ""} 
          ${showPatientList ? "md:block" : "md:hidden"} 
          w-full md:w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 
          ${isMobileScreen ? "h-screen" : ""}`}
      >
        <PatientList
          patients={patients}
          selectedPatient={selectedPatient}
          onSelectPatient={(patient) => {
            setSelectedPatient(patient)
            if (isMobileScreen) setShowChat(true)
          }}
          language={language}
          addNewConversation={addNewConversation}
          onAddPatient={() => {
            setEditingPatient(null)
            setIsPatientEditorOpen(true)
          }}
          onBack={() => setShowChat(false)}
          isMobile={isMobileScreen}
          onDeleteConversation={deleteConversation}
          showPatientList={showPatientList}
          onToggleList={() => setShowPatientList(!showPatientList)}
        />
      </div>

      {/* Chat interface - hidden on mobile when no patient selected or when viewing patient list */}
      <div
        className={`${!selectedPatient || (isMobileScreen && !showChat) ? "hidden md:flex" : "flex"} flex-1 flex-col relative`}
      >
        <ChatInterface
          patient={selectedPatient}
          language={language}
          messages={conversations[selectedPatient?.id]?.messages || []}
          updateMessages={(messages) => updateConversation(selectedPatient.id, messages)}
          onBack={() => setShowChat(false)}
          isMobile={isMobileScreen}
        />
        
        {/* Patient info toggle button */}
        <div className="absolute top-4 right-4 z-10 hidden md:block">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowPatientInfo(!showPatientInfo)}
            className="bg-white dark:bg-gray-800"
          >
            {showPatientInfo ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Patient information sidebar - hidden on mobile */}
      <div className={`hidden ${showPatientInfo ? 'md:block' : 'md:hidden'} w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto`}>
        <PatientInfo patient={selectedPatient} language={language} />
      </div>

      {/* Language toggle - fixed to bottom left with proper z-index and padding */}
      <div className="fixed bottom-4 left-4 z-30">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1">
          <LanguageToggle language={language} setLanguage={setLanguage} />
        </div>
      </div>

      {/* Patient editor modal */}
      {isPatientEditorOpen && (
        <PatientEditor
          patient={editingPatient}
          onClose={() => setIsPatientEditorOpen(false)}
          onSave={(patient) => {
            if (editingPatient) {
              // Update existing patient
              setPatients((prev) => prev.map((p) => (p.id === patient.id ? patient : p)))
            } else {
              // Add new patient
              setPatients((prev) => [...prev, patient])
            }
            setIsPatientEditorOpen(false)
          }}
          language={language}
        />
      )}
    </main>
  )
}

