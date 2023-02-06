import { MigrationInterface, QueryRunner } from "typeorm"

export class createTableTasks1675206626653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE tasks (id INT AUTO_INCREMENT, userId INT, title VARCHAR(100) NOT NULL, description VARCHAR(1000), status ENUM('todo', 'doing', 'done') DEFAULT 'todo', PRIMARY KEY (id), FOREIGN KEY (userId) REFERENCES users(id))")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE tasks")
    }

}
