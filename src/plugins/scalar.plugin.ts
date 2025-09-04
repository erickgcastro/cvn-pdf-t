import fp from "fastify-plugin"
import { FastifyInstance } from "fastify"
import scalarPlugin from "@scalar/fastify-api-reference"

async function scalarDocumentationPlugin(fastify: FastifyInstance) {
  await fastify.register(scalarPlugin, {
    routePrefix: "/reference",
    configuration: {
      title: "Clean Architecture API Documentation",
      theme: "purple",
      layout: "modern",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      metaData: {
        title: "Clean Architecture API Docs",
        description: "API documentation para aplicação seguindo Clean Architecture e DDD",
      },
    },
  })

  fastify.get("/documentation", async (request, reply) => {
    return reply.redirect("/reference")
  })
}

export default fp(scalarDocumentationPlugin, {
  name: "scalar",
  dependencies: ["openapi"],
})
