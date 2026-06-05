# MovieApp Documentation

## Overview

MovieApp is a full-stack application for browsing and managing movies, actors, VOD platforms, reviews, favorites and a personal watchlist.

- Backend: Node.js + TypeScript + TypeORM + Apollo GraphQL (SQLite DB)
- Frontend: Vue 3 + Vite + @vue/apollo-composable (Apollo Client)
- Static images: small Express static server serving images from `backend/images` on port 5001

This document is split into FE (frontend) and BE (backend) sections and covers setup, architecture, features and example GraphQL queries/mutations.

---

## Quick start

Prerequisites

- Node 18+ (or compatible)
- npm

Backend

1. cd backend
2. npm install
3. (optional) Seed demo data: `npm run seed` — this compiles and executes a seeder that creates users, movies, directors, genres, actors, reviews, vod platforms, countries and languages.
4. Start dev server: `npm run dev` (compiles TypeScript and runs the server)

Frontend

1. cd movie-app
2. npm install
3. Start dev server: `npm run dev`

Default endpoints

- GraphQL: http://localhost:5000/
- Images static server: http://localhost:5001/images/<filename>
- Frontend (Vite): typically http://localhost:5173/

---

# Backend (BE)

## Project structure (high-level)

- `backend/src/index.ts` — Apollo server entry and small Express images server
- `backend/src/data-source.ts` — TypeORM DataSource config (SQLite)
- `backend/src/entity/*` — TypeORM entities (Movie, User, Review, Actor, Director, Genre, VodPlatform, FavoriteMovie, Watchlist, MovieCast, etc.)
- `backend/src/resolvers/*` — GraphQL resolvers grouped per resource
- `backend/src/typeDefs.ts` — GraphQL schema (types, queries, mutations)
- `backend/src/seed.ts` — seeding script (creates sample data)

## Entities (important ones)

- User: userId (uuid), email, password, firstName, lastName, bio, avatarUrl, createdAt
- Movie: movieId, title, slug, shortDescription, description, posterUrl, trailerUrl, releaseYear, durationMinutes, averageRating, ratingCount, isPublished, releaseDate, createdAt
  - relations to genres, director, reviews, vodPlatforms, cast, country, language
- Actor: actorId, firstName, lastName, photoUrl, bio, movieRoles (MovieCast)
- MovieCast: castId, roleName, movie, actor
- Review: reviewId, content, rating, createdAt, movie, user
- FavoriteMovie: favoriteMovieId, user, movie
- Watchlist: watchlistId, user, movie, watched
- VodPlatform: vodPlatformId, name, logoUrl, movies

## GraphQL schema highlights

- Queries: `movies`, `movie(id)`, `actors`, `actor(id)`, `vodPlatforms`, `vodPlatform(id)`, `favoriteMovies`, `watchlists`, `reviews`, ...
- Mutations: `register`, `login`, CRUD for movies/actors/directors/genres, `createReview`, `createFavoriteMovie`, `deleteFavoriteMovie`, `createWatchlist`, `updateWatchlist`, `deleteWatchlist`, etc.
- Types use IDs consistent with entities: `vodPlatformId`, `favoriteMovieId`, `watchlistId`, `castId`.

## Important backend behaviors

- Authentication: JWT is issued on login/register (payload contains userId). Many resolvers accept `userId` in input but some also try to derive userId from Authorization header (Bearer token). For production, server-side derivation is recommended and client-supplied userId should be ignored.
- Reviews: when creating a review, the resolver recalculates movie averageRating and ratingCount and updates the Movie record.
- Favorites: createFavoriteMovie prevents duplicate favorites for the same user+movie; resolver can derive user from JWT on missing input.userId.
- Watchlist: create/update/delete watchlist entries; UI filters watchlists for the current user client-side.

## Images server

- A small Express server serves the `backend/images` folder under `/images` on port 5001. Drop poster/actor/logo images into that folder and reference them using `http://localhost:5001/images/<filename>`.

---

# Frontend (FE)

## Project structure (high-level)

- `movie-app/src/main.ts` — app entry, provides Apollo client to Vue
- `movie-app/src/apollo/client.ts` — Apollo client setup (includes Authorization header set from localStorage.token)
- `movie-app/src/router/index.ts` — routes
- `movie-app/src/pages/*` — main pages (Home, MovieDetails, Actors, ActorDetails, VodPlatforms, VodPlatformDetails, Login, Favorites, Watchlist, CreateMovieDialog, etc.)
- `movie-app/src/components/ui/*` — UI primitives (Card, Button, Input, Textarea, Dialog)

## Authentication flow

- Login page calls GraphQL `login` mutation, receives token and user object. Frontend stores `token` and `userId` in `localStorage` and dispatches a window `auth-change` event so Navbar updates.
- Apollo client sets `Authorization: Bearer <token>` header on requests.

## Main pages & UI features

- HomePage
  - Movies grid, client-side filtering (search by title, filter by genre, year, min rating)
  - Favorite heart overlay on cards to add/remove favorites
  - Click card navigates to Movie Details
