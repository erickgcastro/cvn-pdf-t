import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';

async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: process.env.NODE_ENV === 'development' ? true : false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
}

export default fp(corsPlugin, {
  name: 'cors',
});