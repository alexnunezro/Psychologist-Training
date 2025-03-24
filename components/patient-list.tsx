"use client"

import Image from "next/image"
import type { Patient } from "@/types/patient"
import { UserPlus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { translations } from "@/lib/translations"
import ThemeToggle from "@/components/theme-toggle"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PatientListProps {
  patients: Patient[]
  selectedPatient: Patient
  onSelectPatient: (patient: Patient) => void
  language: "en" | "es"
  addNewConversation: (patientId: string) => void
  onAddPatient: () => void
  onBack?: () => void
  isMobile?: boolean
  onDeleteConversation: (patientId: string) => void
  showPatientList: boolean
  onToggleList: () => void
  hideHeader?: boolean
}

export default function PatientList({
  patients,
  selectedPatient,
  onSelectPatient,
  language,
  addNewConversation,
  onAddPatient,
  onBack,
  isMobile,
  onDeleteConversation,
  showPatientList,
  onToggleList,
  hideHeader = false,
}: PatientListProps) {
  const t = translations[language]

  const handleClick = (e: React.MouseEvent, patient: Patient) => {
    const target = e.target as HTMLElement
    if (!target.closest('[data-delete-button]')) {
      onSelectPatient(patient)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedPatient?.id === patient.id ? "bg-gray-100 dark:bg-gray-700" : ""
            }`}
            onClick={(e) => handleClick(e, patient)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="relative h-8 w-8">
                  <Image
                    src={patient.avatar || "/placeholder.svg"}
                    alt={patient.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{patient.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {patient.age} • {language === "en" ? patient.condition : patient.conditionEs}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        data-delete-button
                        className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {language === "en" ? "Delete Patient Case" : "Eliminar Caso del Paciente"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {language === "en" 
                            ? `Are you sure you want to delete ${patient.name}'s case? This action cannot be undone.`
                            : `¿Estás seguro de que quieres eliminar el caso de ${patient.name}? Esta acción no se puede deshacer.`
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {language === "en" ? "Cancel" : "Cancelar"}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800"
                          onClick={() => onDeleteConversation(patient.id)}
                        >
                          {language === "en" ? "Delete" : "Eliminar"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add new patient button */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => onAddPatient()}
          >
            <UserPlus className="h-4 w-4" />
            <span>{t.addPatient}</span>
          </Button>
        </div>
      </div>

      {/* Theme toggle */}
      <div className="p-4 flex justify-end border-t border-gray-200 dark:border-gray-700">
        <ThemeToggle />
      </div>
    </div>
  )
}

