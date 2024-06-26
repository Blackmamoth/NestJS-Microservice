import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginUserDTO, RegisterUserDTO } from '@app/shared/dto/auth/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register_user' })
  registerUser(body: RegisterUserDTO) {
    return this.authService.registerUser(body);
  }

  @MessagePattern({ cmd: 'login_user' })
  loginUser(body: LoginUserDTO) {
    return this.authService.loginUser(body);
  }
}
