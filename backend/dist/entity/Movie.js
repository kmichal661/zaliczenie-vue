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
exports.Movie = void 0;
const typeorm_1 = require("typeorm");
const Genre_1 = require("./Genre");
const Director_1 = require("./Director");
const Review_1 = require("./Review");
const VodPlatform_1 = require("./VodPlatform");
const Country_1 = require("./Country");
const Language_1 = require("./Language");
const MovieCast_1 = require("./MovieCast");
let Movie = class Movie {
    movieId;
    title;
    slug;
    shortDescription;
    description;
    posterUrl;
    trailerUrl;
    releaseYear;
    durationMinutes;
    averageRating;
    ratingCount;
    isPublished;
    releaseDate;
    createdAt;
    genres;
    director;
    reviews;
    vodPlatforms;
    country;
    language;
    cast;
};
exports.Movie = Movie;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Movie.prototype, "movieId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Movie.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Movie.prototype, "shortDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Movie.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Movie.prototype, "posterUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Movie.prototype, "trailerUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Movie.prototype, "releaseYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Movie.prototype, "durationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 3, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], Movie.prototype, "averageRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Movie.prototype, "ratingCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Movie.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], Movie.prototype, "releaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Movie.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Genre_1.Genre, (genre) => genre.movies),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Movie.prototype, "genres", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Director_1.Director, (director) => director.movies),
    __metadata("design:type", Director_1.Director)
], Movie.prototype, "director", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Review_1.Review, (review) => review.movie),
    __metadata("design:type", Array)
], Movie.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => VodPlatform_1.VodPlatform, (vod) => vod.movies),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Movie.prototype, "vodPlatforms", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Country_1.Country, (country) => country.movies),
    __metadata("design:type", Country_1.Country)
], Movie.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Language_1.Language, (language) => language.movies),
    __metadata("design:type", Language_1.Language)
], Movie.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MovieCast_1.MovieCast, (cast) => cast.movie),
    __metadata("design:type", Array)
], Movie.prototype, "cast", void 0);
exports.Movie = Movie = __decorate([
    (0, typeorm_1.Entity)({ name: "movies" })
], Movie);
