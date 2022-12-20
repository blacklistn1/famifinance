import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceOptions = {
  synchronize: false,
  dropSchema: false,
  database: 'famifinance',
};

if (['development', 'production'].includes(process.env.NODE_ENV)) {
  Object.assign(dataSourceOptions, {
    type: 'mariadb',
    host: 'localhost',
    username: 'root',
    password: '123123123',
    entities: ['src/**/*.entity.js'],
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
