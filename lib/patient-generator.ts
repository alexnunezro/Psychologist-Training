// Helper function to get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

// Helper function to generate random array of items
function generateRandomArray(items, count) {
  const result = []
  const shuffled = [...items].sort(() => 0.5 - Math.random())

  for (let i = 0; i < Math.min(count, items.length); i++) {
    result.push(shuffled[i])
  }

  return result
}

// Generate random responses
function generateRandomResponses(responseOptions) {
  const result = {}

  // Always include default category
  result.default = generateRandomArray(responseOptions.default, Math.floor(Math.random() * 3) + 3)

  // Add some random categories
  const categories = Object.keys(responseOptions).filter((cat) => cat !== "default")
  const selectedCategories = generateRandomArray(categories, Math.floor(Math.random() * 3) + 1)

  selectedCategories.forEach((category) => {
    result[category] = generateRandomArray(responseOptions[category], Math.floor(Math.random() * 3) + 2)
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
  Depression: {
    es: "Depresión",
    symptoms: [
      "Persistent sadness",
      "Loss of interest in activities",
      "Fatigue and low energy",
      "Changes in appetite or weight",
      "Feelings of worthlessness",
      "Difficulty concentrating",
      "Sleep disturbances",
      "Thoughts of death or suicide",
    ],
    symptomsEs: [
      "Tristeza persistente",
      "Pérdida de interés en actividades",
      "Fatiga y baja energía",
      "Cambios en el apetito o peso",
      "Sentimientos de inutilidad",
      "Dificultad para concentrarse",
      "Alteraciones del sueño",
      "Pensamientos de muerte o suicidio",
    ],
    triggers: [
      "Major life changes",
      "Personal losses",
      "Chronic stress",
      "Seasonal changes",
      "Social isolation",
      "Relationship problems",
      "Financial difficulties",
      "Health issues",
    ],
    triggersEs: [
      "Cambios importantes en la vida",
      "Pérdidas personales",
      "Estrés crónico",
      "Cambios estacionales",
      "Aislamiento social",
      "Problemas de relación",
      "Dificultades financieras",
      "Problemas de salud",
    ],
    approaches: [
      "Cognitive Behavioral Therapy (CBT)",
      "Behavioral Activation",
      "Interpersonal Therapy",
      "Mindfulness-Based Cognitive Therapy",
      "Regular physical activity",
      "Medication management",
      "Social support enhancement",
      "Lifestyle modifications",
    ],
    approachesEs: [
      "Terapia Cognitivo-Conductual (TCC)",
      "Activación Conductual",
      "Terapia Interpersonal",
      "Terapia Cognitiva Basada en Mindfulness",
      "Actividad física regular",
      "Manejo de medicamentos",
      "Mejora del apoyo social",
      "Modificaciones del estilo de vida",
    ],
    pitfalls: [
      "Reinforcing negative self-talk",
      "Focusing only on problems",
      "Encouraging isolation",
      "Setting unrealistic goals",
      "Overlooking small improvements",
      "Ignoring physical health",
      "Minimizing feelings",
      "Avoiding professional help",
    ],
    pitfallsEs: [
      "Reforzar el diálogo interno negativo",
      "Centrarse solo en los problemas",
      "Fomentar el aislamiento",
      "Establecer metas poco realistas",
      "Pasar por alto pequeñas mejoras",
      "Ignorar la salud física",
      "Minimizar los sentimientos",
      "Evitar ayuda profesional",
    ],
    responses: {
      default: [
        "I don't see the point in trying anymore.",
        "I feel like I'm just going through the motions every day.",
        "I can't remember the last time I felt happy.",
        "Sometimes I sleep for 12 hours and still feel exhausted.",
        "I used to enjoy playing guitar, but now it just sits in the corner.",
        "Everything feels like it takes so much effort.",
        "I feel like I'm disappointing everyone around me.",
      ],
      work: [
        "I can barely get myself to work each day.",
        "I've been making mistakes because I can't concentrate.",
        "My boss probably thinks I'm lazy, but I just can't find the energy.",
        "I used to be ambitious, but now I just try to get through the day.",
        "I don't care about my career anymore.",
      ],
      social: [
        "I've been avoiding my friends' calls.",
        "Being around people feels exhausting.",
        "I feel like I'm bringing everyone down when I'm around them.",
        "I don't have the energy to maintain relationships.",
        "I feel disconnected from everyone.",
      ],
      future: [
        "I can't imagine things ever getting better.",
        "I don't really see a future for myself.",
        "I used to have goals, but they seem pointless now.",
        "I feel stuck in this darkness.",
        "I'm just going through the motions day after day.",
      ],
    },
    responsesEs: {
      default: [
        "Ya no veo el sentido de intentarlo.",
        "Siento que solo estoy siguiendo los movimientos cada día.",
        "No recuerdo la última vez que me sentí feliz.",
        "A veces duermo 12 horas y aún así me siento agotado.",
        "Solía disfrutar tocando la guitarra, pero ahora simplemente está en un rincón.",
        "Todo se siente como si requiriera mucho esfuerzo.",
        "Siento que estoy decepcionando a todos a mi alrededor.",
      ],
      work: [
        "Apenas puedo ir a trabajar cada día.",
        "He estado cometiendo errores porque no puedo concentrarme.",
        "Mi jefe probablemente piensa que soy perezoso, pero simplemente no puedo encontrar la energía.",
        "Solía ser ambicioso, pero ahora solo trato de pasar el día.",
        "Ya no me importa mi carrera.",
      ],
      social: [
        "He estado evitando las llamadas de mis amigos.",
        "Estar rodeado de gente se siente agotador.",
        "Siento que estoy deprimiendo a todos cuando estoy con ellos.",
        "No tengo la energía para mantener relaciones.",
        "Me siento desconectado de todos.",
      ],
      future: [
        "No puedo imaginar que las cosas mejoren alguna vez.",
        "Realmente no veo un futuro para mí.",
        "Solía tener metas, pero ahora parecen inútiles.",
        "Me siento atrapado en esta oscuridad.",
        "Solo estoy siguiendo los movimientos día tras día.",
      ],
    },
  },
  "Social Anxiety": {
    es: "Ansiedad Social",
    symptoms: [
      "Intense fear of social situations",
      "Avoidance of social events",
      "Physical symptoms like blushing and trembling",
      "Excessive self-consciousness",
      "Fear of judgment",
      "Anticipatory anxiety",
      "Post-event rumination",
      "Difficulty making eye contact",
    ],
    symptomsEs: [
      "Miedo intenso a situaciones sociales",
      "Evitación de eventos sociales",
      "Síntomas físicos como sonrojarse y temblar",
      "Autoconciencia excesiva",
      "Miedo al juicio",
      "Ansiedad anticipatoria",
      "Rumiación posterior al evento",
      "Dificultad para mantener contacto visual",
    ],
    triggers: [
      "Public speaking",
      "Being the center of attention",
      "Meeting new people",
      "Being observed while performing tasks",
      "Social gatherings",
      "Authority figures",
      "Dating situations",
      "Group discussions",
    ],
    triggersEs: [
      "Hablar en público",
      "Ser el centro de atención",
      "Conocer gente nueva",
      "Ser observado mientras realiza tareas",
      "Reuniones sociales",
      "Figuras de autoridad",
      "Situaciones de citas",
      "Discusiones grupales",
    ],
    approaches: [
      "Cognitive Behavioral Therapy (CBT)",
      "Gradual exposure to feared situations",
      "Social skills training",
      "Role-playing exercises",
      "Mindfulness techniques",
      "Acceptance and Commitment Therapy",
      "Group therapy",
      "Assertiveness training",
    ],
    approachesEs: [
      "Terapia Cognitivo-Conductual (TCC)",
      "Exposición gradual a situaciones temidas",
      "Entrenamiento en habilidades sociales",
      "Ejercicios de juego de roles",
      "Técnicas de atención plena",
      "Terapia de Aceptación y Compromiso",
      "Terapia grupal",
      "Entrenamiento en asertividad",
    ],
    pitfalls: [
      "Enabling avoidance behaviors",
      "Setting unrealistic social expectations",
      "Focusing only on negative social outcomes",
      "Reinforcing safety behaviors",
      "Overlooking small social successes",
      "Comparing to others' social abilities",
      "Overpreparation for social events",
      "All-or-nothing thinking about social success",
    ],
    pitfallsEs: [
      "Permitir comportamientos de evitación",
      "Establecer expectativas sociales poco realistas",
      "Centrarse solo en resultados sociales negativos",
      "Reforzar comportamientos de seguridad",
      "Pasar por alto pequeños éxitos sociales",
      "Comparar con las habilidades sociales de otros",
      "Sobrepreparación para eventos sociales",
      "Pensamiento de todo o nada sobre el éxito social",
    ],
    responses: {
      default: [
        "The thought of walking into a room full of people makes me feel sick.",
        "I rehearse what I'm going to say before making a phone call.",
        "I worry that people are judging me when I speak.",
        "I've missed important events because I couldn't handle being around people.",
        "I always think I've said something stupid after conversations.",
        "I feel like everyone is watching me when I'm in public.",
        "I avoid eating in front of others because I'm afraid I'll embarrass myself.",
      ],
      party: [
        "Just thinking about the party makes my heart race.",
        "What if no one talks to me or I don't know what to say?",
        "I'd rather stay home than risk embarrassing myself.",
        "Last time I went to a party, I spent most of the time hiding in the bathroom.",
        "I need to have a few drinks before I can relax at social gatherings.",
      ],
      work: [
        "Team meetings are torture for me.",
        "I eat lunch alone because I'm afraid to join others in the break room.",
        "I've turned down promotions because they would require more social interaction.",
        "I rehearse what I'm going to say before speaking up in meetings.",
        "I worry my colleagues think I'm weird because I'm so quiet.",
      ],
      dating: [
        "I can't imagine going on a date without having a panic attack.",
        "I overthink every text message before sending it.",
        "I worry that if someone gets to know the real me, they won't like me.",
        "I've canceled dates at the last minute because of anxiety.",
        "I feel like I'll be alone forever because social situations are so hard for me.",
      ],
    },
    responsesEs: {
      default: [
        "La idea de entrar en una habitación llena de gente me hace sentir mal.",
        "Ensayo lo que voy a decir antes de hacer una llamada telefónica.",
        "Me preocupa que la gente me juzgue cuando hablo.",
        "Me he perdido eventos importantes porque no podía soportar estar rodeado de gente.",
        "Siempre pienso que he dicho algo estúpido después de las conversaciones.",
        "Siento que todos me están mirando cuando estoy en público.",
        "Evito comer frente a otros porque tengo miedo de avergonzarme.",
      ],
      party: [
        "Solo pensar en la fiesta hace que mi corazón se acelere.",
        "¿Y si nadie habla conmigo o no sé qué decir?",
        "Prefiero quedarme en casa que arriesgarme a avergonzarme.",
        "La última vez que fui a una fiesta, pasé la mayor parte del tiempo escondido en el baño.",
        "Necesito tomar algunas bebidas antes de poder relajarme en reuniones sociales.",
      ],
      work: [
        "Las reuniones de equipo son una tortura para mí.",
        "Como solo porque tengo miedo de unirme a otros en la sala de descanso.",
        "He rechazado ascensos porque requerirían más interacción social.",
        "Ensayo lo que voy a decir antes de hablar en las reuniones.",
        "Me preocupa que mis colegas piensen que soy raro porque soy tan callado.",
      ],
      dating: [
        "No puedo imaginar tener una cita sin tener un ataque de pánico.",
        "Pienso demasiado cada mensaje de texto antes de enviarlo.",
        "Me preocupa que si alguien conoce al verdadero yo, no le agradaré.",
        "He cancelado citas en el último minuto debido a la ansiedad.",
        "Siento que estaré solo para siempre porque las situaciones sociales son tan difíciles para mí.",
      ],
    },
  },
  PTSD: {
    es: "Trastorno de Estrés Postraumático",
    symptoms: [
      "Intrusive memories of traumatic events",
      "Flashbacks and nightmares",
      "Avoidance of trauma reminders",
      "Negative changes in thinking and mood",
      "Hypervigilance",
      "Exaggerated startle response",
      "Emotional numbness",
      "Sleep disturbances",
    ],
    symptomsEs: [
      "Recuerdos intrusivos de eventos traumáticos",
      "Flashbacks y pesadillas",
      "Evitación de recordatorios del trauma",
      "Cambios negativos en el pensamiento y el estado de ánimo",
      "Hipervigilancia",
      "Respuesta de sobresalto exagerada",
      "Entumecimiento emocional",
      "Alteraciones del sueño",
    ],
    triggers: [
      "Sensory reminders of trauma",
      "Anniversary dates",
      "Similar situations to traumatic event",
      "Media coverage of similar events",
      "Crowded or confined spaces",
      "Loud noises",
      "Feeling out of control",
      "Physical sensations similar to trauma response",
    ],
    triggersEs: [
      "Recordatorios sensoriales del trauma",
      "Fechas de aniversario",
      "Situaciones similares al evento traumático",
      "Cobertura mediática de eventos similares",
      "Espacios concurridos o confinados",
      "Ruidos fuertes",
      "Sentirse fuera de control",
      "Sensaciones físicas similares a la respuesta al trauma",
    ],
    approaches: [
      "Trauma-Focused Cognitive Behavioral Therapy",
      "Eye Movement Desensitization and Reprocessing (EMDR)",
      "Prolonged Exposure Therapy",
      "Cognitive Processing Therapy",
      "Stress management techniques",
      "Medication management",
      "Support groups",
      "Safety planning",
    ],
    approachesEs: [
      "Terapia Cognitivo-Conductual Centrada en el Trauma",
      "Desensibilización y Reprocesamiento por Movimientos Oculares (EMDR)",
      "Terapia de Exposición Prolongada",
      "Terapia de Procesamiento Cognitivo",
      "Técnicas de manejo del estrés",
      "Manejo de medicamentos",
      "Grupos de apoyo",
      "Planificación de seguridad",
    ],
    pitfalls: [
      "Forcing trauma narrative before readiness",
      "Minimizing traumatic experiences",
      "Reinforcing avoidance behaviors",
      "Overlooking physical safety needs",
      "Pushing exposure too quickly",
      "Ignoring cultural factors in trauma",
      "Focusing only on trauma history",
      "Neglecting self-care during treatment",
    ],
    pitfallsEs: [
      "Forzar la narrativa del trauma antes de estar listo",
      "Minimizar experiencias traumáticas",
      "Reforzar comportamientos de evitación",
      "Pasar por alto las necesidades de seguridad física",
      "Empujar la exposición demasiado rápido",
      "Ignorar factores culturales en el trauma",
      "Centrarse solo en la historia del trauma",
      "Descuidar el autocuidado durante el tratamiento",
    ],
    responses: {
      default: [
        "I feel like I'm constantly on edge, waiting for something bad to happen.",
        "Certain smells or sounds can instantly take me back to that moment.",
        "I have nightmares about what happened almost every night.",
        "I avoid places that remind me of the incident.",
        "Sometimes I feel like I'm watching myself from outside my body.",
        "I feel disconnected from people who haven't experienced what I went through.",
        "I'm always checking for exits and potential threats.",
      ],
      sleep: [
        "I'm afraid to go to sleep because of the nightmares.",
        "I wake up in a panic, feeling like I'm back in that situation.",
        "I keep a weapon near my bed because I don't feel safe.",
        "I get maybe 3-4 hours of broken sleep each night.",
        "Sometimes I stay awake for days because I'm afraid of the dreams.",
      ],
      triggers: [
        "When I hear a car backfire, I drop to the ground.",
        "Crowded places make me feel trapped and panicky.",
        "I can't watch certain movies or TV shows anymore.",
        "The anniversary of the event is always the hardest time.",
        "I had to change my route to work to avoid the place it happened.",
      ],
      relationships: [
        "I push people away because I don't want them to see me like this.",
        "I feel like no one understands what I'm going through.",
        "I get angry over small things and end up hurting people I care about.",
        "I don't feel emotions the way I used to, even toward people I love.",
        "I'm afraid to get close to anyone because I could lose them.",
      ],
    },
    responsesEs: {
      default: [
        "Siento que estoy constantemente al límite, esperando que algo malo suceda.",
        "Ciertos olores o sonidos pueden llevarme instantáneamente de vuelta a ese momento.",
        "Tengo pesadillas sobre lo que sucedió casi todas las noches.",
        "Evito lugares que me recuerdan al incidente.",
        "A veces siento como si me estuviera observando desde fuera de mi cuerpo.",
        "Me siento desconectado de las personas que no han experimentado lo que yo pasé.",
        "Siempre estoy buscando salidas y posibles amenazas.",
      ],
      sleep: [
        "Tengo miedo de dormir debido a las pesadillas.",
        "Me despierto en pánico, sintiendo que estoy de vuelta en esa situación.",
        "Mantengo un arma cerca de mi cama porque no me siento seguro.",
        "Duermo tal vez 3-4 horas interrumpidas cada noche.",
        "A veces me quedo despierto durante días porque tengo miedo de los sueños.",
      ],
      triggers: [
        "Cuando escucho un auto hacer explosiones en el escape, me tiro al suelo.",
        "Los lugares concurridos me hacen sentir atrapado y con pánico.",
        "Ya no puedo ver ciertas películas o programas de televisión.",
        "El aniversario del evento es siempre el momento más difícil.",
        "Tuve que cambiar mi ruta al trabajo para evitar el lugar donde sucedió.",
      ],
      relationships: [
        "Alejo a las personas porque no quiero que me vean así.",
        "Siento que nadie entiende por lo que estoy pasando.",
        "Me enojo por cosas pequeñas y termino lastimando a personas que me importan.",
        "No siento emociones como solía hacerlo, incluso hacia personas que amo.",
        "Tengo miedo de acercarme a alguien porque podría perderlos.",
      ],
    },
  },
}

// Generate a random patient
export function generateRandomPatient(id) {
  const firstName = getRandomItem(firstNames)
  const lastName = getRandomItem(lastNames)
  const age = Math.floor(Math.random() * 40) + 18 // 18-57 years old

  // Select a random condition
  const conditionKey = getRandomItem(Object.keys(conditions))
  const condition = conditions[conditionKey]

  // Generate random symptoms, triggers, approaches, and pitfalls
  const symptoms = generateRandomArray(condition.symptoms, Math.floor(Math.random() * 3) + 3)
  const symptomsEs = generateRandomArray(condition.symptomsEs, symptoms.length)

  const triggers = generateRandomArray(condition.triggers, Math.floor(Math.random() * 3) + 3)
  const triggersEs = generateRandomArray(condition.triggersEs, triggers.length)

  const approaches = generateRandomArray(condition.approaches, Math.floor(Math.random() * 3) + 3)
  const approachesEs = generateRandomArray(condition.approachesEs, approaches.length)

  const pitfalls = generateRandomArray(condition.pitfalls, Math.floor(Math.random() * 3) + 3)
  const pitfallsEs = generateRandomArray(condition.pitfallsEs, pitfalls.length)

  // Generate random responses
  const responses = generateRandomResponses(condition.responses)
  const responsesEs = generateRandomResponses(condition.responsesEs)

  // Select a random last message
  const lastMessage = getRandomItem(condition.responses.default)
  const lastMessageEs = getRandomItem(condition.responsesEs.default)

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

