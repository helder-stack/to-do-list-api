import { MigrationInterface, QueryRunner } from "typeorm"

export class alterTableUsers1675185656839 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE mails MODIFY COLUMN type ENUM('emailValidation', 'resetPassword') DEFAULT 'emailValidation'")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE mails MODIFY COLUMN type ENUM('emailValidation') DEFAULT 'emailValidation'")
    }

}
