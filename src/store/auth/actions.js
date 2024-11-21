import { api } from "boot/axios";

export const doLogin = async ({ commit }, payload) => {
  await api.post("/auth/login", payload).then((response) => {
    const { access_token, usuarioId } = response.data;

    commit("setToken", access_token);
    commit("setMe", usuarioId);
    api.defaults.headers.common.Authorization = "Bearer " + access_token;
  });
};

export const signOut = ({ commit }) => {
  api.defaults.headers.common.Authorization = "";
  commit("removeToken");
  commit("removeMe");
  commit("removeAccessLevel");
};

export const init = async ({ commit }) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    await commit("setToken", JSON.parse(token));
  } else {
    commit("removeToken");
  }
};

export const getUserAccessLevel = async ({ commit }, payload) => {
  const id = payload.id.slice(1, payload.id.length - 1);
  const token = payload.token.slice(1, payload.token.length - 1);

  api.defaults.headers.common.Authorization = "Bearer " + token;

  const { data } = await api.get(`usuarios/${id}`);

  commit("setAccessLevel", data.nivel);
  commit("setUser", data.nome);

  return data.nivel
};
