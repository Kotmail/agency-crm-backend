import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnDeleteCascaseToChecklistItemsTable1749127610870 implements MigrationInterface {
    name = 'AddOnDeleteCascaseToChecklistItemsTable1749127610870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checklist_items" DROP CONSTRAINT "FK_d98db409c26c6ed1a6d20c1bb0c"`);
        await queryRunner.query(`ALTER TABLE "checklist_items" ADD CONSTRAINT "FK_d98db409c26c6ed1a6d20c1bb0c" FOREIGN KEY ("checklist_id") REFERENCES "checklists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checklist_items" DROP CONSTRAINT "FK_d98db409c26c6ed1a6d20c1bb0c"`);
        await queryRunner.query(`ALTER TABLE "checklist_items" ADD CONSTRAINT "FK_d98db409c26c6ed1a6d20c1bb0c" FOREIGN KEY ("checklist_id") REFERENCES "checklists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
