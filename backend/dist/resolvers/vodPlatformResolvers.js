"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vodPlatformResolvers = void 0;
const data_source_1 = require("../data-source");
const entity_1 = require("../entity");
exports.vodPlatformResolvers = {
    Query: {
        vodPlatforms: async () => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.VodPlatform);
            return repo.find({ relations: ["movies"] });
        },
        vodPlatform: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.VodPlatform);
            return repo.findOne({
                where: { vodPlatformId: args.id },
                relations: ["movies"],
            });
        },
    },
    Mutation: {
        createVodPlatform: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.VodPlatform);
            const r = repo.create(args.input);
            const savedRaw = await repo.save(r);
            return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
        },
        updateVodPlatform: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.VodPlatform);
            await repo.update({ vodPlatformId: args.id }, args.input);
            return repo.findOne({
                where: { vodPlatformId: args.id },
                relations: ["movies"],
            });
        },
        deleteVodPlatform: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.VodPlatform);
            const res = await repo.delete({ vodPlatformId: args.id });
            return res.affected && res.affected > 0;
        },
    },
};
exports.default = exports.vodPlatformResolvers;
