import { useState } from "react"

export function useLanguage() {
  const [language, setLanguage] = useState<"en" | "es">("en")
  return { language, setLanguage }
} 