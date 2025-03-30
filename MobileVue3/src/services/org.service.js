import {getRequest, postRequest, patchRequest} from "@/services/axios.service";


//
//
//  SERVICE ORG
//
//

export async function getAllOrgs() {
    try {
        const response = await getRequest('/herocorp/orgs/get', 'GETALLORGS');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la récupération des organisations.';
        throw new Error(errorMessage);
    }
}

export async function createOrg(orgData) {
    try {
        const response = await postRequest('/herocorp/orgs/create', orgData, 'CREATEORG');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la création de l\'organisation.';
        throw new Error(errorMessage);
    }
}

export async function addTeamToOrg(orgData, orgSecret) {
    try {
        console.log("Data;", orgData);
        console.log("Secret;", orgSecret);
        const config = {headers: {'org-secret': orgSecret}};
        const response = await patchRequest('/herocorp/orgs/addteam', orgData, 'ADDTEAMTOORG', config);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de l\'ajout de l\'équipe à l\'organisation.';
        throw new Error(errorMessage);
    }
}

export async function removeTeamFromOrg(orgData, orgSecret) {
    try {
        const config = {headers: {'org-secret': orgSecret}};
        const response = await patchRequest('/herocorp/orgs/removeteam', orgData, 'REMOVETEAMFROMORG', config);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la suppression de l\'équipe de l\'organisation.';
        throw new Error(errorMessage);
    }
}

export async function getOrgById(id, orgSecret) {
    try {
        const response = await getRequest(`/herocorp/orgs/getbyid/${id}`, 'GETORG_BYID', {headers: {'org-secret': orgSecret}});
        console.log("réponse de l'api: ", response,);
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la récupération de l\'organisation.';
        throw new Error(errorMessage);
    }
}
