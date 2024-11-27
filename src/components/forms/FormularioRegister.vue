<template>
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 text-center q-mb-lg">
        <h4 class="text-white q-ma-none text-lg mt-4">Selecione seu tipo de conta</h4>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-btn
          class="full-width account-type-btn bg-indigo-700 text-gray-300"
          size="lg"
          label="Sou Professor"
          icon="school"
          @click="tipoDeConta = 'professor'"
          :outline="tipoDeConta !== 'professor'"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-btn
          class="full-width account-type-btn bg-indigo-700 text-gray-300"
          size="lg"
          label="Sou Aluno"
          icon="person"
          @click="tipoDeConta = 'aluno'"
          :outline="tipoDeConta !== 'aluno'"
        />
      </div>
    </div>
  <div class="q-mt-md">
    <q-form @submit.prevent.stop="$emit('submit', form)" greedy>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-lg">
          <q-input
            dense
            outlined
            v-model="form.nome"
            color="indigo-400"
            text-color="indigo-400"
            dark
            lazy-rules
            label="Nome"
            hint="Informe o nome completo sem
          abreviações"
            clearable
            clear-icon="close"
            :rules="nameRules"
          />
        </div>
        <div class="col-12 q-mb-lg">
          <q-input
            dense
            outlined
            v-model="form.email"
            lazy-rules
            dark
            color="indigo-400"
            text-color="indigo-400"
            label="Email"
            hint="Informe o email"
            clearable
            clear-icon="close"
            :rules="emailRules"
          />
        </div>
        <div class="col-12 q-mb-lg">
          <q-input
            mask="###.###.###-##"
            unmasked-value
            dense
            lazy-rules
            outlined
            dark
            color="indigo-400"
            text-color="indigo-400"
            v-model="form.cpf"
            label="CPF"
            hint="Informe o CPF"
            :rules="cpfRules"
          />
        </div>
        <div class="col-12 q-mb-lg">
          <q-input
            dense
            outlined
            dark
            color="indigo-400"
            text-color="indigo-400"
            v-model="form.login"
            lazy-rules
            label="Login"
            hint="Informe o nome para login"
            clearable
            clear-icon="close"
            :rules="loginRules"
          />
        </div>
        <div class="col-12 q-mb-lg">
          <q-input
            type="password"
            dense
            outlined
            dark
            color="indigo-400"
            text-color="indigo-400"
            v-model="form.senha"
            lazy-rules
            label="Senha"
            hint="Informe uma senha"
            clear-icon="close"
            :rules="senhaRules"
          />
        </div>
        <div class="col-12 q-mb-lg">
          <q-input
            dense
            outlined
            dark
            color="indigo-400"
            text-color="indigo-400"
            v-model="confirmacao_senha"
            lazy-rules
            label="Confirmação da senha"
            hint="Informe novamente a senha"
            type="password"
            clear-icon="close"
            :rules="confirmarSenhaRules"
          />
        </div>
      </div>

      <div class="row justify-end q-gutter-sm w-full grid grid-cols-2 gap-2">
        <q-btn
          class="w-full bg-indigo-700 text-gray-300"
          icon="add"
          :label="enviarBotao"
          type="submit"
        />
        <q-btn
          v-if="exibirBotaoVoltar"
          class="w-full"
          outline
          icon="arrow_back"
          label="Voltar"
          text-color="grey"
          @click="rotaVoltar"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tipoDeConta = ref("professor");
const props = defineProps([
  "administrador",
  "usuarioId",
  "enviarBotao",
  "exibirBotaoVoltar",
]);

const form = ref({
  nome: "",
  email: "",
  cpf: "",
  nivel: "Professor",
  situacao: "Ativo",
  login: "",
  senha: "",
});

watch(tipoDeConta, (newValue) => {
  form.value.nivel = newValue === 'professor' ? 'Professor' : 'Aluno';
});

const rotaVoltar = () => {
  router.go(-1)
}

const confirmacao_senha = ref("");

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

  const valoresIguais = form.value.senha === confirmacao_senha.value;

  if (valoresIguais) return true;
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

const cpfRules = [
  (val) => !!val || "*Campo obrigatório",
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

</script>
