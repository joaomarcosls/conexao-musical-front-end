<template>
  <q-page>
    <card icone="manage_accounts" titulo="Editar professor">
      <formulario-professor
        :usuarioId="id"
        :administrador="true"
        enviarBotao="Salvar"
        exibirBotaoVoltar="true"
        @submit="onSubmit"
      ></formulario-professor>
    </card>
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import Card from "src/components/commons/CardVue.vue";
import FormularioProfessor from "src/components/forms/FormularioProfessor.vue";
import { useQuasar } from "quasar";
import exibiNotificacao from "src/assets/js/notificacao";
import routeHandler from "src/assets/js/routeHandler";

const $q = useQuasar();

const route = useRoute();
const router = useRouter();

const { id } = route.params;

async function editarDados(dados) {
  $q.loading.show({
    message: "Buscando informações no servidor...",
  });
  try {
    const data = { ...dados };

    if(data.senha === ''){
      delete data.senha;
    }
    const { status } = await api.put(`usuarios/${id}`, data);

    if (status == 200) {
      exibiNotificacao("positive", "Professor atualizado com sucesso!", "top");
      router.push(routeHandler("/professores"));
    }
  } catch (error) {
    exibiNotificacao("negative", error.response.data.message, "top");
  } finally {
    $q.loading.hide();
  }
}

function onSubmit(data) {
  editarDados(data);
}
</script>
