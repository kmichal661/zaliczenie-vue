import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { MovieCast } from "./MovieCast";

@Entity({ name: "actors" })
export class Actor {
  @PrimaryGeneratedColumn("uuid")
  actorId!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: "text", nullable: true })
  bio!: string;

  @Column({ nullable: true })
  photoUrl!: string;

  @Column({ nullable: true })
  birthDate!: Date;

  @OneToMany(() => MovieCast, (cast) => cast.actor)
  movieRoles!: MovieCast[];
}
