<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { computed, ref } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const router = useRouter();

const WATCHLISTS_QUERY = gql`
  query Watchlists {
    watchlists {
      watchlistId
      watched
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

const CREATE_WATCHLIST = gql`
  mutation CreateWatchlist($input: WatchlistInput) {
    createWatchlist(input: $input) {
      watchlistId
      watched
      movie {
        movieId
      }
      user {
        userId
      }
    }
  }
`;

const DELETE_WATCHLIST = gql`
  mutation DeleteWatchlist($id: ID!) {
    deleteWatchlist(id: $id)
  }
`;

const UPDATE_WATCHLIST = gql`
  mutation UpdateWatchlist($id: ID!, $input: WatchlistInput) {
    updateWatchlist(id: $id, input: $input) {
      watchlistId
      watched
      movie {
        movieId
      }
      user {
        userId
      }
    }
  }
`;

const { result, loading, error, refetch } = useQuery(WATCHLISTS_QUERY);
// const { mutate: createWatchlist, loading: creating } = useMutation(CREATE_WATCHLIST);
const { mutate: deleteWatchlist, loading: deleting } =
  useMutation(DELETE_WATCHLIST);
const { mutate: updateWatchlist, loading: updating } =
  useMutation(UPDATE_WATCHLIST);

const parseJwt = (token: string | null) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
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

const myWatchlists = computed(() => {
  const list = result?.value?.watchlists || [];
  if (!currentUserId.value) return [];
  return list.filter((w: any) => w.user?.userId === currentUserId.value);
});

const removeFromWatchlist = async (id: string) => {
  try {
    await deleteWatchlist({ id });
    await refetch();
  } catch (e) {
    console.error(e);
  }
};

const toggleWatched = async (w: any) => {
  try {
    await updateWatchlist({
      id: w.watchlistId,
      input: { watched: !w.watched },
    });
    await refetch();
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">My Watchlist</h1>

    <p v-if="loading">Loading watchlist...</p>
    <p v-if="error" class="text-red-500">Failed to load watchlist</p>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card
        v-for="w in myWatchlists"
        :key="w.watchlistId"
        class="cursor-pointer"
      >
        <CardContent class="p-0">
          <img
            :src="w.movie.posterUrl"
            class="w-full h-56 object-cover rounded-t-lg"
          />
          <div class="p-3 space-y-1">
            <div class="flex items-center justify-between">
              <div class="font-semibold text-sm">{{ w.movie.title }}</div>
              <div class="text-xs">⭐ {{ w.movie.averageRating ?? "N/A" }}</div>
            </div>
            <div class="text-xs text-muted-foreground">
              {{ w.movie.releaseYear }}
            </div>

            <div class="mt-2 flex items-center gap-2">
              <Button @click="() => router.push(`/movie/${w.movie.movieId}`)"
                >Details</Button
              >
              <Button variant="ghost" @click="() => toggleWatched(w)">{{
                w.watched ? "Watched" : "Mark watched"
              }}</Button>
              <Button
                variant="destructive"
                @click="() => removeFromWatchlist(w.watchlistId)"
                >Remove</Button
              >
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-if="!myWatchlists.length" class="text-sm text-muted-foreground mt-4">
      Your watchlist is empty.
    </div>
  </div>
</template>
