import { PrismaClient } from "@prisma/client"
import { ExampleRepository } from "@contexts/example/domain/repositories/example.repository"
import { ExampleEntity } from "@contexts/example/domain/entities/example"
import { ExampleAdapter } from "../adapters/example.adapter"
import { PrismaRepository } from "@lib/database/prisma.repository"

export class PrismaExampleRepository implements ExampleRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = PrismaRepository.getInstance()
  }

  async create(example: ExampleEntity): Promise<ExampleEntity> {
    const data = await this.prisma.example.create({
      data: {
        id: example.id,
        name: example.name,
        email: example.email,
        createdAt: example.createdAt,
        updatedAt: example.updatedAt,
      },
    })

    return ExampleAdapter.toDomain(data)
  }

  async findById(id: string): Promise<ExampleEntity | null> {
    const data = await this.prisma.example.findUnique({
      where: { id },
    })

    if (!data) return null

    return ExampleAdapter.toDomain(data)
  }

  async findByEmail(email: string): Promise<ExampleEntity | null> {
    const data = await this.prisma.example.findUnique({
      where: { email },
    })

    if (!data) return null

    return ExampleAdapter.toDomain(data)
  }

  async findAll(): Promise<ExampleEntity[]> {
    const data = await this.prisma.example.findMany({
      orderBy: { createdAt: "desc" },
    })

    return data.map(ExampleAdapter.toDomain)
  }

  async update(
    id: string,
    updateData: Partial<Pick<ExampleEntity, "name" | "email">>
  ): Promise<ExampleEntity | null> {
    try {
      const data = await this.prisma.example.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      })

      return ExampleAdapter.toDomain(data)
    } catch (error) {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.example.delete({
        where: { id },
      })
      return true
    } catch (error) {
      return false
    }
  }
}
