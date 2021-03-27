import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { ReturnUserDto } from './dtos/return-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async createAdminUser (
        @Body(ValidationPipe) createUserDto: CreateUserDto,
    ): Promise<ReturnUserDto> {
        const user = await this.userService.createAdminUser(createUserDto);
        return {
            user,
            message: 'Administrador criado com sucesso',
        };
    }
}
