import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  googleId: string;

  @IsOptional()
  @IsString()
  fullName?: string;
}
