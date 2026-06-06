<script setup lang="ts">
import { ref, watch } from "vue";
import { gql } from "@apollo/client/core";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();

const MOVIE_QUERY = gql`
  query Movie($id: ID!) {
    movie(id: $id) {
      movieId
      title
      slug
      shortDescription
      description
      posterUrl
      trailerUrl
      releaseYear
      durationMinutes
      averageRating
      director {
        firstName
        lastName
      }
      genres {
        name
      }
      vodPlatforms {
        vodPlatformId
        name
        logoUrl
      }
      cast {
        castId
        roleName
        actor {
          actorId
          firstName
          lastName
          photoUrl
        }
      }
      reviews {
        reviewId
        content
        rating
        createdAt
        user {
          userId
          email
          firstName
          lastName
        }
      }
    }
  }
`;

const { result, loading, error, refetch } = useQuery(MOVIE_QUERY, () => ({
  id: route.params.id,
}));

console.log("MovieDetails route param id=", route.params.id);
watch(
  () => route.params.id,
  (v) => console.log("route param changed to", v),
);
watch(
  () => result.value,
  (v) => console.log("movie query result changed", v),
);

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

const { result: favoritesResult, refetch: refetchFavorites } =
  useQuery(FAVORITES_QUERY);
const { mutate: createFavorite, loading: creatingFavorite } =
  useMutation(CREATE_FAVORITE);
const { mutate: deleteFavorite, loading: deletingFavorite } =
  useMutation(DELETE_FAVORITE);

const parseJwtLocal = (token: string | null) => {
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
  const p = parseJwtLocal(localStorage.getItem("token"));
  return p?.userId || null;
});

const currentMovieId = computed(() => {
  return result?.value?.movie?.movieId || (route.params.id as string);
});

// Watchlist handling
const WATCHLISTS_QUERY = gql`
  query Watchlists {
    watchlists {
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

const { result: watchlistsResult, refetch: refetchWatchlists } =
  useQuery(WATCHLISTS_QUERY);
const { mutate: createWatchlist, loading: creatingWatchlist } =
  useMutation(CREATE_WATCHLIST);
const { mutate: deleteWatchlist, loading: deletingWatchlist } =
  useMutation(DELETE_WATCHLIST);
const { mutate: updateWatchlist, loading: updatingWatchlist } =
  useMutation(UPDATE_WATCHLIST);

const watchlistEntry = computed(() => {
  const list = watchlistsResult?.value?.watchlists || [];
  return (
    list.find(
      (w: any) =>
        w.movie?.movieId === currentMovieId.value &&
        w.user?.userId === currentUserId.value,
    ) || null
  );
});

const toggleWatchlist = async () => {
  if (!currentUserId.value) {
    router.push("/login");
    return;
  }
  try {
    if (watchlistEntry.value) {
      // remove
      await deleteWatchlist({ id: watchlistEntry.value.watchlistId });
    } else {
      await createWatchlist({
        input: {
          userId: currentUserId.value,
          movieId: currentMovieId.value,
          watched: false,
        },
      });
    }
    await refetchWatchlists();
  } catch (e) {
    console.error("watchlist toggle error", e);
  }
};

const toggleWatched = async () => {
  if (!watchlistEntry.value) return;
  try {
    await updateWatchlist({
      id: watchlistEntry.value.watchlistId,
      input: { watched: !watchlistEntry.value.watched },
    });
    await refetchWatchlists();
  } catch (e) {
    console.error("toggle watched error", e);
  }
};

const favoriteForThisMovie = computed(() => {
  const favs = favoritesResult?.value?.favoriteMovies || [];
  return (
    favs.find(
      (f: any) =>
        f.movie?.movieId === currentMovieId.value &&
        f.user?.userId === currentUserId.value,
    ) || null
  );
});

const toggleFavorite = async () => {
  console.log("toggleFavorite clicked, currentUserId=", currentUserId.value);
  if (!currentUserId.value) {
    router.push("/login");
    return;
  }
  try {
    const existing = favoriteForThisMovie.value;
    if (existing) {
      console.log("deleting favorite", existing.favoriteMovieId);
      const res: any = await deleteFavorite({ id: existing.favoriteMovieId });
      console.log("deleteFavorite res", res);
    } else {
      const mid = currentMovieId.value;
      console.log(
        "creating favorite for user",
        currentUserId.value,
        "movieId=",
        mid,
      );
      const res: any = await createFavorite({
        input: { userId: currentUserId.value, movieId: mid },
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

const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput) {
    createReview(input: $input) {
      reviewId
      content
      rating
      createdAt
      user {
        userId
        firstName
        lastName
      }
    }
  }
`;

const { mutate: submitReview, loading: reviewLoading } =
  useMutation(CREATE_REVIEW);

const newReviewContent = ref("");
const newReviewRating = ref<number>(0);

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

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  const p = parseJwt(token);
  return p?.userId || null;
};

