import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request & { user?: { sub?: number } }) {
    const userId = req.user?.sub;
    if (typeof userId !== 'number') {
      return null;
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      return null;
    }
    const { id, email, fullName, isEmailConfirmed, createdAt, updatedAt } =
      user;
    const safeUser = {
      id,
      email,
      fullName,
      isEmailConfirmed,
      createdAt,
      updatedAt,
    };
    return safeUser;
  }
}
