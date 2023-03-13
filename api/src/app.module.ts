import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user';
import { TransactionModule } from './transaction';
import { ProfileModule } from './profile';
import { AuthModule } from './auth';
import mainConfig from './common/config';
import { DataSourceOptions } from 'typeorm';
import { AppController } from './app.controller';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      load: [mainConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get<'mariadb' | 'mssql'>('database.type'),
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.name'),
          synchronize: true,
          entities: configService.get('database.entities'),
          options: {
            encrypt: false,
            trustServerCertificate: true,
          },
        } as DataSourceOptions),
    }),
    TransactionModule,
    ProfileModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
