import { z } from "zod"

export const VehicleDataDto = z.object({
  placa: z.string().min(1, "Placa é obrigatória"),
  marca: z.string().min(1, "Marca é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  ano: z
    .number()
    .min(1900, "Ano deve ser maior que 1900")
    .max(new Date().getFullYear() + 1, "Ano inválido"),
})

export const OwnerDataDto = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  documento: z.string().min(1, "Documento é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
})

export const MaintenanceRecordDto = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  servico: z.string().min(1, "Serviço é obrigatório"),
  quilometragem: z.number().min(0, "Quilometragem deve ser positiva"),
  custo: z.number().min(0, "Custo deve ser positivo"),
})

export const CreateVehicleDto = z.object({
  veiculo: VehicleDataDto,
  proprietario: OwnerDataDto,
  historicoManutencao: z.array(MaintenanceRecordDto),
})

export const VehicleParamsDto = z.object({
  id: z.string().min(1, "ID é obrigatório"),
})

export const VehicleResponseDto = z.object({
  id: z.string(),
  veiculo: VehicleDataDto,
  proprietario: OwnerDataDto,
  historicoManutencao: z.array(MaintenanceRecordDto),
  totalManutencoes: z.number(),
  custoTotal: z.number(),
  ultimaManutencao: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const VehicleListResponseDto = z.object({
  data: z.array(VehicleResponseDto),
  total: z.number(),
  timestamp: z.string(),
})

export const GeneratePdfDto = z.object({
  veiculo: VehicleDataDto,
  proprietario: OwnerDataDto,
  historicoManutencao: z.array(MaintenanceRecordDto),
})

export type CreateVehicleDtoType = z.infer<typeof CreateVehicleDto>
export type VehicleParamsDtoType = z.infer<typeof VehicleParamsDto>
export type VehicleResponseDtoType = z.infer<typeof VehicleResponseDto>
export type VehicleListResponseDtoType = z.infer<typeof VehicleListResponseDto>
export type GeneratePdfDtoType = z.infer<typeof GeneratePdfDto>
