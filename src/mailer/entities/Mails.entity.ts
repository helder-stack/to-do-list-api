import Users from "src/user/entities/Users.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import EmailsStatusEnum from "../enums/EmailsStatus.enum";
import EmailsTypesEnum from "../enums/EmailsType.enum";

@Entity('mails')
export default class Mails extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @JoinColumn()
    userId: number;
    
    @Column()
    type: EmailsTypesEnum;

    @Column()
    token: string;

    @Column()
    status: EmailsStatusEnum;

    @ManyToOne(()=> Users, (user: Users)=> user.mails)
    user: Users
}
