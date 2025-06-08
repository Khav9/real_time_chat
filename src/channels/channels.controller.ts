import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import {
  ChannelResponseDto,
  CreateChannelDto,
  CreateChannelResponseDto,
  DeleteChannelResponseDto,
  getChannelByIdResponseDto,
  UpdateChannelDto,
} from './dto/create-channel.dto';
import { Channel } from '../typeorm/entities/Channel';

@ApiTags('channels')
@Controller('servers/:serverId/channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new channel in a server' })
  @ApiParam({ name: 'serverId', description: 'ID of the server' })
  @ApiResponse({
    status: 201,
    description: 'Channel created successfully',
    type: CreateChannelResponseDto,
  })
  async create(
    @Param('serverId', ParseIntPipe) serverId: number,
    @Body() createChannelDto: CreateChannelDto,
  ): Promise<CreateChannelResponseDto> {
    const channel = await this.channelsService.create(
      serverId,
      createChannelDto,
    );
    return {
      message: 'Channel created successfully',
      statusCode: 201,
      data: channel,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all channels in a server' })
  @ApiParam({ name: 'serverId', description: 'ID of the server' })
  @ApiResponse({
    status: 200,
    description: 'List of channels',
    type: [ChannelResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Server not found' })
  findAll(
    @Param('serverId', ParseIntPipe) serverId: number,
  ): Promise<Channel[]> {
    return this.channelsService.findByServerId(serverId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a channel by ID' })
  @ApiParam({ name: 'serverId', description: 'ID of the server' })
  @ApiParam({ name: 'id', description: 'ID of the channel' })
  @ApiResponse({
    status: 200,
    description: 'Channel found',
    type: getChannelByIdResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Channel> {
    return this.channelsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a channel' })
  @ApiParam({ name: 'serverId', description: 'ID of the server' })
  @ApiParam({ name: 'id', description: 'ID of the channel' })
  @ApiResponse({
    status: 200,
    description: 'Channel updated successfully',
    type: ChannelResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChannelDto: UpdateChannelDto,
  ): Promise<ChannelResponseDto> {
    const channel = await this.channelsService.update(id, updateChannelDto);
    return {
      channel_id: channel.channel_id,
      server_id: channel.server_id,
      name: channel.name,
      type: channel.type,
      created_at: channel.created_at,
      updated_at: channel.updated_at,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a channel' })
  @ApiParam({ name: 'serverId', description: 'ID of the server' })
  @ApiParam({ name: 'id', description: 'ID of the channel' })
  @ApiResponse({
    status: 200,
    description: 'Channel deleted successfully',
    type: DeleteChannelResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{
    message: string;
    statusCode: number;
  }> {
    await this.channelsService.remove(id);
    return {
      message: 'Channel deleted successfully',
      statusCode: 200,
    };
  }
}
