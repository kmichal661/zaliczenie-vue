import { AppDataSource } from "../data-source";
import { Country } from "../entity";

export const countryResolvers = {
  Query: {
    countries: async () => {
      const repo = AppDataSource.getRepository(Country);
      return repo.find({ relations: ["movies"] });
    },
    country: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Country);
      return repo.findOne({
        where: { countryId: args.id },
        relations: ["movies"],
      });
    },
  },
  Mutation: {
    createCountry: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(Country);
      const r = repo.create(args.input);
      const savedRaw = await repo.save(r as any);
      return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
    },
    updateCountry: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(Country);
      await repo.update({ countryId: args.id }, args.input);
      return repo.findOne({
        where: { countryId: args.id },
        relations: ["movies"],
      });
    },
    deleteCountry: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Country);
      const res = await repo.delete({ countryId: args.id });
      return res.affected && res.affected > 0;
    },
  },
};

export default countryResolvers;
