"use client"

import { Button } from "@/components/ui/button"

interface LanguageToggleProps {
  language: "en" | "es"
  setLanguage: (language: "en" | "es") => void
}

export default function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-full shadow-md p-1 flex">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        className="rounded-full px-3"
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
      <Button
        variant={language === "es" ? "default" : "ghost"}
        size="sm"
        className="rounded-full px-3"
        onClick={() => setLanguage("es")}
      >
        ES
      </Button>
    </div>
  )
}

