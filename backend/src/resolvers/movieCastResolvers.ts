import { AppDataSource } from "../data-source";
import { MovieCast, Movie, Actor } from "../entity";

export const movieCastResolvers = {
  Query: {
    movieCasts: async () => {
      const repo = AppDataSource.getRepository(MovieCast);
      return repo.find({ relations: ["movie", "actor"] });
    },
    movieCast: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(MovieCast);
      return repo.findOne({
        where: { castId: args.id },
        relations: ["movie", "actor"],
      });
    },
  },
  Mutation: {
    createMovieCast: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(MovieCast);
      const input = { ...args.input };
      const { movieId, actorId, ...rest } = input;
      const mc: any = repo.create(rest as any);
      if (movieId) {
        const m = await AppDataSource.getRepository(Movie).findOne({
          where: { movieId },
        });
        if (m) mc.movie = m;
      }
      if (actorId) {
        const a = await AppDataSource.getRepository(Actor).findOne({
          where: { actorId },
        });
        if (a) mc.actor = a;
      }
      const savedRaw = await repo.save(mc as any);
      return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
    },
    updateMovieCast: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(MovieCast);
      const input = { ...args.input };
      const { movieId, actorId, ...rest } = input;
      if (movieId) {
        const m = await AppDataSource.getRepository(Movie).findOne({
          where: { movieId },
        });
        if (m) (rest as any).movie = m;
      }
      if (actorId) {
        const a = await AppDataSource.getRepository(Actor).findOne({
          where: { actorId },
        });
        if (a) (rest as any).actor = a;
      }
      await repo.update({ castId: args.id }, rest as any);
      return repo.findOne({
        where: { castId: args.id },
        relations: ["movie", "actor"],
      });
    },
    deleteMovieCast: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(MovieCast);
      const res = await repo.delete({ castId: args.id });
      return res.affected && res.affected > 0;
    },
  },
};

export default movieCastResolvers;
