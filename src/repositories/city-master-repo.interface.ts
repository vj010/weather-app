import { CityMaster } from '../entities/city-master.entity';

export interface CityMasterRepositoryInterface {
  getCityById(id: number): Promise<CityMaster> | CityMaster;
}
