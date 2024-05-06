<script setup>
import { ref, onMounted, computed, reactive } from "vue";

import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import { useToast } from "primevue/usetoast";

import AuthLayout from "../layout/AuthLayout.vue";

import { useI18n } from "vue-i18n";
import { useVuelidate } from "../../node_modules/@vuelidate/core";
import {
  required,
  email,
  minLength,
} from "../../node_modules/@vuelidate/validators";
import { useRoute, useRouter } from "vue-router";

import { useAuthService } from "../services/AuthService";

const { t } = useI18n();
const toast = useToast();
const authService = useAuthService();
const route = useRoute();
const router = useRouter();

const formData = reactive({
  firstName: "",
  lastName: "",
  state: "",
  emailVal: "",
  password: "",
  isTermCondition: "",
});
const isLoading = ref(false);
const countries = ref([
  { text: "Alabama", value: "AL" },
  { text: "Alaska", value: "AK" },
  { text: "Arizona", value: "AZ" },
  { text: "Arkansas", value: "AR" },
  { text: "California", value: "CA" },
  { text: "Colorado", value: "CO" },
  { text: "Connecticut", value: "CT" },
  { text: "Delaware", value: "DE" },
  { text: "Florida", value: "FL" },
  { text: "Georgia", value: "GA" },
  { text: "Hawaii", value: "HI" },
  { text: "Idaho", value: "ID" },
  { text: "Illinois", value: "IL" },
  { text: "Indiana", value: "IN" },
  { text: "Iowa", value: "IA" },
  { text: "Kansas", value: "KS" },
  { text: "Kentucky", value: "KY" },
  { text: "Louisiana", value: "LA" },
  { text: "Maine", value: "ME" },
  { text: "Maryland", value: "MD" },
  { text: "Massachusetts", value: "MA" },
  { text: "Michigan", value: "MI" },
  { text: "Minnesota", value: "MN" },
  { text: "Mississippi", value: "MS" },
  { text: "Missouri", value: "MO" },
  { text: "Montana", value: "MT" },
  { text: "Nebraska", value: "NE" },
  { text: "Nevada", value: "NV" },
  { text: "New Hampshire", value: "NH" },
  { text: "New Jersey", value: "NJ" },
  { text: "New Mexico", value: "NM" },
  { text: "New York", value: "NY" },
  { text: "North Carolina", value: "NC" },
  { text: "North Dakota", value: "ND" },
  { text: "Ohio", value: "OH" },
  { text: "Oklahoma", value: "OK" },
  { text: "Oregon", value: "OR" },
  { text: "Pennsylvania", value: "PA" },
  { text: "Rhode Island", value: "RI" },
  { text: "South Carolina", value: "SC" },
  { text: "South Dakota", value: "SD" },
  { text: "Tennessee", value: "TN" },
  { text: "Texas", value: "TX" },
  { text: "Utah", value: "UT" },
  { text: "Vermont", value: "VT" },
  { text: "Virginia", value: "VA" },
  { text: "Washington", value: "WA" },
  { text: "West Virginia", value: "WV" },
  { text: "Wisconsin", value: "WI" },
  { text: "Wyoming", value: "WY" },
]);

const rules = {
  firstName: {
    required,
  },
  lastName: {
    required,
  },
  state: {
    required,
  },
  emailVal: {
    required,
    email,
  },
  password: {
    required,
    minLength: minLength(8),
  },
};

const v$ = useVuelidate(rules, formData);
const onSubmit = async (e) => {
  e.preventDefault();
  const result = await v$.value.$validate();
  if (result) {
    const { firstName, lastName, state, emailVal, password } = formData;
    try {
      isLoading.value = true;
      await authService.createUser({
        first_name: firstName,
        last_name: lastName,
        state: state,
        email: emailVal,
        password: password,
      });
      toast.add({
        severity: "",
        summary: `${t("Your account has been created")}.`,
        detail: `${t("You can Sign In now")}.`,
        sticky: true,
        styleClass: "success register-view-toast",
        closable: false,
        life: 5000,
      });
      router.push({ name: "sign-in" });
    } catch (err) {
      const { response } = err;
      toast.add({
        severity: "error",
        detail:
          response?.data?.message ||
          `${t("There was an error creating your account, please try again")}.`,
        sticky: true,
        styleClass: "error",
        closable: false,
        life: 3000,
      });
    } finally {
      isLoading.value = false;
    }
  }
};
function renderButton() {
  window.gapi.signin2.render("my-signin2", {
    scope: "profile email",
    width: 240,
    height: 50,
    longtitle: true,
    theme: "dark",
  });
}

onMounted(() => {
  let googleLink = document.createElement("script");
  googleLink.setAttribute(
    "src",
    `https://accounts.google.com/gsi/client?onload=${renderButton}`
  );
  document.head.appendChild(googleLink);
});
</script>

<style scoped lang="less">
.register-auth-layout {
  :deep(.p-checkbox .p-checkbox-box.p-highlight) {
    border-color: black;
    background: black;
    svg {
      color: white;
    }
  }
}
.term-condition-label {
  color: black !important;
  span {
    text-decoration: underline;
  }
}

@media (max-width: 600px) {
  .term-condition-label {
    font-size: 10px;
  }
}
</style>

