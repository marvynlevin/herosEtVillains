import { getAllOrgs, getOrgById, createOrg, addTeamToOrg, removeTeamFromOrg } from "@/services/org.service";

export default {
  namespaced: true,
  state: {
    orgs: [],
    currentOrg: null,
    currentOrgSecret: null,
    loading: false,
    error: null,
    secretError: null,
  },
  mutations: {
    SET_ORGS(state, orgs) {
      state.orgs = orgs;
    },
    SET_CURRENT_ORG(state, org) {
      state.currentOrg = org;
    },
    SET_CURRENT_ORG_SECRET(state, secret) {
      state.currentOrgSecret = secret;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_SECRET_ERROR(state, error) {
      state.secretError = error;
    },
    ADD_ORG(state, newOrg) {
      state.orgs.push(newOrg);
    },
  },
  actions: {
    async fetchOrgs({ commit }) {
      commit("SET_LOADING", true);
      try {
        const orgs = await getAllOrgs();
        commit("SET_ORGS", orgs);
      } catch (error) {
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createOrg({ commit }, orgData) {
      commit("SET_LOADING", true);
      try {
        console.log(orgData);
        const newOrg = await createOrg(orgData);
        commit("ADD_ORG", newOrg);
        commit("SET_CURRENT_ORG", newOrg);
        commit("SET_CURRENT_ORG_SECRET", orgData.secret);
      } catch (error) {
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async addTeamToOrg({ commit, state }, teamData) {
      commit("SET_LOADING", true);
      try {
        console.log("add team to org")
        await addTeamToOrg(teamData, state.currentOrgSecret);
        console.log("c'est ou bordel:" , teamData, state.currentOrgSecret);
        console.log("ahh: ", state.currentOrg[0]._id, state.currentOrgSecret);
        console.log("update org")
        const updatedOrg = await getOrgById(state.currentOrg[0]._id, state.currentOrgSecret);
        commit("SET_CURRENT_ORG", updatedOrg);
      } catch (error) {
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async removeTeamFromOrg({ commit, state }, teamData) {
      commit("SET_LOADING", true);
      try {
        await removeTeamFromOrg(teamData, state.currentOrgSecret);
        const updatedOrg = await getOrgById(state.currentOrg, state.currentOrgSecret);
        commit("SET_CURRENT_ORG", updatedOrg);
      } catch (error) {
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async fetchOrgById({ commit, state }, { id, secret }) {
      commit("SET_LOADING", true);
      try {
        console.log("id:", id);
        console.log("secret :", secret );
        const org = await getOrgById(id, secret);
        console.log("test passé avec succès")
        commit("SET_CURRENT_ORG", org.data);
        commit("SET_CURRENT_ORG_SECRET", secret);
        commit("SET_SECRET_ERROR", org.error);
      } catch (error) {
        commit("SET_SECRET_ERROR", error.message);
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
  getters: {
    getOrgs: (state) => state.orgs,
    getCurrentOrg: (state) => state.currentOrg,
    getOrgSecret: (state) => state.currentOrgSecret,
    isOrgLoading: (state) => state.loading,
    getOrgError: (state) => state.error,
    getSecretError: (state) => state.secretError,
  },
};
