<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { useQuery } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { Card, CardContent } from "@/components/ui/card";
import { ref, computed } from "vue";
import { Input } from "@/components/ui/input";

const router = useRouter();

const ACTORS_QUERY = gql`
  query Actors {
    actors {
      actorId
      firstName
      lastName
      photoUrl
    }
  }
`;

const { result, loading, error } = useQuery(ACTORS_QUERY);

const search = ref("");
const actors = computed(() => result?.value?.actors || []);
const filteredActors = computed(() => {
  if (!search.value) return actors.value;
  const q = search.value.toLowerCase().trim();
  return actors.value.filter((a: any) => {
    const full = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
    return full.includes(q);
  });
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Actors</h1>

    <p v-if="loading">Loading actors...</p>
    <p v-if="error" class="text-red-500">Failed to load actors</p>

    <div class="mb-4">
      <Input v-model="search" placeholder="Search actors by name..." />
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card
        v-for="a in filteredActors"
        :key="a.actorId"
        class="cursor-pointer"
        @click="router.push(`/actor/${a.actorId}`)"
      >
        <CardContent class="p-4 text-center">
          <img
            v-if="a.photoUrl"
            :src="a.photoUrl"
            class="w-32 h-48 object-cover rounded-md mb-2 mx-auto"
          />
          <div class="font-medium">{{ a.firstName }} {{ a.lastName }}</div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
