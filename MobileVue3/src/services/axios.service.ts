import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';

// Création de l'instance Axios avec une configuration par défaut
const axiosAgent = axios.create({
    baseURL: 'https://apidemo.iut-bm.univ-fcomte.fr',
    timeout: 10000, // Timeout de 10 secondes
});

/**
 * Gestion centralisée des erreurs API
 * @param {string} serviceName - Nom du service pour le debug
 * @param {AxiosError} err - Objet erreur Axios
 * @returns {Object} - Objet avec la structure { error: 1, data: message }
 */
function handleError(serviceName: string, err: AxiosError): { data: { error: number; data: any } } {
    if (err.response) {
        console.error(`[${serviceName}] API Error:`, err.response.data);
        return {
            data: {
                error: 1,
                data: err.response.data
            }
        };
    } else if (err.request) {
        console.error(`[${serviceName}] Network Error:`, err.request);
        return {
            data: {
                error: 1,
                data: "Le serveur est injoignable ou l'URL demandée n'existe pas"
            }
        };
    } else {
        console.error(`[${serviceName}] Unknown Error:`, err.message);
        return {
            data: {
                error: 1,
                data: "Erreur inconnue"
            }
        };
    }
}

/**
 * Requête GET
 * @param {string} uri - URI de l'API
 * @param {string} name - Nom du service
 * @param {AxiosRequestConfig} config - Configuration optionnelle
 */
async function getRequest(uri: string, name: string, config: AxiosRequestConfig = {}): Promise<{
    data: { error: number; data: any }
}> {
    try {
        return await axiosAgent.get(uri, config);
    } catch (err: any) {
        return handleError(name, err);
    }
}

/**
 * Requête POST
 * @param {string} uri - URI de l'API
 * @param {any} data - Données envoyées
 * @param {string} name - Nom du service
 * @param {AxiosRequestConfig} config - Configuration optionnelle
 */
async function postRequest(uri: string, data: any, name: string, config: AxiosRequestConfig = {}): Promise<{
    data: { error: number; data: any }
}> {
    try {
        return await axiosAgent.post(uri, data, config);
    } catch (err: any) {
        return handleError(name, err);
    }
}

/**
 * Requête PATCH
 * @param {string} uri - URI de l'API
 * @param {any} data - Données envoyées
 * @param {string} name - Nom du service
 * @param {AxiosRequestConfig} config - Configuration optionnelle
 */
async function patchRequest(uri: string, data: any, name: string, config: AxiosRequestConfig = {}): Promise<{
    data: { error: number; data: any }
}> {
    try {
        return await axiosAgent.patch(uri, data, config);
    } catch (err: any) {
        return handleError(name, err);
    }
}

/**
 * Requête PUT (Ajouté pour complétude)
 */
async function putRequest(uri: string, data: any, name: string, config: AxiosRequestConfig = {}): Promise<{
    data: { error: number; data: any }
}> {
    try {
        return await axiosAgent.put(uri, data, config);
    } catch (err: any) {
        return handleError(name, err);
    }
}

/**
 * Requête DELETE (Ajouté pour complétude)
 */
async function deleteRequest(uri: string, name: string, config: AxiosRequestConfig = {}): Promise<{
    data: { error: number; data: any }
}> {
    try {
        return await axiosAgent.delete(uri, config);
    } catch (err: any) {
        return handleError(name, err);
    }
}

export {
    getRequest,
    postRequest,
    patchRequest,
    putRequest,
    deleteRequest
};