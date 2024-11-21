<template>
  <main class="row fullscreen main">
    <div class="col-8 p-10 rounded-lg border border-indigo-400">
      <formulario-register
        enviarBotao="Cadastrar"
        exibirBotaoVoltar="true"
        :administrador="true"
        @submit="onSubmit"
      ></formulario-register>
    </div>
  </main>
</template>

<script setup>
import FormularioRegister from "src/components/forms/FormularioRegister.vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import exibiNotificacao from "src/assets/js/notificacao";

const $q = useQuasar();

const router = useRouter();

async function salvaDados(dados) {
  $q.loading.show({
    message: "Enviando informações ao servidor...",
  });

  try {
    const data = { ...dados };
    const { status } = await api.post("usuarios/register", data);

    if (status == 201) {
      $q.loading.hide();
      exibiNotificacao("positive", "Cadastro realizado com sucesso!", "top");
      router.push("/login");
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

<style scoped>
.main {
  @apply flex flex-col items-center justify-center;
  background-image:
    linear-gradient(to bottom,
      rgb(25, 3, 43),
      rgb(2, 4, 7)) !important;
  background-repeat: no-repeat;
  background-position: left;
  background-size: cover;
}
</style>
