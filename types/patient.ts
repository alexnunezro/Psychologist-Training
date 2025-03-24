export interface Patient {
  id: string
  name: string
  age: number
  condition: string
  conditionEs: string
  avatar: string
  lastMessage: string
  lastMessageEs: string
  symptoms: string[]
  symptomsEs: string[]
  triggers: string[]
  triggersEs: string[]
  therapeuticApproaches: string[]
  therapeuticApproachesEs: string[]
  pitfalls: string[]
  pitfallsEs: string[]
  background?: string
  responses: {
    [key: string]: string[]
  }
  responsesEs: {
    [key: string]: string[]
  }
}

