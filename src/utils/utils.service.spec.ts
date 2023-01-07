import { HttpModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [UtilsService],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  it('utilsService is defined', () => {
    expect(service).toBeDefined();
  });
});
