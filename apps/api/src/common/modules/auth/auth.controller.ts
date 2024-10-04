import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request as IRequest } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JWTAuthGuard } from './jwt-auth.guard';
import { Permissions } from '../../decorators/permissions';
import { Actions, Resources } from './permissions.interface';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import {
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
  SignupAdminDto,
} from './auth.dto';
import { Validator } from 'src/common/pipes/validation.pipe';
import { ForgotPasswordSchema, ResetPasswordSchema } from './auth.schema';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: LoginUserDto })
  @Post('login')
  async login(@Request() req: IRequest) {
    if (!req.user) throw new NotFoundException();
    return this.authService.login(req.user as any);
  }

  @ApiBody({ type: SignupAdminDto })
  @Post('signup')
  async signup(@Body(new Validator(SignupAdminDto)) body: SignupAdminDto) {
    const user = await this.authService.createAccountUserOrganization(
      body.account,
      body.user,
      body.organization,
    );
    if (!user) throw new NotFoundException();
    return user;
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
  @Get('profile')
  async getProfile(@Request() req: IRequest) {
    return req.user;
  }

  @ApiBody({ type: ForgotPasswordDto })
  @Post('forgot-password')
  async forgotPassword(
    @Body(new Validator(ForgotPasswordSchema)) body: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @ApiCreatedResponse({
    description: 'success',
    type: Boolean,
  })
  async resetPassword(
    @Body(new Validator(ResetPasswordSchema)) body: ResetPasswordDto,
  ) {
    const validationToken = await this.authService.validateAccountJWTToken(
      body.token,
    );

    if (!validationToken) throw new UnauthorizedException();

    await this.authService.resetPassword({
      ...body,
      email: validationToken.email,
    });

    return true;
  }
}
