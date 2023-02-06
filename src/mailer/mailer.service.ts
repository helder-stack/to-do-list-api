import { Injectable } from '@nestjs/common';
import SendMailDTO from './DTOs/SendMail.dto';
import Users from 'src/user/entities/Users.entity';
import Mails from './entities/Mails.entity';
import EmailsTypesEnum from './enums/EmailsType.enum';
import * as crypto from "crypto"
import EmailsStatusEnum from './enums/EmailsStatus.enum';
import * as nodemailer from 'nodemailer'

@Injectable()
export default class MailerService {

    async sendValidationEmail(user: Users) {
        const databaseMailDataMounted = await this.mountDatabaseMail(user, EmailsTypesEnum.emailValidation)
        const mailDatabase = await Mails.save(databaseMailDataMounted)
        const emailToSendMounted = await this.mountEmailValidation(user, mailDatabase)
        await this.sendMail(emailToSendMounted, mailDatabase.token)
    }

    async sendResetPasswordEmail(user: Users){
        const databaseMailDataMounted = await this.mountDatabaseMail(user, EmailsTypesEnum.resetPassword)
        const mailDatabase = await Mails.save(databaseMailDataMounted)
        const emailToSendMounted = await this.mountEmailValidation(user, mailDatabase)
        await this.sendMail(emailToSendMounted, mailDatabase.token)
    }

    async mountDatabaseMail(user: Users, type: EmailsTypesEnum) {
        const mail = new Mails()
        mail.userId = user.id
        mail.type = type
        mail.token = await this.generateToken()
        mail.status = EmailsStatusEnum.sent
        return mail
    }

    async mountEmailValidation(user: Users, mailDatabase: Mails) {
        const emailDTO = new SendMailDTO()
        emailDTO.from = `${process.env.MAILER_EMAIL}`
        emailDTO.to = user.email
        emailDTO.subject = "E-mail validation"
        emailDTO.text = `Please, validate your e-mail with: ${process.env.BACKEND_URL}/user/validation/${mailDatabase.token}`
        return emailDTO
    }

    async mountResetPassword(user: Users, mailDatabase: Mails) {
        const emailDTO = new SendMailDTO()
        emailDTO.from = `${process.env.MAILER_EMAIL}`
        emailDTO.to = user.email
        emailDTO.subject = "Reset password"
        emailDTO.text = `Please, use this link to reset your password: ${process.env.BACKEND_URL}/user/reset-password/${mailDatabase.token}`
        return emailDTO
    }

    async generateToken() {
        let token = ''
        for (let index = 0; index <= 3; index++) {
            token += await crypto.randomBytes(4).toString('hex')
        }
        return token
    }

    async sendMail(emailDTO: SendMailDTO, token: string) {
        try {
            const transporter = await nodemailer.createTransport({
                host: process.env.MAILER_HOST,
                service: process.env.MAILER_SERVICE,
                port: process.env.MAILER_PORT,
                secure: true,
                auth: {
                    user: process.env.MAILER_EMAIL,
                    pass: process.env.MAILER_PASS
                },
                tls: {
                    ciphers: 'SSLv3'
                }
            });
            transporter.sendMail(emailDTO).then(response => {
                console.log(response)
            }).catch(e => {
                throw new Error(e.message)
            })
        } catch (e) {
            console.error(e.message)
            await Mails.update({ token: token }, { status: EmailsStatusEnum.error })
        }
    }

    findOneByToken(token: string){
        return Mails.findOne({where: {token}})
    }

    updateEmailStatus(token: string, status: EmailsStatusEnum){
        return Mails.update({token}, {status})
    }
}