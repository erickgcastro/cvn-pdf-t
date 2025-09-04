import { ExampleEntity } from "@contexts/example/domain/entities/example"
import { ExampleRepository } from "@contexts/example/domain/repositories/example.repository"
import { BadRequestException, NotFoundException } from "@lib/erros"

export class ExampleService {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async create(data: { name: string; email: string }): Promise<ExampleEntity> {
    const existingExample = await this.exampleRepository.findByEmail(data.email)
    if (existingExample) {
      throw new BadRequestException("Email already exists")
    }

    const example = ExampleEntity.create({
      name: data.name,
      email: data.email,
    })

    return this.exampleRepository.create(example)
  }

  async findById(id: string): Promise<ExampleEntity> {
    const example = await this.exampleRepository.findById(id)
    if (!example) {
      throw new NotFoundException("Example not found")
    }
    return example
  }

  async findAll(): Promise<ExampleEntity[]> {
    return this.exampleRepository.findAll()
  }

  async update(
    id: string,
    data: { name?: string; email?: string }
  ): Promise<ExampleEntity> {
    const existingExample = await this.exampleRepository.findById(id)
    if (!existingExample) {
      throw new NotFoundException("Example not found")
    }

    if (data.email && data.email !== existingExample.email) {
      const emailExists = await this.exampleRepository.findByEmail(data.email)
      if (emailExists) {
        throw new BadRequestException("Email already exists")
      }
    }

    const updatedExample = await this.exampleRepository.update(id, data)
    if (!updatedExample) {
      throw new NotFoundException("Example not found")
    }

    return updatedExample
  }

  async delete(id: string): Promise<void> {
    const example = await this.exampleRepository.findById(id)
    if (!example) {
      throw new NotFoundException("Example not found")
    }

    const deleted = await this.exampleRepository.delete(id)
    if (!deleted) {
      throw new BadRequestException("Failed to delete example")
    }
  }
}
