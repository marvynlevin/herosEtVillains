import {getRequest, postRequest, patchRequest, putRequest} from "@/services/axios.service";


//
//
//  SERVICE HERO
//
//

export async function getAllHeroes() {
    try {
        const response = await getRequest('/herocorp/heroes/getaliases', 'GETALLHEROES');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la récupération des héros.';
        throw new Error(errorMessage);
    }
}

export async function createHero(heroData) {
    try {
        console.log("data new hero: ", heroData);
        const response = await postRequest('/herocorp/heroes/create', heroData, 'CREATEHERO');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la création du héros.';
        throw new Error(errorMessage);
    }
}

export async function updateHero(heroData, orgSecret) {
    try {
        const config = {headers: {'org-secret': orgSecret}};
        const response = await putRequest('/herocorp/heroes/update', heroData, 'UPDATEHERO', config);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la mise à jour du héros.';
        throw new Error(errorMessage);
    }
}

export async function getHeroById(id, orgSecret) {
    try {
        const config = {headers: {'org-secret': orgSecret}};
        const response = await getRequest(`/herocorp/heroes/getbyid/${id}`, 'GETHEROBYID', config);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la récupération du héros.';
        throw new Error(errorMessage);
    }
}

export async function updateAuthHero(heroData) {
    try {
        const response = await putRequest('/herocorp/heroes/authupdate', heroData, 'UPDATEAUTHHERO');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la mise à jour du héros.';
        throw new Error(errorMessage);
    }
}