<template>
  <q-item v-if="!linksListSubMenu" clickable tag="router-link" :to="link" :active="isActive" active-class="active-link"
    class="link-item">
    <q-item-section v-if="icon" avatar>
      <q-icon class="icon" :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="link">{{ title }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-expansion-item v-else :icon="icon" :label="title" :default-opened="isActive">
    <q-list class="q-pl-lg">
      <q-item v-for="linkSubmenu in linksListSubMenu" :key="linkSubmenu.link" clickable tag="router-link"
        :to="linkSubmenu.link" :active="isSubMenuActive(linkSubmenu.link)" active-class="active-link">
        <q-item-section avatar>
          <q-icon :name="linkSubmenu.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ linkSubmenu.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRoute } from 'vue-router';

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "#",
    },
    icon: {
      type: String,
      default: "",
    },
    linksListSubMenu: {
      type: Array,
      required: false,
    },
    activePaths: {
      type: Array,
      default: () => [],
    },
    excludePaths: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const route = useRoute();

    const isActive = computed(() => {
      if (props.link === '/') {
        return route.path === '/';
      }

      if (props.activePaths.length > 0) {
        return props.activePaths.some(path => route.path.startsWith(path));
      }
      if (props.excludePaths.some(path => route.path.startsWith(path))) {
        return false;
      }

      return route.path.startsWith(props.link);
    });

    const isSubMenuActive = (subMenuLink) => {
      return route.path.startsWith(subMenuLink);
    };

    return {
      isActive,
      isSubMenuActive
    };
  }
});
</script>

<style scoped>
.link-item {
  @apply border-none !important;
  transition: 0.6s !important;
}

.link-item:hover {
  @apply rounded-lg bg-indigo-200 dark:bg-zinc-800 !important;
  transition: 0.6s;
}

.icon {
  @apply text-indigo-950 dark:text-zinc-200;
  transition: 0.6s;
}

.link {
  @apply text-indigo-950 dark:text-zinc-200;
  transition: 0.6s;
}

.active-link {
  @apply bg-indigo-950 rounded-lg;
  transition: 0.6s;
}

.active-link .icon {
  @apply text-white;
}
.active-link .link {
  @apply text-white;
}
</style>
