import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddedAvatarColumnToUsersTable1721454084779
  implements MigrationInterface
{
  name = 'AddedAvatarColumnToUsersTable1721454084779'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatar" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`)
  }
}
