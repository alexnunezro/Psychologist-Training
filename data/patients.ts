import type { Patient } from "@/types/patient"

export const patients: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 28,
    condition: "Anxiety Disorder",
    conditionEs: "Trastorno de Ansiedad",
    avatar: "/placeholder.svg?height=80&width=80",
    lastMessage: "I feel anxious most of the time",
    lastMessageEs: "Me siento ansioso la mayor parte del tiempo",
    symptoms: [
      "Excessive worry and fear",
      "Restlessness or feeling on edge",
      "Rapid heartbeat",
      "Difficulty concentrating",
      "Sleep problems",
    ],
    symptomsEs: [
      "Preocupación y miedo excesivos",
      "Inquietud o sensación de estar al límite",
      "Latidos cardíacos rápidos",
      "Dificultad para concentrarse",
      "Problemas de sueño",
    ],
    triggers: [
      "Social situations",
      "Work or academic pressure",
      "Health concerns",
      "Financial worries",
      "Family issues",
    ],
    triggersEs: [
      "Situaciones sociales",
      "Presión laboral o académica",
      "Preocupaciones de salud",
      "Preocupaciones financieras",
      "Problemas familiares",
    ],
    therapeuticApproaches: [
      "Cognitive Behavioral Therapy (CBT)",
      "Mindfulness and relaxation techniques",
      "Exposure therapy",
      "Progressive muscle relaxation",
      "Deep breathing exercises",
    ],
    therapeuticApproachesEs: [
      "Terapia Cognitivo-Conductual (TCC)",
      "Técnicas de atención plena y relajación",
      "Terapia de exposición",
      "Relajación muscular progresiva",
      "Ejercicios de respiración profunda",
    ],
    pitfalls: [
      "Avoiding anxiety-provoking situations",
      "Reassurance-seeking behavior",
      "Catastrophizing",
      "Overgeneralization",
      "All-or-nothing thinking",
    ],
    pitfallsEs: [
      "Evitar situaciones que provocan ansiedad",
      "Comportamiento de búsqueda de tranquilidad",
      "Catastrofización",
      "Sobregeneralización",
      "Pensamiento de todo o nada",
    ],
    responses: {
      default: [
        "I feel like something bad is going to happen all the time.",
        "My heart races even when I'm just sitting still sometimes.",
        "I've been avoiding social gatherings because they make me so nervous.",
        "Sometimes I can't catch my breath and I think I might be dying.",
        "I keep checking things over and over to make sure everything is okay.",
      ],
      sleep: [
        "I lie awake for hours before I can fall asleep.",
        "I wake up multiple times during the night with my mind racing.",
        "I've tried everything - melatonin, white noise, no screens before bed.",
        "I'm exhausted all day but then can't sleep at night.",
      ],
      work: [
        "I'm constantly worried I'll make a mistake at work and get fired.",
        "I check my emails constantly even on weekends because I'm afraid I'll miss something important.",
        "My colleagues seem to handle pressure so much better than I do.",
      ],
    },
    responsesEs: {
      default: [
        "Siento que algo malo va a pasar todo el tiempo.",
        "Mi corazón se acelera incluso cuando estoy sentada sin moverme.",
        "He estado evitando reuniones sociales porque me ponen muy nerviosa.",
        "A veces no puedo respirar y pienso que podría estar muriendo.",
        "Sigo revisando las cosas una y otra vez para asegurarme de que todo está bien.",
      ],
      sleep: [
        "Me quedo despierta durante horas antes de poder dormirme.",
        "Me despierto varias veces durante la noche con la mente acelerada.",
        "He probado de todo - melatonina, ruido blanco, no usar pantallas antes de dormir.",
        "Estoy agotada todo el día pero luego no puedo dormir por la noche.",
      ],
      work: [
        "Estoy constantemente preocupada de cometer un error en el trabajo y que me despidan.",
        "Reviso mis correos electrónicos constantemente incluso los fines de semana porque temo perderme algo importante.",
        "Mis colegas parecen manejar la presión mucho mejor que yo.",
      ],
    },
  },
  {
    id: "2",
    name: "Michael Chen",
    age: 35,
    condition: "Depression",
    conditionEs: "Depresión",
    avatar: "/placeholder.svg?height=80&width=80",
    lastMessage: "Everything feels overwhelming...",
    lastMessageEs: "Todo se siente abrumador...",
    symptoms: [
      "Persistent sadness",
      "Loss of interest in activities",
      "Fatigue and low energy",
      "Changes in appetite or weight",
      "Feelings of worthlessness",
    ],
    symptomsEs: [
      "Tristeza persistente",
      "Pérdida de interés en actividades",
      "Fatiga y baja energía",
      "Cambios en el apetito o peso",
      "Sentimientos de inutilidad",
    ],
    triggers: ["Major life changes", "Personal losses", "Chronic stress", "Seasonal changes", "Social isolation"],
    triggersEs: [
      "Cambios importantes en la vida",
      "Pérdidas personales",
      "Estrés crónico",
      "Cambios estacionales",
      "Aislamiento social",
    ],
    therapeuticApproaches: [
      "Cognitive Behavioral Therapy (CBT)",
      "Behavioral Activation",
      "Interpersonal Therapy",
      "Mindfulness-Based Cognitive Therapy",
      "Regular physical activity",
    ],
    therapeuticApproachesEs: [
      "Terapia Cognitivo-Conductual (TCC)",
      "Activación Conductual",
      "Terapia Interpersonal",
      "Terapia Cognitiva Basada en Mindfulness",
      "Actividad física regular",
    ],
    pitfalls: [
      "Reinforcing negative self-talk",
      "Focusing only on problems",
      "Encouraging isolation",
      "Setting unrealistic goals",
      "Overlooking small improvements",
    ],
    pitfallsEs: [
      "Reforzar el diálogo interno negativo",
      "Centrarse solo en los problemas",
      "Fomentar el aislamiento",
      "Establecer metas poco realistas",
      "Pasar por alto pequeñas mejoras",
    ],
    responses: {
      default: [
        "I don't see the point in trying anymore.",
        "I feel like I'm just going through the motions every day.",
        "I can't remember the last time I felt happy.",
        "Sometimes I sleep for 12 hours and still feel exhausted.",
        "I used to enjoy playing guitar, but now it just sits in the corner.",
      ],
      work: [
        "I can barely get myself to work each day.",
        "I've been making mistakes because I can't concentrate.",
        "My boss probably thinks I'm lazy, but I just can't find the energy.",
      ],
      social: [
        "I've been avoiding my friends' calls.",
        "Being around people feels exhausting.",
        "I feel like I'm bringing everyone down when I'm around them.",
      ],
    },
    responsesEs: {
      default: [
        "Ya no veo el sentido de intentarlo.",
        "Siento que solo estoy siguiendo los movimientos cada día.",
        "No recuerdo la última vez que me sentí feliz.",
        "A veces duermo 12 horas y aún así me siento agotado.",
        "Solía disfrutar tocando la guitarra, pero ahora simplemente está en un rincón.",
      ],
      work: [
        "Apenas puedo ir a trabajar cada día.",
        "He estado cometiendo errores porque no puedo concentrarme.",
        "Mi jefe probablemente piensa que soy perezoso, pero simplemente no puedo encontrar la energía.",
      ],
      social: [
        "He estado evitando las llamadas de mis amigos.",
        "Estar rodeado de gente se siente agotador.",
        "Siento que estoy deprimiendo a todos cuando estoy con ellos.",
      ],
    },
  },
  {
    id: "3",
    name: "Emma Wilson",
    age: 22,
    condition: "Social Anxiety",
    conditionEs: "Ansiedad Social",
    avatar: "/placeholder.svg?height=80&width=80",
    lastMessage: "I can't go to the party tonight...",
    lastMessageEs: "No puedo ir a la fiesta esta noche...",
    symptoms: [
      "Intense fear of social situations",
      "Avoidance of social events",
      "Physical symptoms like blushing and trembling",
      "Excessive self-consciousness",
      "Fear of judgment",
    ],
    symptomsEs: [
      "Miedo intenso a situaciones sociales",
      "Evitación de eventos sociales",
      "Síntomas físicos como sonrojarse y temblar",
      "Autoconciencia excesiva",
      "Miedo al juicio",
    ],
    triggers: [
      "Public speaking",
      "Being the center of attention",
      "Meeting new people",
      "Being observed while performing tasks",
      "Social gatherings",
    ],
    triggersEs: [
      "Hablar en público",
      "Ser el centro de atención",
      "Conocer gente nueva",
      "Ser observado mientras realiza tareas",
      "Reuniones sociales",
    ],
    therapeuticApproaches: [
      "Cognitive Behavioral Therapy (CBT)",
      "Gradual exposure to feared situations",
      "Social skills training",
      "Role-playing exercises",
      "Mindfulness techniques",
    ],
    therapeuticApproachesEs: [
      "Terapia Cognitivo-Conductual (TCC)",
      "Exposición gradual a situaciones temidas",
      "Entrenamiento en habilidades sociales",
      "Ejercicios de juego de roles",
      "Técnicas de atención plena",
    ],
    pitfalls: [
      "Enabling avoidance behaviors",
      "Setting unrealistic social expectations",
      "Focusing only on negative social outcomes",
      "Reinforcing safety behaviors",
      "Overlooking small social successes",
    ],
    pitfallsEs: [
      "Permitir comportamientos de evitación",
      "Establecer expectativas sociales poco realistas",
      "Centrarse solo en resultados sociales negativos",
      "Reforzar comportamientos de seguridad",
      "Pasar por alto pequeños éxitos sociales",
    ],
    responses: {
      default: [
        "The thought of walking into a room full of people makes me feel sick.",
        "I rehearse what I'm going to say before making a phone call.",
        "I worry that people are judging me when I speak.",
        "I've missed important events because I couldn't handle being around people.",
        "I always think I've said something stupid after conversations.",
      ],
      party: [
        "Just thinking about the party makes my heart race.",
        "What if no one talks to me or I don't know what to say?",
        "I'd rather stay home than risk embarrassing myself.",
        "Last time I went to a party, I spent most of the time hiding in the bathroom.",
      ],
      work: [
        "Team meetings are torture for me.",
        "I eat lunch alone because I'm afraid to join others in the break room.",
        "I've turned down promotions because they would require more social interaction.",
      ],
    },
    responsesEs: {
      default: [
        "La idea de entrar en una habitación llena de gente me hace sentir mal.",
        "Ensayo lo que voy a decir antes de hacer una llamada telefónica.",
        "Me preocupa que la gente me juzgue cuando hablo.",
        "Me he perdido eventos importantes porque no podía soportar estar rodeada de gente.",
        "Siempre pienso que he dicho algo estúpido después de las conversaciones.",
      ],
      party: [
        "Solo pensar en la fiesta hace que mi corazón se acelere.",
        "¿Y si nadie habla conmigo o no sé qué decir?",
        "Prefiero quedarme en casa que arriesgarme a avergonzarme.",
        "La última vez que fui a una fiesta, pasé la mayor parte del tiempo escondida en el baño.",
      ],
      work: [
        "Las reuniones de equipo son una tortura para mí.",
        "Como sola porque tengo miedo de unirme a otros en la sala de descanso.",
        "He rechazado ascensos porque requerirían más interacción social.",
      ],
    },
  },
]

