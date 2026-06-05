"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const entity_1 = require("./entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "db.sqlite",
    entities: [
        entity_1.User,
        entity_1.Movie,
        entity_1.Review,
        entity_1.Watchlist,
        entity_1.FavoriteMovie,
        entity_1.Actor,
        entity_1.MovieCast,
        entity_1.Country,
        entity_1.Language,
        entity_1.VodPlatform,
        entity_1.Genre,
        entity_1.Director,
    ],
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
});
