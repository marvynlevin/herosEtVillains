import {getRequest, postRequest, putRequest, useErrorStore} from '@/services/axios.service';

//
//
//  SERVICE HERO
//
//

export async function getAllHeroes(): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const response = await getRequest('/herocorp/heroes/getaliases', 'GETALLHEROES');
        return response.data;
    } catch (error: any) {
        errorStore.setError(error?.message);
        return error;
    }
}

export async function createHero(heroData: any): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const response = await postRequest('/herocorp/heroes/create', heroData, 'CREATEHERO');
        return response.data;
    } catch (error: any) {
        errorStore.setError(error?.message);
        return error;
    }
}

export async function updateHero(heroData: any, orgSecret: string): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const config = {headers: {'org-secret': orgSecret}};
        const response = await putRequest('/herocorp/heroes/update', heroData, 'UPDATEHERO', config);
        return response.data;
    } catch (error: any) {
        errorStore.setError(error?.message);
        return error;
    }
}

export async function getHeroById(id: string, orgSecret: string): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const config = {headers: {'org-secret': orgSecret}};
        const response = await getRequest(`/herocorp/heroes/getbyid/${id}`, 'GETHEROBYID', config);
        return response.data;
    } catch (error: any) {
        errorStore.setError(error?.message);
        return error;
    }
}

export async function updateAuthHero(heroData: any): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const response = await putRequest('/herocorp/heroes/authupdate', heroData, 'UPDATEAUTHHERO');
        return response.data;
    } catch (error: any) {
        errorStore.setError(error?.message);
        return error;
    }
}
