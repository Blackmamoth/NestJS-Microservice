import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterUserDTO, LoginUserDTO } from '@app/shared/dto/auth/auth.dto';
import { AuthGuard } from '@app/shared/guards/auth/auth.guard';
import {
  DeleteUsersDTO,
  SearchUsersDTO,
  UpdateUserDTO,
} from '@app/shared/dto/user/user.dto';
import { IRequest } from '@app/shared/common/interface';
import { BlockUserDTO, UnBlockUserDTO } from '@app/shared/dto/block/block.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/auth/register')
  @HttpCode(HttpStatus.CREATED)
  registerUser(@Body() body: RegisterUserDTO) {
    return this.appService.registerUser(body);
  }

  @Post('/auth/login')
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() body: LoginUserDTO) {
    return this.appService.loginUser(body);
  }

  @Get('/user/search')
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  @HttpCode(HttpStatus.OK)
  getUsers(@Body() body: SearchUsersDTO, @Req() req: IRequest) {
    return this.appService.searchUsers(body, req.user);
  }

  @Patch('/user/update')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  updateUser(@Body() body: UpdateUserDTO, @Req() req: IRequest) {
    return this.appService.updateUser(body, req.user);
  }

  @Delete('/user/delete')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteUsers(@Body() body: DeleteUsersDTO) {
    return this.appService.deleteUsers(body);
  }

  @Get('/block/getUsers')
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  @HttpCode(HttpStatus.OK)
  getBlockedUser(@Req() req: IRequest) {
    return this.appService.getBlockedUsers(req.user);
  }

  @Patch('/block/blockUser')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  blockUser(@Body() body: BlockUserDTO, @Req() req: IRequest) {
    return this.appService.blockUser(body, req.user);
  }

  @Patch('/block/unblockUser')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  unBlockUser(@Body() body: UnBlockUserDTO, @Req() req: IRequest) {
    return this.appService.unBlockUser(body, req.user);
  }
}
