import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestMysql2Module } from 'mysql2-nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mySqlConfig } from './config/mysql.config';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: mySqlConfig.host,
      port: mySqlConfig.port,
      username: mySqlConfig.username,
      password: mySqlConfig.password,
      entities: [__dirname + '../**/*.entity{.ts,.js}'],
      database: mySqlConfig.database,
      synchronize: false,
    }),
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
