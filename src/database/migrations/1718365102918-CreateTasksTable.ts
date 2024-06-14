import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTasksTable1718365102918 implements MigrationInterface {
    name = 'CreateTasksTable1718365102918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('unsorted', 'in-progress', 'in-review', 'completed')`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('low', 'medium', 'high')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "due_date" date, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'unsorted', "priority" "public"."tasks_priority_enum", "created_at" TIMESTAMP NOT NULL DEFAULT now(), "creator_id" integer, "project_id" integer, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tasks_responsible_users" ("task_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_76e566dfaada1e48a7b14943018" PRIMARY KEY ("task_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3c0b571dbd9e8e88a9df903b11" ON "tasks_responsible_users" ("task_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_dda58bfb0398227d98373f92bd" ON "tasks_responsible_users" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_f4cb489461bc751498a28852356" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks_responsible_users" ADD CONSTRAINT "FK_3c0b571dbd9e8e88a9df903b117" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tasks_responsible_users" ADD CONSTRAINT "FK_dda58bfb0398227d98373f92bd1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks_responsible_users" DROP CONSTRAINT "FK_dda58bfb0398227d98373f92bd1"`);
        await queryRunner.query(`ALTER TABLE "tasks_responsible_users" DROP CONSTRAINT "FK_3c0b571dbd9e8e88a9df903b117"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_f4cb489461bc751498a28852356"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dda58bfb0398227d98373f92bd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c0b571dbd9e8e88a9df903b11"`);
        await queryRunner.query(`DROP TABLE "tasks_responsible_users"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    }

}
