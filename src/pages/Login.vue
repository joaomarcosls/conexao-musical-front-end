<template>
  <main class="row fullscreen">
    <div class="col-xs-12 flex card-left flex-center col-md-5">
      <div>
        <div class="row text-center">
          <div class="col-12 q-mb-xl justify-center flex">
            <img class="logo" src="../assets/images/logo-app.png" alt />
          </div>
        </div>
        <div class="row justify-center">
          <q-form ref="form" class="w-full flex flex-center" @submit.prevent.stop="onSubmit">
            <div class="row form-container">
              <div class="col-12 q-mb-xs">
                <q-input rounded standout dense ref="username" label="Usuário" name="usuario" type="text"
                  v-model="data.username" lazy-rules :rules="usernameRules" />
              </div>
              <div class="col-12 q-mb-md">
                <q-input rounded standout label="Senha" ref="password" dense name="password" type="password"
                  v-model="data.password" :rules="passwordRules" />
              </div>
              <div class="col-12">
                <q-btn rounded standout class="text-font full-width bg-indigo-800" type="submit"
                  label="Entrar" />
              </div>
              <div class="col-12 text-center mt-10">
                <span class="text-font xs:text-sm sm:text-base">
                  Não possui uma conta?
                  <router-link :to="{ name: 'register' }" class="text-indigo-400 font-bold">
                    Cadastre-se
                  </router-link>
                </span>
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </div>
    <div class="aside col-xs-0 col-md-7 column justify-end">
      <div style="width: 100%;" class="flex flex-center q-mb-md">
      </div>
    </div>
  </main>
</template>

<script>
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';


export default defineComponent({
  ...mapGetters('auth', ['isAuthenticated']),
  name: 'PageLogin',
  setup() {
    const $q = useQuasar()
    $q.dark.set(true)
  },
  data() {
    return {
      data: {
        username: '',
        password: '',
      },
      app_name: process.env.APP_NAME,
      usernameRules: [
        (val) => (val && val.length > 0) || 'Digite o seu nome de usuário',
        (val) =>
          this.validaNome(val) ||
          "*Proibido o uso dos seguintes caracteres [!@#$%*()_+=-?°``''~©,.;<>:], valores numéricos ou espaços",
      ],
      passwordRules: [(val) => (val && val.length > 0) || 'Digite a sua senha'],
    };
  },
  beforeMount() {
    if (this.isAuthenticated) {
      this.$router.push('/a/dashboard');
    } else {
      this.$router.push('/a/dashboard');
    }
  },
  methods: {
    ...mapActions('auth', ['doLogin']),
    async onSubmit() {
      this.$refs.username.validate();
      this.$refs.password.validate();

      if (this.$refs.username.hasError || this.$refs.password.hasError) {
        this.$q.notify({
          icon: 'error',
          position: 'top',
          color: 'negative',
          message: 'Você precisa preencher os campos em vermelho',
        });
      } else {
        try {
          await this.doLogin(this.data);
          const isAdmin = this.$store.getters['auth/isAdmin'];
          console.log(isAdmin);
          this.$router.push("/a/dashboard");
        } catch (err) {
          if (err.message) {
            this.$q.notify({
              icon: 'error',
              position: 'top',
              color: 'negative',
              message: err.response.data.message,
            });
          }
        }
      }
    },
    validaNome(val) {
      const regexTexto = /[^a-zA-Zs]/g;

      return !regexTexto.test(val);
    },
  },
});
</script>

<style scoped>
.aside {
  background-image:
    linear-gradient(to bottom,
      rgba(69, 9, 104, 0.096),
      rgb(2, 4, 7)),
    url('../assets/images/Background.png');
  box-shadow: 0px 0px 90px 0px rgba(0, 0, 0, 0.2);
  background-repeat: no-repeat;
  background-position: left;
  background-size: cover;
  height: 100vh;
}

.form-container {
  @apply w-10/12 !important;
  padding: 0 20px;
}

.label {
  font-size: 16px;
}

.card-left {
  background: linear-gradient(to bottom,
      rgba(28, 3, 43, 0.158),
      rgba(9, 3, 32, 0.719));
  backdrop-filter: blur(100px);
}

.logo-empresa {
  filter: drop-shadow(0px 4px 4px rgba(31, 5, 53, 0.25));
}

.text-font {
  font-family: 'Gothic A1', sans-serif;
}

.logo {
  @apply lg:w-96 md:w-72 w-64 object-cover !important;
    filter: drop-shadow(0px 4px 4px rgba(31, 5, 53, 0.25));
  }


  .cti-logo-container {
    justify-content: center;
    align-items: center;
    margin-top: 15px;
    width: 100%;
    height: 130px;
    display: none;
  }

  .cti-logo {
    height: 90px;
    object-fit: cover;
  }


  @media (max-width: 1024px) {
    .aside {
      display: none;
    }

  }


</style>
