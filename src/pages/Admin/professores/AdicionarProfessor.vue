<template>
  <q-page>
    <cti-card titulo="Adicionar Professor" icone="person_add">
      <formulario-professor
        enviarBotao="Salvar"
        exibirBotaoVoltar="true"
        :administrador="true"
        @submit="onSubmit"
      ></formulario-professor>
    </cti-card>
  </q-page>
</template>

<script setup>
import Card from "src/components/commons/CardVue.vue";
import FormularioProfessor from "src/components/forms/FormularioProfessor.vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import exibiNotificacao from "src/assets/js/notificacao";
import routeHandler from "src/assets/js/routeHandler";

const $q = useQuasar();

const router = useRouter();

async function salvaDados(dados) {
  $q.loading.show({
    message: "Enviando informações ao servidor...",
  });

  try {
    const data = { ...dados };
    const { status } = await api.post("usuarios", data);

    if (status == 201) {
      exibiNotificacao("positive", "Professor cadastrado com sucesso!", "top");

      router.push(routeHandler("/professores"));
    }
  } catch (error) {
    $q.loading.hide();
    exibiNotificacao("negative", error.response.data.message, "top");
  }
}

async function onSubmit(dados) {
  salvaDados(dados);
}
</script>
