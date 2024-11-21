export const setToken = (state, token) => {
  state.token = token;
  state.isAuthenticated = true;
  window.sessionStorage.setItem("token", JSON.stringify(token));
};

export const removeToken = (state, token) => {
  state.token = "";
  state.isAuthenticated = false;
  window.sessionStorage.removeItem("token");
};

export const setMe = (state, me) => {
  state.me.id = me;
  window.sessionStorage.setItem("user_id", JSON.stringify(me));
};

export const removeMe = (state, me) => {
  state.me = {};
  window.sessionStorage.removeItem("user_id");
};

export const setAccessLevel = (state, level) => {
  if (level === "Administrador") {
    state.isAdmin = true;
  }
  window.sessionStorage.setItem("access_level", level);
};

export const setUser = (state, level) => {
  window.sessionStorage.setItem("user", level);
};

export const removeAccessLevel = (state, level) => {
  state.isAdmin = false;
  window.sessionStorage.removeItem("access_level");
};
