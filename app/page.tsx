"use client"

import { useState } from "react"
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { translations } from "@/lib/translations"
import PatientList from "@/components/patient-list"
import ChatInterface from "@/components/chat-interface"
import PatientInfo from "@/components/patient-info"
import { patients as patientsData } from "@/data/patients"
import LanguageToggle from "@/components/language-toggle"
import type { Patient } from "@/types/patient"
import PatientEditor from "@/components/patient-editor"
import { useMobileDetect } from "@/hooks/use-mobile"
import { useLanguage } from "@/hooks/use-language"
import { useShowPatientInfo } from "@/hooks/use-show-patient-info"
import { useShowPatientList } from "@/hooks/use-show-patient-list"
import { usePatients } from "@/hooks/use-patients"

export default function Home() {
  const { language, setLanguage } = useLanguage()
  const { showPatientInfo, setShowPatientInfo } = useShowPatientInfo()
  const { showPatientList, setShowPatientList } = useShowPatientList()
  const { 
    patients,
    setPatients,
    selectedPatient,
    setSelectedPatient,
    deletePatient,
    addPatient
  } = usePatients()

  const [conversations, setConversations] = useState<Record<string, { messages: any[] }>>({
    [patientsData[0].id]: {
      messages: [],
    },
  })
  const [isPatientEditorOpen, setIsPatientEditorOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const isMobileScreen = useMobileDetect()
  const [showChat, setShowChat] = useState(false)

  const t = translations[language as keyof typeof translations]

  const deleteConversation = (patientId: string) => {
    deletePatient(patientId)
    
    // Remove their conversation
    setConversations((prev: Record<string, { messages: any[] }>) => {
      const newConversations = { ...prev }
      delete newConversations[patientId]
      return newConversations
    })
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
          ${showPatientList ? "md:w-64" : "md:w-[57px]"}
          w-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 
          flex flex-col transition-all duration-300 ease-in-out`}
      >
        <div className="flex h-[57px] items-center border-b border-gray-200 dark:border-gray-700 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPatientList(!showPatientList)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPatientList ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
          {showPatientList && <h2 className="text-lg font-semibold ml-3">{t.patientCases}</h2>}
        </div>
        
        <div className={`${showPatientList ? "block" : "hidden"} flex-1 overflow-hidden`}>
          <PatientList
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={(patient) => {
              setSelectedPatient(patient)
              if (isMobileScreen) {
                setShowChat(true)
              }
            }}
            language={language}
            addNewConversation={addNewConversation}
            onAddPatient={() => setIsPatientEditorOpen(true)}
            isMobile={isMobileScreen}
            onDeleteConversation={deleteConversation}
            showPatientList={showPatientList}
            onToggleList={() => setShowPatientList(!showPatientList)}
            hideHeader={true}
          />
        </div>
      </div>

      {/* Main chat area */}
      <div className={`${!showChat && isMobileScreen ? "hidden" : ""} flex-1 flex`}>
        <div className="flex-1 flex flex-col">
          <ChatInterface
            patient={selectedPatient}
            messages={conversations[selectedPatient.id]?.messages || []}
            updateMessages={(messages) => updateConversation(selectedPatient.id, messages)}
            language={language}
            onBack={() => setShowChat(false)}
            isMobile={isMobileScreen}
          />
        </div>

        {/* Patient info sidebar */}
        {showPatientInfo && (
          <div className="hidden md:block w-64 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <PatientInfo patient={selectedPatient} language={language} />
          </div>
        )}
      </div>

      {/* Language toggle */}
      <div className="fixed bottom-4 left-4">
        <LanguageToggle language={language} setLanguage={setLanguage} />
      </div>

      {/* Patient editor modal */}
      {isPatientEditorOpen && (
        <PatientEditor
          patient={editingPatient}
          onClose={() => {
            setIsPatientEditorOpen(false)
            setEditingPatient(null)
          }}
          onSave={(patient) => {
            if (editingPatient) {
              setPatients((prev) =>
                prev.map((p) => (p.id === patient.id ? patient : p))
              )
            } else {
              setPatients((prev) => [...prev, patient])
              addNewConversation(patient.id)
            }
            setIsPatientEditorOpen(false)
            setEditingPatient(null)
          }}
          language={language}
        />
      )}
    </main>
  )
}

