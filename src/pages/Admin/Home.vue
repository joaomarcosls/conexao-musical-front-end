<template>
  <div class="flex flex-center h-full">
    <card icone="la la-chart-pie" titulo="Dashboard" class="w-full h-full">
      <div class="admin-home">
        <div class="cards-container">
                <div class="card">
                  <div class="card-icon">
                    👨‍🏫
                  </div>
                  <div class="card-content">
                    <h2>Professores</h2>
                    <p class="number">{{ professores }}</p>
                  </div>
                  <div></div>
                </div>

                <div class="card">
                  <div class="card-icon">
                    👨‍🎓
                  </div>
                  <div class="card-content">
                    <h2>Alunos</h2>
                    <p class="number">{{ alunos }}</p>
                  </div>
                  <div></div>
                </div>
              </div>
              <div class="background-container">
          <img :src="background" />
        </div>
      </div>
    </card>
  </div>
</template>
<script setup>
import Card from "src/components/commons/CardVue.vue";
import { api } from "src/boot/axios";
import { onMounted, ref } from "vue";
import background from "../../assets/images/background-dash.png";
const professores = ref(0);
const alunos = ref(0);

onMounted(async () => {
  await buscaDados();
});

async function buscaDados() {
  const { data } = await api.get('dashboard');
  professores.value = data.usuarios.professores;
  alunos.value = data.usuarios.alunos;
}


</script>
  <style scoped>
  .admin-home {
    @apply flex flex-col h-full;
    padding: 20px;
  }

  .background-container {
    @apply w-full h-full flex justify-center items-center;
  }

  .background-container img {
    @apply w-full xl:h-[700px] mt-20 lg:h-[700px] object-contain;
  }

  .title {
    margin-bottom: 30px;
    color: #333;
  }

  .cards-container {
    @apply grid grid-cols-1 md:grid-cols-2 w-full gap-4;
  }

  .card {
    @apply w-full bg-indigo-50 dark:bg-gray-800 rounded-lg p-4 min-w-40 shadow-md flex items-center justify-between transition-transform duration-200;
  }

  .card:hover {
    transform: translateY(-5px);
  }

  .card-icon {
    font-size: 2.5rem;
  }

  .card-content {
    @apply flex flex-col items-center;
  }

  .card-content h2 {
    @apply m-0 text-gray-500 font-semibold;
    font-size: 1.1rem;
  }

  .number {
    font-size: 2rem;
    font-weight: bold;
    margin: 5px 0 0;
    color: #2c3e50;
  }
  </style>
