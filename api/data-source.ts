import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceOptions = {
  dropSchema: false,
  synchronize: true,
  entities: ['**/*.entity.js'],
};

if (['development', 'production'].includes(process.env.NODE_ENV)) {
  Object.assign(dataSourceOptions, {
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123123123',
    database: 'famifinance',
  });
}

if (process.env.NODE_ENV === 'production')
  Object.assign(dataSourceOptions, { synchronize: false });

if (process.env.NODE_ENV === 'test') {
  Object.assign(dataSourceOptions, {
    type: 'sqlite',
    database: ':memory:',
    entities: ['**/*.entity.ts'],
    dropSchema: true,
  });
}

const typeOrmDS = JSON.parse(JSON.stringify(dataSourceOptions));
Object.assign(typeOrmDS, {
  entities: ['**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});

const dataSource = new DataSource(typeOrmDS as DataSourceOptions);
export { dataSource, dataSourceOptions };
