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
exports.Watchlist = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Movie_1 = require("./Movie");
let Watchlist = class Watchlist {
    watchlistId;
    user;
    movie;
    watched;
};
exports.Watchlist = Watchlist;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Watchlist.prototype, "watchlistId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Watchlist.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Movie_1.Movie),
    __metadata("design:type", Movie_1.Movie)
], Watchlist.prototype, "movie", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Watchlist.prototype, "watched", void 0);
exports.Watchlist = Watchlist = __decorate([
    (0, typeorm_1.Entity)({ name: "watchlists" })
], Watchlist);
