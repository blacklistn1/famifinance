import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user';
import { dataSourceOptions } from '../data-source';
import { TransactionModule } from './transaction';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth';
import mainConfig from './common/config';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      load: [mainConfig],
    }),
    TypeOrmModule.forRoot(dataSourceOptions as DataSourceOptions),
    TransactionModule,
    ProfileModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
