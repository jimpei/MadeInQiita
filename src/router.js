import Vue from "vue";
import Router from "vue-router";
import WelcomeView from "./views/WelcomeView.vue";
import firebase from "@firebase/app";
import "@firebase/auth";
import store from "./store";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "welcome",
      component: WelcomeView
    }
  ]
});
export default router;
