import { MigrationInterface, QueryRunner } from "typeorm"

export class createTableMails1674762329294 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE mails (id INT AUTO_INCREMENT, userId INT NOT NULL, type ENUM("emailValidation") DEFAULT "emailValidation", token VARCHAR(200), status ENUM("sent", "error", "validated"), PRIMARY KEY (id), FOREIGN KEY (userId) REFERENCES users(id))')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE mails')
    }

}
