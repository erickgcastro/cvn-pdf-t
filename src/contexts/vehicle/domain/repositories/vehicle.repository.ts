import { VehicleEntity } from "../entities/vehicle"

export interface VehicleRepository {
  save(vehicle: VehicleEntity): Promise<VehicleEntity>
  findById(id: string): Promise<VehicleEntity | null>
  findAll(): Promise<VehicleEntity[]>
  delete(id: string): Promise<boolean>
}
