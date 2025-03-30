import {defineStore} from 'pinia';

interface ErrorState {
    errorMessage: string | null;
    errorDialog: boolean;
}

export const useErrorStore = defineStore('error', {
    state: (): ErrorState => ({
        errorMessage: null,
        errorDialog: false,
    }),
    getters: {
        getErrorMessage: (state) => state.errorMessage,
        getErrorDialog: (state) => state.errorDialog,
    },
    actions: {
        setError(message: string | null) {
            this.errorMessage = message;
            this.errorDialog = true;
        },
        clearError() {
            this.errorMessage = null;
            this.errorDialog = false;
        },
    },
});