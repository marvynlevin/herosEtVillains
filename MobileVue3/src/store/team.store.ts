import {defineStore} from 'pinia';
import {
    getAllTeams,
    createTeam,
    addHeroesToTeam,
    removeHeroesFromTeam,
    Team,
} from "@/services/team.service";
import {useErrorStore} from './error.store';

interface TeamState {
    teams: Team[];
    currentTeam: Team | null;
    loading: boolean;
}

export const useTeamStore = defineStore('team', {
    state: (): TeamState => ({
        teams: [],
        currentTeam: null,
        loading: false,
    }),
    actions: {
        async fetchTeams() {
            this.loading = true;
            try {
                this.teams = (await getAllTeams()).data;
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async createTeam(teamData: Team) {
            this.loading = true;
            try {
                const newTeam = (await createTeam(teamData)).data;
                this.teams.push(newTeam);
                this.currentTeam = newTeam;
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async addMemberToTeam({teamId, heroId}: { teamId: string; heroId: string }) {
            this.loading = true;
            try {
                const updatedTeam = (await addHeroesToTeam({idTeam: teamId, idHeroes: [heroId]})).data;
                if (this.currentTeam && updatedTeam.members) {
                    this.currentTeam.members = updatedTeam.members;
                }
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async removeMemberFromTeam({teamId, heroId}: { teamId: string; heroId: string }) {
            this.loading = true;
            try {
                await removeHeroesFromTeam({idTeam: teamId, idHeroes: [heroId]});
                if (this.currentTeam && this.currentTeam.members) {
                    this.currentTeam.members = this.currentTeam.members.filter(member => member.id !== heroId);
                }
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },
    },
    getters: {
        getTeams: (state) => state.teams,
        getCurrentTeam: (state) => state.currentTeam,
        isTeamLoading: (state) => state.loading,
    },
});