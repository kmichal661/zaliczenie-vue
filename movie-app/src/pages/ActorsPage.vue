<script setup lang="ts">
import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import { Card, CardContent } from '@/components/ui/card';

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
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Actors</h1>

    <p v-if="loading">Loading actors...</p>
    <p v-if="error" class="text-red-500">Failed to load actors</p>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card v-for="a in result?.actors" :key="a.actorId" class="cursor-pointer" @click="router.push(`/actor/${a.actorId}`)">
        <CardContent class="p-4 text-center">
          <img v-if="a.photoUrl" :src="a.photoUrl" class="w-full h-40 object-cover rounded-md mb-2" />
          <div class="font-medium">{{ a.firstName }} {{ a.lastName }}</div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>