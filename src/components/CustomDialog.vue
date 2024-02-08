<script setup>
import Dialog from "primevue/dialog";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: "",
  },
  customStyle: {
    type: Object,
    default: () => ({ width: "30rem" }),
  },
});
const emit = defineEmits(["onGetPage", "onChangeVisibleState", "onShow"]);
</script>
<style lang="less">
.custom-dialog {
  background: black;
  .p-dialog-header {
    display: flex;
    justify-content: center;
    background-color: var(--light-blue);
    button.p-dialog-header-icon.p-dialog-header-close.p-link {
      position: absolute;
      right: 17px;
    }
    .p-dialog-title {
      font-weight: bold;
      text-transform: uppercase;
      color: var(--text-color);
    }
  }
  .p-dialog-content {
    background-color: var(--light-blue);
  }
}
</style>
<template>
  <Dialog
    :visible="props.visible"
    :class="`${props.customClass} custom-dialog`"
    :style="{ ...props.customStyle }"
    :dismissableMask="true"
    @show="emit('onShow')"
    ><slot></slot>
    <template #closeicon>
      <i
        class="pi pi-times-circle"
        @click="emit('onChangeVisibleState', false)"
      ></i>
    </template>
  </Dialog>
</template>
