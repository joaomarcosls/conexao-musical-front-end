  <template>
    <div class="card-dash">
      <div class="q-ml-sm q-py-sm">
      </div>
      <slot />
    </div>
  </template>
<script setup>
const props = defineProps({
  titulo_dash: String,
});
</script>
<style scoped>
.card-dash {
  @apply bg-slate-50 dark:bg-slate-800;
  border: 1px solid rgba(128, 128, 128, 0.294);
  border-radius: 5px;
  margin-bottom: 1rem;
}
</style>
