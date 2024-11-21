<template>
  <q-page>
    <card icone="la la-user-graduate" titulo="Alunos">
      <tabela-user
        title="Lista de alunos"
        :colunas="colunas"
        rota="usuarios"
        nivel="Aluno"
        rota_adicionar="/alunos/adicionar"
        botao="Adicionar Aluno"
        :acoes="acoes"
        :itensPorPagina="10"
      />
    </card>
  </q-page>
</template>

<script setup>
import exibeMensagem from "src/assets/js/mensagem";
import exibiNotificacao from "src/assets/js/notificacao";
import routeHandler from "src/assets/js/routeHandler";
import { api } from "src/boot/axios";
import Card from "src/components/commons/CardVue.vue";
import TabelaUser from "src/components/tables/TabelaUser.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const colunas = ref([
  {
    name: "nome",
    required: true,
    label: "Nome",
    align: "left",
    field: "nome",
    sortable: true,
  },
  {
    name: "login",
    align: "center",
    label: "Login",
    field: "login",
    sortable: true,
  },
  {
    name: "nivel",
    align: "center",
    label: "Nível",
    field: "nivel",
    sortable: true,
  },
  {
    name: "situacao",
    align: "center",
    label: "Situação",
    field: "situacao",
    sortable: true,
  },
  {
    name: "acoes",
    field: "acoes",
    align: "center",
    label: "Ações",
    sortable: true,
  },
]);

async function deleta(usuario) {
  try {
    const { status } = await api.delete(`usuarios/${usuario.id}`);
    const recarregar = () => location.reload()

    if (status == 200) {
      exibiNotificacao(
        "positive",
        `${usuario.nome} removido(a) com sucesso!`,
        "top",
        3000,
      );
      setTimeout(recarregar, 1000)
    }
  } catch (error) {
    exibiNotificacao("negative", error.response.data.message, "top", 3000);
  }
}

const acoes = ref([
  {
    nome: "Editar",
    cor: "warning",
    icone: "edit",
    click(row) {
      router.push(routeHandler("/alunos/editar/" + row.id));
    },
  },
  {
    nome: "Deletar",
    cor: "negative",
    icone: "delete",
    click(row) {
      const msg = `Tem certeza que deseja excluir ${row.nome}?`;
      const acao = () => deleta(row);
      const btn = "Sim, excluir";
      exibeMensagem(msg, btn, acao);
    },
  },
]);
</script>
