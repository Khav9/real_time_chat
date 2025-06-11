import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Message } from 'src/typeorm/entities/message.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/typeorm/entities/User';

@ApiTags('Message')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('channels/:channelId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Message created successfully',
  })
  @ApiOperation({
    summary: 'Create a new message in a channel',
    description:
      'Creates a new message in the specified channel. The message will be associated with the current user.',
  })
  async create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    const user: Partial<User> = {
      user_id: req.user.sub,
      username: req.user.username,
    };
    const channelId = parseInt(req.params.channelId);
    await this.messagesService.create(
      createMessageDto,
      user as User,
      channelId,
    );
    return {
      message: 'Message created successfully',
      statusCode: 201,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all messages in a channel',
    description:
      'Retrieves all messages from the specified channel, ordered by creation date',
  })
  @ApiResponse({
    status: 200,
    description: 'List of messages in the channel',
    type: [Message],
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  findAll(@Param('channelId', ParseIntPipe) channelId: number) {
    return this.messagesService.findByChannel(channelId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific message',
    description: 'Retrieves a specific message by its ID from the channel',
  })
  @ApiParam({
    name: 'channelId',
    description: 'ID of the channel containing the message',
    type: 'number',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the message to retrieve',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The requested message',
    type: Message,
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  findOne(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a message',
    description:
      'Updates the content of an existing message. Only the message owner can update it.',
  })
  @ApiParam({
    name: 'channelId',
    description: 'ID of the channel containing the message',
    type: 'number',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the message to update',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Message updated successfully',
    type: Message,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  update(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a message',
    description:
      'Deletes a message from the channel. Only the message owner can delete it.',
  })
  @ApiParam({
    name: 'channelId',
    description: 'ID of the channel containing the message',
    type: 'number',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the message to delete',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  remove(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.messagesService.remove(id);
  }
}
