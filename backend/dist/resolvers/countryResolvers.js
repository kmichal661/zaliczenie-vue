"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryResolvers = void 0;
const data_source_1 = require("../data-source");
const entity_1 = require("../entity");
exports.countryResolvers = {
    Query: {
        countries: async () => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Country);
            return repo.find({ relations: ["movies"] });
        },
        country: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Country);
            return repo.findOne({
                where: { countryId: args.id },
                relations: ["movies"],
            });
        },
    },
    Mutation: {
        createCountry: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Country);
            const r = repo.create(args.input);
            const savedRaw = await repo.save(r);
            return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
        },
        updateCountry: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Country);
            await repo.update({ countryId: args.id }, args.input);
            return repo.findOne({
                where: { countryId: args.id },
                relations: ["movies"],
            });
        },
        deleteCountry: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Country);
            const res = await repo.delete({ countryId: args.id });
            return res.affected && res.affected > 0;
        },
    },
};
exports.default = exports.countryResolvers;
