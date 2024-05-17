import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1715931880540 implements MigrationInterface {
  name = 'SchemaUpdate1715931880540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supplement" ADD "is_deleted" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supplement" DROP COLUMN "is_deleted"`,
    );
  }
}
