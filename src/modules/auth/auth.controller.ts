import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from '../../dtos/auth/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body(ValidationPipe) body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  signin(@Body(ValidationPipe) body: SigninDto) {
    return this.authService.signin(body);
  }
}
