import { PrismaClient } from "@prisma/client"
import {
  VehicleEntity,
  VehicleData,
  OwnerData,
  MaintenanceRecord,
} from "@contexts/vehicle/domain/entities/vehicle"
import { VehicleRepository } from "@contexts/vehicle/domain/repositories/vehicle.repository"

export class PrismaVehicleRepository implements VehicleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(vehicle: VehicleEntity): Promise<VehicleEntity> {
    const savedVehicle = await this.prisma.vehicle.create({
      data: {
        placa: vehicle.veiculo.placa,
        marca: vehicle.veiculo.marca,
        modelo: vehicle.veiculo.modelo,
        ano: vehicle.veiculo.ano,
        proprietario: {
          create: {
            nome: vehicle.proprietario.nome,
            documento: vehicle.proprietario.documento,
            endereco: vehicle.proprietario.endereco,
          },
        },
        manutencoes: {
          create: vehicle.historicoManutencao.map((record) => ({
            data: new Date(record.data),
            servico: record.servico,
            quilometragem: record.quilometragem,
            custo: record.custo,
          })),
        },
      },
      include: {
        proprietario: true,
        manutencoes: true,
      },
    })

    return this.mapToEntity(savedVehicle)
  }

  async findById(id: string): Promise<VehicleEntity | null> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: id },
      include: {
        proprietario: true,
        manutencoes: true,
      },
    })

    if (!vehicle) {
      return null
    }

    return this.mapToEntity(vehicle)
  }

  async findAll(): Promise<VehicleEntity[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      include: {
        proprietario: true,
        manutencoes: true,
      },
    })

    return vehicles.map((vehicle) => this.mapToEntity(vehicle))
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.vehicle.delete({
        where: { id: id },
      })
      return true
    } catch {
      return false
    }
  }

  private mapToEntity(vehicle: any): VehicleEntity {
    const vehicleData: VehicleData = {
      placa: vehicle.placa,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      ano: vehicle.ano,
    }

    const ownerData: OwnerData = {
      nome: vehicle.proprietario.nome,
      documento: vehicle.proprietario.documento,
      endereco: vehicle.proprietario.endereco,
    }

    const maintenanceRecords: MaintenanceRecord[] = vehicle.manutencoes.map(
      (record: any) => ({
        data: record.data.toISOString().split("T")[0],
        servico: record.servico,
        quilometragem: record.quilometragem,
        custo: record.custo,
      })
    )

    return new VehicleEntity(vehicleData, ownerData, maintenanceRecords)
  }
}
