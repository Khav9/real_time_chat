import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import {
  CreateServerDto,
  CreateServerResponseDto,
  ServerResponseDto,
  ServerListResponseDto,
} from './dto/server.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Servers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new server' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The server has been successfully created.',
    type: CreateServerResponseDto,
  })
  async create(@Body() createServerDto: CreateServerDto, @Request() req) {
    await this.serversService.create(createServerDto, req.user.sub);
    return {
      message: 'Server created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all servers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all servers.',
    type: ServerListResponseDto,
  })
  async findAll() {
    const servers = await this.serversService.findAll();
    return {
      message: 'Servers retrieved successfully',
      statusCode: HttpStatus.OK,
      data: servers,
    };
  }

  @Get('my-servers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all servers owned by the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all servers owned by the current user.',
    type: ServerListResponseDto,
  })
  async findMyServers(@Request() req) {
    const servers = await this.serversService.findByOwnerId(req.user.sub);
    return {
      message: 'User servers retrieved successfully',
      statusCode: HttpStatus.OK,
      data: servers,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a server by id' })
  @ApiParam({ name: 'id', description: 'Server ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the server.',
    type: ServerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Server not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const server = await this.serversService.findOne(id);
    return {
      message: 'Server retrieved successfully',
      statusCode: HttpStatus.OK,
      data: server,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a server' })
  @ApiParam({ name: 'id', description: 'Server ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The server has been successfully updated.',
    type: ServerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Server not found.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServerDto: CreateServerDto,
  ) {
    await this.serversService.update(id, updateServerDto);
    return {
      message: 'Server updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a server' })
  @ApiParam({ name: 'id', description: 'Server ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The server has been successfully deleted.',
    type: CreateServerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Server not found.',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.serversService.remove(id);
    return {
      message: 'Server deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
