import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class Init1670168719827 implements MigrationInterface {
  name = 'Init1670168719827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar(100)',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar(100)',
            isNullable: false,
          },
        ] as TableColumn[],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user', true);
  }
}
