import { Injectable } from '@nestjs/common';
import { Mysql } from 'mysql2-nestjs';
import { PoolConnection } from 'mysql2/promise';
import { clearLine, cursorTo } from 'readline';

@Injectable()
export class UtilsService {
  async exectureQuery(
    mysql: Mysql,
    dbName: string,
    query: string,
    params: any[] = [],
  ) {
    const connectionPool: PoolConnection = await mysql.getConnection();
    connectionPool.changeUser({ database: dbName });
    let response;
    try {
      connectionPool.beginTransaction();
      response = await connectionPool.query(query, params);
      connectionPool.commit();
    } catch (err) {
      connectionPool.rollback();
      console.log(err);
    } finally {
      connectionPool.release();
    }
    return response;
  }

  async getConnection(mysql: Mysql, dbName: string): Promise<PoolConnection> {
    const connectionPool: PoolConnection = await mysql.getConnection();
    connectionPool.changeUser({ database: dbName });

    return connectionPool;
  }

  async populateCityTable(
    mysql: Mysql,
    dbName: string,
    cityData: Record<string, any>[],
  ) {
    const insertquery = `INSERT IGNORE INTO CITY_MASTER(NAME, STATE,COUNTRY,LONGITUDE,LATITUDE) values`;
    try {
      let insertBatch = ``;
      let comma = '';
      let batchSize = 0;
      for (let i = 0; i < cityData.length; i++) {
        insertBatch += `${comma} ("${cityData[i].name.replace(
          /[\\$'"]/g,
          '\\$&',
        )}", "${cityData[i].state.replace(/[\\$'"]/g, '\\$&')}", "${cityData[
          i
        ].country.replace(/[\\$'"]/g, '\\$&')}", ${cityData[i].coord.lon},${
          cityData[i].coord.lat
        })`;

        comma = ',';
        batchSize++;

        if (batchSize >= 50) {
          await this.exectureQuery(mysql, dbName, insertquery + insertBatch);

          batchSize = 0;
          insertBatch = ``;
          comma = '';
          process.stdout.write(`processed ${i} of ${cityData.length} records`);
          clearLine(process.stdout, 0);
          cursorTo(process.stdout, 0, null);
        }
      }
      if (batchSize > 0) {
        await this.exectureQuery(mysql, dbName, insertquery + insertBatch);

        process.stdout.write(
          `processed ${cityData.length} of ${cityData.length} records\n`,
        );
        clearLine(process.stdout, 0);
        cursorTo(process.stdout, 0, null);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
