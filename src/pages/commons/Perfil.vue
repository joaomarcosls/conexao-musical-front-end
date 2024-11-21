<template>
  <q-page>
    <card icone="manage_accounts" titulo="Perfil">
      <formulario-usuario
        :usuarioId="id"
        :administrador="administrador"
        enviarBotao="Salvar"
        @submit="onSubmit"
      ></formulario-usuario>
    </card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Card from "src/components/commons/CardVue.vue";
import FormularioUsuario from "src/components/forms/FormularioUsuario.vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import exibiNotificacao from "src/assets/js/notificacao";

const $q = useQuasar();

const usuario_id = window.sessionStorage.getItem("user_id");
const id = usuario_id.slice(1, usuario_id.length - 1);

const administrador =
  window.sessionStorage.getItem("access_level") == "Administrador" ? true : false;

async function editaDados(dados) {
  try {
    const data = { ...dados };

    if(data.senha === ''){
      delete data.senha;
    }

    const { status } = await api.put(`usuarios/${id}`, data);

    if (status == 200)
      exibiNotificacao("positive", "Usuário atualizado com sucesso!", "top",);
  } catch (error) {
    exibiNotificacao("negative", error.response.data.message, "top");
  }
}

function onSubmit(dados) {
  editaDados(dados);
}
</script>
