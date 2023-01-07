import { CityMaster } from '../entities/city-master.entity';
import { DataSource, Repository } from 'typeorm';

const getCityMasterRepository = (
  datasource: DataSource,
): Repository<CityMaster> => {
  return datasource.getRepository(CityMaster);
};

export default getCityMasterRepository;
