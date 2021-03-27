import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { CredentialsDto } from 'src/user/dtos/credentials.dto';
import { UserRole } from 'src/user/user-roles.enum';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(createUserDto:  CreateUserDto): Promise<User> {
        if(createUserDto.password != createUserDto.passwordConfirmation) {
            throw new UnprocessableEntityException('A senhas não conferem');
        }
        return await this.userRepository.createUser(createUserDto, UserRole.USER);
    }

    async sigIn(credentialsDto: CredentialsDto) {
        const user = await this.userRepository.checkCredentials(credentialsDto);

        if(user === null) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const jwtPayload = {
            id: user.id,
        };
        const token = await this.jwtService.sign(jwtPayload);

        return{ token };
    }
}
