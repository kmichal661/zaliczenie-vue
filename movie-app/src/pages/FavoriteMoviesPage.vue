<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { useQuery } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { Card, CardContent } from "@/components/ui/card";

const router = useRouter();

const FAVORITES_QUERY = gql`
  query FavoriteMovies {
    favoriteMovies {
      favoriteMovieId
      movie {
        movieId
        title
        posterUrl
        releaseYear
        averageRating
      }
      user {
        userId
      }
    }
  }
`;

import { computed } from "vue";

const { result, loading, error } = useQuery(FAVORITES_QUERY);

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
  const p = parseJwt(localStorage.getItem("token"));
  return p?.userId || null;
});

const myFavorites = computed(() => {
  const favs = result?.value?.favoriteMovies || [];
  if (!currentUserId.value) return [];
  return favs.filter((f: any) => f.user?.userId === currentUserId.value);
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Favorite Movies</h1>

    <p v-if="loading">Loading favorites...</p>
    <p v-if="error" class="text-red-500">Failed to load favorites</p>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card
        v-for="f in myFavorites"
        :key="f.favoriteMovieId"
        class="cursor-pointer"
        @click="router.push(`/movie/${f.movie.movieId}`)"
      >
        <CardContent class="p-0">
          <img
            :src="f.movie.posterUrl"
            class="w-full h-60 object-cover rounded-t-lg"
          />
          <div class="p-3 space-y-1">
            <h2 class="font-semibold text-sm">{{ f.movie.title }}</h2>
            <p class="text-xs text-muted-foreground">
              {{ f.movie.releaseYear }}
            </p>
            <p class="text-xs">⭐ {{ f.movie.averageRating ?? "N/A" }}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
