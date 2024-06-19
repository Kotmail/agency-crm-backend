import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangedDueDateColumnTypeInProjectsAndTasksTables1718822530474
  implements MigrationInterface
{
  name = 'ChangedDueDateColumnTypeInProjectsAndTasksTables1718822530474'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "due_date"`)
    await queryRunner.query(`ALTER TABLE "projects" ADD "due_date" TIMESTAMP`)
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "due_date"`)
    await queryRunner.query(`ALTER TABLE "tasks" ADD "due_date" TIMESTAMP`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "due_date"`)
    await queryRunner.query(`ALTER TABLE "tasks" ADD "due_date" date`)
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "due_date"`)
    await queryRunner.query(`ALTER TABLE "projects" ADD "due_date" date`)
  }
}
