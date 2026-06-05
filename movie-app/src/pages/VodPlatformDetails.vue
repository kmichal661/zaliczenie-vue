<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { useQuery } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { Card, CardContent } from "@/components/ui/card";

const route = useRoute();
const router = useRouter();
const platformId = route.params.id as string;

const VOD_QUERY = gql`
  query VodPlatform($id: ID!) {
    vodPlatform(id: $id) {
      vodPlatformId
      name
      logoUrl
      movies {
        movieId
        title
        posterUrl
        releaseYear
        averageRating
      }
    }
  }
`;

const { result, loading, error } = useQuery(VOD_QUERY, { id: platformId });
</script>

<template>
  <div class="p-6">
    <button class="mb-4 text-sm text-muted-foreground" @click="router.back()">
      ← Back
    </button>

    <div v-if="loading">Loading platform...</div>
    <div v-if="error" class="text-red-500">Failed to load platform</div>

    <div v-if="result?.vodPlatform">
      <div class="flex items-center gap-4 mb-6">
        <img
          v-if="result.vodPlatform.logoUrl"
          :src="result.vodPlatform.logoUrl"
          class="w-20 h-20 object-contain"
        />
        <div>
          <h1 class="text-2xl font-bold">{{ result.vodPlatform.name }}</h1>
          <div class="text-sm text-muted-foreground">
            {{ result.vodPlatform.movies?.length ?? 0 }} movies
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          v-for="m in result.vodPlatform.movies"
          :key="m.movieId"
          class="cursor-pointer"
          @click="router.push(`/movie/${m.movieId}`)"
        >
          <CardContent class="p-0">
            <img
              :src="m.posterUrl"
              class="w-full h-56 object-cover rounded-t-lg"
            />
            <div class="p-3 space-y-1">
              <div class="font-semibold text-sm">{{ m.title }}</div>
              <div class="text-xs text-muted-foreground">
                {{ m.releaseYear }}
              </div>
              <div class="text-xs">⭐ {{ m.averageRating ?? "N/A" }}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
