import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { GeneratePdfDto, VehicleParamsDto } from "../dtos/vehicle.dto"

const API_TAGS = ["PDF"]

export class VehicleController {
  public registerRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/generate-pdf",
      {
        schema: {
          tags: API_TAGS,
          summary: "Gerar PDF do relatório de veículo a partir de JSON",
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
          summary: "Gerar PDF do relatório de veículo a partir de ID",
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
  }
}
