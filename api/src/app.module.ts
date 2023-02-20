import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from '../data-source';
import { TransactionsModule } from './transactions/transactions.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import config from './common/config';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot(dataSourceOptions as DataSourceOptions),
    TransactionsModule,
    ProfileModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
