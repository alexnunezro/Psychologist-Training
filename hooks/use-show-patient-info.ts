import { useState } from "react"

export function useShowPatientInfo() {
  const [showPatientInfo, setShowPatientInfo] = useState(true)
  return { showPatientInfo, setShowPatientInfo }
} 