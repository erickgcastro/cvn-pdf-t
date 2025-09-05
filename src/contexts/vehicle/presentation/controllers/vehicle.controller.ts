import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {
  GeneratePdfDto,
  VehicleParamsDto,
  VehicleListResponseDto,
} from "../dtos/vehicle.dto"
const API_TAGS = ["PDF"]

export class VehicleController {
  public registerRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/generate-pdf",
      {
        schema: {
          tags: API_TAGS,
          summary: "Gerar PDF do relatório a partir de JSON",
          description:
            "Recebe um JSON com dados do veículo e gera um PDF com o relatório",
          body: GeneratePdfDto,
          response: {
            200: {
              type: "string",
              format: "binary",
              description: "Arquivo PDF do relatório",
            },
          },
        },
      },
      async ({ body }, reply) => {
        const vehicle = await app.vehicleContext.vehicleService.create(body)

        const pdfBuffer = await app.vehicleContext.pdfService.generateVehicleReport(
          vehicle
        )

        reply.header("Content-Type", "application/pdf")
        reply.header(
          "Content-Disposition",
          `attachment; filename="relatorio-veiculo-${vehicle.veiculo.placa}.pdf"`
        )
        reply.header("Content-Length", pdfBuffer.length)

        return reply.send(pdfBuffer)
      }
    )

    app.withTypeProvider<ZodTypeProvider>().get(
      "/generate-pdf/:id",
      {
        schema: {
          tags: API_TAGS,
          summary: "Gerar PDF de relatório a partir de ID",
          description: "Busca um veículo pelo ID e gera um PDF com o relatório",
          params: VehicleParamsDto,
          response: {
            200: {
              type: "string",
              format: "binary",
              description: "Arquivo PDF do relatório",
            },
          },
        },
      },
      async ({ params }, reply) => {
        const vehicle = await app.vehicleContext.vehicleService.findById(params.id)

        const pdfBuffer = await app.vehicleContext.pdfService.generateVehicleReport(
          vehicle
        )

        reply.header("Content-Type", "application/pdf")
        reply.header(
          "Content-Disposition",
          `attachment; filename="relatorio-veiculo-${vehicle.veiculo.placa}.pdf"`
        )
        reply.header("Content-Length", pdfBuffer.length)

        return reply.send(pdfBuffer)
      }
    )

    app.withTypeProvider<ZodTypeProvider>().get(
      "/reports",
      {
        schema: {
          tags: API_TAGS,
          summary: "Listar todos os reports",
          description: "Retorna uma lista com todos os veículos salvos no banco de dados",
          response: {
            200: VehicleListResponseDto,
          },
        },
      },
      async (request, reply) => {
        const vehicles = await app.vehicleContext.vehicleService.findAll()

        const response = {
          data: vehicles.map((vehicle) => ({
            id: vehicle.id || "",
            veiculo: vehicle.veiculo,
            proprietario: vehicle.proprietario,
            historicoManutencao: vehicle.historicoManutencao,
            totalManutencoes: vehicle.getMaintenanceCount(),
            custoTotal: vehicle.getTotalMaintenanceCost(),
            ultimaManutencao: vehicle.getLastMaintenanceDate(),
            createdAt: vehicle.createdAt.toISOString(),
            updatedAt: vehicle.updatedAt.toISOString(),
          })),
          total: vehicles.length,
          timestamp: new Date().toISOString(),
        }

        return reply.send(response)
      }
    )
  }
}
