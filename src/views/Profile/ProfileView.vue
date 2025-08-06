<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useAuthService } from "@/services/AuthService";
import { useUserService } from "../../services/UserService";
import { useToast } from "primevue/usetoast";

const { t } = useI18n();
const authService = useAuthService();
const userService = useUserService();
const toast = useToast();

const user = ref({
    firstName: "",
    lastName: "",
    email: "",
});

onMounted(async() => {
    try {
        const response = await authService.getCurrentUser();
        user.value = {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
        };
    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to load user data",
            life: 3000,
        });
    }
});

const updateProfile = async () => {
    try {
        await userService.updateCurrentUser({
            first_name: user.value.firstName,
            last_name: user.value.lastName,
        });
        toast.add({
            severity: "success",
            summary: "Success",
            detail: t("Profile updated successfully"),
            life: 3000,
        });
    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: t("Failed to update profile"),
            life: 3000,
        });
    }
}
</script>

<template>
    <div class="profile-view">
        <h1>{{  t("User Profile") }}</h1>
        <div class="p-card">
            <div class="p-card-body">
                <form @submit.prevent="updateProfile">
                    <div class="p-fluid">
                        <div class="p-field">
                            <label for="firstName">{{  t("First Name") }}</label>
                            <InputText id="firstName" v-model="user.firstName"/>
                        </div>
                        <div class="p-field">
                            <label for="lastName">{{  t("Last Name") }}</label>
                            <InputText id="lastName" v-model="user.lastName"/>
                        </div>
                        <div class="p-field">
                            <label for="email">{{  t("Email") }}</label>
                            <InputText id="email" v-model="user.email" disabled/>
                        </div>
                        <Button type="submit" :label="t('Update Profile')" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-view {
    padding: 2rem;
}
.p-card {
    margin-top: 2rem;
}
.p-field {
    margin-bottom: 1rem;
}
</style>
