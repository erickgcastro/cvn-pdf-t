import { z } from 'zod';

export const CreateExampleDto = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
});

export const UpdateExampleDto = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

export const ExampleParamsDto = z.object({
  id: z.string().min(1),
});

export const ExampleResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ExampleListResponseDto = z.object({
  data: z.array(ExampleResponseDto),
  total: z.number(),
  timestamp: z.string(),
});

export type CreateExampleDtoType = z.infer<typeof CreateExampleDto>;
export type UpdateExampleDtoType = z.infer<typeof UpdateExampleDto>;
export type ExampleParamsDtoType = z.infer<typeof ExampleParamsDto>;
export type ExampleResponseDtoType = z.infer<typeof ExampleResponseDto>;
export type ExampleListResponseDtoType = z.infer<typeof ExampleListResponseDto>;