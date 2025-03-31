import {getRequest, postRequest, patchRequest, useErrorStore} from '@/services/axios.service';

//
//
//   SERVICE TEAM
//
//

export async function getAllTeams(): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const response = await getRequest('/herocorp/teams/get', 'GETALLTEAMS');
        return response.data;
    } catch (error: any) {
        {
            errorStore.setError(error?.message)
            return null;
        }
    }
}

export async function createTeam(teamData: any): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const response = await postRequest('/herocorp/teams/create', teamData, 'CREATETEAM');
        return response.data;
    } catch (error: any) {
        {
            errorStore.setError(error?.message)
            return null;
        }
    }
}

export async function addHeroesToTeam(teamData: any): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const response = await patchRequest('/herocorp/teams/addheroes', teamData, 'ADDHEROSTOTEAM');
        return response.data;
    } catch (error: any) {
        errorStore.setError(error?.message)
        return null;
    }
}

export async function removeHeroesFromTeam(teamData: any): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const response = await patchRequest('/herocorp/teams/removeheroes', teamData, 'REMOVEHEROFROMTEAM');
        return response.data;
    } catch (error: any) {
        {
            errorStore.setError(error?.message)
            return null;
        }
    }
}