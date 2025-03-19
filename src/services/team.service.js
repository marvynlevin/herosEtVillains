import { getRequest, postRequest, patchRequest } from "@/services/axios.service";


//
//
//  SERVICE TEAM
//
//

export async function getAllTeams() {
  try {
    const response = await getRequest('/teams/get', 'GETALLTEAMS');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la récupération des équipes.';
    throw new Error(errorMessage);
  }
}

export async function createTeam(teamData) {
  try {
    const response = await postRequest('/teams/create', teamData, 'CREATETEAM');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la création de l\'équipe.';
    throw new Error(errorMessage);
  }
}

export async function addHeroesToTeam(teamData) {
  try {
    const response = await patchRequest('/teams/addheroes', teamData, 'ADDHEROSTOTEAM');
    return response.data; // Retourne les informations de l'équipe après ajout des héros
  } catch (error) {
    const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de l\'ajout des héros à l\'équipe.';
    throw new Error(errorMessage); // Retourne le message d'erreur
  }
}

export async function removeHeroesFromTeam(teamData) {
  try {
    const response = await patchRequest('/teams/removeheroes', teamData, 'REMOVEHEROFROMTEAM');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.data || 'Une erreur est survenue lors de la suppression des héros de l\'équipe.';
    throw new Error(errorMessage);
  }
}