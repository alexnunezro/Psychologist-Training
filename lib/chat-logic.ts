import type { Patient } from "@/types/patient"

export function getPatientResponse(patient: Patient, userMessage: string, language: "en" | "es"): string {
  const lowerCaseMessage = userMessage.toLowerCase()

  // Check for specific keywords to determine response category
  if (
    lowerCaseMessage.includes("sleep") ||
    lowerCaseMessage.includes("rest") ||
    lowerCaseMessage.includes("tired") ||
    lowerCaseMessage.includes("dormir") ||
    lowerCaseMessage.includes("descanso") ||
    lowerCaseMessage.includes("cansado")
  ) {
    return getRandomResponse(patient, "sleep", language)
  }

  if (
    lowerCaseMessage.includes("work") ||
    lowerCaseMessage.includes("job") ||
    lowerCaseMessage.includes("career") ||
    lowerCaseMessage.includes("trabajo") ||
    lowerCaseMessage.includes("empleo") ||
    lowerCaseMessage.includes("carrera")
  ) {
    return getRandomResponse(patient, "work", language)
  }

  if (
    lowerCaseMessage.includes("party") ||
    lowerCaseMessage.includes("social") ||
    lowerCaseMessage.includes("friend") ||
    lowerCaseMessage.includes("fiesta") ||
    lowerCaseMessage.includes("social") ||
    lowerCaseMessage.includes("amigo")
  ) {
    return getRandomResponse(patient, "party", language) || getRandomResponse(patient, "social", language)
  }

  // Default response if no specific category matches
  return getRandomResponse(patient, "default", language)
}

function getRandomResponse(patient: Patient, category: string, language: "en" | "es"): string {
  const responseKey = language === "en" ? "responses" : "responsesEs"
  const responses = patient[responseKey]?.[category]

  // If the category doesn't exist, fall back to default
  if (!responses || responses.length === 0) {
    return patient[responseKey]["default"][Math.floor(Math.random() * patient[responseKey]["default"].length)]
  }

  // Return a random response from the category
  return responses[Math.floor(Math.random() * responses.length)]
}

