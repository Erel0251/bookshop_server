import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1715753058340 implements MigrationInterface {
    name = 'SchemaUpdate1715753058340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(255) NOT NULL, "comment" text NOT NULL, "rating" integer NOT NULL, "book_id" uuid, CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "last_name" text NOT NULL, "first_name" text NOT NULL, "bio" text, "img_url" text, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" text NOT NULL, "publisher" text NOT NULL, "img_urls" text array NOT NULL DEFAULT '{}', "overview" text NOT NULL, "isbn" character(13) NOT NULL, "categories" text array NOT NULL DEFAULT '{}', "price" real NOT NULL, "sale" real NOT NULL DEFAULT '0', "currency" text NOT NULL, "is_recommended" boolean NOT NULL DEFAULT false, "buy_count" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_c10a44a29ef231062f22b1b7ac5" UNIQUE ("title"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "quantity" smallint NOT NULL DEFAULT '0', "total_price" real NOT NULL DEFAULT '0', "user_id" uuid, CONSTRAINT "REL_f091e86a234693a49084b4c2c8" UNIQUE ("user_id"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "first_name" text NOT NULL, "last_name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "refresh_token" text NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "author_book_details" ("author_id" uuid NOT NULL, "book_id" uuid NOT NULL, CONSTRAINT "PK_654c6c47fc16fe6bc245aede238" PRIMARY KEY ("author_id", "book_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_02995202d8f8d5f65541473a46" ON "author_book_details" ("author_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ad4d344af14b965c4cd0ae07cd" ON "author_book_details" ("book_id") `);
        await queryRunner.query(`CREATE TABLE "cart_book_details" ("cart_id" uuid NOT NULL, "book_id" uuid NOT NULL, CONSTRAINT "PK_c7f98344495d49b2821b91f0311" PRIMARY KEY ("cart_id", "book_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1509fe836191395641d9cb1980" ON "cart_book_details" ("cart_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ceb45c93f1f93f4fa3e0d7ec4e" ON "cart_book_details" ("book_id") `);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_99555d5b4a120b01a7a33625d5f" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_f091e86a234693a49084b4c2c86" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "author_book_details" ADD CONSTRAINT "FK_02995202d8f8d5f65541473a46b" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "author_book_details" ADD CONSTRAINT "FK_ad4d344af14b965c4cd0ae07cd6" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_book_details" ADD CONSTRAINT "FK_1509fe836191395641d9cb1980b" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cart_book_details" ADD CONSTRAINT "FK_ceb45c93f1f93f4fa3e0d7ec4ec" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_book_details" DROP CONSTRAINT "FK_ceb45c93f1f93f4fa3e0d7ec4ec"`);
        await queryRunner.query(`ALTER TABLE "cart_book_details" DROP CONSTRAINT "FK_1509fe836191395641d9cb1980b"`);
        await queryRunner.query(`ALTER TABLE "author_book_details" DROP CONSTRAINT "FK_ad4d344af14b965c4cd0ae07cd6"`);
        await queryRunner.query(`ALTER TABLE "author_book_details" DROP CONSTRAINT "FK_02995202d8f8d5f65541473a46b"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_f091e86a234693a49084b4c2c86"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_99555d5b4a120b01a7a33625d5f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ceb45c93f1f93f4fa3e0d7ec4e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1509fe836191395641d9cb1980"`);
        await queryRunner.query(`DROP TABLE "cart_book_details"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad4d344af14b965c4cd0ae07cd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_02995202d8f8d5f65541473a46"`);
        await queryRunner.query(`DROP TABLE "author_book_details"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`DROP TABLE "rating"`);
    }

}
