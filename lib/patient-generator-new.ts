import type { Patient } from "@/types/patient"

// Helper function to get random item from array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Helper function to generate random array of items
function generateRandomArray<T>(items: T[], count: number): T[] {
  const result: T[] = []
  const shuffled = [...items].sort(() => 0.5 - Math.random())

  for (let i = 0; i < Math.min(count, items.length); i++) {
    result.push(shuffled[i])
  }

  return result
}

// Generate random responses
function generateRandomResponses(responseOptions: Record<string, string[]>): Record<string, string[]> {
  const result: Record<string, string[]> = {
    default: []
  }

  // Always include default category
  if (responseOptions.default) {
    result.default = generateRandomArray(responseOptions.default, Math.floor(Math.random() * 3) + 3)
  }

  // Add some random categories
  const categories = Object.keys(responseOptions).filter((cat) => cat !== "default")
  const selectedCategories = generateRandomArray(categories, Math.floor(Math.random() * 3) + 1)

  selectedCategories.forEach((category) => {
    if (responseOptions[category]) {
      result[category] = generateRandomArray(responseOptions[category], Math.floor(Math.random() * 3) + 2)
    }
  })

  return result
}

// Data for random generation
const firstNames = [
  "James",
  "Emma",
  "Michael",
  "Olivia",
  "William",
  "Sophia",
  "David",
  "Isabella",
  "Joseph",
  "Mia",
  "Carlos",
  "Elena",
  "Jamal",
  "Aisha",
  "Wei",
  "Mei",
  "Raj",
  "Priya",
]

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Chen",
  "Wong",
  "Patel",
  "Singh",
  "Kim",
  "Lee",
  "Nguyen",
  "Ali",
]

const conditions = {
  "Anxiety Disorder": {
    es: "Trastorno de Ansiedad",
    symptoms: [
      "Excessive worry and fear",
      "Restlessness or feeling on edge",
      "Rapid heartbeat",
      "Difficulty concentrating",
      "Sleep problems",
      "Muscle tension",
      "Irritability",
      "Avoidance behaviors",
    ],
    symptomsEs: [
      "Preocupación y miedo excesivos",
      "Inquietud o sensación de estar al límite",
      "Latidos cardíacos rápidos",
      "Dificultad para concentrarse",
      "Problemas de sueño",
      "Tensión muscular",
      "Irritabilidad",
      "Comportamientos de evitación",
    ],
    triggers: [
      "Social situations",
      "Work or academic pressure",
      "Health concerns",
      "Financial worries",
      "Family issues",
      "Public speaking",
      "Crowded places",
      "Uncertainty",
    ],
    triggersEs: [
      "Situaciones sociales",
      "Presión laboral o académica",
      "Preocupaciones de salud",
      "Preocupaciones financieras",
      "Problemas familiares",
      "Hablar en público",
      "Lugares concurridos",
      "Incertidumbre",
    ],
    approaches: [
      "Cognitive Behavioral Therapy (CBT)",
      "Mindfulness and relaxation techniques",
      "Exposure therapy",
      "Progressive muscle relaxation",
      "Deep breathing exercises",
      "Acceptance and Commitment Therapy",
      "Medication management",
      "Lifestyle changes",
    ],
    approachesEs: [
      "Terapia Cognitivo-Conductual (TCC)",
      "Técnicas de atención plena y relajación",
      "Terapia de exposición",
      "Relajación muscular progresiva",
      "Ejercicios de respiración profunda",
      "Terapia de Aceptación y Compromiso",
      "Manejo de medicamentos",
      "Cambios en el estilo de vida",
    ],
    pitfalls: [
      "Avoiding anxiety-provoking situations",
      "Reassurance-seeking behavior",
      "Catastrophizing",
      "Overgeneralization",
      "All-or-nothing thinking",
      "Enabling avoidance",
      "Focusing only on medication",
      "Ignoring physical health",
    ],
    pitfallsEs: [
      "Evitar situaciones que provocan ansiedad",
      "Comportamiento de búsqueda de tranquilidad",
      "Catastrofización",
      "Sobregeneralización",
      "Pensamiento de todo o nada",
      "Permitir la evitación",
      "Centrarse solo en la medicación",
      "Ignorar la salud física",
    ],
    responses: {
      default: [
        "I feel like something bad is going to happen all the time.",
        "My heart races even when I'm just sitting still sometimes.",
        "I've been avoiding social gatherings because they make me so nervous.",
        "Sometimes I can't catch my breath and I think I might be dying.",
        "I keep checking things over and over to make sure everything is okay.",
        "I worry about things that most people don't even think about.",
        "My mind never seems to shut off, especially at night.",
      ],
      sleep: [
        "I lie awake for hours before I can fall asleep.",
        "I wake up multiple times during the night with my mind racing.",
        "I've tried everything - melatonin, white noise, no screens before bed.",
        "I'm exhausted all day but then can't sleep at night.",
        "I have nightmares about the things I worry about.",
      ],
      work: [
        "I'm constantly worried I'll make a mistake at work and get fired.",
        "I check my emails constantly even on weekends because I'm afraid I'll miss something important.",
        "My colleagues seem to handle pressure so much better than I do.",
        "I rehearse what I'm going to say in meetings over and over.",
        "I feel like I'm always one mistake away from disaster at work.",
      ],
      social: [
        "I cancel plans at the last minute because I get too anxious.",
        "I worry that people are judging me when I'm in public.",
        "I rehearse conversations in my head before social events.",
        "I feel like I don't know what to say in group settings.",
        "I analyze everything I said after social interactions.",
      ],
    },
    responsesEs: {
      default: [
        "Siento que algo malo va a pasar todo el tiempo.",
        "Mi corazón se acelera incluso cuando estoy sentado sin moverme.",
        "He estado evitando reuniones sociales porque me ponen muy nervioso.",
        "A veces no puedo respirar y pienso que podría estar muriendo.",
        "Sigo revisando las cosas una y otra vez para asegurarme de que todo está bien.",
        "Me preocupo por cosas en las que la mayoría de la gente ni siquiera piensa.",
        "Mi mente nunca parece apagarse, especialmente por la noche.",
      ],
      sleep: [
        "Me quedo despierto durante horas antes de poder dormirme.",
        "Me despierto varias veces durante la noche con la mente acelerada.",
        "He probado de todo - melatonina, ruido blanco, no usar pantallas antes de dormir.",
        "Estoy agotado todo el día pero luego no puedo dormir por la noche.",
        "Tengo pesadillas sobre las cosas que me preocupan.",
      ],
      work: [
        "Estoy constantemente preocupado de cometer un error en el trabajo y que me despidan.",
        "Reviso mis correos electrónicos constantemente incluso los fines de semana porque temo perderme algo importante.",
        "Mis colegas parecen manejar la presión mucho mejor que yo.",
        "Ensayo lo que voy a decir en las reuniones una y otra vez.",
        "Siento que siempre estoy a un error de distancia del desastre en el trabajo.",
      ],
      social: [
        "Cancelo planes a último momento porque me pongo demasiado ansioso.",
        "Me preocupa que la gente me juzgue cuando estoy en público.",
        "Ensayo conversaciones en mi cabeza antes de eventos sociales.",
        "Siento que no sé qué decir en entornos grupales.",
        "Analizo todo lo que dije después de las interacciones sociales.",
      ],
    },
  },
  // ... other conditions ...
}

