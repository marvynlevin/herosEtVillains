import {getRequest, patchRequest, postRequest, useErrorStore} from '@/services/axios.service';

//
//
//  SERVICE ORG
//
//

export async function getAllOrgs(): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const response = await getRequest('/herocorp/orgs/get', 'GETALLORGS');
        return response.data;
    } catch (error: any) {
        errorStore.setError(error?.message)
        return null;
    }
}

export async function createOrg(orgData: any): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const response = await postRequest('/herocorp/orgs/create', orgData, 'CREATEORG');
        return response.data;
    } catch (error: any) {
        errorStore.setError(error?.message)
        return null;
    }
}

export async function addTeamToOrg(orgData: any, orgSecret: string): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const config = {headers: {'org-secret': orgSecret}};
        const response = await patchRequest('/herocorp/orgs/addteam', orgData, 'ADDTEAMTOORG', config);
        return response.data;
    } catch (error: any) {
        errorStore.setError(error?.message)
        return null;
    }
}

export async function removeTeamFromOrg(orgData: any, orgSecret: string): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const config = {headers: {'org-secret': orgSecret}};
        const response = await patchRequest('/herocorp/orgs/removeteam', orgData, 'REMOVETEAMFROMORG', config);
        return response.data;
    } catch (error: any) {
        errorStore.setError(error?.message)
        return null;
    }
}

export async function getOrgById(id: string, orgSecret: string): Promise<any> {
    const errorStore = useErrorStore();
    try {
        const config = {headers: {'org-secret': orgSecret}};
        return await getRequest(`/herocorp/orgs/getbyid/${id}`, 'GETORG_BYID', config);
    } catch (error: any) {
        errorStore.setError(error?.message)
        return null;
    }
}
