import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectsTable1718295831486 implements MigrationInterface {
    name = 'CreateProjectsTable1718295831486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "creator_id" integer, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects_members" ("project_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_3f688fea7350488557685b44074" PRIMARY KEY ("project_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2b761e52355ca4a6b37f385eb1" ON "projects_members" ("project_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3434643c846626365199848a06" ON "projects_members" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_4b86fad39217ca10aace123c7bd" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects_members" ADD CONSTRAINT "FK_2b761e52355ca4a6b37f385eb12" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_members" ADD CONSTRAINT "FK_3434643c846626365199848a06d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects_members" DROP CONSTRAINT "FK_3434643c846626365199848a06d"`);
        await queryRunner.query(`ALTER TABLE "projects_members" DROP CONSTRAINT "FK_2b761e52355ca4a6b37f385eb12"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_4b86fad39217ca10aace123c7bd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3434643c846626365199848a06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b761e52355ca4a6b37f385eb1"`);
        await queryRunner.query(`DROP TABLE "projects_members"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
