import { PrismaClient } from '@prisma/client';

export class PrismaRepository {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!PrismaRepository.instance) {
      PrismaRepository.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        errorFormat: 'pretty',
      });
    }
    return PrismaRepository.instance;
  }

  public static async disconnect(): Promise<void> {
    if (PrismaRepository.instance) {
      await PrismaRepository.instance.$disconnect();
    }
  }
}