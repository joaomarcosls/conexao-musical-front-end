<template>
  <span></span>
</template>

<script setup>
import { onMounted } from 'vue';
import store from 'src/store/index';
import { useRouter } from 'app/node_modules/vue-router/dist/vue-router';

onMounted(() => {
  const id = window.sessionStorage.getItem('user_id');
  const token = window.sessionStorage.getItem('token');
  const $store = store();
  const $router = useRouter();

  $store
    .dispatch('auth/getUserAccessLevel', {
      id,
      token,
    })
    .then((res) => {
      // Redireciona conforme o nível de acesso retornado do getUserAccessLevel no actions do auth store
      switch (res) {
        case 'Administrador': {
          $router.push('/a/');
          break;
        }
        case 'Usuário': {
          $router.push('/u/');
          break;
        }
        default: {
          $router.push('/erro');
          console.log('erro no redirect');
          break;
        }
      }
    });
});
</script>
