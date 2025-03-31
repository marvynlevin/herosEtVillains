import {defineStore} from 'pinia';
import {createHero, getAllHeroes, getHeroById, updateHero} from '@/services/hero.service';
import {useErrorStore} from './error.store'

export interface Hero {
    _id: string;
    publicName: string;
    realName?: string;
    powers?: Power[];
}

export interface Power {
    _id?: string;
    name: string;
    type: number | null;
    level: number;
}

interface HeroDetails extends Hero {
    realName: string;
    powers: Power[];
}

export const useHeroStore = defineStore('hero', {
    state: () => ({
        heroesAliases: [] as Hero[],
        heroesDetails: [] as HeroDetails[],
        currentHero: null as HeroDetails | null,
        loading: false,
    }),
    actions: {
        async fetchHeroesAliases() {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                this.heroesAliases = await getAllHeroes();
            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async fetchHeroById({id, orgSecret}: { id: string; orgSecret: string }) {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                const hero = await getHeroById(id, orgSecret);
                this.SET_HERO_DETAILS(hero[0]);
                return hero[0];
            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async createHero(heroData: Hero) {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                const newHero = await createHero(heroData);
                this.heroesAliases.push(newHero);
                this.currentHero = newHero;
                return newHero;
            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async updateHero({heroData, orgSecret}: { heroData: HeroDetails; orgSecret: string }) {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                const updatedHero = await updateHero(heroData, orgSecret);
                this.SET_HERO_DETAILS(updatedHero);
                this.currentHero = updatedHero;
            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },
        SET_HERO_DETAILS(hero: HeroDetails) {
            const index = this.heroesDetails.findIndex(h => h._id === hero._id);
            if (index !== -1) {
                this.heroesDetails[index] = hero;
            } else {
                this.heroesDetails.push(hero);
            }
        }
    },
    getters: {
        getHeroesAliases: (state) => state.heroesAliases,
        getCurrentHero: (state) => state.currentHero,
        isHeroLoading: (state) => state.loading,
        getHeroesDetails: (state) => state.heroesDetails,
    },
});
