<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin card">
      <q-card-section align="center" class="colum items-center justify-between text-center">
        <q-avatar icon="la la-exclamation-triangle" color="orange-10" text-color="white" />
        <div class="text-h6">{{ mensagem }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center">
        Ao confirmar essa ação, você não poderá desfazê-la.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn class="bg-slate-600 text-white" unelevated :label="botao" v-close-popup @click="acao" />
        <q-btn outline label="Não" v-close-popup @click="cancela" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  mensagem: {
    type: String,
    required: true,
  },
  botao: {
    type: String,
    required: true,
  },
  acao: {
    type: Function,
    required: true,
  },
  cancela: {
    type: Function,
    required: false,
  },
});
</script>
<style scoped>
.card {
  @apply dark:bg-slate-700 bg-slate-50;
}
</style>
