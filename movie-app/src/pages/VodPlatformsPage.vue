<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { useQuery } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { Card, CardContent } from "@/components/ui/card";

const router = useRouter();

const VODS_QUERY = gql`
  query VodPlatforms {
    vodPlatforms {
      vodPlatformId
      name
      logoUrl
      movies {
        movieId
        title
        posterUrl
      }
    }
  }
`;

const { result, loading, error } = useQuery(VODS_QUERY);

const navigateToVod = (p: any) => {
  const id = p?.vodPlatformId || p?.platformId || p?.id || null;
  if (!id) {
    console.warn("navigateToVod: missing id for platform", p);
    alert("Platform id missing, cannot navigate");
    return;
  }
  router.push(`/vod/${id}`);
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">VOD Platforms</h1>

    <p v-if="loading">Loading platforms...</p>
    <p v-if="error" class="text-red-500">Failed to load platforms</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card
        v-for="p in result?.vodPlatforms"
        :key="p.vodPlatformId"
        class="cursor-pointer"
        @click="navigateToVod(p)"
      >
        <CardContent>
          <div class="flex items-center gap-4">
            <img
              v-if="p.logoUrl"
              :src="p.logoUrl"
              class="w-16 h-16 object-contain"
            />
            <div>
              <div class="font-medium">{{ p.name }}</div>
              <div class="text-sm text-muted-foreground">
                {{ p.movies?.length ?? 0 }} movies
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
