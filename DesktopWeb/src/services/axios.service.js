import axios from 'axios';

const axiosAgent = axios.create({
    baseURL: 'https://apidemo.iut-bm.univ-fcomte.fr',
    timeout: 10000,
});

/**
 * Gestion centralisée des erreurs API
 * @param {string} serviceName - Nom du service pour le debug
 * @param {Object} err - Objet erreur Axios
 * @returns {Object} - Objet avec la structure { error: 1, data: message }
 */
function handleError(serviceName, err) {
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
 * @param {Object} config - Configuration optionnelle
 */
async function getRequest(uri, name, config = {}) {
    try {
        const response = await axiosAgent.get(uri, config);
        return response.data;
    } catch (err) {
        return handleError(name, err);
    }
}

/**
 * Requête POST
 * @param {string} uri - URI de l'API
 * @param {Object} data - Données envoyées
 * @param {string} name - Nom du service
 * @param {Object} config - Configuration optionnelle
 */
async function postRequest(uri, data, name, config = {}) {
    try {
        const response = await axiosAgent.post(uri, data, config);
        return response.data;
    } catch (err) {
        return handleError(name, err);
    }
}

/**
 * Requête PATCH
 * @param {string} uri - URI de l'API
 * @param {Object} data - Données envoyées
 * @param {string} name - Nom du service
 * @param {Object} config - Configuration optionnelle
 */
async function patchRequest(uri, data, name, config = {}) {
    try {
        const response = await axiosAgent.patch(uri, data, config);
        return response.data;
    } catch (err) {
        return handleError(name, err);
    }
}

/**
 * Requête PUT
 */
async function putRequest(uri, data, name, config = {}) {
    try {
        const response = await axiosAgent.put(uri, data, config);
        return response.data;
    } catch (err) {
        return handleError(name, err);
    }
}

/**
 * Requête DELETE
 */
async function deleteRequest(uri, name, config = {}) {
    try {
        const response = await axiosAgent.delete(uri, config);
        return response.data;
    } catch (err) {
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
