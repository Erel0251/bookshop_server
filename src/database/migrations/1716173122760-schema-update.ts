import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1716173122760 implements MigrationInterface {
  name = 'SchemaUpdate1716173122760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying(255) NOT NULL, "comment" text NOT NULL, "rating" integer NOT NULL, "book_id" uuid, "user_id" uuid, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "promotion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" text NOT NULL, "description" text, "type" character varying NOT NULL DEFAULT 'SALE', "from" date, "to" date, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "promotion_book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "quantity" integer, "price" integer, "discount" integer, "promotion_id" uuid, "book_id" uuid, CONSTRAINT "PK_ca0b71af2fcecbf86b5063e3ada" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_c8c387802649e72190078ed5a78" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_81446f2ee100305f42645d4d6c2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion_book" ADD CONSTRAINT "FK_67aa82350ff88889e18e9dcf1b8" FOREIGN KEY ("promotion_id") REFERENCES "promotion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion_book" ADD CONSTRAINT "FK_9c8129516e5e0054a2b3be4e95f" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "promotion_book" DROP CONSTRAINT "FK_9c8129516e5e0054a2b3be4e95f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion_book" DROP CONSTRAINT "FK_67aa82350ff88889e18e9dcf1b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_81446f2ee100305f42645d4d6c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_c8c387802649e72190078ed5a78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP TABLE "promotion_book"`);
    await queryRunner.query(`DROP TABLE "promotion"`);
    await queryRunner.query(`DROP TABLE "review"`);
  }
}
