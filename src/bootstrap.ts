import fastify from "fastify"
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"
import { envSchema } from "./env.schema"

import corsPlugin from "./plugins/fastify.cors"
import prismaPlugin from "./lib/database/prisma.plugin"
import prismaUnitOfWorkPlugin from "./lib/database/prisma.unit-of-work.plugin"
import { ZodValidatorPlugin } from "./plugins/zod.plugin"
import openApiPlugin from "./plugins/openai.plugin"
import scalarPlugin from "./plugins/scalar.plugin"

import { OnCloseHook } from "./hooks/on-close"
import { OnExceptions } from "./hooks/on-exception"

import exampleContextModule from "./contexts/example"

export async function bootstrap() {
  const env = envSchema.parse(process.env)

  const app = fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
            }
          : undefined,
    },
  }).withTypeProvider<ZodTypeProvider>()

  await app.register(OnCloseHook)
  await app.register(OnExceptions)
  await app.register(corsPlugin)

  await app.register(prismaPlugin)
  await app.register(prismaUnitOfWorkPlugin)
  await app.register(ZodValidatorPlugin)
  await app.register(openApiPlugin)
  await app.register(scalarPlugin)

  await app.register(exampleContextModule)

  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() }
  })

  await app.listen({
    host: "0.0.0.0",
    port: env.PORT,
  })

  app.log.info(`Server is running on http://0.0.0.0:${env.PORT}`)
  app.log.info(`Documentation available at http://0.0.0.0:${env.PORT}/reference`)
}
