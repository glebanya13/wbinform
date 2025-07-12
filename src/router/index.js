import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "../pages/HomePage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import BalancePage from "../pages/BalancePage.vue";
import CreateCampaingPage from "../pages/CreateCampaingPage.vue";
import CampaingsPage from "../pages/CampaingsPage.vue";
import CampaingPage from "../pages/CampaingPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home-page",
    component: HomePage,
    meta: { authRequired: true },
  },
  {
    path: "/profile",
    name: "profile-page",
    component: ProfilePage,
    meta: { authRequired: true },
  },
  {
    path: "/balance",
    name: "balance-page",
    component: BalancePage,
    meta: { authRequired: true },
  },
  {
    path: "/campaing/create",
    name: "create-campaign-page",
    component: CreateCampaingPage,
    meta: { authRequired: true },
  },
  {
    path: "/campaings",
    name: "campaings",
    component: CampaingsPage,
    meta: { authRequired: true },
  },
  {
    path: "/campaings/:id",
    name: "campaing-page:id",
    component: CampaingPage,
    props: true,
    meta: { authRequired: true },
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
