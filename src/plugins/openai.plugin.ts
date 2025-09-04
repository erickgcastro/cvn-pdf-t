import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import { FastifyInstance } from 'fastify';

async function openApiPlugin(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Clean Architecture API',
        description: 'API construída seguindo os princípios de Clean Architecture e DDD',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:5000',
          description: 'Development server',
        },
      ],
      tags: [
        {
          name: 'Examples',
          description: 'Operações do contexto de exemplo',
        },
        {
          name: 'Health',
          description: 'Health check endpoints',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: ({ schema, url }) => {
      const transformedUrl = url === '/' ? { url: '/health' } : { url };
      return {
        schema: schema,
        url: transformedUrl.url,
      };
    },
  });
}

export default fp(openApiPlugin, {
  name: 'openapi',
});