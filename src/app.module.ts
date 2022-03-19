import { HttpModule, Module } from '@nestjs/common';
import { NestMysql2Module } from 'mysql2-nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mySqlConfig } from './config/mysql.config';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    NestMysql2Module.register({
      host: mySqlConfig.host,
      port: mySqlConfig.port,
      user: mySqlConfig.username,
      password: mySqlConfig.password,
    }),
    UtilsModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
