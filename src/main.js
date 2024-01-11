import "./assets/main.less";

import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import App from "./App.vue";
import router from "./router";
import i18n_en from "../i18n_en";
import icons from "./font-awesome-icons";

import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";

icons.forEach((icon) => library.add(icon));
const i18n = createI18n({
  locale: "en",
  legacy: false,
  allowComposition: true,
  messages: {
    en: i18n_en,
  },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
