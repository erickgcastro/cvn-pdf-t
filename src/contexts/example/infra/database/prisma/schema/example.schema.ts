export interface ExamplePrismaData {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateExamplePrismaData {
  name: string
  email: string
}

export interface UpdateExamplePrismaData {
  name?: string
  email?: string
}
