<template>
  <div class="q-mt-md">
    <q-form @submit.prevent.stop="$emit('submit', form)" greedy>
      <div class="row q-col-gutter-md">
        <!-- Input fields -->
        <div class="col-12 col-sm-4 q-mb-lg">
          <q-input dense outlined v-model="form.nome" lazy-rules label="Nome" hint="Informe o nome completo sem
          abreviações" clearable clear-icon="close" :rules="nameRules" />
        </div>
        <div class="col-12 col-sm-4 q-mb-lg">
          <q-input dense outlined v-model="form.email" lazy-rules label="Email" hint="Informe o email" clearable
            clear-icon="close" :rules="emailRules" />
        </div>
        <div class="col-12 col-sm-4 q-mb-lg">
          <q-input dense outlined v-model="form.telefone" lazy-rules mask="(##) #####-####" unmasked-value
            label="Telefone" hint="Informe o telefone" clearable clear-icon="close" :rules="campoVazioRules" />
        </div>
        <div class="col-12 col-sm-4 q-mb-lg">
          <q-input mask="###.###.###-##" unmasked-value dense outlined v-model="form.cpf" label="CPF" hint="Informe o CPF" />
        </div>
        <div v-if="nivel != 'Aluno' && nivel != 'Professor'" class="col-12 col-sm-4 q-mb-lg">
          <q-select transition-show="scale" transition-hide="scale" :disable="!administrador" outlined dense
            v-model="form.nivel" :options="nivelAcesso" lazy-rules label="Nível" hint="Informe o nível de acesso"
            clearable clear-icon="close" :rules="campoVazioRules" />
        </div>
        <div v-if="nivel != 'Aluno' && nivel != 'Professor'" class="col-12 col-sm-4 q-mb-lg">
          <q-select transition-show="scale" transition-hide="scale" :disable="!administrador" dense outlined
            v-model="form.ativo" :options="ativo" emit-value option-value="value" option-label="label" lazy-rules
            label="Situação" hint="Informe a situação" clearable clear-icon="close" :rules="campoVazioRules" />
        </div>

        <div class="col-12 col-sm-4 q-mb-lg">
          <q-input :disable="!administrador" dense outlined v-model="form.login" lazy-rules label="Login"
            hint="Informe o nome para login" clearable clear-icon="close" :rules="loginRules" />
        </div>
        <div class="col-12 col-sm-4 q-mb-lg">
          <q-input type="password" dense outlined v-model="form.senha" lazy-rules label="Senha" hint="Informe uma senha"
            clear-icon="close" :rules="senhaRules" />
        </div>
        <div class="col-12 col-sm-4 q-mb-lg">
          <q-input dense outlined v-model="confirmacao_senha" lazy-rules label="Confirmação da senha"
            hint="Informe novamente a senha" type="password" clear-icon="close" :rules="confirmarSenhaRules" />
        </div>
      </div>

      <div class="row justify-end q-gutter-sm">
        <q-btn size="md" icon="save" :label="enviarBotao" type="submit" class="btn-salvar" />
        <q-btn v-if="exibirBotaoVoltar" outline icon="close" label="Cancelar" @click="rotaVoltar" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from "boot/axios";
import routeHandler from "src/assets/js/routeHandler";
import { useRouter } from "vue-router";
const nivel = window.sessionStorage.getItem("access_level");
const router = useRouter();

const props = defineProps([
  "administrador",
  "usuarioId",
  "enviarBotao",
  "exibirBotaoVoltar",
]);

const rotaVoltar = () => {
  router.push(routeHandler('/perfil'))

}

const form = ref({
  nome: "",
  email: "",
  cpf: "",
  nivel: "Administrador",
  ativo: "",
  login: "",
  pago: true,
  senha: "",
  telefone: "",
});

onMounted(async () => {
  if (props.usuarioId) {
    const data = await buscaUsuario(props.usuarioId);
    preencheCampos(data);
  }
});

const confirmacao_senha = ref("");

const nivelAcesso = ref(["Aluno", "Professor", "Administrador"]);

const ativo = ref([
  { value: true, label: 'Ativo' },
  { value: false, label: 'Inativo' },
]);

const campoVazioRules = [(val) => !!val || "*Campo obrigatório"];

function validaNome(val) {
  const regex = /[!@#$%*()_+=-?°``''~©,.;<>:]|[0-9]/g;
  return !regex.test(val);
}

function validaEmail(val) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(val);
}

function validaLogin(val) {
  const regex = /[^a-zA-Zs]/g;
  return !regex.test(val);
}

function validaSenha() {
  if (!!props.usuarioId) return true;
  return !!form.value.senha.length;
}

function validaConfirmacaoSenha() {
  if (!!props.usuarioId && form.value.senha.length == 0) return true;
  return form.value.senha === confirmacao_senha.value;
}

const nameRules = [
  (val) => !!val || "*Campo obrigatório",
  (val) =>
    validaNome(val) ||
    "*Proibido o uso dos seguintes caracteres [!@#$%*()_+=-?°``''~©,.;<>:], valores numéricos ou espaços",
];

const emailRules = [
  (val) => !!val || "*Campo obrigatório",
  (val) => validaEmail(val) || "*Formato de email inválido",
];

const loginRules = [
  (val) => !!val || "*Campo obrigatório",
  (val) =>
    validaLogin(val) ||
    "*Proibido o uso dos seguintes caracteres [!@#$%*()_+=-?°``''~©,.;<>:], valores numéricos ou espaços",
];

const senhaRules = [() => validaSenha() || "*Campo obrigatório"];

const confirmarSenhaRules = [
  () =>
    validaConfirmacaoSenha() ||
    "*A senha deve ser igual a confirmação da senha",
];

async function buscaUsuario(id) {
  const { data } = await api.get(`usuarios/${id}`);
  return data;
}

function preencheStatus(ativo) {
  if (ativo == true) {
    return { value: ativo, label: 'Ativo' };
  } else {
    return { value: ativo, label: 'Inativo' };
  }
}


function preencheCampos(data) {
  form.value.nome = data.nome;
  form.value.email = data.email;
  form.value.cpf = data.cpf;
  form.value.nivel = data.nivel;
  form.value.telefone = data.telefone;
  form.value.ativo = preencheStatus(data.ativo);
  form.value.login = data.login;
}
</script>

<style scoped>
.btn-salvar {
  @apply dark:bg-slate-600 bg-sky-950 text-white;
}
</style>
