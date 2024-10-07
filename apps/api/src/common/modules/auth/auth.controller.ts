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
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignupAdminSchema,
} from './auth.schema';
import { OrganizationsService } from 'src/core/modules/organizations/organizations.service';
import { UsersService } from 'src/core/modules/users/users.service';
import { AccountType } from 'src/core/modules/accounts/entities/account.entity';
import { RolePermissions } from './permissions.model';
import { SafeBaseAccount } from 'src/common/db/schemas';
import { Model, ORM } from 'src/common/repository';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly organizationsService: OrganizationsService,
    private readonly usersService: UsersService,
  ) {}

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
  async signup(@Body(new Validator(SignupAdminSchema)) body: SignupAdminDto) {
    // Create the organization
    const organization = await this.organizationsService.create({
      name: body.organization_name,
    });

    // Create the user
    const user = await this.usersService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      middle_name: body.middle_name,
    });

    const account = await this.authService.createAccountUserOrganization({
      ...body,
      organization_uid: organization.uid,
      user_uid: user.uid,
      type: AccountType.ADMIN,
      permissions: RolePermissions.super_admin, // TODO: Change this to the actual role
    });

    return account;
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
  @Get('profile')
  async getProfile(@Request() req: IRequest) {
    if (!req.user) throw new NotFoundException();
    const account = Model(
      SafeBaseAccount,
      req.user as ORM<typeof SafeBaseAccount>,
    );

    const user = await this.usersService.findOne(account.user_uid);
    return {
      ...account,
      ...user,
    };
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
