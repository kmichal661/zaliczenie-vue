import { AppDataSource } from "../data-source";
import {
  Movie,
  Genre,
  Director,
  VodPlatform,
  Country,
  Language,
} from "../entity";
import { In } from "typeorm";

export const movieResolvers = {
  Query: {
    movies: async () => {
      const repo = AppDataSource.getRepository(Movie);
      return repo.find({
        relations: [
          "genres",
          "director",
          "reviews",
          "reviews.user",
          "vodPlatforms",
          "country",
          "language",
          "cast",
          "cast.actor",
        ],
      });
    },
    movie: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Movie);
      console.log("movie resolver called with id=", args?.id);
      try {
        const m = await repo.findOne({
          where: { movieId: args.id },
          relations: [
            "genres",
            "director",
            "reviews",
            "reviews.user",
            "vodPlatforms",
            "country",
            "language",
            "cast",
            "cast.actor",
          ],
        });
        if (!m) console.warn("movie not found for id=", args?.id);
        return m;
      } catch (e) {
        console.error("movie resolver error for id=", args?.id, e);
        throw e;
      }
    },
  },
  Mutation: {
    createMovie: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(Movie);
      const input = { ...args.input };
      const {
        directorId,
        countryId,
        languageId,
        genreIds,
        vodPlatformIds,
        ...rest
      } = input;
      const movie: any = repo.create({
        ...rest,
        slug:
          rest.slug ||
          rest.title
            ?.toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, ""),
      });

      if (directorId) {
        const d = await AppDataSource.getRepository(Director).findOne({
          where: { directorId },
        });
        if (d) movie.director = d;
      }
      if (countryId) {
        const c = await AppDataSource.getRepository(Country).findOne({
          where: { countryId },
        });
        if (c) movie.country = c;
      }
      if (languageId) {
        const l = await AppDataSource.getRepository(Language).findOne({
          where: { languageId },
        });
        if (l) movie.language = l;
      }
      if (genreIds && Array.isArray(genreIds) && genreIds.length) {
        const genres = await AppDataSource.getRepository(Genre).find({
          where: { genreId: In(genreIds) },
        });
        movie.genres = genres;
      }
      if (
        vodPlatformIds &&
        Array.isArray(vodPlatformIds) &&
        vodPlatformIds.length
      ) {
        const v = await AppDataSource.getRepository(VodPlatform).find({
          where: { vodPlatformId: In(vodPlatformIds) },
        });
        movie.vodPlatforms = v;
      }

      const savedRaw = await repo.save(movie as any);
      return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
    },
    updateMovie: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(Movie);
      const input = { ...args.input };
      const {
        directorId,
        countryId,
        languageId,
        genreIds,
        vodPlatformIds,
        ...rest
      } = input;

      if (directorId) {
        const d = await AppDataSource.getRepository(Director).findOne({
          where: { directorId },
        });
        if (d) (rest as any).director = d;
      }
      if (countryId) {
        const c = await AppDataSource.getRepository(Country).findOne({
          where: { countryId },
        });
        if (c) (rest as any).country = c;
      }
      if (languageId) {
        const l = await AppDataSource.getRepository(Language).findOne({
          where: { languageId },
        });
        if (l) (rest as any).language = l;
      }
      if (genreIds) {
        const genres = await AppDataSource.getRepository(Genre).find({
          where: { genreId: In(genreIds) },
        });
        (rest as any).genres = genres;
      }
      if (vodPlatformIds) {
        const v = await AppDataSource.getRepository(VodPlatform).find({
          where: { vodPlatformId: In(vodPlatformIds) },
        });
        (rest as any).vodPlatforms = v;
      }

      await repo.update({ movieId: args.id }, rest as any);
      return repo.findOne({
        where: { movieId: args.id },
        relations: [
          "genres",
          "director",
          "reviews",
          "reviews.user",
          "vodPlatforms",
          "country",
          "language",
          "cast",
          "cast.actor",
        ],
      });
    },
    deleteMovie: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Movie);
      const res = await repo.delete({ movieId: args.id });
      return res.affected && res.affected > 0;
    },
  },
};

export default movieResolvers;
