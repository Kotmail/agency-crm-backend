import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUsersTable1713536829875 implements MigrationInterface {
  name = 'CreateUsersTable1713536829875'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'manager', 'executor')`,
    )
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying, "email" character varying NOT NULL, "full_name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'executor', "password" character varying NOT NULL, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`)
  }
}
