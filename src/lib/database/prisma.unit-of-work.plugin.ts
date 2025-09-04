import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { PrismaUnitOfWork, IUnitOfWork } from './prisma.unit-of-work';

declare module 'fastify' {
  interface FastifyInstance {
    unitOfWork: IUnitOfWork;
  }
}

async function prismaUnitOfWorkPlugin(fastify: FastifyInstance) {
  const unitOfWork = new PrismaUnitOfWork();
  
  fastify.decorate('unitOfWork', unitOfWork);
}

export default fp(prismaUnitOfWorkPlugin, {
  name: 'prismaUnitOfWork',
  dependencies: ['prisma'],
});