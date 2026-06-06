<script setup lang="ts">
import { ref } from "vue";
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

const title = ref("");
const shortDescription = ref("");
const description = ref("");
const posterUrl = ref("");
const trailerUrl = ref("");
const releaseYear = ref<number | null>(null);
const durationMinutes = ref<number | null>(null);

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const CREATE_MOVIE = gql`
  mutation CreateMovie($input: MovieInput) {
    createMovie(input: $input) {
      movieId
      title
      slug
    }
  }
`;

const { mutate, loading } = useMutation(CREATE_MOVIE);

const resetForm = () => {
  title.value = "";
  shortDescription.value = "";
  description.value = "";
  posterUrl.value = "";
  trailerUrl.value = "";
  releaseYear.value = null;
  durationMinutes.value = null;
};

const createMovie = async () => {
  try {
    const payload = {
      title: title.value,
      slug: generateSlug(title.value),

      shortDescription: shortDescription.value || null,

      description: description.value,

      posterUrl: posterUrl.value || null,

      trailerUrl: trailerUrl.value || null,

      releaseYear: releaseYear.value,

      durationMinutes: durationMinutes.value,

      isPublished: true,
    };

    console.log("Sending movie payload:", payload);

    const result = await mutate({
      input: payload,
    });

    console.log("Mutation response:", result);

    resetForm();

    open.value = false;

    window.location.reload();
  } catch (err) {
    console.error("Movie creation failed:", err);
  }
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button> + New Movie </Button>
    </DialogTrigger>

    <DialogContent class="max-w-xl">
      <DialogHeader>
        <DialogTitle> Create New Movie </DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <Input v-model="title" placeholder="Movie title" />

        <div v-if="title" class="text-sm text-muted-foreground">
          Generated slug:
          <strong>
            {{ generateSlug(title) }}
          </strong>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Short description (one-liner)</label
          >
          <Input
            v-model="shortDescription"
            placeholder="Short description (one-liner)"
            maxlength="160"
            class="mt-1 w-full"
          />
          <div class="text-xs text-muted-foreground mt-1">
            {{ shortDescription.length }} / 160
          </div>
        </div>

        <Textarea v-model="description" placeholder="Movie description" />

        <Input v-model="posterUrl" placeholder="Poster URL" />

        <Input v-model="trailerUrl" placeholder="Trailer URL" />

        <Input
          v-model.number="releaseYear"
          type="number"
          placeholder="Release year"
        />

        <Input
          v-model.number="durationMinutes"
          type="number"
          placeholder="Duration (minutes)"
        />

        <Button class="w-full" @click="createMovie" :disabled="loading">
          {{ loading ? "Creating..." : "Create Movie" }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
