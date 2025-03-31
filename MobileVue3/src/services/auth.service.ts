import {postRequest, getRequest, useErrorStore} from '@/services/axios.service';

const AUTH_API_BASE_URL = '/authapi';

const AuthService = {
    /**
     * Effectue la connexion de l'utilisateur.
     * @param login - Le login de l'utilisateur.
     * @param password - Le mot de passe de l'utilisateur.
     * @returns Une promesse qui résout avec la réponse de l'API.
     */
    async login(login: string, password: string): Promise<any> {
        try {
            const response = await postRequest(
                `${AUTH_API_BASE_URL}/auth/signin`,
                {login, password},
                'LOGIN'
            );
            localStorage.setItem('login', login);
            return response.data;
        } catch (error: any) {
            return error;
        }
    },

    /**
     * Récupère les informations de l'utilisateur par son login.
     * @param login - Le login de l'utilisateur à récupérer.
     * @returns Une promesse qui résout avec la réponse de l'API.
     */
    async getUser(login: string): Promise<any> {
        try {
            const response = await getRequest(
                `${AUTH_API_BASE_URL}/user/getuser/${login}`,
                'GET_USER'
            );
            return response.data;
        } catch (error: any) {
            return error;
        }
    },

    /**
     * Enregistre un nouvel utilisateur.
     * @param login - Le login de l'utilisateur.
     * @param password - Le mot de passe de l'utilisateur.
     * @param hero - Le nom du héro associé à l'utilisateur.
     * @param captchaToken - Le token du captcha.
     * @returns Une promesse qui résout avec la réponse de l'API.
     */
    async register(login: string, password: string, hero: string, captchaToken: string): Promise<any> {
        try {
            const response = await postRequest(
                `${AUTH_API_BASE_URL}/user/register`,
                {login, password, hero, captchaToken},
                'REGISTER'
            );
            return response.data;
        } catch (error: any) {
            return error;
        }
    },
};

export default AuthService;
