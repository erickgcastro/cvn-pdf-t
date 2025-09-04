import { ExampleEntity } from '@contexts/example/domain/entities/example';
import { ExamplePrismaData } from '../schema/example.schema';

export class ExampleAdapter {
  static toDomain(prismaData: ExamplePrismaData): ExampleEntity {
    return new ExampleEntity(
      prismaData.id,
      prismaData.name,
      prismaData.email,
      prismaData.createdAt,
      prismaData.updatedAt,
    );
  }

  static toPrisma(entity: ExampleEntity): ExamplePrismaData {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}