import { Injectable } from '@nestjs/common';
import { CityMaster } from '../entities/city-master.entity';
import { CityMasterRepositoryInterface } from 'src/repositories/city-master-repo.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class CityMasterRepository implements CityMasterRepositoryInterface {
  constructor(private dataSource: DataSource) {}
  async getCityById(id: number): Promise<CityMaster> {
    const repo = this.dataSource.getRepository(CityMaster);
    const city = await repo.findOne({ where: { id } });
    return city;
  }
}
