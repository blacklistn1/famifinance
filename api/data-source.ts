import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

const dataSourceOptions = {
  synchronize: true,
  dropSchema: false,
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseFloat(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/src/**/*.entity.js'],
};

if (process.env.NODE_ENV === 'production') {
  dataSourceOptions.synchronize = false;
}

const testDataSourceOptions = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  dropSchema: true,
  entities: ['src/**/*.entity.ts'],
};

const typeDS = JSON.parse(JSON.stringify(dataSourceOptions));
Object.assign(typeDS, {
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
const dataSource = new DataSource(typeDS as DataSourceOptions);

export { dataSource, dataSourceOptions, testDataSourceOptions };
