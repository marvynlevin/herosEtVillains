import {getRequest, postRequest, patchRequest} from "@/services/axios.service";

//
//
//  SERVICE TEAM
//
//

export interface Team {
    _id: string;
    name: string;
    members: any[];
}

export interface TeamUpdate {
    idTeam: string;
    idHeroes: string[];
}

export async function getAllTeams(): Promise<{ error: number; data: any }> {
    try {
        const response = await getRequest('/herocorp/teams/get', 'GETALLTEAMS');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la récupération des équipes.';
        throw new Error(errorMessage);
    }
}

export async function createTeam(teamData: Omit<Team, '_id' | 'members'>): Promise<{ error: number; data: any }> {
    try {
        const response = await postRequest('/herocorp/teams/create', teamData, 'CREATETEAM');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la création de l\'équipe.';
        throw new Error(errorMessage);
    }
}

export async function addHeroesToTeam(teamData: TeamUpdate): Promise<{ error: number; data: any }> {
    try {
        const response = await patchRequest('/herocorp/teams/addheroes', teamData, 'ADDHEROSTOTEAM');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de l\'ajout des héros à l\'équipe.';
        throw new Error(errorMessage);
    }
}

export async function removeHeroesFromTeam(teamData: TeamUpdate): Promise<{ error: number; data: any }> {
    try {
        const response = await patchRequest('/herocorp/teams/removeheroes', teamData, 'REMOVEHEROFROMTEAM');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la suppression des héros de l\'équipe.';
        throw new Error(errorMessage);
    }
}