"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieCast = void 0;
const typeorm_1 = require("typeorm");
const Movie_1 = require("./Movie");
const Actor_1 = require("./Actor");
let MovieCast = class MovieCast {
    castId;
    roleName;
    movie;
    actor;
};
exports.MovieCast = MovieCast;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], MovieCast.prototype, "castId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MovieCast.prototype, "roleName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Movie_1.Movie, (movie) => movie.cast),
    __metadata("design:type", Movie_1.Movie)
], MovieCast.prototype, "movie", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Actor_1.Actor, (actor) => actor.movieRoles),
    __metadata("design:type", Actor_1.Actor)
], MovieCast.prototype, "actor", void 0);
exports.MovieCast = MovieCast = __decorate([
    (0, typeorm_1.Entity)({ name: "movie_cast" })
], MovieCast);
