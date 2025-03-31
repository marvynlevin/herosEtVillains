export default {
    namespaced: true,
    state: {
        errorMessage: null,
        errorDialog: false,
    },
    getters: {
        getErrorMessage: (state) => state.errorMessage,
        getErrorDialog: (state) => state.errorDialog,
    },
    mutations: {
        SET_ERROR(state, message) {
            state.errorMessage = message;
            state.errorDialog = true;
        },
        CLEAR_ERROR(state) {
            state.errorMessage = null;
            state.errorDialog = false;
        },
    },
    actions: {
        setError({commit}, message) {
            commit('SET_ERROR', message);
        },
        clearError({commit}) {
            commit('CLEAR_ERROR');
        },
    },
};