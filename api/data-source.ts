import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

const dataSourceOptions = {
  synchronize: !!parseFloat(process.env.DB_SYNCHRONIZE),
  dropSchema: !!parseFloat(process.env.DB_DROP_SCHEMA),
  database: process.env.DB_NAME,
};

if (['development', 'production'].includes(process.env.NODE_ENV)) {
  Object.assign(dataSourceOptions, {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseFloat(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [__dirname + '/src/**/*.entity.js'],
  });
}

if (['production'].includes(process.env.NODE_ENV)) {
  Object.assign(dataSourceOptions, {
    synchronize: false,
  });
}

if (['testing'].includes(process.env.NODE_ENV)) {
  Object.assign(dataSourceOptions, {
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ['src/**/*.entity.ts'],
  });
}

const typeDS = JSON.parse(JSON.stringify(dataSourceOptions));
Object.assign(typeDS, {
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
const dataSource = new DataSource(typeDS as DataSourceOptions);

export { dataSource, dataSourceOptions };
