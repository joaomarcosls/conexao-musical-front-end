<template>
  <q-page>
    <card titulo="Adicionar Aluno" icone="person_add">
      <formulario-aluno
        enviarBotao="Salvar"
        exibirBotaoVoltar="true"
        :administrador="true"
        @submit="onSubmit"
      ></formulario-aluno>
    </card>
  </q-page>
</template>

<script setup>
import Card from "src/components/commons/CardVue.vue";
import FormularioAluno from "src/components/forms/FormularioAluno.vue";
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
      exibiNotificacao("positive", "Aluno cadastrado com sucesso!", "top");

      router.push(routeHandler("/alunos"));
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
