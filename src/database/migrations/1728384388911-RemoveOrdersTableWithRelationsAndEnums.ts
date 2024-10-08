import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveOrdersTableWithRelationsAndEnums1728384388911
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_bd4b266d9cf1fbf3f25a7f6a223"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_7bbb60d1339c786f56b3cd6fd43"`,
    )
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "executor_id"`)
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "creator_id"`)

    await queryRunner.query(`DROP TABLE "orders"`)
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`)
    await queryRunner.query(`DROP TYPE "public"."orders_priority_enum"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_priority_enum" AS ENUM('low', 'medium', 'high')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('waiting', 'accepted', 'done')`,
    )
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "description" text NOT NULL, "object_address" text NOT NULL, "brand" character varying NOT NULL, "cost" integer NOT NULL, "priority" "public"."orders_priority_enum" NOT NULL DEFAULT 'low', "status" "public"."orders_status_enum" NOT NULL DEFAULT 'waiting', "deadline" date NOT NULL, "is_archived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    )

    await queryRunner.query(`ALTER TABLE "orders" ADD "creator_id" integer`)
    await queryRunner.query(`ALTER TABLE "orders" ADD "executor_id" integer`)
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_7bbb60d1339c786f56b3cd6fd43" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_bd4b266d9cf1fbf3f25a7f6a223" FOREIGN KEY ("executor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
