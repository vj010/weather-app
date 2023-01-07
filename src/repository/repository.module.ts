import { Module } from '@nestjs/common';
import { CityMasterRepository } from './city-master-repo.provider';
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
