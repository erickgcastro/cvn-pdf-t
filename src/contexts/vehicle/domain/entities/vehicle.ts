export interface VehicleData {
  placa: string
  marca: string
  modelo: string
  ano: number
}

export interface OwnerData {
  nome: string
  documento: string
  endereco: string
}

export interface MaintenanceRecord {
  data: string
  servico: string
  quilometragem: number
  custo: number
}

export interface VehicleEntityData {
  veiculo: VehicleData
  proprietario: OwnerData
  historicoManutencao: MaintenanceRecord[]
  id?: string
  createdAt?: Date
  updatedAt?: Date
}

export class VehicleEntity {
  constructor(private readonly data: VehicleEntityData) {
    this.data.createdAt = this.data.createdAt || new Date()
    this.data.updatedAt = this.data.updatedAt || new Date()
  }

  get veiculo(): VehicleData {
    return this.data.veiculo
  }

  get proprietario(): OwnerData {
    return this.data.proprietario
  }

  get historicoManutencao(): MaintenanceRecord[] {
    return this.data.historicoManutencao
  }

  get id(): string | undefined {
    return this.data.id
  }

  get createdAt(): Date {
    return this.data.createdAt as Date
  }

  get updatedAt(): Date {
    return this.data.updatedAt as Date
  }

  getTotalMaintenanceCost(): number {
    return this.historicoManutencao.reduce((total, record) => total + record.custo, 0)
  }

  getMaintenanceCount(): number {
    return this.historicoManutencao.length
  }

  getLastMaintenanceDate(): string | null {
    if (this.historicoManutencao.length === 0) {
      return null
    }

    const sortedRecords = [...this.historicoManutencao].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )

    return sortedRecords[0].data
  }
}
