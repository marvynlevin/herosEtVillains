import {getRequest, postRequest, putRequest} from "@/services/axios.service";

//
//
//  SERVICE HERO
//
//

export interface HeroAlias {
    id: string;
    alias: string;
}

export interface Hero {
    _id: string;
    alias: string;
    secretIdentity: string;
    powers: string[];
    team: string;
    firstname?: string,
    lastname?: string,
    power?: string
}

export async function getAllHeroes(): Promise<{ error: number; data: any }> {
    try {
        const response = await getRequest('/herocorp/heroes/getaliases', 'GETALLHEROES');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la récupération des héros.';
        throw new Error(errorMessage);
    }
}

export async function createHero(heroData: Omit<Hero, '_id'>): Promise<{ error: number; data: any }> {
    try {
        const response = await postRequest('/herocorp/heroes/create', heroData, 'CREATEHERO');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la création du héros.';
        throw new Error(errorMessage);
    }
}

export async function updateHero(heroData: Hero, orgSecret: string): Promise<{ error: number; data: any }> {
    try {
        const config = {headers: {'org-secret': orgSecret}};
        const response = await putRequest('/herocorp/heroes/update', heroData, 'UPDATEHERO', config);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la mise à jour du héros.';
        throw new Error(errorMessage);
    }
}

export async function getHeroById(id: string, orgSecret: string): Promise<{ error: number; data: any }> {
    try {
        const config = {headers: {'org-secret': orgSecret}};
        const response = await getRequest(`/herocorp/heroes/getbyid/${id}`, 'GETHEROBYID', config);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la récupération du héros.';
        throw new Error(errorMessage);
    }
}

export async function updateAuthHero(heroData: Partial<Hero>): Promise<{ error: number; data: any }> {
    try {
        const response = await putRequest('/herocorp/heroes/authupdate', heroData, 'UPDATEAUTHHERO');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la mise à jour du héros.';
        throw new Error(errorMessage);
    }
}