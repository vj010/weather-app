import { Module } from '@nestjs/common';
import { CityMasterRepository } from './city-master-repo.provider';
import { CityMasterRepositoryInterface } from '../repositories/city-master-repo.interface';
@Module({
  providers: [
    {
      provide: 'CityMasterRepo',
      useClass: CityMasterRepository,
    },
  ],
  exports: ['CityMasterRepo'],
})
export class RepositoryModule {}
