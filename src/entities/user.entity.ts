import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  hash: string;

  @Column('varchar')
  umail: string;

  @Column({ type: 'varchar', nullable: true })
  icon_url: string | null;

  @CreateDateColumn()
  readonly created_at?: Date;

  @UpdateDateColumn()
  readonly updated_at?: Date;
}
