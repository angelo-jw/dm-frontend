<script setup>
import { onMounted } from "vue";
import logo1 from "../assets/logo1.png";
import Card from "primevue/card";

onMounted(() => {
  let googleLink = document.createElement("script");
  googleLink.setAttribute("src", "https://accounts.google.com/gsi/client");
  document.head.appendChild(googleLink);
});
</script>

<template>
  <div class="login-view-wrapper">
    <div class="wrapper-logo">
      <img class="logo" :src="logo1" />
    </div>
    <Card class="login-card">
      <template #title>
        <slot name="title"></slot>
      </template>
      <template #content>
        <slot name="content"></slot>
      </template>
    </Card>
    <div class="legal-container">
      <h6 class="legal-text">Wetmore Enterprises @ 2024</h6>
      <div class="legal-links">
        <h6>Terms of use</h6>
        <h6>License Agreement</h6>
        <h6>Privacy Policy</h6>
        <h6>Copyright Information</h6>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-view-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-image: url("../assets/success.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow: hidden;
  width: 100%;
  height: 100vh; /* Ensures the wrapper fits the viewport height */

  .logo {
    max-width: 300px; /* Limits maximum width */
    max-height: 300px; /* Limits maximum height */
    width: auto; /* Adjusts width automatically to maintain aspect ratio */
    height: auto; /* Adjusts height automatically to maintain aspect ratio */
    margin-left: 20rem; /* Margin from the left border */
  }

  .login-card {
    background-color: var(--primary-color);
    width: 25rem; /* Reduced width for the card */
    margin-right: 15rem; /* Margin from the right border */
  }

  .legal-container {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 15px;
    text-align: center;
    color: white;

    .legal-text {
      margin-bottom: 10px;
    }

    .legal-links h6 {
      display: none;
      margin-right: 10px;
    }
  }
}

@media (max-width: 1200px) {
  .login-view-wrapper {
    flex-direction: column;
    background-image: url("../assets/breakdown_image.jpg");
    background-position: left;
    padding-left: 15rem; /* Adjusted to account for the 10px design and a little extra space */
    justify-content: center; /* This will vertically center the contents */
    align-items: center; /* This will horizontally center the contents in the available space, excluding the 10px design */

    .logo {
      max-width: 200px;
      max-height: 200px;
      margin: 0 0 20px 0; /* Adjusted margins to remove 'auto' which centers logo across full width */
      margin-left: 30px;
    }

    .login-card {
      width: 50%; /* Adjust width for smaller screens */
      margin-bottom: 10px; /* Small margin from the logo */
      margin-left: 15rem;
    }
    .legal-links {
      display: none; /* Hides the legal links on very small screens */
    }
    .legal-text {
      color: black;
    }

  }
  
}
@media (max-width: 800px) {
  .login-view-wrapper {
    flex-direction: column;
    background-image: none;
    background-color: white; /* Plain white background for mobile */
    padding: 20px; /* Padding for some breathing room */
    justify-content: center;
    align-items: center;

    .logo {
      width: 90%; /* Slightly reduce width to not be too overwhelming */
      margin: 10px 0 20px 30px; /* Reset margins to ensure vertical centering */
      
    }

    .login-card {
      width: 80%; /* Slightly reduce width to not be too overwhelming */
      margin: 0 0 20px 0; /* Reset margins to ensure vertical centering */
    }

    .legal-links {
      display: none; /* Hides the legal links on very small screens */
    }

    .legal-text {
      color: black;
    }
  }
}
</style>
