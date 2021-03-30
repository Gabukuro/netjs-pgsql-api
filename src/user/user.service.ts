import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { CredentialsDto } from './dtos/credentials.dto';
import { UserRole } from './user-roles.enum';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
        if(createUserDto.password != createUserDto.passwordConfirmation) {
            throw new UnprocessableEntityException('As senhas não conferem');
        }
        return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
    }

    async sigIn(credentialsDto:  CredentialsDto) {
        const user = await this.userRepository.checkCredentials(credentialsDto);

        if(user === null) {
            throw new UnauthorizedException('Credenciais inválidas');
        }
    }

    async findUserById(userId: string): Promise<User> {
        const user = await this.userRepository.findOne(userId, {
            select: ['email', 'name', 'role', 'id'],
        });

        if(!user) throw new NotFoundException('Usuário não encontrado');

        return user;
    }
}
