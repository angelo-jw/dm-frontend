<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped></style>
<template>
  <div>
    <h1 class="uppercase text-color font-bold text-center">{{ t('Activity tracking') }}</h1>
  </div>
</template>
