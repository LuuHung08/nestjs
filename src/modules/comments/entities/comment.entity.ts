import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('comments')
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  vid: number;

  @Column('text')
  content: string;

  @Column('text')
  username: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true }) // Cột parent_id sẽ lưu ID của comment cha
  parent_id: number;

  @ManyToOne(() => CommentsEntity, (comment) => comment.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' }) // Gắn cột parent_id với khóa chính của comment cha
  parent: CommentsEntity;

  @OneToMany(() => CommentsEntity, (comment) => comment.parent, {
    cascade: true,
  })
  comments: CommentsEntity[];
}
