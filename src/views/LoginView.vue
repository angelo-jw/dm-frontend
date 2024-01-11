<script setup>
import { ref, onMounted, computed } from "vue";

import InputText from "primevue/inputtext";
import Button from "primevue/button";

import AuthLayout from "../layout/AuthLayout.vue";

import { useI18n } from "vue-i18n";
import { useVuelidate } from "../../node_modules/@vuelidate/core";
import {
  required,
  email,
  maxLength,
  minLength,
} from "../../node_modules/@vuelidate/validators";

const { t } = useI18n();

const emailVal = ref("");
const password = ref("");

const rules = computed(() => {
  return {
    emailVal: {
      required,
      email,
    },
    password: {
      required,
      maxLength: maxLength(12),
      minLength: minLength(8),
    },
  };
});

const v$ = useVuelidate(rules, { emailVal, password });

const onSubmit = async (e) => {
  e.preventDefault();
  // const result = await v$.value.$validate()
};

onMounted(() => {
  let googleLink = document.createElement("script");
  googleLink.setAttribute("src", "https://accounts.google.com/gsi/client");
  document.head.appendChild(googleLink);
});
</script>

<template>
  <AuthLayout>
    <template v-slot:title>
      <div class="flex justify-content-center">
        <h6 class="mr-1">{{ t("Don't have an account ?") }}</h6>
        <router-link to="/sign-up"
          ><h6 class="text-color font-bold">
            {{ t("Sign Up Now") }}
          </h6></router-link
        >
      </div>
    </template>
    <template #content>
      <form @submit="onSubmit">
        <div class="flex flex-column gap-2">
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
                :class="{ 'w-full h-2rem': true }"
                v-model="emailVal"
                :placeholder="t('Enter your email')"
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
                v-model="password"
                :placeholder="t('Enter your password')"
                type="password"
              />
            </div>
            <h5 class="text-red-50" v-if="v$.password.maxLength.$invalid">
              Your password should less or equal than 12
            </h5>
            <h5 class="text-red-50" v-if="v$.password.minLength.$invalid">
              Your password must contain at least 8 characters
            </h5>
            <h5 class="text-red-50" v-else-if="v$.password.$errors.length">
              Your password is required
            </h5>
          </div>
          <!-- <div class="flex">
              <Checkbox inputId="termCondition" v-model="isTermCondition" />

              <label for="termCondition" class="ml-2 text-sm text-black">
                {{ t('I have read and agreed to the') }}
                <span>{{ t('Terms and Conditions') }}</span>
              </label>
            </div> -->
          <Button class="flex justify-content-center h-2rem" type="submit"
            >Login now</Button
          >
          <div>
            <div
              id="g_id_onload"
              data-client_id="908491129907-uv67o2msi9jbami9fi7ikfb4klc5a304.apps.googleusercontent.com"
              data-callback="handleCredentialResponse"
            ></div>
            <div class="g_id_signin" data-type="standard"></div>
          </div>
        </div>
      </form>
    </template>
  </AuthLayout>
</template>
