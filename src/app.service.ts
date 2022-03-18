import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectMysql, Mysql } from 'mysql2-nestjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectMysql()
    private readonly mysql: Mysql,
  ) {}
  getHello(): string {
    return 'Hello !';
  }

  onModuleInit() {
    console.log('weather app started');
  }
}
