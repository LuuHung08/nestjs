import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ResponseData } from 'src/common/meta-response';
import { CommentsEntity } from './entities/comment.entity';
import { CreateCommentsDto } from './dto/create-comment.dto';
import { QueryCommentsDto } from './dto/query-comment.dto';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private configService: ConfigService,
  ) {}

  async findAll(
    query: QueryCommentsDto,
  ): Promise<ResponseData<CommentsEntity>> {
    const { page, limit, vid, key_content } = query;

    if (
      key_content !==
      this.configService.get<AppConfig['KEY_CONTENT']>('KEY_CONTENT')
    )
      throw new UnauthorizedException('Unauthorized');

    const whereCondition = {
      ...(vid && { vid: Number(vid) }),
      parent: IsNull(),
    };

    const [comments, total] = await this.commentsRepository.findAndCount({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['comments'],
    });

    for (const comment of comments) {
      comment['count_comments'] = comment.comments.length;
    }

    const commentsWithFirstChild = comments.map((comment) => {
      if (comment.comments && comment.comments.length > 0) {
        comment.comments = [comment.comments[0]];
      }
      return comment;
    });

    const meta = {
      total,
      page,
      limit,
    };

    return new ResponseData(commentsWithFirstChild, meta);
  }

  async create(body: CreateCommentsDto): Promise<CommentsEntity> {
    const { vid, key_content, content, username, avatar, parent_id } = body;
    if (!vid || !key_content)
      throw new BadRequestException('vid and key_content are required');

    if (
      key_content !==
      this.configService.get<AppConfig['KEY_CONTENT']>('KEY_CONTENT')
    )
      throw new UnauthorizedException('Unauthorized');

    const newComment = this.commentsRepository.create({
      vid,
      content,
      username,
    });
    if (parent_id) {
      const parentComment = await this.commentsRepository.findOne({
        where: { id: parent_id },
      });

      if (!parentComment) {
        throw new BadRequestException('Parent comment not found');
      }
      parentComment.parent_id = parent_id;
      parentComment.avatar = avatar;
      newComment.parent = parentComment;
    }
    await this.commentsRepository.save(newComment);
    return null;
  }

  async getCommentDetail(id: number): Promise<CommentsEntity[]> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment.comments;
  }
}
