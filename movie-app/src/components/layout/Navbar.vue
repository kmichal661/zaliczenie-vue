<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { gql } from "@apollo/client/core";
import { useMutation } from "@vue/apollo-composable";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const open = ref(false);

const isLoggedIn = ref<boolean>(!!localStorage.getItem("token"));

// Listen for auth changes dispatched from other parts of the app
const onAuthChange = () => {
  isLoggedIn.value = !!localStorage.getItem("token");
};

onMounted(() => window.addEventListener("auth-change", onAuthChange));
onBeforeUnmount(() => window.removeEventListener("auth-change", onAuthChange));

const router = useRouter();
const goToLogin = () => {
  router.push("/login");
};

const navigate = (path: string) => {
  router.push(path);
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  // notify other parts of the app
  window.dispatchEvent(new Event("auth-change"));
  // navigate to home
  router.push("/");
};

const title = ref("");
const shortDescription = ref("");
const description = ref("");
const posterUrl = ref("");
const trailerUrl = ref("");
const releaseYear = ref<number | null>(null);
const durationMinutes = ref<number | null>(null);

const CREATE_MOVIE = gql`
  mutation CreateMovie($input: MovieInput) {
    createMovie(input: $input) {
      movieId
      title
    }
  }
`;

const { mutate, loading } = useMutation(CREATE_MOVIE);

const createMovie = async () => {
  try {
    await mutate({
      input: {
        title: title.value,
        shortDescription: shortDescription.value || null,
        description: description.value,
        posterUrl: posterUrl.value,
        trailerUrl: trailerUrl.value,
        releaseYear: releaseYear.value,
        durationMinutes: durationMinutes.value,
        isPublished: true,
      },
    });

    open.value = false;

    title.value = "";
    shortDescription.value = "";
    description.value = "";
    posterUrl.value = "";
    trailerUrl.value = "";

    location.reload();
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <nav class="w-full bg-white shadow px-4 py-2">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button class="text-lg font-bold" @click.prevent="navigate('/')">
          MovieApp
        </button>
        <nav class="ml-4 flex items-center gap-3">
          <button
            class="text-sm text-muted-foreground hover:underline"
            @click.prevent="navigate('/actors')"
          >
            Actors
          </button>
          <button
            class="text-sm text-muted-foreground hover:underline"
            @click.prevent="navigate('/favorites')"
          >
            Favorites
          </button>
          <button
            class="text-sm text-muted-foreground hover:underline"
            @click.prevent="navigate('/watchlist')"
          >
            Watchlist
          </button>
          <button
            class="text-sm text-muted-foreground hover:underline"
            @click.prevent="navigate('/vod-platforms')"
          >
            VOD Platforms
          </button>
        </nav>
      </div>

      <div class="flex items-center gap-2">
        <!-- If not logged in show login button -->
        <template v-if="!isLoggedIn">
          <Button @click="goToLogin">Login</Button>
        </template>

        <!-- If logged in show new movie trigger and logout -->
        <template v-else>
          <Dialog v-model:open="open">
            <DialogTrigger as-child>
              <Button>+ New Movie</Button>
            </DialogTrigger>

            <DialogContent class="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create Movie</DialogTitle>
              </DialogHeader>

              <div class="space-y-4">
                <Input v-model="title" placeholder="Movie title" />

                <Input
                  v-model="shortDescription"
                  placeholder="Short description (one-liner)"
                />

                <Textarea v-model="description" placeholder="Description" />

                <Input v-model="posterUrl" placeholder="Poster URL" />

                <Input v-model="trailerUrl" placeholder="Trailer URL" />

                <Input
                  v-model.number="releaseYear"
                  type="number"
                  placeholder="Release Year"
                />

                <Input
                  v-model.number="durationMinutes"
                  type="number"
                  placeholder="Duration"
                />

                <Button class="w-full" @click="createMovie" :disabled="loading">
                  {{ loading ? "Creating..." : "Create Movie" }}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" @click="logout">Logout</Button>
        </template>
      </div>
    </div>
  </nav>
</template>
