import { AppDataSource } from "../data-source";
import { Watchlist, User, Movie } from "../entity";

export const watchlistResolvers = {
  Query: {
    watchlists: async () => {
      const repo = AppDataSource.getRepository(Watchlist);
      return repo.find({ relations: ["user", "movie"] });
    },
    watchlist: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Watchlist);
      return repo.findOne({
        where: { watchlistId: args.id },
        relations: ["user", "movie"],
      });
    },
  },
  Mutation: {
    createWatchlist: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(Watchlist);
      const input = { ...args.input };
      const { userId, movieId, ...rest } = input;
      const w: any = repo.create(rest as any);
      if (userId) {
        const u = await AppDataSource.getRepository(User).findOne({
          where: { userId },
        });
        if (u) w.user = u;
      }
      if (movieId) {
        const m = await AppDataSource.getRepository(Movie).findOne({
          where: { movieId },
        });
        if (m) w.movie = m;
      }
      const savedRaw = await repo.save(w as any);
      return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
    },
    updateWatchlist: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(Watchlist);
      const input = { ...args.input };
      const { userId, movieId, ...rest } = input;
      if (userId) {
        const u = await AppDataSource.getRepository(User).findOne({
          where: { userId },
        });
        if (u) (rest as any).user = u;
      }
      if (movieId) {
        const m = await AppDataSource.getRepository(Movie).findOne({
          where: { movieId },
        });
        if (m) (rest as any).movie = m;
      }
      await repo.update({ watchlistId: args.id }, rest as any);
      return repo.findOne({
        where: { watchlistId: args.id },
        relations: ["user", "movie"],
      });
    },
    deleteWatchlist: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Watchlist);
      const res = await repo.delete({ watchlistId: args.id });
      return res.affected && res.affected > 0;
    },
  },
};

export default watchlistResolvers;
