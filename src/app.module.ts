import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilsModule } from './utils/utils.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASS'),
        database: configService.get<string>('MYSQL_DB'),
        port: configService.get<number>('MYSQL_PORT'),
        entities: ['dist/**/*.entity{.ts,.js}'],
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    UtilsModule,
    HttpModule,
    RepositoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
