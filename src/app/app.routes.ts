import { Routes } from "@angular/router";
import AuthGuard from "@app/guard/auth.guard";
import LoginComponent from "@pages/login/login.component";

export const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "register",
    loadComponent: () => import("@pages/register/register.component"),
  },
  {
    path: "home",
    loadComponent: () => import("@pages/home/home.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "movie/:id/:slug",
    loadComponent: () => import("@pages/movie/movie.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "add-movie",
    loadComponent: () => import("@pages/add-movie/add-movie.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "cinema/:id/:slug",
    loadComponent: () => import("@pages/cinema/cinema.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "cinemas",
    loadComponent: () => import("@pages/cinemas/cinemas.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "edit-cinema/:id/:slug",
    loadComponent: () => import("@pages/edit-cinema/edit-cinema.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "search",
    loadComponent: () => import("@pages/search/search.component"),
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];
