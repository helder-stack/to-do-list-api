import { MigrationInterface, QueryRunner } from "typeorm"

export class alterTableUser1675175828978 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE users ADD COLUMN status ENUM('active', 'deleted') DEFAULT 'active'")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE users DROP COLUMN status")
    }

}
