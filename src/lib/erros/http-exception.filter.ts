import { Prisma } from "@prisma/client"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { ZodError } from "zod"
import {
  ApplicationLevelError,
  ConflictException,
  DomainError,
  ForbiddenException,
  ItemNotFound,
  MethodNotAllowedException,
  NotImplementedException,
  UnauthorizedException,
} from "./index"
import { OutputError } from "./output-error"
import { AxiosError } from "axios"

export function isZodError(err: unknown): err is ZodError {
  return Boolean(
    err && (err instanceof ZodError || (err as ZodError).name === "ZodError")
  )
}

export class HttpExceptionFilter {
  constructor(private readonly app: FastifyInstance) {}

  public catch(request: FastifyRequest, reply: FastifyReply, originalException: unknown) {
    console.log("❌❌❌❌❌❌❌ HttpExceptionFilter ❌❌❌❌❌❌❌")
    console.dir(
      {
        method: request.method,
        url: request.url,
        body: request.body,
        query: request.query,
        params: request.params,
      },
      { depth: null }
    )
    console.log("===========================================================")

    const outputError = new OutputError(request)

    if (originalException instanceof ForbiddenException) {
      outputError.setStatusCode(403)
      outputError.setCategory("ForbiddenException")
      outputError.setMessage(originalException.message)
    } else if (originalException instanceof UnauthorizedException) {
      outputError.setStatusCode(401)
      outputError.setCategory("UnauthorizedException")
      outputError.setMessage(originalException.message)
    } else if (originalException instanceof ConflictException) {
      outputError.setStatusCode(409)
      outputError.setCategory("ConflictException")
      outputError.setMessage(originalException.message)
    } else if (originalException instanceof ItemNotFound) {
      outputError.setStatusCode(454)
      outputError.setCategory("ItemNotFound")
      outputError.setMessage(originalException.message)
      outputError.setMetadata(originalException.metadata)
    } else if (originalException instanceof DomainError) {
      outputError.setStatusCode(422)
      outputError.setCategory("DomainError")
      outputError.setMessage(originalException.message)
      outputError.setMetadata(originalException.metadata)

      if (isZodError(originalException.metadata)) {
        outputError.setMetadata(originalException.metadata.issues)
        outputError.setMessage(
          `Ocorreu um erro de validação. Verifique o campo (${originalException.metadata.issues
            .map((issue) => issue.path.join(", "))
            .join(", ")})!`
        )
      }
    } else if (
      isZodError(originalException) ||
      isZodError((originalException as any)?.metadata)
    ) {
      const exception = isZodError(originalException)
        ? originalException
        : (originalException as any)?.metadata
      outputError.setStatusCode(451)
      outputError.setCategory("DtoValidationException")

      outputError.setMessage(
        `Falha na validação. Verifique o campo (${exception.flatten().fieldErrors})!`
      )
      outputError.setMetadata(exception.flatten().fieldErrors)
    } else if (originalException instanceof ApplicationLevelError) {
      outputError.setStatusCode(450)
      outputError.setCategory("ApplicationLevelError")
      outputError.setMessage(originalException.message)
      outputError.setMetadata(originalException.metadata)
    } else if (originalException instanceof NotImplementedException) {
      outputError.setStatusCode(500)
      outputError.setCategory("NotImplementedException")
      outputError.setMessage(originalException.message)
    } else if (originalException instanceof MethodNotAllowedException) {
      outputError.setStatusCode(500)
      outputError.setCategory("MethodNotAllowedException")
      outputError.setMessage(originalException.message)
    } else if (originalException instanceof AxiosError) {
      outputError.setStatusCode(500)
      outputError.setCategory("AxiosException")
      outputError.setMetadata(originalException.response?.data)
    } else if (HttpExceptionFilter.isPrismaError(originalException)) {
      outputError.setStatusCode(500)
      outputError.setCategory("RepositoryException")
      outputError.setMetadata({
        ...originalException,
        category: originalException?.constructor?.name,
        code: originalException.code,
        meta: originalException.meta,
        message: originalException.message,
        batchRequestIdx: originalException.batchRequestIdx,
        clientVersion: originalException.clientVersion,
        stack: originalException.stack,
        name: originalException.name,
      })
    } else if (originalException instanceof TypeError) {
      outputError.setStatusCode(500)
      outputError.setCategory("TypeError")
      outputError.setMessage(originalException.message)
    } else if (originalException instanceof Error) {
      outputError.setStatusCode(500)
      outputError.setCategory("Error")
      outputError.setMessage(originalException.message)
    } else {
      console.log("not mapped error")
    }

    console.log(outputError)

    if (isZodError(originalException)) {
      console.log(originalException.flatten().fieldErrors)
    }

    return reply.status(outputError.statusCode).send(outputError)
  }

  private static isPrismaError(
    err: unknown
  ): err is Prisma.PrismaClientKnownRequestError {
    const err1 = err instanceof Prisma.PrismaClientRustPanicError
    const err2 = err instanceof Prisma.PrismaClientKnownRequestError
    const err3 = err instanceof Prisma.PrismaClientUnknownRequestError
    const err4 = err instanceof Prisma.PrismaClientInitializationError
    const err5 = err instanceof Prisma.PrismaClientValidationError

    return err1 || err2 || err3 || err4 || err5
  }
}
