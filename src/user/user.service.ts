import { HttpException, Injectable } from "@nestjs/common";
import CreateUserDTO from "./DTOs/CreateUser.dto";
import LoginUserDTO from "./DTOs/LoginUser.dto";
import UpdateUserDTO from "./DTOs/UpdateUser.dto";
import Users from "./entities/Users.entity";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import MailerService from "src/mailer/mailer.service";
import EmailsStatusEnum from "src/mailer/enums/EmailsStatus.enum";
import StatusEnum from "./enums/Status.enum";
import ResetPasswordDTO from "./DTOs/ResetPassword.dto";

@Injectable()
export default class UserService {

    constructor(
        private readonly mailService: MailerService
    ) { }

    async create(userDTO: CreateUserDTO) {
        const existentUser = await this.findByEmail(userDTO.email)
        if (existentUser) {
            throw new HttpException("This e-mail is already in use.", 400)
            return;
        }
        try {
            const mountedUserData = this.mount(userDTO)
            mountedUserData.password = await this.generatePassword(userDTO.password)
            const user = await Users.save(mountedUserData)
            await this.mailService.sendValidationEmail(user)
        } catch (e) {
            console.error(e.message)
            throw new HttpException("Internal server Error", 500)
        }
    }

    mount(userDTO: CreateUserDTO | UpdateUserDTO) {
        const user = new Users()
        user.name = userDTO.name
        user.lastName = userDTO.lastName
        user.email = userDTO.email
        return user
    }

    async findOne(id: number) {
        const user = await Users.findOne({
            where: {
                id,
                status: StatusEnum.active
            }
        })
        if (!user) {
            throw new HttpException("User not found!", 404)
            return;
        }
        delete user.password
        return user
    }

    findByEmail(email: string) {
        return Users.findOne({
            where: {
                email,
                status: StatusEnum.active
            }
        })
    }

    async delete(user: Users) {
        const userToUpdate = await Users.findOne({
            where: {
                id: user.id,
                status: StatusEnum.active
            }
        })
        if (userToUpdate) {
            await Users.update({ id: user.id }, {
                status: StatusEnum.deleted
            })
        }
        throw new HttpException("User not found", 404)
        return;
    }

    async update(userDTO: UpdateUserDTO, user: Users) {
        const updatedUserData = await this.mountUpdatedUserData(userDTO, user)
        try{
            await Users.update({id: user.id}, {
                ...updatedUserData
            })
        }catch(e){
            throw new HttpException("Internal server error", 500)
        }
    }

    mountUpdatedUserData(updatedData: UpdateUserDTO, currentData: Users) {
        const user = new Users()
        user.name = updatedData.name ? updatedData.name : currentData.name
        user.lastName = updatedData.lastName ? updatedData.lastName : currentData.lastName
        return user
    }

    async validateEmail(token: string) {
        const mail = await this.mailService.findOneByToken(token)
        if (!mail) {
            throw new HttpException("E-mail not found", 404)
            return
        }
        await this.mailService.updateEmailStatus(token, EmailsStatusEnum.validated)
        await Users.update(mail.userId, { emailIsVerified: true })
    }

    async auth(userDTO: LoginUserDTO) {
        const { email, password } = userDTO
        const user = await Users.findOne({ where: { email } })
        if (!user) {
            throw new HttpException("User not found", 404)
            return;
        }
        if (user.emailIsVerified) {
            const passwordIsValid = await this.validatePassword(password, user)
            if (!passwordIsValid) {
                throw new HttpException("Password is not valid", 400)
                return;
            }
            const token = await this.generateToken(user)
            return {
                authorization: `Bearer ${token}`
            }
        }
        throw new HttpException("Please, verify your e-mail", 400)
    }

    async generateToken(user: Users) {
        const encodedToken = await jwt.sign({
            id: user.id,
            email: user.email,
            emailIsVerified: user.emailIsVerified
        }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        })
        return encodedToken
    }

    async resetPassword(token: string, resetPasswordDTO: ResetPasswordDTO){
        const email = await this.mailService.findOneByToken(token)
        if(!email){
            throw new HttpException("E-mail not found", 404)
            return;
        }
        const user = await Users.findOne({where: {id: email.userId}})
        if(!user){
            throw new HttpException("User not found", 404);
            return;
        }
        const passwordIsValid = await this.validatePassword(resetPasswordDTO.oldPassword, user)
        if(!passwordIsValid){
            throw new HttpException("Password is not valid", 400)
            return
        }
        const newPasswordHashed = await this.generatePassword(resetPasswordDTO.newPassword)
        try{
            await Users.update({id: user.id}, {password: newPasswordHashed})
        }catch(e){
            throw new HttpException("Internal server error", 500)
        }
    }

    async validatePassword(textPassword: string, user: Users) {
        const validatePass = await bcrypt.compareSync(textPassword, user.password)
        return validatePass
    }

    async generatePassword(password: string) {
        const salt = await bcrypt.genSaltSync(10)
        const hashedPass = await bcrypt.hashSync(password, salt)
        return hashedPass
    }
}