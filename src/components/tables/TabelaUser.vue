<template>
  <div class="row header_container q-py-xs q-mb-sm justify-end"
    style="border-top-left-radius: 5px; border-top-right-radius: 5px;">
    <div class="flex q-gutter-x-sm row col-lg-3 col-md-8 col-sm-8">
      <q-input class="search_bar" dense filled debounce="500" outlined v-model="filter" @blur="buscaDados"
        placeholder="Pesquisar">
        <template v-slot:append>
          <q-icon name="search" color="blue-grey-5" />
        </template>
      </q-input>
    </div>
    <q-btn class="btn-adicionar" icon="add_circle" v-if="rota_adicionar && botao" :to="routeHandler(rota_adicionar)">
      <span class="q-ml-xs" v-if="$q.screen.width >= 750">{{ botao }}</span>
    </q-btn>
  </div>
  <q-table class="custom-body" :title="titulo" :rows="dados" :columns="colunas" row-key="name" flat
    v-model:pagination="paginacao_inicial">
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="custom-header">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-if="acoes" v-slot:body-cell-acoes="props">
      <q-td auto-width class="q-pa-md q-gutter-sm text-right" :class="color_coluna_acoes">
        <q-fab v-if="exibe_fab && nivel == 'Administrador'" square outline color="blue-grey-5"
          icon="keyboard_arrow_left" padding="0" direction="left" title="Alterar Status" label="Alterar Status"
          size="sm">
          <q-fab-action square :color="mudarCor(status.label)" @click="confirmarMudarStatus(props.row.id, status.value)"
            :label="status.label" label-position="left" v-for="status in status_select" :key="status.id">
          </q-fab-action>
        </q-fab>
        <q-btn dense size="sm" v-for="acao in acoes" :key="acao.nome" :color="acao.cor" @click="acao.click(props.row)">
          <q-icon :name="acao.icone" />
        </q-btn>
      </q-td>
    </template>
    <template v-slot:body-cell-ativo="props">
      <q-td auto-width :props="props">
        <div>
          <q-badge :color="mudarCor(props.value)" :label="props.value" />
        </div>
        <div>
          {{ props.row.details }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-status_pagamento="props">
      <q-td auto-width :props="props">
        <div>
          <q-badge :color="mudarCor(props.value)" :label="props.value" />
        </div>
        <div>
          {{ props.row.details }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-nome_estabelecimento="props">
      <q-td style="text-align: left; width: 20%;">
        <q-avatar style="filter: drop-shadow(0px 0px 4px rgba(0, 0, 4, 0.4))
        ;" class="q-mr-sm" size="md">
          <img :src="props.row.img_logo">
        </q-avatar>
        {{ props.row.nome }}
      </q-td>
    </template>
    <template v-slot:body-cell-comercios="props">
      <q-td style="text-align: center; width: 7%">
        <div class="estabelecimento" v-if="props.row.usuarioEstabelecimento.length > 0">
          <q-badge v-for="(estabelecimento, index) in props.row.usuarioEstabelecimento
            .slice(0, 2)
            .map((item) => item.estabelecimento.nome)" :key="index" color="indigo-7" class="q-ma-xs flex">
            {{ estabelecimento }}
          </q-badge>
          <q-badge color="indigo-7" v-if="props.row.usuarioEstabelecimento.length > 2">...
            <q-tooltip anchor="center middle" class="text-tooltip" style="font-size: 0.9em" max-width="400px"
              :delay="500">
              <div v-for="estabelecimento in props.row.usuarioEstabelecimento.map(
                (item) => item.estabelecimento.nome
              )" :key="estabelecimento">
                {{ estabelecimento }}
              </div>
            </q-tooltip>
          </q-badge>
        </div>
        <div class="estabelecimento" v-if="props.row.usuarioEstabelecimento.length == 0">
          <q-badge color="red-7" class="q-ma-xs flex">
            Não atribuído
          </q-badge>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-usuarios="props">
      <q-td style="text-align: center; width: 7%" :class="color_coluna_usuarios">
        <div class="usuario" v-if="props.row.usuarioEstabelecimento.length > 0">
          <q-badge v-for="(usuario, index) in props.row.usuarioEstabelecimento
            .slice(0, 2)
            .map((item) => item.usuario.nome)" :key="index" color="indigo-7" class="q-ma-xs flex">
            {{ usuario }}
          </q-badge>
          <q-badge color="indigo-7" v-if="props.row.usuarioEstabelecimento.length > 2">...
            <q-tooltip anchor="center middle" class="text-tooltip" style="font-size: 0.9em" max-width="400px"
              :delay="500">
              <div v-for="usuario in props.row.usuarioEstabelecimento.map(
                (item) => item.usuario.nome
              )" :key="usuario">
                {{ usuario }}
              </div>
            </q-tooltip>
          </q-badge>
        </div>
        <div class="usuario" v-if="props.row.usuarioEstabelecimento.length == 0">
          <q-badge color="red-7" class="q-ma-xs flex">
            Não atribuído
          </q-badge>
        </div>
      </q-td>
    </template>
    <template v-slot:bottom>
      <div class="pagination_container">
        <q-pagination v-if="max_paginas > 1" @input="console.log(pagination.page)" v-model="pagination.page"
          color="white" active-text-color="primary" active-color="white" text-color="white" :max="max_paginas"
          :max-pages="max_paginas" direction-links size="md" />
      </div>
    </template>
  </q-table>
