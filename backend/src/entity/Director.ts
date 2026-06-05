import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Movie } from "./Movie";

@Entity({ name: "directors" })
export class Director {
  @PrimaryGeneratedColumn("uuid")
  directorId!: string;

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

  @OneToMany(() => Movie, (movie) => movie.director)
  movies!: Movie[];
}
