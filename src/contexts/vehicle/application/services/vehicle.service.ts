import { VehicleEntity } from "@contexts/vehicle/domain/entities/vehicle"
import { VehicleRepository } from "@contexts/vehicle/domain/repositories/vehicle.repository"
import { BadRequestException, NotFoundException } from "@lib/erros"

export interface CreateVehicleData {
  veiculo: {
    placa: string
    marca: string
    modelo: string
    ano: number
  }
  proprietario: {
    nome: string
    documento: string
    endereco: string
  }
  historicoManutencao: Array<{
    data: string
    servico: string
    quilometragem: number
    custo: number
  }>
}

export class VehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async create(data: CreateVehicleData): Promise<VehicleEntity> {
    try {
      const vehicle = new VehicleEntity(data)
      return await this.vehicleRepository.save(vehicle)
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message)
      }
      throw new BadRequestException("Erro ao criar veículo")
    }
  }

  async findById(id: string): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.findById(id)
    if (!vehicle) {
      throw new NotFoundException("Veículo não encontrado")
    }
    return vehicle
  }

  async findAll(): Promise<VehicleEntity[]> {
    return await this.vehicleRepository.findAll()
  }

  async delete(id: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(id)
    if (!vehicle) {
      throw new NotFoundException("Veículo não encontrado")
    }

    const deleted = await this.vehicleRepository.delete(id)
    if (!deleted) {
      throw new BadRequestException("Falha ao deletar veículo")
    }
  }
}
