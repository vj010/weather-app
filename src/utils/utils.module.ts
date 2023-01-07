import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UtilsService } from './utils.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
