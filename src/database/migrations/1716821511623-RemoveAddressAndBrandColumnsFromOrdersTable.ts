import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAddressAndBrandColumnsFromOrdersTable1716821511623 implements MigrationInterface {
    name = 'RemoveAddressAndBrandColumnsFromOrdersTable1716821511623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "object_address"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "brand"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "brand" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "object_address" text`);
    }

}
