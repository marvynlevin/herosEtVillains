import {defineStore} from 'pinia';

export const useErrorStore = defineStore('error', {
    state: () => ({
        errorMessage: null as string | null,
        errorDialog: false,
    }),
    getters: {
        getErrorMessage: (state) => state.errorMessage,
        getErrorDialog: (state) => state.errorDialog,
    },
    actions: {
        setError(message: string) {
            this.errorMessage = message;
            this.errorDialog = true;
        },
        clearError() {
            this.errorMessage = null;
            this.errorDialog = false;
        },
    },
});
