import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { CredentialsDto } from './dtos/credentials.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
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

    async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
        const user = await this.findUserById(id);
        const { name, email, role, status } = updateUserDto;
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        user.role = role ?? user.role;
        user.status = status ?? user.status;
        try {
            await user.save();
            return user;
        } catch (error) {
            throw new InternalServerErrorException(
                'Erro ao salvar os dados no banco de dados',
            )
        }
    }

    async deleteUser(userId: string) {
        const result = await this.userRepository.delete({ id: userId });
        if(result.affected === 0) {
            throw new NotFoundException(
                'Não foi possível encontrar um usuário com o ID informado',
            );
        }
    }
}