const submitNewReview = async () => {
  const userId = getUserIdFromToken();
  if (!userId) {
    // redirect to login
    router.push("/login");
    return;
  }
  if (!newReviewRating.value || newReviewRating.value < 1) {
    alert("Please select a rating");
    return;
  }

  try {
    await submitReview({
      input: {
        movieId: currentMovieId.value,
        userId,
        rating: newReviewRating.value,
        content: newReviewContent.value,
      },
    });
    newReviewContent.value = "";
    newReviewRating.value = 0;
    // refetch movie to get new reviews and updated rating
    await refetch();
  } catch (e) {
    console.error("Failed to submit review", e);
    alert("Failed to submit review");
  }
};

const resetReview = () => {
  newReviewContent.value = "";
  newReviewRating.value = 0;
};

const formatDate = (val: any) => {
  if (val === null || val === undefined) return "N/A";
  try {
    // If it's already a Date
    if (val instanceof Date) return val.toLocaleString();

    // If it's a number (timestamp ms)
    if (typeof val === "number") {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    }

    // If it's a string, try parsing
    if (typeof val === "string") {
      // Trim and handle possible serialized formats
      const s = val.trim();
      // If it's a numeric string (timestamp)
      if (/^\d+$/.test(s)) {
        const d = new Date(parseInt(s, 10));
        if (!isNaN(d.getTime())) return d.toLocaleString();
      }
      const d2 = new Date(s);
      if (!isNaN(d2.getTime())) return d2.toLocaleString();
    }

    // If it's an object coming from some serializers (e.g. { seconds })
    if (typeof val === "object") {
      if (
        "seconds" in val &&
        (typeof val.seconds === "number" || typeof val.seconds === "string")
      ) {
        const secs = Number((val as any).seconds);
        const d = new Date(secs * 1000);
        if (!isNaN(d.getTime())) return d.toLocaleString();
      }
      if (typeof (val as any).toDate === "function") {
        const d = (val as any).toDate();
        if (d instanceof Date && !isNaN(d.getTime())) return d.toLocaleString();
      }
      // If object has ISO string property
      if ((val as any).iso) {
        const d3 = new Date((val as any).iso);
        if (!isNaN(d3.getTime())) return d3.toLocaleString();
      }
    }

    // As a last resort, attempt Date on JSON string
    const tryJson = JSON.stringify(val);
    const d3 = new Date(tryJson);
    if (!isNaN(d3.getTime())) return d3.toLocaleString();

    console.warn("formatDate: unable to parse date value", val);
    return "Invalid date";
  } catch (e) {
    console.warn("formatDate error", e, val);
    return "Invalid date";
  }
};

