import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOrdersTable1713536978208 implements MigrationInterface {
  name = 'CreateOrdersTable1713536978208'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_priority_enum" AS ENUM('low', 'medium', 'high')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('waiting', 'accepted', 'done')`,
    )
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "description" text NOT NULL, "object_address" text NOT NULL, "brand" character varying NOT NULL, "cost" integer NOT NULL, "priority" "public"."orders_priority_enum" NOT NULL DEFAULT 'low', "status" "public"."orders_status_enum" NOT NULL DEFAULT 'waiting', "deadline" date NOT NULL, "is_archived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "orders"`)
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`)
    await queryRunner.query(`DROP TYPE "public"."orders_priority_enum"`)
  }
}
