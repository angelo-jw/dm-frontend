<script setup>
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";

import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import logo1 from "../assets/logo1.png";

import Avatar from "primevue/avatar";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const menu = [
  {
    href: "/",
    title: t("Dashboard"),
    icon: {
      element: "i",
      class: "pi pi-chart-line",
    },
  },
  {
    href: "/activity-tracking",
    title: t("Activity Tracking"),
    icon: {
      element: "i",
      class: "pi pi-list",
    },
  },
  {
    href: "/payments",
    title: t("Deposits"),
    icon: {
      element: "i",
      class: "pi pi-wallet",
    },
  },
  {
    href: "/carrier",
    title: t("Carrier"),
    icon: {
      element: "i",
      class: "pi pi-money-bill",
    },
  },
];
const logout = () => {
  localStorage.setItem("do-more-token", "");
  router.push("/sign-in");
};
</script>

<style scoped lang="less">
.sidebar-layout {
  :deep(.v-sidebar-menu.vsm_collapsed) {
    .footer-wrapper {
      display: none;
    }
  }
  :deep(.v-sidebar-menu) {
    background-color: white;
    box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.075);
    border-radius: 23px;
    .vsm--title {
      color: var(--text-color);
      font-size: 17px;
      span {
        font-weight: 600;
      }
    }
    .vsm--toggle-btn {
      background-color: white;
      color: var(--text-color);
      position: absolute;
      display: flex;
      justify-content: start !important;
      padding-left: 25px;
      height: 50px;
    }
    .vsm--icon {
      color: var(--text-color);
      background-color: transparent;
    }
    .vsm--menu li {
      &:first-child {
        margin-top: 49px;
      }
    }
    .vsm--item.vsm--item_mobile {
      .vsm--link.vsm--link_active.vsm--link_hover {
        .vsm--mobile-bg {
          background-color: var(--primary-color);
        }
        span {
          color: var(--text-color);
        }
      }
      .vsm--link_mobile.vsm--link_hover {
        .vsm--mobile-bg {
          background-color: var(--text-color);
        }
        span {
          color: white;
        }
      }
    }
    .vsm--item {
      .vsm--link_hover {
        background: var(--text-color);
        color: white;
        i,
        .vsm--title {
          color: white;
        }
      }

      .vsm--link.vsm--link_active {
        background-color: var(--primary-color);
        color: var(--text-color);
        i,
        .vsm--title {
          color: var(--text-color);
        }
      }
    }
    .footer-wrapper {
      .logo {
        width: 150px;
      }
      .logout-icon {
        transform: rotate(182deg);
      }
    }
  }
}
</style>
<template>
  <div class="grid grid-nogutter">
    <div class="sidebar-layout flex h-screen col-2">
      <SidebarMenu :menu="menu" class="h-full relative">
        <template v-slot:footer>
          <div class="footer-wrapper">
            <div class="flex justify-content-center relative mb-4">
              <img class="logo" :src="logo1" />
            </div>
            <div class="flex justify-content-around align-items-center mb-4">
              <Avatar
                image="https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png"
                class="cursor-pointer"
                size="large"
                shape="circle"
              />
              <div
                class="flex flex-column cursor-pointer align-items-center"
                @click="logout"
              >
                <font-awesome-icon
                  :icon="['fa', 'right-from-bracket']"
                  class="logout-icon fa-2x"
                />
                <small>{{ t("Logout") }}</small>
              </div>
              <div class="flex flex-column cursor-pointer align-items-center">
                <font-awesome-icon
                  :icon="['fa', 'circle-question']"
                  class="fa-2x"
                />
                <small class="text-color">{{ t("FAQs") }}</small>
              </div>
            </div>
          </div>
        </template>
      </SidebarMenu>
    </div>
    <div
      :class="{
        'col-10 px-3': true,
        blueBody: route.name == 'dashboard',
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>
