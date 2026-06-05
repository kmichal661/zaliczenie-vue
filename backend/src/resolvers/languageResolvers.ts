import { AppDataSource } from "../data-source";
import { Language } from "../entity";

export const languageResolvers = {
  Query: {
    languages: async () => {
      const repo = AppDataSource.getRepository(Language);
      return repo.find({ relations: ["movies"] });
    },
    language: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Language);
      return repo.findOne({
        where: { languageId: args.id },
        relations: ["movies"],
      });
    },
  },
  Mutation: {
    createLanguage: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(Language);
      const r = repo.create(args.input);
      const savedRaw = await repo.save(r as any);
      return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
    },
    updateLanguage: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(Language);
      await repo.update({ languageId: args.id }, args.input);
      return repo.findOne({
        where: { languageId: args.id },
        relations: ["movies"],
      });
    },
    deleteLanguage: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Language);
      const res = await repo.delete({ languageId: args.id });
      return res.affected && res.affected > 0;
    },
  },
};

export default languageResolvers;
