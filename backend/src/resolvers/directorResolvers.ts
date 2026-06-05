import { AppDataSource } from "../data-source";
import { Director } from "../entity";

export const directorResolvers = {
  Query: {
    directors: async () => {
      const repo = AppDataSource.getRepository(Director);
      return repo.find({ relations: ["movies"] });
    },
    director: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Director);
      return repo.findOne({
        where: { directorId: args.id },
        relations: ["movies"],
      });
    },
  },
  Mutation: {
    createDirector: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(Director);
      const r = repo.create(args.input);
      const savedRaw = await repo.save(r as any);
      return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
    },
    updateDirector: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(Director);
      await repo.update({ directorId: args.id }, args.input);
      return repo.findOne({
        where: { directorId: args.id },
        relations: ["movies"],
      });
    },
    deleteDirector: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Director);
      const res = await repo.delete({ directorId: args.id });
      return res.affected && res.affected > 0;
    },
  },
};

export default directorResolvers;
