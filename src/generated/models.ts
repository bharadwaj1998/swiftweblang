import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ nullable: true })
  name?: string  = "John Doe";
  @Column({ nullable: true })
  age?: number  = 30;
  @Column({ type: 'float', nullable: true })
  height?: number  = 1.75;
  @Column({ nullable: true })
  isActive?: boolean  = 1.75;
  @Column({ type: 'jsonb',  nullable: true })
  tasks?: Task[];
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ nullable: true })
  description?: string ;
  @Column({ nullable: true })
  isComplete?: boolean ;
}

