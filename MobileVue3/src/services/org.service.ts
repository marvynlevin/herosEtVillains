import {getRequest, postRequest, patchRequest} from "@/services/axios.service";

//
//
//  SERVICE ORG
//
//

export interface Org {
    _id: string;
    name: string;
    secret: string;
    teams: string[];
}

export interface Team {
    idTeam: string;
    idOrg: string;
}

export async function getAllOrgs(): Promise<{ error: number; data: any }> {
    try {
        const response = await getRequest('/herocorp/orgs/get', 'GETALLORGS');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la récupération des organisations.';
        throw new Error(errorMessage);
    }
}

export async function createOrg(orgData: Omit<Org, '_id' | 'teams'>): Promise<{ error: number; data: any }> {
    try {
        const response = await postRequest('/herocorp/orgs/create', orgData, 'CREATEORG');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la création de l\'organisation.';
        throw new Error(errorMessage);
    }
}

export async function addTeamToOrg(orgData: Team, orgSecret: string): Promise<any> {
    try {
        const config = {headers: {'org-secret': orgSecret}};
        const response = await patchRequest('/herocorp/orgs/addteam', orgData, 'ADDTEAMTOORG', config);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de l\'ajout de l\'équipe à l\'organisation.';
        throw new Error(errorMessage);
    }
}

export async function removeTeamFromOrg(orgData: Team, orgSecret: string): Promise<any> {
    try {
        const config = {headers: {'org-secret': orgSecret}};
        const response = await patchRequest('/herocorp/orgs/removeteam', orgData, 'REMOVETEAMFROMORG', config);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la suppression de l\'équipe de l\'organisation.';
        throw new Error(errorMessage);
    }
}

export async function getOrgById(id: string, orgSecret: string): Promise<any> {
    try {
        const response = await getRequest(`/herocorp/orgs/getbyid/${id}`, 'GETORG_BYID', {headers: {'org-secret': orgSecret}});
        return response;
    } catch (error: any) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la récupération de l\'organisation.';
        throw new Error(errorMessage);
    }
}