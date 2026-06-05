import { DataSource } from "typeorm";
import {
  User,
  Movie,
  Review,
  Watchlist,
  FavoriteMovie,
  Actor,
  MovieCast,
  Country,
  Language,
  VodPlatform,
  Genre,
  Director,
} from "./entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [
    User,
    Movie,
    Review,
    Watchlist,
    FavoriteMovie,
    Actor,
    MovieCast,
    Country,
    Language,
    VodPlatform,
    Genre,
    Director,
  ],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [],
});
