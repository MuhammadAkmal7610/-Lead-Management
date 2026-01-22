import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // 👈 important
  }

 async validate(email: string, password: string) {
  console.log('LOGIN ATTEMPT:', email, password);
  const user = await this.authService.validateUser(email, password);
  console.log('USER FOUND:', user);
  if (!user) throw new UnauthorizedException('Invalid credentials');
  return user;
}

}
