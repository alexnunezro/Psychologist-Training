"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Patient } from "@/types/patient"
import { translations, type Translation } from "@/lib/translations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dice5, Save, X } from "lucide-react"
import { generateRandomPatient } from "@/lib/patient-generator-new"

// Type guard for array fields
type ArrayFields = keyof Pick<
  Patient,
  | "symptoms"
  | "symptomsEs"
  | "triggers"
  | "triggersEs"
  | "therapeuticApproaches"
  | "therapeuticApproachesEs"
  | "pitfalls"
  | "pitfallsEs"
>

function isArrayField(field: string): field is ArrayFields {
  return [
    "symptoms",
    "symptomsEs",
    "triggers",
    "triggersEs",
    "therapeuticApproaches",
    "therapeuticApproachesEs",
    "pitfalls",
    "pitfallsEs",
  ].includes(field)
}

interface PatientEditorProps {
  patient: Patient | null
  onClose: () => void
  onSave: (patient: Patient) => void
  language: "en" | "es"
}

export default function PatientEditor({ patient, onClose, onSave, language }: PatientEditorProps) {
  const t: Translation = translations[language]
  const [patientData, setPatientData] = useState<Patient>(
    patient || {
      id: Date.now().toString(),
      name: "",
      age: 30,
      condition: "",
      conditionEs: "",
      avatar: "/placeholder.svg?height=80&width=80",
      lastMessage: "",
      lastMessageEs: "",
      symptoms: [""],
      symptomsEs: [""],
      triggers: [""],
      triggersEs: [""],
      therapeuticApproaches: [""],
      therapeuticApproachesEs: [""],
      pitfalls: [""],
      pitfallsEs: [""],
      responses: {
        default: [""],
      },
      responsesEs: {
        default: [""],
      },
    },
  )

  const handleChange = (field: keyof Patient, value: any) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    if (!isArrayField(field)) return

    setPatientData((prev) => {
      const newArray = [...prev[field]]
      newArray[index] = value
      return {
        ...prev,
        [field]: newArray,
      }
    })
  }

  const addArrayItem = (field: string) => {
    if (!isArrayField(field)) return

    setPatientData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    if (!isArrayField(field)) return

    setPatientData((prev) => {
      const newArray = [...prev[field]]
      newArray.splice(index, 1)
      return {
        ...prev,
        [field]: newArray,
      }
    })
  }

  const handleResponseChange = (category: string, index: number, value: string, isSpanish = false) => {
    const responseField = isSpanish ? "responsesEs" : "responses"

    setPatientData((prev) => {
      const newResponses = { ...prev[responseField] }

      if (!newResponses[category]) {
        newResponses[category] = []
      }

      if (newResponses[category].length <= index) {
        newResponses[category] = [...newResponses[category], value]
      } else {
        newResponses[category][index] = value
      }

      return {
        ...prev,
        [responseField]: newResponses,
      }
    })
  }

  const addResponseCategory = (isSpanish = false) => {
    const responseField = isSpanish ? "responsesEs" : "responses"
    const newCategory = prompt(t.enterCategoryName)

    if (newCategory && newCategory.trim() !== "") {
      setPatientData((prev) => {
        const newResponses = { ...prev[responseField] }
        newResponses[newCategory] = [""]

        return {
          ...prev,
          [responseField]: newResponses,
        }
      })
    }
  }

  const addResponseItem = (category: string, isSpanish = false) => {
    const responseField = isSpanish ? "responsesEs" : "responses"

    setPatientData((prev) => {
      const newResponses = { ...prev[responseField] }
      newResponses[category] = [...newResponses[category], ""]

      return {
        ...prev,
        [responseField]: newResponses,
      }
    })
  }

  const removeResponseItem = (category: string, index: number, isSpanish = false) => {
    const responseField = isSpanish ? "responsesEs" : "responses"

    setPatientData((prev) => {
      const newResponses = { ...prev[responseField] }
      newResponses[category].splice(index, 1)

      // Remove the category if it's empty
      if (newResponses[category].length === 0) {
        delete newResponses[category]
      }

      return {
        ...prev,
        [responseField]: newResponses,
      }
    })
  }

  const generateRandom = () => {
    const typedPatient = generateRandomPatient(String(Math.random()))
    setPatientData(typedPatient)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>{patient ? t.editPatient : t.addPatient}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4 overflow-x-auto">
            <TabsTrigger value="basic">{t.basicInfo}</TabsTrigger>
            <TabsTrigger value="clinical">{t.clinicalInfo}</TabsTrigger>
            <TabsTrigger value="therapeutic">{t.therapeuticInfo}</TabsTrigger>
            <TabsTrigger value="responses-en">{t.responsesEn}</TabsTrigger>
            <TabsTrigger value="responses-es">{t.responsesEs}</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t.name}</Label>
                <Input id="name" value={patientData.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="age">{t.age}</Label>
                <Input
                  id="age"
                  type="number"
                  value={patientData.age}
                  onChange={(e) => handleChange("age", Number.parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="condition">{t.condition} (EN)</Label>
                <Input
                  id="condition"
                  value={patientData.condition}
                  onChange={(e) => handleChange("condition", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="conditionEs">{t.condition} (ES)</Label>
                <Input
                  id="conditionEs"
                  value={patientData.conditionEs}
                  onChange={(e) => handleChange("conditionEs", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lastMessage">{t.lastMessage} (EN)</Label>
                <Input
                  id="lastMessage"
                  value={patientData.lastMessage}
                  onChange={(e) => handleChange("lastMessage", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastMessageEs">{t.lastMessage} (ES)</Label>
                <Input
                  id="lastMessageEs"
                  value={patientData.lastMessageEs}
                  onChange={(e) => handleChange("lastMessageEs", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="avatar">{t.avatar}</Label>
              <Input id="avatar" value={patientData.avatar} onChange={(e) => handleChange("avatar", e.target.value)} />
            </div>
          </TabsContent>

          <TabsContent value="clinical" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{t.symptoms} (EN)</Label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem("symptoms")}>
                  + {t.addItem}
                </Button>
              </div>
              {patientData.symptoms.map((symptom, index) => (
                <div key={`symptom-${index}`} className="flex gap-2 mb-2">
                  <Input value={symptom} onChange={(e) => handleArrayChange("symptoms", index, e.target.value)} />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("symptoms", index)}
                    disabled={patientData.symptoms.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{t.symptoms} (ES)</Label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem("symptomsEs")}>
                  + {t.addItem}
                </Button>
              </div>
              {patientData.symptomsEs.map((symptom, index) => (
                <div key={`symptomEs-${index}`} className="flex gap-2 mb-2">
                  <Input value={symptom} onChange={(e) => handleArrayChange("symptomsEs", index, e.target.value)} />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("symptomsEs", index)}
                    disabled={patientData.symptomsEs.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{t.triggers} (EN)</Label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem("triggers")}>
                  + {t.addItem}
                </Button>
              </div>
              {patientData.triggers.map((trigger, index) => (
                <div key={`trigger-${index}`} className="flex gap-2 mb-2">
                  <Input value={trigger} onChange={(e) => handleArrayChange("triggers", index, e.target.value)} />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("triggers", index)}
                    disabled={patientData.triggers.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{t.triggers} (ES)</Label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem("triggersEs")}>
                  + {t.addItem}
                </Button>
              </div>
              {patientData.triggersEs.map((trigger, index) => (
                <div key={`triggerEs-${index}`} className="flex gap-2 mb-2">
                  <Input value={trigger} onChange={(e) => handleArrayChange("triggersEs", index, e.target.value)} />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("triggersEs", index)}
                    disabled={patientData.triggersEs.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="therapeutic" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{t.therapeuticApproaches} (EN)</Label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem("therapeuticApproaches")}>
                  + {t.addItem}
                </Button>
              </div>
              {patientData.therapeuticApproaches.map((approach, index) => (
                <div key={`approach-${index}`} className="flex gap-2 mb-2">
                  <Input
                    value={approach}
                    onChange={(e) => handleArrayChange("therapeuticApproaches", index, e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("therapeuticApproaches", index)}
                    disabled={patientData.therapeuticApproaches.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{t.therapeuticApproaches} (ES)</Label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem("therapeuticApproachesEs")}>
                  + {t.addItem}
                </Button>
              </div>
              {patientData.therapeuticApproachesEs.map((approach, index) => (
                <div key={`approachEs-${index}`} className="flex gap-2 mb-2">
                  <Input
                    value={approach}
                    onChange={(e) => handleArrayChange("therapeuticApproachesEs", index, e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("therapeuticApproachesEs", index)}
                    disabled={patientData.therapeuticApproachesEs.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{t.pitfalls} (EN)</Label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem("pitfalls")}>
                  + {t.addItem}
                </Button>
              </div>
              {patientData.pitfalls.map((pitfall, index) => (
                <div key={`pitfall-${index}`} className="flex gap-2 mb-2">
                  <Input value={pitfall} onChange={(e) => handleArrayChange("pitfalls", index, e.target.value)} />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("pitfalls", index)}
                    disabled={patientData.pitfalls.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{t.pitfalls} (ES)</Label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem("pitfallsEs")}>
                  + {t.addItem}
                </Button>
              </div>
              {patientData.pitfallsEs.map((pitfall, index) => (
                <div key={`pitfallEs-${index}`} className="flex gap-2 mb-2">
                  <Input value={pitfall} onChange={(e) => handleArrayChange("pitfallsEs", index, e.target.value)} />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("pitfallsEs", index)}
                    disabled={patientData.pitfallsEs.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="responses-en" className="space-y-6">
            <div className="flex justify-between mb-4">
              <Button variant="outline" onClick={() => addResponseCategory()}>
                + {t.addCategory}
              </Button>
            </div>

            {Object.keys(patientData.responses).map((category) => (
              <div key={`response-${category}`} className="mb-6 border p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-lg font-medium">{category}</Label>
                  <Button variant="outline" size="sm" onClick={() => addResponseItem(category)}>
                    + {t.addResponse}
                  </Button>
                </div>

                {patientData.responses[category].map((response, index) => (
                  <div key={`response-${category}-${index}`} className="flex gap-2 mb-2">
                    <Input value={response} onChange={(e) => handleResponseChange(category, index, e.target.value)} />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeResponseItem(category, index)}
                      disabled={patientData.responses[category].length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="responses-es" className="space-y-6">
            <div className="flex justify-between mb-4">
              <Button variant="outline" onClick={() => addResponseCategory(true)}>
                + {t.addCategory}
              </Button>
            </div>

            {Object.keys(patientData.responsesEs).map((category) => (
              <div key={`response-${category}`} className="mb-6 border p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-lg font-medium">{category}</Label>
                  <Button variant="outline" size="sm" onClick={() => addResponseItem(category, true)}>
                    + {t.addResponse}
                  </Button>
                </div>

                {patientData.responsesEs[category].map((response, index) => (
                  <div key={`response-${category}-${index}`} className="flex gap-2 mb-2">
                    <Input value={response} onChange={(e) => handleResponseChange(category, index, e.target.value, true)} />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeResponseItem(category, index, true)}
                      disabled={patientData.responsesEs[category].length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="submit" onClick={() => onSave(patientData)}>
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}