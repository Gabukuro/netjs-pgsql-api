import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '../auth/role.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUserQueryDto } from './dtos/find-user-query.dto';
import { ReturnUserDto } from './dtos/return-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUser } from './get-user.decorator';
import { UserRole } from './user-roles.enum';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    @Role(UserRole.ADMIN)
    async createAdminUser (
        @Body(ValidationPipe) createUserDto: CreateUserDto,
    ): Promise<ReturnUserDto> {
        const user = await this.userService.createAdminUser(createUserDto);
        return {
            user,
            message: 'Administrador criado com sucesso',
        };
    }

    @Get(':id')
    @Role(UserRole.ADMIN)
    async findUserById(@Param('id') id): Promise<ReturnUserDto> {
        const user = await this.userService.findUserById(id);
        return {
            user, 
            message: 'Usuário encontrado',
        };
    }

    @Patch(':id')
    async updateUser(
        @Body(ValidationPipe) updateUserDto: UpdateUserDto,
        @GetUser() user: User,
        @Param('id') id: string
    ) {
        if(user.role != UserRole.ADMIN && user.id.toString() != id) {
            throw new ForbiddenException(
                'Você não tem autorização para acessar esse recurso',
            );
        }
        return this.userService.updateUser(updateUserDto, id);
    }

    @Delete(':id')
    @Role(UserRole.ADMIN)
    async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser(id);
        return {
            message: 'Usuário removido com sucesso',
        };
    }

    @Get()
    @Role(UserRole.ADMIN)
    async findUsers(@Query() query: FindUserQueryDto) {
        const found = await this.userService.findUsers(query);
        return {
            found,
            message: 'Usuários encontrados',
        };
    }
}
