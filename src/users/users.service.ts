import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createLocalUser(
    dto: CreateUserDto,
    emailConfirmToken: string,
  ): Promise<User> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.usersRepository.create({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
      emailConfirmToken,
      isEmailConfirmed: false,
    });
  }

  async createGoogleUser(
    email: string,
    googleId: string,
    fullName: string,
  ): Promise<User> {
    const existingByGoogle =
      await this.usersRepository.findByGoogleId(googleId);
    if (existingByGoogle) {
      return existingByGoogle;
    }
    const existingByEmail = await this.usersRepository.findByEmail(email);
    if (existingByEmail) {
      existingByEmail.googleId = googleId;
      existingByEmail.isEmailConfirmed = true;
      return this.usersRepository.save(existingByEmail);
    }
    return this.usersRepository.create({
      email,
      fullName,
      googleId,
      isEmailConfirmed: true,
    });
  }

  async markEmailConfirmed(token: string): Promise<User> {
    const user = await this.usersRepository.findByEmailConfirmToken(token);
    if (!user) {
      throw new BadRequestException('Invalid token');
    }
    user.isEmailConfirmed = true;
    user.emailConfirmToken = null;
    return this.usersRepository.save(user);
  }

  async setResetPasswordToken(
    user: User,
    token: string,
    expiresAt: Date,
  ): Promise<User> {
    user.resetPasswordToken = token;
    user.resetPasswordExpiresAt = expiresAt;
    return this.usersRepository.save(user);
  }

  async resetPassword(token: string, newPassword: string): Promise<User> {
    const user = await this.usersRepository.findByResetPasswordToken(token);
    if (
      !user ||
      !user.resetPasswordExpiresAt ||
      user.resetPasswordExpiresAt < new Date()
    ) {
      throw new BadRequestException('Invalid or expired token');
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    return this.usersRepository.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: number): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (dto.fullName !== undefined) {
      user.fullName = dto.fullName;
    }
    return this.usersRepository.save(user);
  }
}
