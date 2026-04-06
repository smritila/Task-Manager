import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

export interface AuthResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);
    const user = await this.usersService.createUser({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      passwordHash,
    });

    return this.buildAuthResponse(this.usersService.toAuthenticatedUser(user));
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.buildAuthResponse(this.usersService.toAuthenticatedUser(user));
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<AuthenticatedUser> {
    if (
      updateProfileDto.firstName === undefined &&
      updateProfileDto.lastName === undefined &&
      updateProfileDto.email === undefined
    ) {
      throw new BadRequestException(
        'Provide at least one profile field to update.',
      );
    }

    const updatedUser = await this.usersService.updateUserProfile(userId, {
      firstName: updateProfileDto.firstName,
      lastName: updateProfileDto.lastName,
      email: updateProfileDto.email,
    });

    return this.usersService.toAuthenticatedUser(updatedUser);
  }

  private async buildAuthResponse(
    user: AuthenticatedUser,
  ): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
