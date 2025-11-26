import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  findByGoogleId(googleId: string): Promise<User | null> {
    return this.repository.findOne({ where: { googleId } });
  }

  findByEmailConfirmToken(token: string): Promise<User | null> {
    return this.repository.findOne({ where: { emailConfirmToken: token } });
  }

  findByResetPasswordToken(token: string): Promise<User | null> {
    return this.repository.findOne({ where: { resetPasswordToken: token } });
  }

  save(user: User): Promise<User> {
    return this.repository.save(user);
  }
}
