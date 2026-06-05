"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const userResolvers_1 = require("./userResolvers");
const movieResolvers_1 = __importDefault(require("./movieResolvers"));
const actorResolvers_1 = __importDefault(require("./actorResolvers"));
const directorResolvers_1 = __importDefault(require("./directorResolvers"));
const genreResolvers_1 = __importDefault(require("./genreResolvers"));
const movieCastResolvers_1 = __importDefault(require("./movieCastResolvers"));
const reviewResolvers_1 = __importDefault(require("./reviewResolvers"));
const favoriteMovieResolvers_1 = __importDefault(require("./favoriteMovieResolvers"));
const watchlistResolvers_1 = __importDefault(require("./watchlistResolvers"));
const countryResolvers_1 = __importDefault(require("./countryResolvers"));
const languageResolvers_1 = __importDefault(require("./languageResolvers"));
const vodPlatformResolvers_1 = __importDefault(require("./vodPlatformResolvers"));
exports.resolvers = [
    userResolvers_1.userResolvers,
    movieResolvers_1.default,
    actorResolvers_1.default,
    directorResolvers_1.default,
    genreResolvers_1.default,
    movieCastResolvers_1.default,
    reviewResolvers_1.default,
    favoriteMovieResolvers_1.default,
    watchlistResolvers_1.default,
    countryResolvers_1.default,
    languageResolvers_1.default,
    vodPlatformResolvers_1.default,
];
exports.default = exports.resolvers;
