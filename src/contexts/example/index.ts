import fp from "fastify-plugin"
import { FastifyInstance } from "fastify"

import { ExampleRepository } from "./domain/repositories/example.repository"
import { PrismaExampleRepository } from "./infra/database/prisma/repositories/example.repository"
import { ExampleService } from "./application/services/example.service"
import { ExampleController } from "./presentation/controllers/example.controller"

declare module "fastify" {
  interface FastifyInstance {
    exampleContext: ExampleContextDependencies
  }
}

export interface ExampleContextDependencies {
  exampleRepository: ExampleRepository
  exampleService: ExampleService
  exampleController: ExampleController
}

async function exampleContextModule(fastify: FastifyInstance) {
  const dependencies: ExampleContextDependencies = {
    exampleRepository: new PrismaExampleRepository(),
    exampleService: null as any,
    exampleController: null as any,
  }

  dependencies.exampleService = new ExampleService(dependencies.exampleRepository)

  dependencies.exampleController = new ExampleController()

  await fastify.register(
    async function exampleRoutes(fastify: FastifyInstance) {
      dependencies.exampleController.registerRoutes(fastify)
    },
    { prefix: "/api/examples" }
  )

  fastify.decorate("exampleContext", dependencies)
}

export default fp(exampleContextModule, {
  name: "exampleContext",
  dependencies: ["prisma"],
})
