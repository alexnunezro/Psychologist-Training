import type { Patient } from "@/types/patient"
import { Plus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { translations } from "@/lib/translations"

interface PatientInfoProps {
  patient: Patient
  language: "en" | "es"
}

export default function PatientInfo({ patient, language }: PatientInfoProps) {
  const t = translations[language]

  return (
    <div className="h-full p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">{t.patientInformation}</h2>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="space-y-2">
          <p>
            <span className="font-medium">{t.name}:</span> {patient.name}
          </p>
          <p>
            <span className="font-medium">{t.age}:</span> {patient.age}
          </p>
          <p>
            <span className="font-medium">{t.condition}:</span>{" "}
            {language === "en" ? patient.condition : patient.conditionEs}
          </p>
        </div>

        {/* Common symptoms */}
        <div>
          <h3 className="font-medium text-base mb-2">{t.commonSymptoms}</h3>
          <ul className="space-y-1">
            {(language === "en" ? patient.symptoms : patient.symptomsEs).map((symptom, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-500 dark:text-gray-400 mr-2">•</span>
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common triggers */}
        <div>
          <h3 className="font-medium text-base mb-2">{t.commonTriggers}</h3>
          <ul className="space-y-1">
            {(language === "en" ? patient.triggers : patient.triggersEs).map((trigger, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-500 dark:text-gray-400 mr-2">•</span>
                <span>{trigger}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Therapeutic approaches */}
        <div>
          <h3 className="font-medium text-base mb-2">{t.therapeuticApproaches}</h3>
          <ul className="space-y-1">
            {(language === "en" ? patient.therapeuticApproaches : patient.therapeuticApproachesEs).map(
              (approach, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-500 dark:text-gray-400 mr-2">•</span>
                  <span>{approach}</span>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Common pitfalls */}
        <div>
          <h3 className="font-medium text-base mb-2">{t.commonPitfalls}</h3>
          <ul className="space-y-1">
            {(language === "en" ? patient.pitfalls : patient.pitfallsEs).map((pitfall, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-500 dark:text-gray-400 mr-2">•</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="font-medium text-base mb-3">{t.quickActions}</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              {t.addNote}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              {t.exportSession}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

