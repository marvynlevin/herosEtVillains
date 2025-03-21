import {postRequest, getRequest} from '@/services/axios.service';

const AUTH_API_BASE_URL = '/authapi';

export const AuthService = {
    /**
     * Effectue la connexion de l'utilisateur.
     * @param {string} login - Le login de l'utilisateur.
     * @param {string} password - Le mot de passe de l'utilisateur.
     * @returns {Promise<any>} - Une promesse qui résout avec la réponse de l'API.
     * @throws {Error} - Si une erreur se produit pendant la requête.
     */
    async login(login, password) {
        try {
            const response = await postRequest(
                `${AUTH_API_BASE_URL}/auth/signin`,
                {login, password},
                'LOGIN'
            );
            localStorage.setItem('login', login);
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.data || 'Une erreur est survenue lors de la connexion.';
            throw new Error(errorMessage);
        }
    },

    /**
     * Récupère les informations de l'utilisateur par son login.
     * @param {string} login - Le login de l'utilisateur à récupérer.
     * @returns {Promise<any>} - Une promesse qui résout avec la réponse de l'API.
     * @throws {Error} - Si une erreur se produit pendant la requête.
     */
    async getUser(login) {
        try {
            const response = await getRequest(
                `${AUTH_API_BASE_URL}/user/getuser/${login}`,
                'GET_USER'
            );
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.data || 'Une erreur est survenue lors de la récupération de l\'utilisateur.';
            throw new Error(errorMessage);
        }
    },
};