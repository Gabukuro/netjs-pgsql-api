import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CredentialsDto } from 'src/user/dtos/credentials.dto';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signUp(
        @Body(ValidationPipe) createUserDto: CreateUserDto,
    ): Promise<{message: string}> {
        await this.authService.signUp(createUserDto);
        return {
            message: 'Cadastro realizado com sucesso',
        };
    }

    @Post('/sigin')
    async sigIn(
        @Body(ValidationPipe) credentialsDto: CredentialsDto,
    ): Promise<{ token: string }> {
        return await this.authService.sigIn(credentialsDto);
    }
}
