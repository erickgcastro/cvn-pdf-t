import { HttpExceptionFilter } from "@/lib/erros/http-exception.filter"
import fp from "fastify-plugin"

export const OnExceptions = fp(async (app) => {
  process.on("unhandledRejection", (error) => {
    console.log(error)
  })

  process.on("uncaughtException", (error) => {
    console.log(error)
  })

  const httpExceptionFilter = new HttpExceptionFilter(app)

  app.addHook("onError", (request, reply, error) => {
    httpExceptionFilter.catch(request, reply, error)
  })
})
