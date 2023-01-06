import { Injectable } from '@nestjs/common';
import { clearLine, cursorTo } from 'readline';
import { CityMaster } from 'src/entities/city-master.entity';
import { CityInfo } from 'src/types/city-info-interface';

@Injectable()
export class UtilsService {
  constructor() {}

  getCityInfoObject(cityMaster: CityMaster): CityInfo {
    return {
      name: cityMaster.name,
      id: cityMaster.id,
      lat: cityMaster.latutitude,
      lng: cityMaster.longitude,
    };
  }
}
