import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

export default route(function ({ store, ssrContext }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE,
    ),
  });

  Router.beforeEach(async (to, from, next) => {
    const auth = store.state.auth;

    if (to.meta.requiredLogin && !auth.isAuthenticated) {
      next({
        name: 'login',
      });

      return;
    }

    if (to.path !== '/login' && to.path !== '/register') {
      const id = window.sessionStorage.getItem('user_id');
      const token = window.sessionStorage.getItem('token');

      try {
        await store.dispatch('auth/getUserAccessLevel', {
          id,
          token,
        });
      } catch (erro) {
        next({
          name: 'login',
        });

        return;
      }
    }

    const accessLevel = window.sessionStorage.getItem('access_level');

    // Verifica os níveis de acesso
    if (
      to.meta.requiredAdminLevel &&
      accessLevel !== 'Administrador'
      // || ((to?.meta.requiredOutroNivelDeAcesso) && accessLevel !== "OutroNivelDeAcesso")
    ) {
      next({
        name: 'erro',
      });

      return;
    }
    // Direciona para a página de REDIRECT
    next();
  });

  return Router;
});
