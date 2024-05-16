import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1715844330075 implements MigrationInterface {
  name = 'SchemaUpdate1715844330075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying(255) NOT NULL, "comment" text NOT NULL, "rating" integer NOT NULL, "book_id" uuid, CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "last_name" text NOT NULL, "first_name" text NOT NULL, "bio" text, "img_url" text, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" text NOT NULL, "description" text, "book_id" uuid, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sale" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" text NOT NULL, "description" text, "from" date, "to" date, "book_id" uuid, CONSTRAINT "PK_d03891c457cbcd22974732b5de2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "province" character varying NOT NULL, "district" character varying NOT NULL, "ward" character varying NOT NULL, "address" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "total_price" real NOT NULL, "user_id" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "price" real NOT NULL, "discount" real NOT NULL DEFAULT '0', "quantity" integer NOT NULL DEFAULT '1', "total_price" real NOT NULL, "order_id" uuid, "book_id" uuid, CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supplement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, "total_quantity" integer NOT NULL, "total_price" integer NOT NULL, "currency" character varying NOT NULL, "supplier" character varying NOT NULL, CONSTRAINT "PK_e88bfaa9511f7093f7fb015bb07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supplement_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "quantity" integer NOT NULL, "price" integer NOT NULL, "currency" character varying NOT NULL, "supplementsId" uuid, "booksId" uuid, CONSTRAINT "PK_a6cf11c57237468eae4c6fdb449" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" text NOT NULL, "publisher" text NOT NULL, "img_urls" text array NOT NULL DEFAULT '{}', "overview" text NOT NULL, "isbn" character(13) NOT NULL, "price" real NOT NULL, "status" text NOT NULL, "currency" text NOT NULL, "is_recommended" boolean NOT NULL DEFAULT false, "buy_count" integer NOT NULL DEFAULT '0', "inventory" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_c10a44a29ef231062f22b1b7ac5" UNIQUE ("title"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "quantity" integer NOT NULL DEFAULT '1', "cart_id" uuid, "book_id" uuid, CONSTRAINT "PK_0aee33198afb7b90e93105593b2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "total_price" real NOT NULL DEFAULT '0', "user_id" uuid, CONSTRAINT "REL_f091e86a234693a49084b4c2c8" UNIQUE ("user_id"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "first_name" text NOT NULL, "last_name" text NOT NULL, "email" text NOT NULL, "phone" text, "role" text NOT NULL DEFAULT 'user', "password" text NOT NULL, "refresh_token" text NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "author_book_details" ("author_id" uuid NOT NULL, "book_id" uuid NOT NULL, CONSTRAINT "PK_654c6c47fc16fe6bc245aede238" PRIMARY KEY ("author_id", "book_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_02995202d8f8d5f65541473a46" ON "author_book_details" ("author_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ad4d344af14b965c4cd0ae07cd" ON "author_book_details" ("book_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" ADD CONSTRAINT "FK_99555d5b4a120b01a7a33625d5f" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_e209544b2ee6edeab590857a259" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "FK_6e9dc286b83e57c9b5d2d88b39e" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" ADD CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" ADD CONSTRAINT "FK_3d855f5483990f14739c8c09ec0" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplement_detail" ADD CONSTRAINT "FK_533ac064b02bb4f4e843f969910" FOREIGN KEY ("supplementsId") REFERENCES "supplement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplement_detail" ADD CONSTRAINT "FK_027bc5a0d44ed2c2745d2ddaefe" FOREIGN KEY ("booksId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_detail" ADD CONSTRAINT "FK_72be77f2fa4aff406b0c4498d47" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_detail" ADD CONSTRAINT "FK_459492df5696486f61416c83fd4" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_f091e86a234693a49084b4c2c86" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "author_book_details" ADD CONSTRAINT "FK_02995202d8f8d5f65541473a46b" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "author_book_details" ADD CONSTRAINT "FK_ad4d344af14b965c4cd0ae07cd6" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "author_book_details" DROP CONSTRAINT "FK_ad4d344af14b965c4cd0ae07cd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "author_book_details" DROP CONSTRAINT "FK_02995202d8f8d5f65541473a46b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_f091e86a234693a49084b4c2c86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_detail" DROP CONSTRAINT "FK_459492df5696486f61416c83fd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_detail" DROP CONSTRAINT "FK_72be77f2fa4aff406b0c4498d47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplement_detail" DROP CONSTRAINT "FK_027bc5a0d44ed2c2745d2ddaefe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplement_detail" DROP CONSTRAINT "FK_533ac064b02bb4f4e843f969910"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" DROP CONSTRAINT "FK_3d855f5483990f14739c8c09ec0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" DROP CONSTRAINT "FK_6e9dc286b83e57c9b5d2d88b39e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_e209544b2ee6edeab590857a259"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" DROP CONSTRAINT "FK_99555d5b4a120b01a7a33625d5f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ad4d344af14b965c4cd0ae07cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_02995202d8f8d5f65541473a46"`,
    );
    await queryRunner.query(`DROP TABLE "author_book_details"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "cart_detail"`);
    await queryRunner.query(`DROP TABLE "book"`);
    await queryRunner.query(`DROP TABLE "supplement_detail"`);
    await queryRunner.query(`DROP TABLE "supplement"`);
    await queryRunner.query(`DROP TABLE "order_detail"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "sale"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "author"`);
    await queryRunner.query(`DROP TABLE "rating"`);
  }
}