// Generate a random patient
export function generateRandomPatient(id: string): Patient {
  const firstName = getRandomItem(firstNames)
  const lastName = getRandomItem(lastNames)
  const age = Math.floor(Math.random() * 40) + 18 // 18-57 years old

  // Select a random condition
  const conditionKey = getRandomItem(Object.keys(conditions)) as keyof typeof conditions
  const condition = conditions[conditionKey]

  // Generate random symptoms, triggers, approaches, and pitfalls
  const symptoms = generateRandomArray([...condition.symptoms], Math.floor(Math.random() * 3) + 3)
  const symptomsEs = generateRandomArray([...condition.symptomsEs], symptoms.length)

  const triggers = generateRandomArray([...condition.triggers], Math.floor(Math.random() * 3) + 3)
  const triggersEs = generateRandomArray([...condition.triggersEs], triggers.length)

  const approaches = generateRandomArray([...condition.approaches], Math.floor(Math.random() * 3) + 3)
  const approachesEs = generateRandomArray([...condition.approachesEs], approaches.length)

  const pitfalls = generateRandomArray([...condition.pitfalls], Math.floor(Math.random() * 3) + 3)
  const pitfallsEs = generateRandomArray([...condition.pitfallsEs], pitfalls.length)

  // Generate random responses
  const responses = generateRandomResponses({...condition.responses})
  const responsesEs = generateRandomResponses({...condition.responsesEs})

  // Select a random last message
  const lastMessage = getRandomItem([...condition.responses.default])
  const lastMessageEs = getRandomItem([...condition.responsesEs.default])

  return {
    id,
    name: `${firstName} ${lastName}`,
    age,
    condition: conditionKey,
    conditionEs: condition.es,
    avatar: `/placeholder.svg?height=80&width=80`,
    lastMessage,
    lastMessageEs,
    symptoms,
    symptomsEs,
    triggers,
    triggersEs,
    therapeuticApproaches: approaches,
    therapeuticApproachesEs: approachesEs,
    pitfalls,
    pitfallsEs,
    responses,
    responsesEs,
  }
} 