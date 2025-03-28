<script setup>
import { ref, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import AuthLayout from "../layout/AuthLayout.vue";
import { useI18n } from "vue-i18n";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, sameAs } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";
import { useRouter, useRoute } from "vue-router";
import { useAuthService } from "../services/AuthService";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const authService = useAuthService();

const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const isValidToken = ref(true);
const token = ref(route.query.token || "");

const rules = {
  password: { 
    required, 
    minLength: minLength(8) 
  },
  confirmPassword: { 
    required,
    sameAsPassword: sameAs(password) 
  }
};

const v$ = useVuelidate(rules, { password, confirmPassword });

onMounted(async () => {
  if (!token.value) {
    isValidToken.value = false;
    toast.add({
      severity: "error",
      detail: t("Invalid or expired password reset link. Please request a new one."),
      life: 5000,
    });
    setTimeout(() => {
      router.push({ name: "reset-password" });
    }, 2000);
    return;
  }
  
  try {
    await authService.verifyResetToken(token.value);
  } catch (err) {
    isValidToken.value = false;
    toast.add({
      severity: "error",
      detail: t("Invalid or expired password reset link. Please request a new one."),
      life: 5000,
    });
    setTimeout(() => {
      router.push({ name: "reset-password" });
    }, 2000);
  }
});

const onSubmit = async (e) => {
  e.preventDefault();
  const result = await v$.value.$validate();
  if (result) {
    try {
      isLoading.value = true;
      
      await authService.resetPassword(token.value, password.value);
      
      toast.add({
        severity: "success",
        detail: t("Your password has been reset successfully"),
        life: 5000,
      });
      
      router.push({ name: "sign-in" });
    } catch (err) {
      toast.add({
        severity: "error",
        detail: t("There was a problem resetting your password. Please try again."),
        life: 3000,
      });
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
        <h5>{{ t("Set New Password") }}</h5>
      </div>
    </template>
    <template #content>
      <div v-if="!isValidToken" class="flex flex-column align-items-center">
        <p>{{ t("This password reset link is invalid or has expired") }}</p>
        <p>{{ t("Please request a new password reset link") }}</p>
        <Button
          class="mt-3"
          @click="router.push({ name: 'reset-password' })"
          :label="t('Request New Link')"
        />
      </div>
      <form v-else @submit="onSubmit">
        <div class="flex flex-column gap-2">
          <label for="password" class="text-color font-bold text-sm md:text-base">
            {{ t("New Password") }}
          </label>
          <div>
            <div class="p-input-icon-left w-full">
              <i class="pi pi-lock" style="color: #234a72"></i>
              <InputText
                id="password"
                type="password"
                v-model="password"
                class="w-full h-2rem"
                :placeholder="t('Enter your new password')"
                :disabled="isLoading"
              />
            </div>
            <h5 class="text-red-50" v-if="v$.password.minLength.$invalid">
              {{ t("Password must be at least 8 characters") }}
            </h5>
            <h5 class="text-red-50" v-else-if="v$.password.$errors.length">
              {{ t("Password is required") }}
            </h5>
          </div>
          
          <label for="confirmPassword" class="text-color font-bold text-sm md:text-base">
            {{ t("Confirm Password") }}
          </label>
          <div>
            <div class="p-input-icon-left w-full">
              <i class="pi pi-lock" style="color: #234a72"></i>
              <InputText
                id="confirmPassword"
                type="password"
                v-model="confirmPassword"
                class="w-full h-2rem"
                :placeholder="t('Confirm your new password')"
                :disabled="isLoading"
              />
            </div>
            <h5 class="text-red-50" v-if="v$.confirmPassword.sameAsPassword.$invalid">
              {{ t("Passwords don't match") }}
            </h5>
            <h5 class="text-red-50" v-else-if="v$.confirmPassword.$errors.length">
              {{ t("Please confirm your password") }}
            </h5>
          </div>
          
          <Button
            class="flex justify-content-center h-2rem mt-3"
            type="submit"
            :loading="isLoading"
            :label="t('Reset Password')"
          />
        </div>
      </form>
    </template>
  </AuthLayout>
</template>