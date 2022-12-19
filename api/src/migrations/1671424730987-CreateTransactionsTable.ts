import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateTransactionsTable1671424730987
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
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
            name: 'user',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar(100)',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'current_timestamp()',
          },
        ] as TableColumn[],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions', true);
  }
}