- MovieDetails
  - Poster, title, short description, director, genres
  - Cast tiles (actor photo, name, role) — clickable to actor page
  - VOD Platforms list (logo + name)
  - Trailer iframe (YouTube embedding)
  - Favorite (heart) and Watchlist (bookmark) controls near title
  - Reviews displayed under poster; small review form with 5-star rating
- Actors & ActorDetails
  - Actors list page; clicking actor opens ActorDetails page with bio and movies (filmography)
- VOD Platforms & VodPlatformDetails
  - Platforms list; click to open platform details, which show movies available on that platform.
- Favorites
  - Shows current user's favorite movies.
- Watchlist
  - Shows current user's watchlist with controls (details, mark watched, remove).
- Create Movie dialog (Navbar)
  - For authenticated users: create a new movie via GraphQL mutation.

## Important UI notes

- The app uses a local event "auth-change" for cross-tab/component updates when authentication state changes (login/logout).
- The frontend decodes JWT in several places for convenience, but also stores userId to avoid parsing issues.
- Error handling: GraphQL errors are surfaced via alert or console logs; review UX shows errors inline minimalistically.

---

# Features (end-user guide)

## Authentication

- Register/login via GraphQL mutations (LoginPage). Example login response contains token + user data. Store token and userId in localStorage.

## Favorites

- Add/remove favorites from:
  - Home movie cards (top-right heart).
  - MovieDetails (heart next to title).
- Favorite movies appear on the Favorites page.

## Watchlist

- On MovieDetails click the bookmark icon (next to favorite) to add/remove movie from your watchlist.
- Use Watchlist page to view and manage your watchlist: mark watched/unwatched or remove items.

## Reviews

- On MovieDetails select a star rating and enter a comment. Submit to post a review; the movie's averageRating will be recalculated and shown.

## Actors and VOD

- Actors page: browse actors and click to view actor details and their movie credits.
- VOD Platforms page: browse platforms and click a platform to view all movies available there.

## Creating movies

- Authenticated users can click + New Movie in the top right to open a dialog and create a new movie.

---

# GraphQL Examples

Query: Fetch movies (minimal)

```
query Movies {
  movies {
    movieId
    title
    posterUrl
    releaseYear
    averageRating
  }
}
```

Query: Fetch single movie (detailed)

```
query Movie($id: ID!) {
  movie(id: $id) {
    movieId
    title
    shortDescription
    description
    posterUrl
    trailerUrl
    releaseYear
    durationMinutes
    averageRating
    director { firstName lastName }
    genres { name }
    vodPlatforms { vodPlatformId name logoUrl }
    cast { castId roleName actor { actorId firstName lastName photoUrl } }
    reviews { reviewId rating content createdAt user { userId firstName } }
  }
}
```

Mutation: Add review

```
mutation CreateReview($input: ReviewInput) {
  createReview(input: $input) {
    reviewId
    rating
    content
  }
}
```

Variables: `{ "input": { "movieId": "<id>", "userId": "<id>", "rating": 5, "content": "Great!" } }`

Mutation: Add favorite

```
mutation CreateFavorite($input: FavoriteMovieInput) {
  createFavoriteMovie(input: $input) { favoriteMovieId }
}
```

Variables: `{ "input": { "userId": "<id>", "movieId": "<id>" } }`

Mutation: Add to watchlist

```
mutation CreateWatchlist($input: WatchlistInput) {
  createWatchlist(input: $input) {
    watchlistId
    watched
  }
}
```

Variables: `{ "input": { "userId": "<id>", "movieId": "<id>", "watched": false } }`

---

# Troubleshooting & notes

- 400 Bad Request from Apollo usually indicates a schema mismatch: ensure frontend queries/mutations request fields that exist in backend typeDefs (watch for platformId vs vodPlatformId, id field names etc.). Restart backend after schema changes.
- If favorites/watchlist actions fail related to userId, ensure localStorage.token is present and Authorization header is being sent (frontend Apollo client sets it). Also ensure backend is restarted after resolver changes.
- If dates display as "Invalid date", check the format returned by backend (ISO string vs timestamp vs object). The frontend attempts to parse common formats; unusual shapes can be added easily.

---

# Next steps & recommendations

Security & correctness

- Enforce server-side authentication: derive user from JWT in resolvers rather than trusting client-provided userId. This prevents spoofing.
- Add role-based access control if required (admin for creating movies etc.).

Performance & UX

- Implement server-side filtering & pagination for movies and large lists (movies, reviews, favorites, watchlist) instead of client-side filtering.
- Add optimistic UI updates for favorites and watchlist toggles for snappier UX.
- Improve review UX (inline validation, toasts, optimistic rendering) and add pagination for reviews.

Testing

- Add unit and integration tests for resolvers (GraphQL) and critical frontend flows (login, add favorite, add review).

Accessibility

- Replace unicode icons with accessible SVG icons and add proper ARIA labels and keyboard support for interactive controls.

---

If you want, I can generate a shorter Quick Reference with common GraphQL queries/mutations only, or produce Postman/curl examples for the most common operations. Also I can add server-side JWT enforcement and adjust resolvers to use the authenticated user automatically.
