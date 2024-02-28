const state = () => ({
  token: "",
});

const mutations = {
  setToken(state, token) {
    console.log("asdfsafsafadsfad", token);
    state.token = token;
    localStorage.setItem("do-more-token", token);
  },
  setRefreshToken(_, refreshToken) {
    localStorage.setItem("refresh-do-more", refreshToken);
  },
};

const actions = {
  addToken({ commit }, token) {
    commit("setToken", token);
  },
  addRefreshToken({ commit }, refreshToken) {
    commit("setRefreshToken", refreshToken);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
