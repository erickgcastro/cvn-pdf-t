import fp from "fastify-plugin"
import { FastifyInstance } from "fastify"
import { PrismaRepository } from "./prisma.repository"

declare module "fastify" {
  interface FastifyInstance {
    prisma: import("@prisma/client").PrismaClient
  }
}

async function prismaPlugin(fastify: FastifyInstance) {
  const prisma = PrismaRepository.getInstance()

  await prisma.$connect()

  fastify.decorate("prisma", prisma)

  fastify.addHook("onClose", async () => {
    await PrismaRepository.disconnect()
  })
}

export default fp(prismaPlugin, {
  name: "prisma",
})
