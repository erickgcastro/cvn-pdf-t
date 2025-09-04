import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import {
  CreateExampleDto,
  UpdateExampleDto,
  ExampleParamsDto,
  ExampleResponseDto,
  ExampleListResponseDto,
} from "../dtos/example.dto"

export class ExampleController {
  public registerRoutes(fastify: FastifyInstance) {
    // Create Example
    fastify.withTypeProvider<ZodTypeProvider>().post(
      "/",
      {
        schema: {
          tags: ["Examples"],
          summary: "Create a new example",
          body: CreateExampleDto,
          response: {
            201: ExampleResponseDto,
          },
        },
      },
      async ({ body }) => {
        const example = await fastify.exampleContext.exampleService.create(body)

        return {
          id: example.id,
          name: example.name,
          email: example.email,
          createdAt: example.createdAt.toISOString(),
          updatedAt: example.updatedAt.toISOString(),
        }
      }
    )

    fastify.withTypeProvider<ZodTypeProvider>().get(
      "/",
      {
        schema: {
          tags: ["Examples"],
          summary: "Get all examples",
          response: {
            200: ExampleListResponseDto,
          },
        },
      },
      async () => {
        const examples = await fastify.exampleContext.exampleService.findAll()

        return {
          data: examples.map((example) => ({
            id: example.id,
            name: example.name,
            email: example.email,
            createdAt: example.createdAt.toISOString(),
            updatedAt: example.updatedAt.toISOString(),
          })),
          total: examples.length,
          timestamp: new Date().toISOString(),
        }
      }
    )

    fastify.withTypeProvider<ZodTypeProvider>().get(
      "/:id",
      {
        schema: {
          tags: ["Examples"],
          summary: "Get example by ID",
          params: ExampleParamsDto,
          response: {
            200: ExampleResponseDto,
          },
        },
      },
      async ({ params }) => {
        const example = await fastify.exampleContext.exampleService.findById(params.id)

        return {
          id: example.id,
          name: example.name,
          email: example.email,
          createdAt: example.createdAt.toISOString(),
          updatedAt: example.updatedAt.toISOString(),
        }
      }
    )

    fastify.withTypeProvider<ZodTypeProvider>().put(
      "/:id",
      {
        schema: {
          tags: ["Examples"],
          summary: "Update example by ID",
          params: ExampleParamsDto,
          body: UpdateExampleDto,
          response: {
            200: ExampleResponseDto,
          },
        },
      },
      async ({ params, body }) => {
        const example = await fastify.exampleContext.exampleService.update(
          params.id,
          body
        )

        return {
          id: example.id,
          name: example.name,
          email: example.email,
          createdAt: example.createdAt.toISOString(),
          updatedAt: example.updatedAt.toISOString(),
        }
      }
    )

    fastify.withTypeProvider<ZodTypeProvider>().delete(
      "/:id",
      {
        schema: {
          tags: ["Examples"],
          summary: "Delete example by ID",
          params: ExampleParamsDto,
          response: {
            204: z.void(),
          },
        },
      },
      async ({ params }, reply) => {
        await fastify.exampleContext.exampleService.delete(params.id)
        return reply.status(204).send()
      }
    )
  }
}
