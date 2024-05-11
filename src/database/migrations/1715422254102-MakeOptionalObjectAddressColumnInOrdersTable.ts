import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeOptionalObjectAddressColumnInOrdersTable1715422254102 implements MigrationInterface {
    name = 'MakeOptionalObjectAddressColumnInOrdersTable1715422254102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "object_address" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "object_address" SET NOT NULL`);
    }

}
