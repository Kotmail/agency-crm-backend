import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemovedFullNameColAndCreatedTwoNewColsInUsersTable1719508349184
  implements MigrationInterface
{
  name = 'RemovedFullNameColAndCreatedTwoNewColsInUsersTable1719508349184'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "full_name"`)
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "last_name" SET NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "last_name" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "first_name" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD "full_name" character varying NOT NULL`,
    )
  }
}
