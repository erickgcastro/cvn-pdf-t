export class ExampleEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id?: string;
    name: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): ExampleEntity {
    const now = new Date();
    
    return new ExampleEntity(
      data.id ?? crypto.randomUUID(),
      data.name,
      data.email,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }

  updateName(name: string): ExampleEntity {
    return new ExampleEntity(
      this.id,
      name,
      this.email,
      this.createdAt,
      new Date(),
    );
  }
}