<template>
  <AuthLayout class="register-auth-layout">
    <template v-slot:title>
      <div class="flex justify-content-center">
        <h6 class="mr-1">{{ t("Already have an account?") }}</h6>
        <br>
        <router-link to="/sign-in"
          ><h6 class="text-color font-bold">
            {{ t("Sign In Now") }}
          </h6></router-link
        >
      </div>
    </template>
    <template #content>
      <form @submit="onSubmit">
        <div class="flex flex-column gap-2">
          <div>
            <label
              for="firstName"
              class="text-color font-bold text-sm md:text-base"
              >{{ t("First Name") }}</label
            >
            <div>
              <div class="p-input-icon-left w-full">
                <i class="pi pi-user" style="color: #234a72"></i>
                <InputText
                  id="firstName"
                  v-model="formData.firstName"
                  :class="{ 'w-full h-2rem': true }"
                  :disabled="isLoading"
                  :placeholder="t('Enter your first name')"
                  aria-describedby="text-error"
                />
              </div>
              <h5 class="text-red-50" v-if="v$.firstName.$error">
                Firstname is required
              </h5>
            </div>
          </div>
          <div>
            <label
              for="firstName"
              class="text-color font-bold text-sm md:text-base"
              >{{ t("Last Name") }}</label
            >
            <div>
              <div class="p-input-icon-left w-full">
                <i class="pi pi-user" style="color: #234a72"></i>
                <InputText
                  id="lastName"
                  v-model="formData.lastName"
                  :class="{ 'w-full h-2rem': true }"
                  :disabled="isLoading"
                  :placeholder="t('Enter your last name')"
                  aria-describedby="text-error"
                />
              </div>
              <h5 class="text-red-50" v-if="v$.lastName.$error">
                Firstname is required
              </h5>
            </div>
          </div>
          <div>
            <label
              for="firstName"
              class="text-color font-bold text-sm md:text-base"
              >{{ t("State") }}</label
            >
            <div>
              <div class="relative w-full">
                <span class="pl-3 h-2rem flex align-items-center absolute z-1">
                  <font-awesome-icon
                    :icon="['fas', 'earth-americas']"
                    class="country-icon"
                  />
                </span>
                <Dropdown
                  v-model="formData.state"
                  class="w-full h-2rem d-flex align-items-center pl-5"
                  filter
                  optionLabel="text"
                  optionValue="value"
                  :disabled="isLoading"
                  :options="countries"
                  :placeholder="t('Enter your state')"
                />
              </div>
              <h5 class="text-red-50" v-if="v$.state.$error">
                State is required
              </h5>
            </div>
          </div>
          <div>
            <label
              for="username"
              class="text-color font-bold text-sm md:text-base"
              >{{ t("Email") }}</label
            >
            <div>
              <div class="p-input-icon-left w-full">
                <i class="pi pi-user" style="color: #234a72"></i>
                <InputText
                  id="email"
                  v-model="formData.emailVal"
                  :class="{ 'w-full h-2rem': true }"
                  :placeholder="t('Enter your email')"
                  :disabled="isLoading"
                  aria-describedby="text-error"
                />
              </div>
              <h5 class="text-red-50" v-if="v$.emailVal.email.$invalid">
                Your email is invalid
              </h5>
              <h5 class="text-red-50" v-else-if="v$.emailVal.$errors.length">
                Your email is required
              </h5>
            </div>
          </div>
          <div>
            <label
              for="password"
              class="text-color font-bold text-sm md:text-base"
              >{{ t("Password") }}</label
            >
            <div>
              <div class="p-input-icon-left w-full">
                <i class="pi pi-cog" style="color: #234a72"></i>
                <InputText
                  id="password"
                  class="w-full h-2rem"
                  v-model="formData.password"
                  type="password"
                  :disabled="isLoading"
                  :placeholder="t('Enter your password')"
                />
              </div>
              <h5 class="text-red-50" v-if="v$.password.minLength.$invalid">
                Your password must contain at least 8 characters
              </h5>
              <h5 class="text-red-50" v-else-if="v$.password.$errors.length">
                Your password is required
              </h5>
            </div>
          </div>
          <br>
          <div class="flex align-items-center">
            <Checkbox
              inputId="termCondition"
              v-model="formData.isTermCondition"
              :binary="true"
            />

            <label
              for="termCondition"
              class="term-condition-label ml-2 text-sm text-black"
            >
              {{ t("I have read and agreed to the") }}
              <span class="font-bold">{{ t("Terms and Conditions") }}</span>
            </label>
          </div>
          <Button
            class="flex justify-content-center h-2rem w-full"
            icon="pi pi-search"
            type="submit"
            :label="t('Sign Up')"
            :loading="isLoading"
          />
          <!-- <h6 class="text-color font-bold text-center">{{ t("Or") }}</h6> -->
          <!-- <div class="w-full">
            <div
              id="g_id_onload"
              data-client_id="908491129907-uv67o2msi9jbami9fi7ikfb4klc5a304.apps.googleusercontent.com"
              data-callback="handleCredentialResponse"
            ></div>
            <div class="g_id_signin" data-type="standard"></div>
          </div> -->
        </div>
      </form>
    </template>
  </AuthLayout>
</template>
