import { Module, forwardRef,HttpModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersModule } from '../users/users.module'
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    forwardRef(() => UsersModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '4h' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports:[PassportModule,AuthService]
})
export class AuthModule {}
