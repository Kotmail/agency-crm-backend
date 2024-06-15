import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddedNewColumnsToProjectsTable1718477502486
  implements MigrationInterface
{
  name = 'AddedNewColumnsToProjectsTable1718477502486'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" ADD "description" text`)
    await queryRunner.query(`ALTER TABLE "projects" ADD "due_date" date`)
    await queryRunner.query(
      `CREATE TYPE "public"."projects_priority_enum" AS ENUM('low', 'medium', 'high')`,
    )
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "priority" "public"."projects_priority_enum"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "priority"`)
    await queryRunner.query(`DROP TYPE "public"."projects_priority_enum"`)
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "due_date"`)
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "description"`)
  }
}
