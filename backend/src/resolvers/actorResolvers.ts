import { AppDataSource } from "../data-source";
import { Actor, MovieCast } from "../entity";

export const actorResolvers = {
  Query: {
    actors: async () => {
      const repo = AppDataSource.getRepository(Actor);
      return repo.find({ relations: ["movieRoles", "movieRoles.movie"] });
    },
    actor: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Actor);
      return repo.findOne({
        where: { actorId: args.id },
        relations: ["movieRoles", "movieRoles.movie"],
      });
    },
  },
  Mutation: {
    createActor: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(Actor);
      const r = repo.create(args.input);
      const savedRaw = await repo.save(r as any);
      return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
    },
    updateActor: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(Actor);
      await repo.update({ actorId: args.id }, args.input);
      return repo.findOne({
        where: { actorId: args.id },
        relations: ["movieRoles", "movieRoles.movie"],
      });
    },
    deleteActor: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Actor);
      const res = await repo.delete({ actorId: args.id });
      return res.affected && res.affected > 0;
    },
  },
};

export default actorResolvers;
