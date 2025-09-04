import type { FastifyRequest } from "fastify"

export class OutputError {
  public readonly url: string
  public readonly method: string
  public readonly timestamp: string = new Date().toISOString()

  public category = "UnknownError"
  public tracerId: string
  public message = "Ocorreu um erro inesperado."
  public statusCode = 500
  public metadata: any

  constructor(request: FastifyRequest) {
    this.url = request.url
    this.method = request.method
    this.tracerId = crypto.randomUUID()
  }

  setCategory(category: string) {
    this.category = category
  }

  setTracerId(tracerId: string) {
    this.tracerId = tracerId
  }

  setStatusCode(statusCode: number) {
    this.statusCode = statusCode
  }

  setMessage(message: string) {
    this.message = message
  }

  setMetadata(metadata: any) {
    this.metadata = metadata
  }
}
