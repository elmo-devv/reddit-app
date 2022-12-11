import {BaseEntity, BeforeInsert, Column, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import {User} from './User';
import Sub from './Sub';
import {Exclude, Expose} from 'class-transformer';
import {makeId, slugify} from '../utils/helper';

export default class Post extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Column()
  title: string

  @Column()
  @Index()
  slug: string;

  @Column({nullable: true, type: 'text'})
  body: string;

  @Column()
  subName: string;

  @Column()
  userName: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({name: 'userName', referencedColumnName: 'userName'})
  user: User;

  @ManyToOne(()=> Sub, (sub) => sub.posts)
  @JoinColumn({name: 'subName', referencedColumnName: 'name'})
  sub: Sub;

  @Exclude()
  @OneToMany(() => Commnet, (comment) => comment.post)
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @Expose() get url(): string {
    return `r/${this.subName}/${this.identifier}/${thisl.slug}`
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((memo,  curt) => memo + (curt.value || 0), 0);
  }

  protected userVote: number;

  setUserVote(user: User) {
    const index = this.votes?.findIndex(v => v.userName === user.userName);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}