import Users from "../../user/entities/Users.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import TasksStatusEnum from "../enums/TasksStatus.enum";

@Entity('tasks')
export default class Tasks extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number;

    @Column()
    title: string;

    @Column()
    description: string;
    
    @Column()
    status: TasksStatusEnum

    @ManyToOne(()=> Users, (user: Users) => user.tasks)
    user: Users
}

// await queryRunner.query("CREATE TABLE tasks (id INT AUTO_INCREMENT, userId INT NOT NULL, title VARCHAR(100) NOT NULL, description VARCHAR(1000), status ENUM('todo', 'doing', 'done') DEFAULT 'todo',PRIMARY KEY (id), FOREIGN KEY (userId) REFERENCES userId(id))")
