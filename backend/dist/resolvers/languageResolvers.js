"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageResolvers = void 0;
const data_source_1 = require("../data-source");
const entity_1 = require("../entity");
exports.languageResolvers = {
    Query: {
        languages: async () => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Language);
            return repo.find({ relations: ["movies"] });
        },
        language: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Language);
            return repo.findOne({
                where: { languageId: args.id },
                relations: ["movies"],
            });
        },
    },
    Mutation: {
        createLanguage: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Language);
            const r = repo.create(args.input);
            const savedRaw = await repo.save(r);
            return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
        },
        updateLanguage: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Language);
            await repo.update({ languageId: args.id }, args.input);
            return repo.findOne({
                where: { languageId: args.id },
                relations: ["movies"],
            });
        },
        deleteLanguage: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Language);
            const res = await repo.delete({ languageId: args.id });
            return res.affected && res.affected > 0;
        },
    },
};
exports.default = exports.languageResolvers;
