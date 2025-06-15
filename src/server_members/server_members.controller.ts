import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ServerMembersService } from './server_members.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ServerMembersDto, ServerMembersResponseDto } from './dto/server-members.dto';

@Controller('server-members')
@ApiTags('Server Members')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ServerMembersController {
  constructor(private readonly serverMembersService: ServerMembersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Server member added successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'User is already a member of this server',
  })
  @ApiOperation({
    summary: 'Add a user to a server',
    description: 'Adds a new member to the specified server',
  })
  async create(@Body() createServerMemberDto: ServerMembersDto) {
    await this.serverMembersService.create(createServerMemberDto);
    return {
      message: 'Server member added successfully',
      statusCode: 201,
    };
  }

  @Delete(':serverId/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'serverId',
    description: 'The ID of the server',
    type: 'number',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user to remove',
    type: 'number',
  })
  @ApiResponse({
    status: 204,
    description: 'Server member removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Server member not found',
  })
  @ApiOperation({
    summary: 'Remove a user from a server',
    description: 'Removes a member from the specified server',
  })
  async remove(
    @Param('serverId', ParseIntPipe) serverId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    await this.serverMembersService.remove(serverId, userId);
    return {
      message: 'Server member removed successfully',
      statusCode: 204,
    };
  }

  @Get(':serverId')
  @ApiOperation({
    summary: 'Get all server members',
    description: 'Retrieves all server members',
  })
  @ApiResponse({
    status: 200,
    description: 'List of server members',
    type: [ServerMembersResponseDto],
  })
  async findAll(@Param('serverId', ParseIntPipe) serverId: number) {
    return this.serverMembersService.findAll(serverId);
  }
}
