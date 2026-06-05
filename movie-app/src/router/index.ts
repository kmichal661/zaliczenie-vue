import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/pages/LoginPage.vue";
import HomePage from "@/pages/HomePage.vue";
import MovieDetails from "@/pages/MovieDetails.vue";
import ActorsPage from "@/pages/ActorsPage.vue";
import FavoriteMoviesPage from "@/pages/FavoriteMoviesPage.vue";
import VodPlatformsPage from "@/pages/VodPlatformsPage.vue";
import WatchlistPage from "@/pages/WatchlistPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: LoginPage,
    },
    {
      path: "/",
      component: HomePage,
    },
    {
      path: "/actors",
      component: ActorsPage,
    },
    {
      path: "/favorites",
      component: FavoriteMoviesPage,
    },
    {
      path: "/vod-platforms",
      component: VodPlatformsPage,
    },
    {
      path: "/movie/:id",
      name: "movie-details",
      component: MovieDetails,
    },
    {
      path: "/actor/:id",
      name: "actor-details",
      component: () => import("@/pages/ActorDetails.vue"),
    },
    {
      path: "/vod/:id",
      name: "vod-details",
      component: () => import("@/pages/VodPlatformDetails.vue"),
    },
    {
      path: "/watchlist",
      name: "watchlist",
      component: WatchlistPage,
    },
  ],
});

export default router;
