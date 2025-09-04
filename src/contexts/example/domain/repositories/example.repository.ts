import { ExampleEntity } from '../entities/example';

export interface ExampleRepository {
  create(example: ExampleEntity): Promise<ExampleEntity>;
  findById(id: string): Promise<ExampleEntity | null>;
  findByEmail(email: string): Promise<ExampleEntity | null>;
  findAll(): Promise<ExampleEntity[]>;
  update(id: string, data: Partial<Pick<ExampleEntity, 'name' | 'email'>>): Promise<ExampleEntity | null>;
  delete(id: string): Promise<boolean>;
}