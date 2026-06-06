"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./data-source");
const entity_1 = require("./entity");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sampleMovies = [
    { title: "Echoes of Tomorrow", year: 2021 },
    { title: "Crimson Horizon", year: 2019 },
    { title: "Silent Harbor", year: 2018 },
    { title: "Neon Skies", year: 2022 },
    { title: "The Last Lantern", year: 2020 },
    { title: "Paper Moons", year: 2017 },
    { title: "Glass Oceans", year: 2016 },
    { title: "Midnight Bloom", year: 2023 },
    { title: "Broken Compass", year: 2015 },
    { title: "Golden Ashes", year: 2014 },
];
const sampleDirectors = [
    "Lana Rivers",
    "Marcello Ortega",
    "Priya Kumar",
    "Ethan Shaw",
    "Yuko Tanaka",
    "Omar Haddad",
];
const sampleGenres = [
    "Drama",
    "Sci-Fi",
    "Thriller",
    "Romance",
    "Comedy",
    "Adventure",
    "Mystery",
    "Fantasy",
];
const sampleVod = [
    "NetStream",
    "CineBox",
    "FlixPlus",
    "Streamio",
    "PrimeTime",
    "MovieHub",
    "BroadPlay",
];
const sampleActors = [
    "Liam Carter",
    "Olivia Brooks",
    "Noah Blake",
    "Emma Stone",
    "Lucas Reed",
    "Mia Torres",
    "Ethan Cole",
    "Ava Morgan",
    "Mason Rivera",
    "Sophia Bennett",
    "Logan Price",
    "Isabella Cruz",
    "James Hart",
    "Amelia Fox",
    "Benjamin Lee",
    "Harper Quinn",
    "Alexander Scott",
    "Evelyn Ward",
    "Daniel Kim",
    "Abigail Hughes",
    "Henry Young",
    "Charlotte Diaz",
];
const sampleUsers = [
    { email: "user1@example.com", firstName: "User", lastName: "One" },
    { email: "user2@example.com", firstName: "User", lastName: "Two" },
    { email: "user3@example.com", firstName: "User", lastName: "Three" },
    { email: "user4@example.com", firstName: "User", lastName: "Four" },
    { email: "user5@example.com", firstName: "User", lastName: "Five" },
    { email: "user6@example.com", firstName: "User", lastName: "Six" },
    { email: "user7@example.com", firstName: "User", lastName: "Seven" },
    { email: "user8@example.com", firstName: "User", lastName: "Eight" },
    { email: "user9@example.com", firstName: "User", lastName: "Nine" },
    { email: "user10@example.com", firstName: "User", lastName: "Ten" },
];
const sampleComments = [
    "Absolutely loved it!",
    "A thoughtful and moving film.",
    "Visually stunning, great performances.",
    "Interesting concept but dragged in places.",
    "Could watch it again and again.",
    "A bit predictable but enjoyable.",
    "Fantastic pacing and soundtrack.",
    "Great chemistry between leads.",
    "Not my cup of tea, but well made.",
    "Exceeded my expectations!",
];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const choose = (arr) => arr[randInt(0, arr.length - 1)];
async function seedMany() {
    await data_source_1.AppDataSource.initialize();
    console.log("Data source initialized for seed_many");
    const userRepo = data_source_1.AppDataSource.getRepository(entity_1.User);
    const directorRepo = data_source_1.AppDataSource.getRepository(entity_1.Director);
    const genreRepo = data_source_1.AppDataSource.getRepository(entity_1.Genre);
    const movieRepo = data_source_1.AppDataSource.getRepository(entity_1.Movie);
    const reviewRepo = data_source_1.AppDataSource.getRepository(entity_1.Review);
    const actorRepo = data_source_1.AppDataSource.getRepository(entity_1.Actor);
    const castRepo = data_source_1.AppDataSource.getRepository(entity_1.MovieCast);
    const vodRepo = data_source_1.AppDataSource.getRepository(entity_1.VodPlatform);
    const countryRepo = data_source_1.AppDataSource.getRepository(entity_1.Country);
    const langRepo = data_source_1.AppDataSource.getRepository(entity_1.Language);
    // Clean existing (careful in production)
    try {
        await castRepo.delete({});
        await reviewRepo.delete({});
        await movieRepo.delete({});
        await actorRepo.delete({});
        await directorRepo.delete({});
        await genreRepo.delete({});
        await vodRepo.delete({});
        await countryRepo.delete({});
        await langRepo.delete({});
        await userRepo.delete({});
    }
    catch (e) {
        // ignore
    }
    // Create users (with hashed passwords)
    const users = [];
    for (const u of sampleUsers) {
        const password = "password";
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashed = await bcryptjs_1.default.hash(password, salt);
        const created = userRepo.create({
            email: u.email,
            password: hashed,
            firstName: u.firstName,
            lastName: u.lastName,
        });
        users.push(created);
    }
    await userRepo.save(users);
    // Directors
    const directors = sampleDirectors.map((name) => {
        const [first, last] = name.split(" ");
        return directorRepo.create({ firstName: first, lastName: last });
    });
    await directorRepo.save(directors);
    // Genres
    const genres = sampleGenres.map((g) => genreRepo.create({ name: g }));
    await genreRepo.save(genres);
    // Vod platforms (ensure at least 6)
    const vods = sampleVod.map((v) => vodRepo.create({
        name: v,
        logoUrl: `https://via.placeholder.com/128x128?text=${encodeURIComponent(v)}`,
    }));
    await vodRepo.save(vods);
    // Countries & languages
    const countries = [
        countryRepo.create({ name: "USA" }),
        countryRepo.create({ name: "UK" }),
        countryRepo.create({ name: "Canada" }),
    ];
    await countryRepo.save(countries);
    const languages = [langRepo.create({ name: "English" })];
    await langRepo.save(languages);
    // Actors (>=20)
    const actors = sampleActors.map((fullname) => {
        const parts = fullname.split(" ");
        const first = parts[0];
        const last = parts.slice(1).join(" ") || "Smith";
        return actorRepo.create({
            firstName: first,
            lastName: last,
            photoUrl: `https://via.placeholder.com/300x400?text=${encodeURIComponent(first)}`,
        });
    });
    await actorRepo.save(actors);
    // Create movies
    const movies = [];
    for (let i = 0; i < sampleMovies.length; i++) {
        const s = sampleMovies[i];
        const title = s.title;
        const slug = title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
        const director = choose(directors);
        const movieGenres = Array.from(new Set(Array.from({ length: randInt(1, 3) }, () => choose(genres))));
        const movieVods = Array.from(new Set(Array.from({ length: randInt(2, 4) }, () => choose(vods))));
        const m = movieRepo.create({
            title,
            slug,
            shortDescription: `A short description of ${title}`,
            description: `${title} is a compelling film that explores ...`,
            posterUrl: `https://via.placeholder.com/500x750?text=${encodeURIComponent(title)}`,
            trailerUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
            releaseYear: s.year,
            durationMinutes: randInt(85, 160),
            isPublished: true,
            director,
            genres: movieGenres,
            vodPlatforms: movieVods,
            country: choose(countries),
            language: choose(languages),
        });
        movies.push(m);
    }
    const savedMovies = await movieRepo.save(movies);
    // For each movie, create cast (4 unique actors)
    for (const mv of savedMovies) {
        const chosenActors = [];
        while (chosenActors.length < 4) {
            const a = choose(actors);
            if (!chosenActors.includes(a))
                chosenActors.push(a);
        }
        const castItems = chosenActors.map((a, idx) => castRepo.create({
            roleName: `Role ${idx + 1}`,
            movie: mv,
            actor: a,
        }));
        await castRepo.save(castItems);
    }
    // Create reviews (at least 5 per movie)
    for (const mv of savedMovies) {
        const reviewsForMovie = [];
        const reviewCount = randInt(5, 8);
        for (let r = 0; r < reviewCount; r++) {
            const user = choose(users);
            const rating = randInt(1, 5);
            const content = choose(sampleComments);
            const rev = reviewRepo.create({
                content,
                rating,
                user,
                movie: mv,
            });
            reviewsForMovie.push(rev);
        }
        await reviewRepo.save(reviewsForMovie);
        // update movie rating
        const movieReviews = await reviewRepo.find({
            where: { movie: { movieId: mv.movieId } },
        });
        if (movieReviews.length) {
            const sum = movieReviews.reduce((s, r) => s + r.rating, 0);
            mv.ratingCount = movieReviews.length;
            mv.averageRating = parseFloat((sum / movieReviews.length).toFixed(1));
            await movieRepo.save(mv);
        }
    }
    console.log("seed_many finished:");
    console.log(`- users: ${users.length}`);
    console.log(`- directors: ${directors.length}`);
    console.log(`- genres: ${genres.length}`);
    console.log(`- vod platforms: ${vods.length}`);
    console.log(`- actors: ${actors.length}`);
    console.log(`- movies: ${savedMovies.length}`);
    await data_source_1.AppDataSource.destroy();
}
seedMany().catch((e) => {
    console.error("Seeding many error", e);
    process.exit(1);
});
