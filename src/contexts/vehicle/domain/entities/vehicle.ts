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

export class VehicleEntity {
  constructor(
    public readonly veiculo: VehicleData,
    public readonly proprietario: OwnerData,
    public readonly historicoManutencao: MaintenanceRecord[]
  ) {}

  static create(data: {
    veiculo: VehicleData
    proprietario: OwnerData
    historicoManutencao: MaintenanceRecord[]
  }): VehicleEntity {
    if (!data.veiculo.placa || data.veiculo.placa.trim() === "") {
      throw new Error("Placa do veículo é obrigatória")
    }

    if (!data.veiculo.marca || data.veiculo.marca.trim() === "") {
      throw new Error("Marca do veículo é obrigatória")
    }

    if (!data.veiculo.modelo || data.veiculo.modelo.trim() === "") {
      throw new Error("Modelo do veículo é obrigatório")
    }

    if (
      !data.veiculo.ano ||
      data.veiculo.ano < 1900 ||
      data.veiculo.ano > new Date().getFullYear() + 1
    ) {
      throw new Error("Ano do veículo deve ser válido")
    }

    if (!data.proprietario.nome || data.proprietario.nome.trim() === "") {
      throw new Error("Nome do proprietário é obrigatório")
    }

    if (!data.proprietario.documento || data.proprietario.documento.trim() === "") {
      throw new Error("Documento do proprietário é obrigatório")
    }

    if (!data.proprietario.endereco || data.proprietario.endereco.trim() === "") {
      throw new Error("Endereço do proprietário é obrigatório")
    }

    for (const record of data.historicoManutencao) {
      if (!record.data || record.data.trim() === "") {
        throw new Error("Data da manutenção é obrigatória")
      }

      if (!record.servico || record.servico.trim() === "") {
        throw new Error("Serviço da manutenção é obrigatório")
      }

      if (record.quilometragem < 0) {
        throw new Error("Quilometragem deve ser um valor positivo")
      }

      if (record.custo < 0) {
        throw new Error("Custo deve ser um valor positivo")
      }

      const date = new Date(record.data)
      if (isNaN(date.getTime())) {
        throw new Error("Data da manutenção deve estar em formato válido (YYYY-MM-DD)")
      }
    }

    return new VehicleEntity(data.veiculo, data.proprietario, data.historicoManutencao)
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
