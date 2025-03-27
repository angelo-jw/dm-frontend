<script setup>
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import AuthLayout from "../layout/AuthLayout.vue";
import { useI18n } from "vue-i18n";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { useAuthService } from "../services/AuthService";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const authService = useAuthService();

const emailVal = ref("");
const isLoading = ref(false);

const rules = {
  emailVal: { required, email },
};

const v$ = useVuelidate(rules, { emailVal });

const onSubmit = async (e) => {
  e.preventDefault();
  const result = await v$.value.$validate();
  if (result) {
    try {
      isLoading.value = true;
      
      await authService.requestPasswordReset(emailVal.value);
      
      toast.add({
        severity: "success",
        detail: t("If an account exists with this email, password reset instructions have been sent"),
        life: 5000,
      });
      
      router.push({ name: "sign-in" });
    } catch (err) {
      if (err?.response?.status !== 404) {
        toast.add({
          severity: "error",
          detail: t("There was a problem processing your request. Please try again later."),
          life: 3000,
        });
      } else {
        toast.add({
          severity: "success",
          detail: t("If an account exists with this email, password reset instructions have been sent"),
          life: 5000,
        });
        
        setTimeout(() => {
          router.push({ name: "sign-in" });
        }, 1500);
      }
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<template>
  <AuthLayout>
    <template v-slot:title>
      <div class="flex justify-content-center">
        <h5>{{ t("Reset Password") }}</h5>
      </div>
    </template>
    <template #content>
      <form @submit="onSubmit">
        <div class="flex flex-column gap-2">
          <p>{{ t("Enter your email address to receive password reset instructions") }}</p>
          <label for="email" class="text-color font-bold text-sm md:text-base">{{ t("Email") }}</label>
          <div>
            <div class="p-input-icon-left w-full">
              <i class="pi pi-user" style="color: #234a72"></i>
              <InputText
                id="email"
                v-model="emailVal"
                class="w-full h-2rem"
                :placeholder="t('Enter your email')"
                :disabled="isLoading"
              />
            </div>
            <h5 class="text-red-50" v-if="v$.emailVal.email.$invalid">
              Your email is invalid
            </h5>
            <h5 class="text-red-50" v-else-if="v$.emailVal.$errors.length">
              Your email is required
            </h5>
          </div>
          <Button
            class="flex justify-content-center h-2rem mt-3"
            type="submit"
            :loading="isLoading"
            :label="t('Send Reset Instructions')"
          />
          <div class="flex justify-content-center mt-3">
            <router-link to="/sign-in" class="text-color">
              {{ t('Back to Login') }}
            </router-link>
          </div>
        </div>
      </form>
    </template>
  </AuthLayout>
</template>