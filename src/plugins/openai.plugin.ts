import fp from "fastify-plugin"
import swagger from "@fastify/swagger"
import { FastifyInstance } from "fastify"
import { env } from "@/env.schema"

async function openApiPlugin(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "erickgcastro - pdf api docs",
        description: "API documentation para aplicação seguindo Clean Architecture e DDD",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: "Development server",
        },
      ],
      tags: [
        {
          name: "Health",
          description: "Health check endpoints",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    transform: ({ schema, url }) => {
      const transformedUrl = url === "/" ? { url: "/health" } : { url }
      return {
        schema: schema,
        url: transformedUrl.url,
      }
    },
  })
}

export default fp(openApiPlugin, {
  name: "openapi",
})
