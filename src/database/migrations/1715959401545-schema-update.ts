import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1715959401545 implements MigrationInterface {
  name = 'SchemaUpdate1715959401545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "name" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "name"`);
  }
}
