import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateChecklistsAndChecklistItemsTables1728740850246
  implements MigrationInterface
{
  name = 'CreateChecklistsAndChecklistItemsTables1728740850246'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "checklists" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "task_id" integer, CONSTRAINT "PK_336ade2047f3d713e1afa20d2c6" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "checklist_items" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "is_done" boolean NOT NULL DEFAULT false, "checklist_id" integer, CONSTRAINT "PK_bae00945a1d4789bd648e583e29" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "checklists" ADD CONSTRAINT "FK_abcc7a3510958376d5d1c254368" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "checklist_items" ADD CONSTRAINT "FK_d98db409c26c6ed1a6d20c1bb0c" FOREIGN KEY ("checklist_id") REFERENCES "checklists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checklist_items" DROP CONSTRAINT "FK_d98db409c26c6ed1a6d20c1bb0c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "checklists" DROP CONSTRAINT "FK_abcc7a3510958376d5d1c254368"`,
    )
    await queryRunner.query(`DROP TABLE "checklist_items"`)
    await queryRunner.query(`DROP TABLE "checklists"`)
  }
}