const formatYoutubeEmbed = (url: string) => {
  try {
    if (!url) return url;
    if (url.includes("youtu.be")) {
      const id = url.split("/").pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    const urlObj = new URL(url);
    const v = urlObj.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
  } catch (e) {
    // ignore
  }
  return url;
};
</script>

<template>
  <div class="p-6">
    <Button class="mb-4" variant="ghost" @click="router.back()">← Back</Button>

    <p v-if="loading">Loading movie...</p>
    <p v-if="error" class="text-red-500">Failed to load movie</p>

    <div v-if="result?.movie">
      <!-- movie found -->
      <Card class="flex flex-col md:flex-row gap-6">
        <img
          v-if="result.movie.posterUrl"
          :src="result.movie.posterUrl"
          alt="Poster"
          class="w-full md:w-1/3 h-80 object-cover rounded-lg"
        />

        <CardContent class="p-4 md:p-6 flex-1">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold mb-2">{{ result.movie.title }}</h1>
            <div class="flex items-center gap-2">
              <button
                @click="toggleFavorite"
                class="ml-4 text-2xl"
                :title="
                  favoriteForThisMovie
                    ? 'Remove from favorites'
                    : 'Add to favorites'
                "
              >
                <span v-if="favoriteForThisMovie" class="text-red-500">♥</span>
                <span v-else class="text-gray-400">♡</span>
              </button>

              <!-- Watchlist button -->
              <button
                @click="toggleWatchlist"
                class="ml-2 text-2xl"
                :title="
                  watchlistEntry
                    ? watchlistEntry.watched
                      ? 'In watchlist (watched)'
                      : 'In watchlist'
                    : 'Add to watchlist'
                "
              >
                <span v-if="watchlistEntry">🔖</span>
                <span v-else class="text-gray-400">📑</span>
              </button>
            </div>
          </div>

          <p
            v-if="result.movie.shortDescription"
            class="text-muted-foreground mb-3"
          >
            {{ result.movie.shortDescription }}
          </p>

          <div class="flex items-center gap-3 mb-3">
            <span class="text-sm"
              >Year: {{ result.movie.releaseYear ?? "N/A" }}</span
            >
            <span class="text-sm">•</span>
            <span class="text-sm"
              >Duration: {{ result.movie.durationMinutes ?? "N/A" }} min</span
            >
            <span class="text-sm">•</span>
            <span class="text-sm"
              >Rating: {{ result.movie.averageRating ?? "N/A" }}</span
            >
          </div>

          <p class="mb-4" v-html="result.movie.description"></p>

          <div class="mb-4">
            <strong>Director:</strong>
            <span>
              {{
                result.movie.director
                  ? result.movie.director.firstName +
                    " " +
                    result.movie.director.lastName
                  : "N/A"
              }}
            </span>
          </div>

          <div class="mb-4">
            <strong>Genres:</strong>
            <span>
              <template
                v-if="result.movie.genres && result.movie.genres.length"
              >
                <span
                  v-for="g in result.movie.genres"
                  :key="g.name"
                  class="inline-block mr-2 text-sm text-muted-foreground"
                  >{{ g.name }}</span
                >
              </template>
              <span v-else>N/A</span>
            </span>
          </div>

          <!-- Cast Section -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Cast</h3>
            <div
              v-if="result.movie.cast && result.movie.cast.length"
              class="grid grid-cols-2 md:grid-cols-4 gap-2"
            >
              <div
                v-for="c in result.movie.cast"
                :key="c.castId"
                class="flex flex-col items-start p-1 border rounded w-32"
              >
                <img
                  v-if="c.actor?.photoUrl"
                  :src="c.actor.photoUrl"
                  alt="actor"
                  class="w-32 h-48 object-cover rounded-md mb-2"
                />
                <div class="font-medium text-left text-sm break-words">
                  {{ c.actor?.firstName }} {{ c.actor?.lastName }}
                </div>
                <div class="text-xs text-muted-foreground text-left">
                  {{ c.roleName }}
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-muted-foreground">
              No cast information available.
            </div>
          </div>

          <!-- VOD Platforms Section -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Available on</h3>
            <div
              v-if="
                result.movie.vodPlatforms && result.movie.vodPlatforms.length
              "
              class="flex items-center gap-4 flex-wrap"
            >
              <div
                v-for="p in result.movie.vodPlatforms"
                :key="p.vodPlatformId"
                class="flex items-center gap-3 p-2 border rounded"
              >
                <div
                  class="w-16 h-16 flex items-center justify-center bg-white rounded"
                >
                  <img
                    v-if="p.logoUrl"
                    :src="p.logoUrl"
                    :alt="p.name"
                    class="w-14 h-14 object-contain"
                  />
                  <div
                    v-else
                    class="w-14 h-14 flex items-center justify-center bg-gray-100 rounded text-sm text-muted-foreground"
                  >
                    {{
                      p.name
                        .split(" ")
                        .map((s: any) => s[0])
                        .join("")
                        .slice(0, 2)
                    }}
                  </div>
                </div>
                <div class="text-sm font-medium">{{ p.name }}</div>
              </div>
            </div>
            <div v-else class="text-sm text-muted-foreground">
              Not available on VOD platforms.
            </div>
          </div>

          <div v-if="result.movie.trailerUrl" class="mt-4">
            <strong>Trailer</strong>
            <div class="mt-2">
              <iframe
                v-if="
                  result.movie.trailerUrl.includes('youtube') ||
                  result.movie.trailerUrl.includes('youtu.be')
                "
                :src="formatYoutubeEmbed(result.movie.trailerUrl)"
                class="w-full h-64 rounded-md"
                frameborder="0"
                allowfullscreen
              ></iframe>

              <a
                v-else
                :href="result.movie.trailerUrl"
                target="_blank"
                class="text-blue-600 underline"
              >
                Open trailer
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Reviews Section -->
      <div class="mt-6 max-w-3xl">
        <h3 class="text-xl font-semibold mb-3">Reviews</h3>

        <div class="space-y-4">
          <div v-if="result.movie.reviews && result.movie.reviews.length">
            <div
              v-for="r in result.movie.reviews"
              :key="r.reviewId"
              class="p-4 border rounded-md"
            >
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium">
                  {{ r.user?.firstName || r.user?.email || "Anonymous" }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ formatDate(r.createdAt) }}
                </div>
              </div>
              <div class="mt-2">
                <div class="text-yellow-500">
                  {{ "★".repeat(r.rating) + "☆".repeat(5 - r.rating) }}
                </div>
                <p class="mt-2 text-sm">{{ r.content }}</p>
              </div>
            </div>
          </div>

          <div v-else class="text-sm text-muted-foreground">
            No reviews yet. Be the first to review!
          </div>
        </div>

        <!-- New review form -->
        <div class="mt-6 p-4 border rounded-md">
          <h4 class="font-medium mb-2">Leave a review</h4>

          <div class="flex items-center gap-2 mb-2">
            <template v-for="n in 5" :key="n">
              <button
                @click.prevent="newReviewRating = n"
                class="text-2xl"
                :class="
                  n <= newReviewRating ? 'text-yellow-400' : 'text-gray-300'
                "
              >
                ★
              </button>
            </template>
            <div class="text-sm text-muted-foreground">
              {{ newReviewRating }} / 5
            </div>
          </div>

          <textarea
            v-model="newReviewContent"
            rows="3"
            class="w-full p-2 border rounded-md"
            placeholder="Write your review..."
          ></textarea>

          <div class="mt-3 flex items-center gap-2">
            <Button @click="submitNewReview" :disabled="reviewLoading">{{
              reviewLoading ? "Posting..." : "Post review"
            }}</Button>
            <Button variant="ghost" @click="resetReview">Cancel</Button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-6">
      <p class="text-red-500">Movie not found.</p>
    </div>
  </div>
</template>
