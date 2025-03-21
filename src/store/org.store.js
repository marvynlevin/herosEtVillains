import {getAllOrgs, getOrgById, createOrg, addTeamToOrg, removeTeamFromOrg} from "@/services/org.service";

export default {
    namespaced: true,
    state: {
        orgs: [],
        currentOrg: null,
        currentOrgSecret: null,
        loading: false,
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
        ADD_ORG(state, newOrg) {
            state.orgs.push(newOrg);
        },
    },
    actions: {
        async fetchOrgs({commit, dispatch}) {
            commit("SET_LOADING", true);
            try {
                const orgs = await getAllOrgs();
                commit("SET_ORGS", orgs);
            } catch (error) {
                dispatch("error/setError", error.message, {root: true});
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async createOrg({commit, dispatch}, orgData) {
            commit("SET_LOADING", true);
            try {
                console.log(orgData);
                const newOrg = await createOrg(orgData);
                commit("ADD_ORG", newOrg);
                commit("SET_CURRENT_ORG", newOrg);
                commit("SET_CURRENT_ORG_SECRET", orgData.secret);
            } catch (error) {
                dispatch("error/setError", error.message, {root: true});
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async addTeamToOrg({commit, state, dispatch}, teamData) {
            commit("SET_LOADING", true);
            try {
                console.log("add team to org")
                await addTeamToOrg(teamData, state.currentOrgSecret);
                console.log("c'est ou bordel:", teamData, state.currentOrgSecret);
                console.log("ahh: ", state.currentOrg[0]._id, state.currentOrgSecret);
                console.log("update org")
                const updatedOrg = await getOrgById(state.currentOrg[0]._id, state.currentOrgSecret);
                commit("SET_CURRENT_ORG", updatedOrg);
            } catch (error) {
                dispatch("error/setError", error.message, {root: true});
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async removeTeamFromOrg({commit, state, dispatch}, teamData) {
            commit("SET_LOADING", true);
            try {
                await removeTeamFromOrg(teamData, state.currentOrgSecret);
                const updatedOrg = await getOrgById(state.currentOrg, state.currentOrgSecret);
                commit("SET_CURRENT_ORG", updatedOrg);
            } catch (error) {
                dispatch("error/setError", error.message, {root: true});
            } finally {
                commit("SET_LOADING", false);
            }
        },
        async fetchOrgById({commit, state, dispatch}, {id, secret}) {
            commit("SET_LOADING", true);
            try {
                console.log("id:", id);
                console.log("secret :", secret);
                const org = await getOrgById(id, secret);
                console.log("test passé avec succès")
                commit("SET_CURRENT_ORG", org.data);
                commit("SET_CURRENT_ORG_SECRET", secret);
            } catch (error) {
                dispatch("error/setError", error.message, {root: true});
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
