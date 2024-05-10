import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOnDeleteOptionToCreatorAndExecutorInOrdersTable1715338037468
  implements MigrationInterface
{
  name = 'AddOnDeleteOptionToCreatorAndExecutorInOrdersTable1715338037468'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_7bbb60d1339c786f56b3cd6fd43"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_bd4b266d9cf1fbf3f25a7f6a223"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_7bbb60d1339c786f56b3cd6fd43" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_bd4b266d9cf1fbf3f25a7f6a223" FOREIGN KEY ("executor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_bd4b266d9cf1fbf3f25a7f6a223"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_7bbb60d1339c786f56b3cd6fd43"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_bd4b266d9cf1fbf3f25a7f6a223" FOREIGN KEY ("executor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_7bbb60d1339c786f56b3cd6fd43" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
