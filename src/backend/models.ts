import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  name: string;
  @Column()
  age: number;
  @Column()
  height: number;
  @Column()
  isActive: boolean;
  @Column()
  tasks: Task;
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  description: string;
  @Column()
  isComplete: boolean;
}

