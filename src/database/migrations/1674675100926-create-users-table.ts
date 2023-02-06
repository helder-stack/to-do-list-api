import { MigrationInterface, QueryRunner } from "typeorm"

export class createUsersTable1674675100926 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE users (id INT AUTO_INCREMENT, name VARCHAR(20) NOT NULL, lastName VARCHAR(20) NULL, email VARCHAR(50) NOT NULL, password VARCHAR(250) NOT NULL, emailIsVerified BOOLEAN DEFAULT '0', PRIMARY KEY (id))")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE users")
    }

}