</template>
<style scoped>
.header_container {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
      gap: 1rem;
    }

.custom-header {
  @apply bg-indigo-100 text-indigo-950 dark:bg-zinc-900 dark:text-white px-4 py-5 text-sm font-semibold
}

.custom-body {
  @apply dark:bg-zinc-800;
}
.search_bar {
  flex: 1 1 0%;
}

.pagination_container {
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-adicionar {
  @apply dark:bg-zinc-600 bg-indigo-950 text-white;
  border-radius: 5px;
}
.actions_container {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import DashCardTitle from '../commons/DashCardTitle.vue';
import { defineProps, ref, watch, onMounted, nextTick } from 'vue';
import exibiNotificacao from 'src/assets/js/notificacao';
import routeHandler from 'src/assets/js/routeHandler';
import exibeMensagem from 'src/assets/js/mensagem';


const props = defineProps({
  colunas: Array,
  rota: String,
  nivel: String,
  status_usuario_select: {
    type: Array,
    default: () => [],
  },
  exibe_fab: {
    type: Boolean,
    default: false,
  },
  titulo_dash: String,
  exibe_dash: {
    type: Boolean,
    default: false,
  },
  cards: {
    type: Array,
    default: () => [],
  },
  color_coluna_acoes: String,
  color_coluna_usuarios: String,
  rota_adicionar: String,
  titulo: String,
  itensPorPagina: Number,
  acoes: {
    type: Array,
    default: () => [],
  },
  botao: {
    type: String,
    default: undefined,
  },
});

const color_coluna_acoes = ref(props.color_coluna_acoes);
const color_coluna_usuarios = ref(props.color_coluna_usuarios);
const status_select = ref(props.status_usuario_select);
const filter = ref('');
const $q = useQuasar();
const dados = ref([]);
const max_paginas = ref(0);
const rowsPerPage = ref(10);
const nivel = sessionStorage.getItem('access_level');
const paginacao_inicial = ref({
  page: 1,
  rowsPerPage: props.itensPorPagina,
});

const pagination = ref({
  rowsPerPage,
  maxPages: 0,
  page: paginacao_inicial.value.page,
  pageShow: 1,
});


function confirmarMudarStatus(id, statusValue) {
  const statusFormatado = statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
  exibeMensagem(
    `Deseja realmente alterar o status deste item para "${statusFormatado}"?`,
    'Confirmação',
    async () => {
      await mudarStatus(id, statusValue);
    }
  );
}

async function mudarStatus(id, statusValue) {
  try {
    const data = {
      status_pagamento: statusValue
    };
    const response = await api.patch(`usuarios/status/${id}`, data);
    buscaDados()
    console.log(response);
    if (response.status === 200) {
      exibiNotificacao('positive', `Status atualizado com sucesso!`, 'top', 3000);
      await buscaDados();
    }
  } catch (error) {
    exibiNotificacao('negative', 'Ocorreu um erro ao atualizar status', 'top');
  }
}

async function buscaDados() {
  $q.loading.show({
    message: 'Buscando informações no servidor...',
  });

  const pagina = pagination.value.page;

  const url = `${props.rota}/?pagina=${pagina}&itensPorPagina=${props.itensPorPagina}&busca=${filter.value}&nivel=${props.nivel}`;
  dados.value = [];

  try {
    const { data } = await api.get(url);
    dados.value = data.data;
    max_paginas.value = data.maxPag;
    $q.loading.hide();
  } catch (erro) {
    $q.loading.hide();
    exibiNotificacao('negative', erro.message, 'top');
  }

  return;
}

watch(() => props.rota, async (newRota, oldRota) => {
  if (newRota !== oldRota) {
    await buscaDados();
  }
});

function mudarCor(ativo) {
  switch (ativo) {
    case 'Disponível':
      return 'green-9';
    case 'Em dia':
      return 'teal-10';
    case 'Pendente':
    case 'Indisponível':
      return 'orange-9';
    case 'Ativo':
      return 'green-9';
    case 'Inativo':
      return 'red-9';
    case 'Atribuido':
      return 'blue-10';
    default:
      return 'grey';
  }
}


onMounted(() => {
  buscaDados();
});

watch(
  () => pagination,
  () => {
    nextTick(async () => {
      await buscaDados();
    });
  },
  { deep: true },
);

watch(filter, () => {
  nextTick(async () => {
    await buscaDados();
  });
});
</script>
