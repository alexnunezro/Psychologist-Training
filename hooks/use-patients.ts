import { useState } from "react"
import type { Patient } from "@/types/patient"
import { patients as patientsData } from "@/data/patients"

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>(patientsData)
  const [selectedPatient, setSelectedPatient] = useState<Patient>(patientsData[0])

  const deletePatient = (patientId: string) => {
    setPatients((prev) => prev.filter(p => p.id !== patientId))
    if (selectedPatient?.id === patientId) {
      const remainingPatients = patients.filter(p => p.id !== patientId)
      if (remainingPatients.length > 0) {
        setSelectedPatient(remainingPatients[0])
      }
    }
  }

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient])
  }

  return {
    patients,
    setPatients,
    selectedPatient,
    setSelectedPatient,
    deletePatient,
    addPatient
  }
} 