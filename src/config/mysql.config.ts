import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const mySqlConfig: TypeOrmModuleOptions = {
  host: process.env.MYSQL_HOST as string,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER as string,
  password: process.env.MYSQL_PASS as string,
  database: process.env.MYSQL_DB as string,
  type: 'mysql',
  entities: ['dist/**/*.entity{.ts,.js}'],
};

export const initializeAppDBSchema =
  process.env.INITIALIZE_DB?.toLocaleLowerCase() === 'true';

export const cityJsonFilePath = process.env.CONTAINER_CITY_JSON_FILE_PATH;
