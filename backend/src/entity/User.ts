import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "text", nullable: true })
  firstName!: string | null;

  @Column({ type: "text", nullable: true })
  lastName!: string | null;

  @Column({ type: "text", nullable: true })
  bio!: string | null;

  @Column({ type: "text", nullable: true })
  avatarUrl!: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
