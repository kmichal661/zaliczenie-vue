<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { computed, ref } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const router = useRouter();

const MOVIES_QUERY = gql`
  query Movies {
    movies {
      movieId
      title
      description
      posterUrl
      releaseYear
      averageRating
      genres {
        name
      }
    }
  }
`;

const GENRES_QUERY = gql`
  query Genres {
    genres {
      genreId
      name
    }
  }
`;

const FAVORITES_QUERY = gql`
  query FavoriteMovies {
    favoriteMovies {
      favoriteMovieId
      movie {
        movieId
      }
      user {
        userId
      }
    }
  }
`;

const CREATE_FAVORITE = gql`
  mutation CreateFavorite($input: FavoriteMovieInput) {
    createFavoriteMovie(input: $input) {
      favoriteMovieId
      movie {
        movieId
      }
      user {
        userId
      }
    }
  }
`;

const DELETE_FAVORITE = gql`
  mutation DeleteFavorite($id: ID!) {
    deleteFavoriteMovie(id: $id)
  }
`;

const { result, loading, error } = useQuery(MOVIES_QUERY);
const { result: genresResult } = useQuery(GENRES_QUERY);
const { result: favoritesResult, refetch: refetchFavorites } =
  useQuery(FAVORITES_QUERY);

const { mutate: createFavorite, loading: creatingFavorite } =
  useMutation(CREATE_FAVORITE);
const { mutate: deleteFavorite, loading: deletingFavorite } =
  useMutation(DELETE_FAVORITE);

// Filter state
const search = ref("");
const selectedGenre = ref<string | null>(null);
const selectedYear = ref<number | null>(null);
const minRating = ref<number | null>(null);

const movies = computed(() => result?.value?.movies ?? []);

const parseJwt = (token: string | null) => {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

const currentUserId = computed(() => {
  const stored = localStorage.getItem("userId");
  if (stored) return stored;
  const p = parseJwt(localStorage.getItem("token"));
  return p?.userId || null;
});

const favoritesByMovie = computed(() => {
  const favs = favoritesResult?.value?.favoriteMovies || [];
  const map: Record<string, any> = {};
  favs.forEach((f: any) => {
    if (f.user?.userId === currentUserId.value) {
      map[f.movie.movieId] = f;
    }
  });
  return map;
});

const toggleFavorite = async (movie: any, ev?: Event) => {
  if (ev) ev.stopPropagation();
  console.log(
    "toggleFavorite clicked for movie",
    movie.movieId,
    "currentUserId=",
    currentUserId.value,
  );
  if (!currentUserId.value) {
    router.push("/login");
    return;
  }
  const existing = favoritesByMovie.value[movie.movieId];
  try {
    if (existing) {
      console.log("deleting favorite", existing.favoriteMovieId);
      const res: any = await deleteFavorite({ id: existing.favoriteMovieId });
      console.log("deleteFavorite res", res);
    } else {
      console.log("creating favorite for user", currentUserId.value);
      const res: any = await createFavorite({
        input: { userId: currentUserId.value, movieId: movie.movieId },
      });
      console.log("createFavorite res", res);
    }
    await refetchFavorites();
  } catch (e: any) {
    console.error("Failed to toggle favorite", e);
    if (e.graphQLErrors) console.error("graphql errors", e.graphQLErrors);
    if (e.networkError) console.error("network error", e.networkError);
    alert("Failed to toggle favorite: " + (e.message || "unknown"));
  }
};

const availableYears = computed(() => {
  const yrs = new Set<number>();
  (movies.value || []).forEach((m: any) => {
    if (m.releaseYear) yrs.add(m.releaseYear);
  });
  return Array.from(yrs).sort((a, b) => b - a);
});

const filteredMovies = computed(() => {
  const list = movies.value || [];
  return list.filter((m: any) => {
    if (
      search.value &&
      !m.title.toLowerCase().includes(search.value.toLowerCase())
    )
      return false;
    if (selectedGenre.value) {
      const gs = m.genres || [];
      if (!gs.some((g: any) => g.name === selectedGenre.value)) return false;
    }
    if (selectedYear.value && m.releaseYear !== selectedYear.value)
      return false;
    if (
      minRating.value &&
      (m.averageRating == null || m.averageRating < minRating.value)
    )
      return false;
    return true;
  });
});
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Filters -->
    <div class="flex items-center gap-2">
      <Input v-model="search" placeholder="Search by title..." />

      <select v-model="selectedGenre" class="border rounded px-2 py-1">
        <option :value="null">All genres</option>
        <option
          v-for="g in genresResult?.genres"
          :key="g.genreId"
          :value="g.name"
        >
          {{ g.name }}
        </option>
      </select>

      <select v-model.number="selectedYear" class="border rounded px-2 py-1">
        <option :value="null">All years</option>
        <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
      </select>

      <select v-model.number="minRating" class="border rounded px-2 py-1">
        <option :value="null">Any rating</option>
        <option v-for="r in [5, 4, 3, 2, 1]" :key="r" :value="r">
          {{ r }}+ ⭐
        </option>
      </select>

      <Button
        variant="ghost"
        @click="
          () => {
            search = '';
            selectedGenre = null;
            selectedYear = null;
            minRating = null;
          }
        "
        >Clear</Button
      >
    </div>

    <!-- Loading -->
    <p v-if="loading">Loading movies...</p>

    <!-- Error -->
    <p v-if="error" class="text-red-500">Failed to load movies</p>

    <!-- Movies Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card
        v-for="movie in filteredMovies"
        :key="movie.movieId"
        class="cursor-pointer hover:shadow-lg transition relative"
        @click="router.push(`/movie/${movie.movieId}`)"
      >
        <CardContent class="p-0">
          <img
            :src="movie.posterUrl"
            class="w-full h-60 object-cover rounded-t-lg"
          />

          <!-- Favorite button -->
          <button
            @click.stop="toggleFavorite(movie, $event)"
            class="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
            :title="
              favoritesByMovie[movie.movieId]
                ? 'Remove from favorites'
                : 'Add to favorites'
            "
          >
            <span
              v-if="favoritesByMovie[movie.movieId]"
              class="text-red-500 text-xl"
              >♥</span
            >
            <span v-else class="text-gray-400 text-xl">♡</span>
          </button>

          <div class="p-3 space-y-1">
            <h2 class="font-semibold text-sm">
              {{ movie.title }}
            </h2>

            <p class="text-xs text-muted-foreground">
              {{ movie.releaseYear }}
            </p>

            <p class="text-xs">⭐ {{ movie.averageRating ?? "N/A" }}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
