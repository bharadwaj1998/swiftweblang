import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  tasks: Task;
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  user: User;
}

