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
import { CreateMessageDto, MessageResponseDto } from './dto/create-message.dto';
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
    type: [MessageResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  findAll(@Param('channelId', ParseIntPipe) channelId: number) {
    return this.messagesService.findByChannel(channelId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a message',
    description:
      'Updates the content of an existing message. Only the message owner can update it.',
  })
  @ApiResponse({
    status: 201,
    description: 'Message updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
    @Request() req,
  ) {
    const user: Partial<User> = {
      user_id: req.user.sub,
      username: req.user.username,
    };
    await this.messagesService.update(id, updateMessageDto, user as User);
    return {
      message: 'Message updated successfully',
      statusCode: 200,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a message',
    description:
      'Deletes a message from the channel. Only the message owner can delete it.',
  })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  async remove(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const user: Partial<User> = {
      user_id: req.user.sub,
      username: req.user.username,
    };
    await this.messagesService.remove(id, user as User);
    return {
      message: 'Message deleted successfully',
      statusCode: 200,
    };
  }
}
