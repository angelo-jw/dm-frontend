import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("../views/Dashboard/DashboardView.vue"),
    },
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
      path: "/activities",
      name: "activities",
      component: () => import("../views/Activities/ActivitiesView.vue"),
    },
    {
      path: "/activity-tracking",
      name: "activity-tracking",
      component: () =>
        import("../views/ActivityTracking/ActivityTrackingView.vue"),
    },
    {
      path: "/deposits",
      name: "deposits",
      component: () => import("../views/Payments/PaymentsView.vue"),
    },
    {
      path: "/carrier",
      name: "carrier",
      component: () => import("../views/Carrier/CarrierView.vue"),
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: () => import("../views/ResetPasswordView.vue"),
    },
    {
      path: "/reset-password-confirm",
      name: "reset-password-confirm",
      component: () => import("../views/ResetPasswordConfirmView.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/Profile/ProfileView.vue"),
    },
  ],
});
router.beforeEach(async (to, from) => {
  if (
    !localStorage.getItem("do-more-token") &&
    to.name !== "sign-in" &&
    to.name !== "sign-up" &&
    to.name !== "reset-password" &&
    to.name !== "reset-password-confirm"
  ) {
    return { name: "sign-in" };
  }
});

export default router;
