import fp from "fastify-plugin"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"

export const ZodValidatorPlugin = fp(async (app) => {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)
})
