"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./data-source");
const entity_1 = require("./entity");
async function seed() {
    await data_source_1.AppDataSource.initialize();
    console.log("Data source initialized");
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
    // Clear existing data (simple approach)
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
    // Create users
    const users = [
        userRepo.create({
            email: "alice@example.com",
            password: "password",
            firstName: "Alice",
            lastName: "Johnson",
        }),
        userRepo.create({
            email: "bob@example.com",
            password: "password",
            firstName: "Bob",
            lastName: "Smith",
        }),
    ];
    await userRepo.save(users);
    // Create directors
    const directors = [
        directorRepo.create({ firstName: "Christopher", lastName: "Nolan" }),
        directorRepo.create({ firstName: "Greta", lastName: "Gerwig" }),
    ];
    await directorRepo.save(directors);
    // Create genres
    const genres = [
        genreRepo.create({ name: "Drama" }),
        genreRepo.create({ name: "Sci-Fi" }),
        genreRepo.create({ name: "Comedy" }),
        genreRepo.create({ name: "Romance" }),
    ];
    await genreRepo.save(genres);
    // VOD platforms
    const vods = [
        vodRepo.create({ name: "Netflix", logoUrl: "https://logo.clearbit.com/netflix.com" }),
        vodRepo.create({ name: "Hulu", logoUrl: "https://logo.clearbit.com/hulu.com" }),
    ];
    await vodRepo.save(vods);
    // Countries and languages
    const countries = [countryRepo.create({ name: "USA" }), countryRepo.create({ name: "UK" })];
    await countryRepo.save(countries);
    const languages = [langRepo.create({ name: "English" })];
    await langRepo.save(languages);
    // Actors
    const actors = [
        actorRepo.create({ firstName: "Leonardo", lastName: "DiCaprio" }),
        actorRepo.create({ firstName: "Florence", lastName: "Pugh" }),
    ];
    await actorRepo.save(actors);
    // Create movies
    const m1 = movieRepo.create({
        title: "Inception",
        slug: "inception",
        shortDescription: "A thief who steals corporate secrets through dream-sharing technology.",
        description: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction...",
        posterUrl: "https://via.placeholder.com/500x750?text=Inception",
        trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
        releaseYear: 2010,
        durationMinutes: 148,
        isPublished: true,
        director: directors[0],
        genres: [genres[1], genres[0]],
        vodPlatforms: [vods[0]],
        country: countries[0],
        language: languages[0],
    });
    const m2 = movieRepo.create({
        title: "Little Women",
        slug: "little-women",
        shortDescription: "Jo March reflects on her life and sisters in post-Civil War America.",
        description: "Jo March lives with her three sisters in a quiet Massachusetts town...",
        posterUrl: "https://via.placeholder.com/500x750?text=Little+Women",
        trailerUrl: "https://www.youtube.com/watch?v=AST2-4db4ic",
        releaseYear: 2019,
        durationMinutes: 135,
        isPublished: true,
        director: directors[1],
        genres: [genres[0], genres[3]],
        vodPlatforms: [vods[1]],
        country: countries[0],
        language: languages[0],
    });
    const savedMovies = await movieRepo.save([m1, m2]);
    // Create reviews
    const reviews = [
        reviewRepo.create({ content: "Amazing mind-bending film.", rating: 5, user: users[0], movie: savedMovies[0] }),
        reviewRepo.create({ content: "A beautifully crafted period piece.", rating: 4, user: users[1], movie: savedMovies[1] }),
        reviewRepo.create({ content: "Intriguing and complex.", rating: 4, user: users[1], movie: savedMovies[0] }),
    ];
    await reviewRepo.save(reviews);
    // Update movie ratings
    for (const mv of savedMovies) {
        const movieReviews = await reviewRepo.find({ where: { movie: { movieId: mv.movieId } } });
        if (movieReviews.length) {
            const sum = movieReviews.reduce((s, r) => s + r.rating, 0);
            mv.ratingCount = movieReviews.length;
            mv.averageRating = parseFloat((sum / movieReviews.length).toFixed(1));
            await movieRepo.save(mv);
        }
    }
    // Movie casts
    const castItems = [
        castRepo.create({ roleName: "Dom Cobb", movie: savedMovies[0], actor: actors[0] }),
        castRepo.create({ roleName: "Amy March", movie: savedMovies[1], actor: actors[1] }),
    ];
    await castRepo.save(castItems);
    console.log("Seeding finished");
    await data_source_1.AppDataSource.destroy();
}
seed().catch((e) => {
    console.error("Seeding error", e);
    process.exit(1);
});
