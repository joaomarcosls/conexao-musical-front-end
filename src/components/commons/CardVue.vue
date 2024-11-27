<template>
  <div class="flex flex-col h-full">
    <q-card-section
      class="row text-blue-950 bg-indigo-100 dark:text-zinc-200 dark:bg-zinc-800 q-py-sm flex justify-between sec-header">
      <div class="flex items-center" style="font-size: 1.1em;">
        <q-icon size="sm" :name="icone" />
        <div class="q-ml-sm">{{ titulo }}</div>
      </div>
      <slot name="button" />
    </q-card-section>

    <q-separator />
    <div class="q-pa-md h-full">
      <slot />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
export default defineComponent({
  props: ["titulo", "icone"],
  setup() {
    const $q = useQuasar();
  },
});
</script>

