import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Authenticated } from 'src/common/decorators/authenticated.decorator';
import { ResponseData } from 'src/common/meta-response';
import { CommentsService } from './comment.service';
import { QueryCommentsDto } from './dto/query-comment.dto';
import { CommentsEntity } from './entities/comment.entity';
import { CreateCommentsDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Authenticated()
  @Get()
  async findAll(
    @Query() query: QueryCommentsDto,
  ): Promise<ResponseData<CommentsEntity>> {
    const { page, limit } = query;

    if (!page || !limit) {
      throw new BadRequestException('Page and limit are required');
    }

    return await this.commentsService.findAll(query);
  }

  @Authenticated()
  @Get(':id')
  async getCommentDetail(@Param('id') id: number): Promise<CommentsEntity[]> {
    return this.commentsService.getCommentDetail(id);
  }

  @Authenticated()
  @Post()
  async create(@Body() body: CreateCommentsDto): Promise<CommentsEntity> {
    return this.commentsService.create(body);
  }
}
