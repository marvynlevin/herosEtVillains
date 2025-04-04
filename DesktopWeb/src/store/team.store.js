import {
    getAllTeams,
    createTeam,
    addHeroesToTeam,
    removeHeroesFromTeam,
} from "@/services/team.service";

export default {
    namespaced: true,
    state: {
        teams: [],
        currentTeam: null,
        loading: false,
    },
    mutations: {
        SET_TEAMS(state, teams) {
            state.teams = teams;
        },
        ADD_TEAM(state, team) {
            state.teams.push(team);
        },
        SET_CURRENT_TEAM(state, team) {
            state.currentTeam = team;
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        ADD_MEMBER_TO_TEAM(state, hero) {
            if (state.currentTeam && state.currentTeam.members) {
                state.currentTeam.members.push(hero);
            }
        },
        REMOVE_MEMBER_FROM_TEAM(state, heroId) {
            if (state.currentTeam && state.currentTeam.members) {
                state.currentTeam.members = state.currentTeam.members.filter(member => member.id !== heroId);
            }
        },
    },
    actions: {
        async fetchTeams({commit, dispatch}) {
            commit("SET_LOADING", true);
            try {
                const teams = await getAllTeams();
                commit("SET_TEAMS", teams);
            } catch (error) {
                dispatch("error/setError", error.message, {root: true});
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async createTeam({commit, dispatch}, teamData) {
            commit("SET_LOADING", true);
            try {
                const newTeam = await createTeam(teamData);
                commit("ADD_TEAM", newTeam);
                commit("SET_CURRENT_TEAM", newTeam);
            } catch (error) {
                dispatch("error/setError", error.message, {root: true});
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async addMemberToTeam({commit, dispatch}, {teamId, heroId}) {
            commit("SET_LOADING", true);
            try {
                const updatedTeam = await addHeroesToTeam({idTeam: teamId, idHeroes: [heroId]});
                commit("ADD_MEMBER_TO_TEAM", updatedTeam);
            } catch (error) {
                dispatch("error/setError", error.message, {root: true});
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async removeMemberFromTeam({commit, dispatch}, {teamId, heroId}) {
            commit("SET_LOADING", true);
            try {
                await removeHeroesFromTeam({idTeam: teamId, idHeroes: [heroId]});
                commit("REMOVE_MEMBER_FROM_TEAM", heroId);
            } catch (error) {
                dispatch("error/setError", error.message, {root: true});
            } finally {
                commit("SET_LOADING", false);
            }
        },
    },
    getters: {
        getTeams: (state) => state.teams,
        getCurrentTeam: (state) => state.currentTeam,
        isTeamLoading: (state) => state.loading,
    },
};
