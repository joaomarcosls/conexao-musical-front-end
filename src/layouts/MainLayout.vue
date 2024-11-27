<template>
  <q-layout view="hHh Lpr lff" :class="{ 'dark': isDarkMode }">
    <q-header class="bg-indigo-950 shadow-md dark:bg-zinc-950">
      <q-toolbar class="flex justify-between px-6 py-2">
        <div class="w-1/4">
          <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        </div>
        <div class="w-1/4 flex justify-center">
          <img style="height: 5em;" class="logo-empresa" src="../assets/images/logo-header.png" alt="Logo">
        </div>
        <div class="header-acoes-right">
          <div>
            <q-btn flat round dense @click="toggleDarkMode">
              <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" class="text-white icon-transition" />
            </q-btn>
          </div>
          <div>
            <q-btn color="blue-600" class="text-white px-6" rounded icon="account_circle arrow_drop_down">
              <q-menu transition-show="scale" transition-hide="scale"
                class="w-32 dark:bg-indigo-800 dark:text-white text-indigo-800" anchor="bottom left" self="top left"
                :offset="[2, 2]">
                <q-item clickable tag="a" @click="perfil" exact class="flex items-center">
                  <q-icon class="mr-2" name="account_circle" size="sm" />
                  <q-item-section>Perfil</q-item-section>
                </q-item>
                <q-item clickable tag="a" @click="sair" exact class="flex items-center">
                  <q-icon class="mr-2" name="logout" size="sm" />
                  <q-item-section>Sair</q-item-section>
                </q-item>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="h-full">
      <div>
        <q-drawer v-model="leftDrawerOpen" :overlay="!modoExibicao" style="
        box-shadow: rgba(0, 0, 0, 0.12) 2.4px 2.4px 3.2px;
        " class="pt-0 bg-gradient-to-b from-indigo-100 to-indigo-200 dark:from-zinc-900 dark:to-indigo-950 py-4 px-3">
          <q-list dark separator>
            <div class="flex mt-4 mb-4 w-full ml-1">
              <img v-if="isDarkMode" style="width: 12em;" class="logo-empresa ml-3"
                src="../assets/images/logo-app.png" alt="Logo">
              <img v-if="!isDarkMode" style="width: 12em;" class="logo-empresa ml-3"
                src="../assets/images/logo-app-2.png" alt="Logo">
            </div>
            <q-select color="light-blue-9" v-if="nivel == 'Cliente'" class="pb-4" option-label="nome" dense filled
              @update:model-value="recarregarPagina" v-model="estabelecimentoSelecionado" emit-value label="Comércio"
              :dark="isDarkMode" behavior="menu" map-options transition-show="scale" transition-hide="scale"
              option-value="id" :options="estabelecimentos" stack-label>

              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" :class="{ 'dark:bg-gray-900': isDarkMode }">
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="scope.opt.img_logo" alt="Logo" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nome }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
              </template>

              <template v-slot:prepend>
                <q-avatar class="mr-2">
                  <img :src="logoEstabelecimento" alt="Estabelecimento Logo" />
                </q-avatar>
              </template>
            </q-select>
            <EssentialLink v-for="link in links" :key="link.title" v-bind="link" />
          </q-list>
        </q-drawer>
      </div>
      <router-view />
    </q-page-container>
    <q-footer class="footer">
      <span>Nota Mestre © 2024</span>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import EssentialLink from 'components/commons/EssentialLink.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';


const store = useStore();
const router = useRouter();
const $q = useQuasar();

const modoExibicao = $q.platform.is.desktop;
const estabelecimentoSelecionado = ref();
const logoEstabelecimento = ref();
const acesso = ref('');
const userName = ref('');
const nivel = ref('');
const links = ref([]);
const usuario_id = window.sessionStorage.getItem("user_id");
const id = usuario_id.slice(1, usuario_id.length - 1);
const estabelecimentos = ref([]);
const estabelecimento_id = '';
const isDarkMode = ref(false)

onMounted(() => {
  configurarMenu();
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    isDarkMode.value = storedTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode.value);
  }

  if (nivel.value == 'Cliente') {
    buscaEstabelecimentos(id).then(() => {
      defineEstabelecimento(estabelecimento_id);
    });
  }
});

function verifyDark() {
  if (isDarkMode.value) {
    $q.dark.set(true)
  } else {
    $q.dark.set(false)
  }
}

onMounted(() => {
  verifyDark();
}
)

watch(isDarkMode, () => {
  verifyDark()
});

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

async function buscaEstabelecimentos(id_user) {
  const { data } = await api.get(`estabelecimentos/usuario/${id_user}`);
  estabelecimentos.value = data;
  return data;
}

function defineEstabelecimento(estabelecimento_id) {
  estabelecimento_id = sessionStorage.getItem("estabelecimento_id");
  if (estabelecimento_id == null) {
    estabelecimentoSelecionado.value = estabelecimentos.value[0].id;
    logoEstabelecimento.value = estabelecimentos.value[0].img_logo;
    window.sessionStorage.setItem('estabelecimento_id', estabelecimentoSelecionado.value);
    estabelecimento_id = sessionStorage.getItem(estabelecimento_id);
  } else {
    estabelecimentoSelecionado.value = estabelecimento_id;
    logoEstabelecimento.value = estabelecimentos.value.find(estabelecimento => estabelecimento.id == estabelecimentoSelecionado.value).img_logo;
  }
}

watch(estabelecimentoSelecionado, async (newValue) => {
  if (newValue) {
    logoEstabelecimento.value = estabelecimentos.value.find(estabelecimento => estabelecimento.id == newValue).img_logo;
    window.sessionStorage.setItem('estabelecimento_id', newValue);
  }
});

function recarregarPagina() {
  window.location.reload();
}

function configurarMenu() {
  const accessLevel = window.sessionStorage.getItem('access_level');
  const user = window.sessionStorage.getItem('user');
  userName.value = user;
  nivel.value = accessLevel;
  if (accessLevel === 'Administrador') {

    links.value.push(
      {
        title: 'Dashboard',
        icon: 'la la-chart-pie',
        link: '/a/dashboard',
      },
      {
        title: 'Gerenciar Professores',
        icon: 'la la-school',
        link: '/a/professores',
      },
      {
        title: 'Gerenciar Alunos',
        icon: 'la la-user-graduate',
        link: '/a/alunos',
      },
      {
        title: 'Perfil',
        icon: 'la la-id-badge',
        link: `/perfil`,
      },
    );

    acesso.value = 'admin';
  } else if (accessLevel === 'Usuário') {
    links.value.push(
      {
        title: 'Perfil',
        icon: 'account_circle',
        link: `/perfil`,
      },
    );

    acesso.value = 'usuário';
  }
}
async function perfil() {
  router.push('/perfil');
}
async function sair() {
  router.push('/login');
  await store.dispatch('auth/signOut');
}

const leftDrawerOpen = ref(true);
</script>
<style scoped>

.header-acoes-right {
  @apply w-1/4 flex justify-end space-x-4;
}

.footer {
  @apply bg-slate-200 text-sky-950 dark:bg-zinc-950 dark:text-white text-center px-2 py-1 fixed inset-x-0 bottom-0;
}

.icon-transition {
  transition: transform 1s ease, opacity 1s ease;
}

.icon-transition:active {
  transform: rotate(360deg);
}

.logo-empresa {
  @apply drop-shadow-xl p-2
}
</style>
