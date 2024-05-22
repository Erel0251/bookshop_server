import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1716363133542 implements MigrationInterface {
    name = 'SchemaUpdate1716363133542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_01279634d048402041313def384"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "fatherId" TO "father_id"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_08644d63888f9493b187f8dda2e" FOREIGN KEY ("father_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_08644d63888f9493b187f8dda2e"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "father_id" TO "fatherId"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_01279634d048402041313def384" FOREIGN KEY ("fatherId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
