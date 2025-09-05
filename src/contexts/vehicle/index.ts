import fp from "fastify-plugin"
import { FastifyInstance } from "fastify"

import { VehicleRepository } from "./domain/repositories/vehicle.repository"
import { PrismaVehicleRepository } from "./infra/database/prisma/repositories/vehicle.repository"
import { VehicleService } from "./application/services/vehicle.service"
import { PdfService } from "./application/services/pdf.service"
import { VehicleController } from "./presentation/controllers/vehicle.controller"

declare module "fastify" {
  interface FastifyInstance {
    vehicleContext: VehicleContextDependencies
  }
}

export interface VehicleContextDependencies {
  vehicleRepository: VehicleRepository
  vehicleService: VehicleService
  pdfService: PdfService
  vehicleController: VehicleController
}

async function vehicleContextModule(app: FastifyInstance) {
  const dependencies: VehicleContextDependencies = {
    vehicleRepository: new PrismaVehicleRepository(app.prisma),
    vehicleService: null as any,
    pdfService: null as any,
    vehicleController: null as any,
  }

  dependencies.vehicleService = new VehicleService(dependencies.vehicleRepository)
  dependencies.pdfService = new PdfService()
  dependencies.vehicleController = new VehicleController()

  await app.register(
    async function vehicleRoutes(app: FastifyInstance) {
      dependencies.vehicleController.registerRoutes(app)
    },
    { prefix: "/api" }
  )

  app.decorate("vehicleContext", dependencies)
}

export default fp(vehicleContextModule, {
  name: "vehicleContext",
  dependencies: ["prisma"],
})
