import { PrismaClient } from "@prisma/client"
import { PrismaRepository } from "./prisma.repository"

export interface IUnitOfWork {
  execute<T>(operation: (prisma: PrismaClient) => Promise<T>): Promise<T>
}

export class PrismaUnitOfWork implements IUnitOfWork {
  private prisma: PrismaClient

  constructor() {
    this.prisma = PrismaRepository.getInstance()
  }

  async execute<T>(operation: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (prismaTransaction: any) => {
      // return this.prisma.$transaction(async (prismaTransaction: PrismaClient) => {
      return await operation(prismaTransaction)
    })
  }
}
