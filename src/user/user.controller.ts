import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import CreateUserDTO from "./DTOs/CreateUser.dto";
import LoginUserDTO from "./DTOs/LoginUser.dto";
import ResetPasswordDTO from "./DTOs/ResetPassword.dto";
import UpdateUserDTO from "./DTOs/UpdateUser.dto";
import UserService from "./user.service";

@Controller('user')
export default class UserController{
    constructor(
        private readonly service: UserService
    ){}

    @Post()
    create(@Body() userDTO: CreateUserDTO){
        return this.service.create(userDTO)
    }

    @Patch('/me')
    update(@Body() userDTO: UpdateUserDTO, @Req() req){
        return this.service.update(userDTO, req.user)
    }

    @Delete('')
    delete(@Req() req){
        return this.service.delete(req.user)
    }

    @Post('/auth')
    auth(@Body() userDTO: LoginUserDTO){
        return this.service.auth(userDTO)
    }

    @Get("/me")
    findOne(@Req() req){
        return this.service.findOne(req.user.id)                                                                                                                     
    }

    @Post('validation/:token')
    validateEmail(@Param("token") token: string){
        return this.service.validateEmail(token)
    }

    @Post('/reset-password/:token')
    resetPassword(@Param("token") token: string, @Body() body: ResetPasswordDTO){
        return this.service.resetPassword(token, body)
    }
}