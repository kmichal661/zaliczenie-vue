import { AppDataSource } from "../data-source";
import { Genre } from "../entity";

export const genreResolvers = {
  Query: {
    genres: async () => {
      const repo = AppDataSource.getRepository(Genre);
      return repo.find({ relations: ["movies"] });
    },
    genre: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Genre);
      return repo.findOne({
        where: { genreId: args.id },
        relations: ["movies"],
      });
    },
  },
  Mutation: {
    createGenre: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(Genre);
      const r = repo.create(args.input);
      const savedRaw = await repo.save(r as any);
      return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
    },
    updateGenre: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(Genre);
      await repo.update({ genreId: args.id }, args.input);
      return repo.findOne({
        where: { genreId: args.id },
        relations: ["movies"],
      });
    },
    deleteGenre: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Genre);
      const res = await repo.delete({ genreId: args.id });
      return res.affected && res.affected > 0;
    },
  },
};

export default genreResolvers;
