import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/sign-in",
      name: "sign-in",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/",
      name: "activity-tracking",
      component: () => import("../views/ActivityTrackingView.vue"),
    },
    {
      path: "/payments",
      name: "payments",
      component: () => import("../views/PaymentsView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
    },
  ],
});

export default router;
