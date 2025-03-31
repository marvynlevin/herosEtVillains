import axios, {AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig} from 'axios';
import {defineStore} from 'pinia';

interface ApiResponse<T> {
    error?: number;
    status?: number;
    data: T | string;
}

const axiosAgent: AxiosInstance = axios.create({
    baseURL: 'https://apidemo.iut-bm.univ-fcomte.fr',
    timeout: 10000,
});

const useErrorStore = defineStore('error', {
    state: () => ({
        error: null as ApiResponse<any> | null,
    }),
    actions: {
        setError(error: ApiResponse<any> | null) {
            this.error = error;
        },
        clearError() {
            this.error = null;
        },
    },
});

async function handleRequest<T>(
    request: Promise<AxiosResponse<ApiResponse<T>>>,
    serviceName: string
): Promise<ApiResponse<T>> {
    const errorStore = useErrorStore();
    try {
        const response = await request;
        errorStore.clearError();
        return response.data;
    } catch (err) {
        const error = err as AxiosError;
        let apiError: ApiResponse<any>;

        if (error.response) {
            console.error(`[${serviceName}] API Error:`, error.response.data);
            apiError = {
                data: error.response.data,
                error: 1,
                status: error.response.status,
            };
        } else if (error.request) {
            console.error(`[${serviceName}] Network Error:`, error.request);
            apiError = {
                data: 'Le serveur est injoignable ou l\'URL demandée n\'existe pas',
                error: 1,
            };
        } else {
            console.error(`[${serviceName}] Unknown Error:`, error.message);
            apiError = {
                data: 'Erreur inconnue',
                error: 1,
            };
        }
        errorStore.setError(apiError);
        return {data: apiError.data, error: apiError.error, status: apiError.status};
    }
}

async function getRequest<T>(uri: string, name: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return handleRequest<T>(axiosAgent.get<ApiResponse<T>>(uri, config), name);
}

async function postRequest<T>(uri: string, data: any, name: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return handleRequest<T>(axiosAgent.post<ApiResponse<T>>(uri, data, config), name);
}

async function patchRequest<T>(uri: string, data: any, name: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return handleRequest<T>(axiosAgent.patch<ApiResponse<T>>(uri, data, config), name);
}

async function putRequest<T>(uri: string, data: any, name: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return handleRequest<T>(axiosAgent.put<ApiResponse<T>>(uri, data, config), name);
}

async function deleteRequest<T>(uri: string, name: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return handleRequest<T>(axiosAgent.delete<ApiResponse<T>>(uri, config), name);
}

export {
    getRequest,
    postRequest,
    patchRequest,
    putRequest,
    deleteRequest,
    useErrorStore,
};