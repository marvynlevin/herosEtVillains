import {defineStore} from 'pinia';
import {addHeroesToTeam, createTeam, getAllTeams, removeHeroesFromTeam,} from '@/services/team.service';
import {useErrorStore} from './error.store';

interface Hero {
    id: string;
    name: string;
    power?: string;
    level?: number;
}

interface Team {
    _id: string;
    name: string;
    members: Hero[];
    description: string;
}

export const useTeamStore = defineStore('team', {
    state: () => ({
        teams: [] as Team[],
        currentTeam: null as Team | null,
        loading: false,
    }),
    actions: {
        setCurrentTeam(data: any) {
            this.currentTeam = data;
        },
        async fetchTeams() {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                this.teams = await getAllTeams();
            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async createTeam(teamData: { name: string }) {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                const newTeam = await createTeam(teamData);
                this.teams.push(newTeam);
                this.currentTeam = newTeam;
            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async addMemberToTeam({teamId, heroId}: { teamId: string; heroId: string }) {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                const updatedTeam = await addHeroesToTeam({idTeam: teamId, idHeroes: [heroId]});
                const index = this.teams.findIndex(t => t._id === teamId);
                if (index !== -1) {
                    this.teams[index] = updatedTeam;
                }
                this.currentTeam = updatedTeam;

            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async removeMemberFromTeam({teamId, heroId}: { teamId: string; heroId: string }) {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                await removeHeroesFromTeam({idTeam: teamId, idHeroes: [heroId]});
                const index = this.teams.findIndex(t => t._id === teamId);
                if (index !== -1) {
                    this.teams[index].members = this.teams[index].members.filter(member => member.id !== heroId);
                }
                if (this.currentTeam?._id === teamId) {
                    this.currentTeam.members = this.currentTeam.members.filter(member => member.id !== heroId);
                }

            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },
        fetchTeamById(teamId: string) {
            return this.teams.find(t => t._id === teamId)
        }
    },
    getters: {
        getTeams: (state) => state.teams,
        getCurrentTeam: (state) => state.currentTeam,
        isTeamLoading: (state) => state.loading,
    },
});
