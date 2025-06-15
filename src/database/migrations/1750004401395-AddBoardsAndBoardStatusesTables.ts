import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBoardsAndBoardStatusesTables1750004401395 implements MigrationInterface {
    name = 'AddBoardsAndBoardStatusesTables1750004401395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`);
        await queryRunner.query(`ALTER TABLE "tasks" RENAME COLUMN "project_id" TO "board_status_id"`);
        await queryRunner.query(`CREATE TABLE "boards" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "project_id" integer, CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "board_statuses" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "board_id" integer, CONSTRAINT "PK_36416f71bc0f7f844547ffed1c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "boards" ADD CONSTRAINT "FK_1542ae826c0dfeaf4c79e07fc57" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_122ab010a68f254494b5eb3659a" FOREIGN KEY ("board_status_id") REFERENCES "board_statuses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board_statuses" ADD CONSTRAINT "FK_a338277c285e105457dc8a85ae0" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board_statuses" DROP CONSTRAINT "FK_a338277c285e105457dc8a85ae0"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_122ab010a68f254494b5eb3659a"`);
        await queryRunner.query(`ALTER TABLE "boards" DROP CONSTRAINT "FK_1542ae826c0dfeaf4c79e07fc57"`);
        await queryRunner.query(`DROP TABLE "board_statuses"`);
        await queryRunner.query(`DROP TABLE "boards"`);
        await queryRunner.query(`ALTER TABLE "tasks" RENAME COLUMN "board_status_id" TO "project_id"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
