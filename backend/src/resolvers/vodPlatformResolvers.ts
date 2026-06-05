import { AppDataSource } from "../data-source";
import { VodPlatform } from "../entity";

export const vodPlatformResolvers = {
  Query: {
    vodPlatforms: async () => {
      const repo = AppDataSource.getRepository(VodPlatform);
      return repo.find({ relations: ["movies"] });
    },
    vodPlatform: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(VodPlatform);
      return repo.findOne({
        where: { vodPlatformId: args.id },
        relations: ["movies"],
      });
    },
  },
  Mutation: {
    createVodPlatform: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(VodPlatform);
      const r = repo.create(args.input);
      const savedRaw = await repo.save(r as any);
      return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
    },
    updateVodPlatform: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(VodPlatform);
      await repo.update({ vodPlatformId: args.id }, args.input);
      return repo.findOne({
        where: { vodPlatformId: args.id },
        relations: ["movies"],
      });
    },
    deleteVodPlatform: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(VodPlatform);
      const res = await repo.delete({ vodPlatformId: args.id });
      return res.affected && res.affected > 0;
    },
  },
};

export default vodPlatformResolvers;
