import { useState } from "react"

export function useShowPatientList() {
  const [showPatientList, setShowPatientList] = useState(true)
  return { showPatientList, setShowPatientList }
} 