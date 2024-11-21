const routes = [

  {
    name: 'erro',
    path: '/:catchAll(.*)*',
    component: () => module.require('pages/commons/Error404.vue'),
  },
  {
    name: 'login',
    path: '/login',
    component: () => module.require('pages/Login.vue'),
  },
  {
    name: 'register',
    path: '/register',
    component: () => module.require('pages/Register.vue'),
  },
  {
    path: '/',
    component: () => module.require('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        component: () => module.require('src/pages/Redirect.vue'),
        meta: { requiredLogin: true },
      },
      {
        path: '/perfil',
        component: () => module.require('src/pages/commons/Perfil.vue'),
        meta: { requiredLogin: true },
      },
      {
        path: '/a/',
        meta: { requiredLogin: true, requiredAdminLevel: true },
        children: [
          {
            path: 'dashboard',
            component: () => module.require('src/pages/Admin/Home.vue'),
          },
          {
            path: 'professores',
            component: () => module.require('src/pages/Admin/professores/ListarProfessores.vue'),
          },
          {
            path: 'professores/adicionar',
            component: () => module.require('src/pages/Admin/professores/AdicionarProfessor.vue'),
          },
          {
            path: 'professores/editar/:id',
            component: () => module.require('src/pages/Admin/professores/EditarProfessor.vue'),
          },
          {
            path: 'alunos',
            component: () => module.require('src/pages/Admin/alunos/ListarAlunos.vue'),
          },
          {
            path: 'alunos/adicionar',
            component: () => module.require('src/pages/Admin/alunos/AdicionarAluno.vue'),
          },
          {
            path: 'alunos/editar/:id',
            component: () => module.require('src/pages/Admin/alunos/EditarAluno.vue'),
          },
        ],
      },
      {
        path: '/u/',
        meta: { requiredLogin: true },
        children: [
          {
            path: '',
            component: () => module.require('src/pages/Usuario/Home.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
