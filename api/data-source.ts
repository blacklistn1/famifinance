import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

const dataSourceOptions: DataSourceOptions = {
  synchronize: true,
  dropSchema: false,
  type: process.env.DB_TYPE as 'mysql' | 'mariadb' | 'mssql',
  host: process.env.DB_HOST,
  port: parseFloat(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity.js'],
};

if (process.env.NODE_ENV === 'production') {
  Object.assign(dataSourceOptions.synchronize, false);
}

const testDataSourceOptions = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  dropSchema: true,
  entities: ['./**/*.entity.ts'],
};

const typeDS = JSON.parse(JSON.stringify(dataSourceOptions));
Object.assign(typeDS, {
  entities: ['./**/*.entity.{js,ts}'],
  migrations: ['./**/migrations/*.ts'],
});
const dataSource = new DataSource(typeDS as DataSourceOptions);

export { dataSource, dataSourceOptions, testDataSourceOptions };
