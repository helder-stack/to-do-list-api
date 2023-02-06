
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'
import UserService from 'src/user/user.service';

interface JWTResponse{
    id: number;
    email: string;
    emailIsVerified: boolean,
    iat: number;
    exp: number
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    
    constructor(
        private readonly userService: UserService
    ){}

    async use(req: Request, res: Response, next: NextFunction) {
        const authorizaton = req.headers.authorization
        if (authorizaton) {
            const decodedToken = await this.decodeToken(authorizaton)
            if(decodedToken){
                const user = await this.userService.findOne(decodedToken.id)
                if(user){
                    req['user'] = user
                    next()
                    return;
                }
                throw new HttpException("User not found", 404)
                return;
            }
            throw new HttpException("Token not accepted", 400)
            return;
        }
        throw new HttpException("Need authorization header", 400)
    }

    async decodeToken(token: string) {
        token = token.replace("Bearer ", '')
        try {
            const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
            return decodedToken as JWTResponse
        } catch (e) {
            return false
        }
    }
}
