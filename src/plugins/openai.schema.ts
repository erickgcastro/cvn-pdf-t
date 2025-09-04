import { z } from "zod"

export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string().optional(),
  details: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
        code: z.string(),
      })
    )
    .optional(),
  timestamp: z.string(),
})

export const SuccessResponseSchema = z.object({
  message: z.string(),
  data: z.any().optional(),
  timestamp: z.string(),
})

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

export const PaginatedResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
    timestamp: z.string(),
  })
