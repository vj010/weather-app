export const mySqlConfig = {
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  entities: ['dist/**/*.entity{.ts,.js}'],
};

export const initializeAppDBSchema =
  process.env.INITIALIZE_DB?.toLocaleLowerCase() === 'true';

export const cityJsonFilePath = process.env.CONTAINER_CITY_JSON_FILE_PATH;
