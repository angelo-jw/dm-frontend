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
      component: () =>
        import("../views/ActivityTracking/ActivityTrackingView.vue"),
    },
    {
      path: "/payments",
      name: "payments",
      component: () => import("../views/Payments/PaymentsView.vue"),
    },
    {
      path: "/carrier",
      name: "carrier",
      component: () => import("../views/Carrier/CarrierView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/Dashboard/DashboardView.vue"),
    },
  ],
});
router.beforeEach(async (to, from) => {
  if (!localStorage.getItem("do-more-token") && to.name !== "sign-in") {
    return { name: "sign-in" };
  }
});

export default router;
