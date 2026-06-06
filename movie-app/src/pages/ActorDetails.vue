<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { useQuery } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { Card, CardContent } from "@/components/ui/card";

const route = useRoute();
const router = useRouter();
const actorId = route.params.id as string;

const ACTOR_QUERY = gql`
  query Actor($id: ID!) {
    actor(id: $id) {
      actorId
      firstName
      lastName
      bio
      photoUrl
      birthDate
      movieRoles {
        castId
        roleName
        movie {
          movieId
          title
          posterUrl
          releaseYear
          averageRating
        }
      }
    }
  }
`;

const { result, loading, error } = useQuery(ACTOR_QUERY, { id: actorId });
</script>

<template>
  <div class="p-6">
    <button class="mb-4 text-sm text-muted-foreground" @click="router.back()">
      ← Back
    </button>

    <p v-if="loading">Loading actor...</p>
    <p v-if="error" class="text-red-500">Failed to load actor</p>

    <div v-if="result?.actor">
      <div class="flex items-start gap-6 mb-6">
        <img
          v-if="result.actor.photoUrl"
          :src="result.actor.photoUrl"
          class="w-48 h-64 object-cover rounded-md"
        />
        <div>
          <h1 class="text-2xl font-bold">
            {{ result.actor.firstName }} {{ result.actor.lastName }}
          </h1>
          <p class="text-sm text-muted-foreground">
            Born:
            {{
              result.actor.birthDate
                ? new Date(result.actor.birthDate).toLocaleDateString()
                : "N/A"
            }}
          </p>
          <p class="mt-3">{{ result.actor.bio }}</p>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-3">Movies</h2>
        <div
          v-if="result.actor.movieRoles && result.actor.movieRoles.length"
          class="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card
            v-for="r in result.actor.movieRoles"
            :key="r.castId"
            class="cursor-pointer"
            @click="router.push(`/movie/${r.movie.movieId}`)"
          >
            <CardContent class="p-0">
              <img
                :src="r.movie.posterUrl"
                class="w-full h-56 object-cover rounded-t-lg"
              />
              <div class="p-3 space-y-1">
                <div class="font-semibold text-sm">{{ r.movie.title }}</div>
                <div class="text-xs text-muted-foreground">
                  {{ r.movie.releaseYear }}
                </div>
                <div class="text-xs">Role: {{ r.roleName }}</div>
                <div class="text-xs">
                  ⭐ {{ r.movie.averageRating ?? "N/A" }}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div v-else class="text-sm text-muted-foreground">
          No movie credits available.
        </div>
      </div>
    </div>
  </div>
</template>
