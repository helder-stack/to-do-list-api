import Mails from "src/mailer/entities/Mails.entity";
import Tasks from "../../tasks/entities/Tasks.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import StatusEnum from "../enums/Status.enum";

@Entity("users")
export default class Users extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        default: false
    })
    emailIsVerified: boolean

    @Column({
        default: StatusEnum.active
    })
    status: StatusEnum

    @OneToMany(()=>Mails, (mails: Mails)=> mails.user, {eager: true})
    mails: Mails[]

    @OneToMany(()=> Tasks, (tasks: Tasks) => tasks.user, {eager: true})
    tasks: Tasks[]
}